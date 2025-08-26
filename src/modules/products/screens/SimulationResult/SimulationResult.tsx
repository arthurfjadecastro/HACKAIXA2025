import React, { useMemo, useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '@/navigation/AppStack';

import { Text, Button } from '@/design-system/components';
import ExpandPanel from '@/components/ExpandPanel';
import { calculateLoanSchedule } from '@/utils/loanCalculator';
import { useProducts } from '@/hooks/useProducts';

type RouteProps = RouteProp<AppStackParamList, 'SimulationResult'>;
type NavigationProps = NativeStackNavigationProp<AppStackParamList>;

const SimulationResult: React.FC = () => {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation<NavigationProps>();
  const { productId, amount, months, result } = route.params;
  const { products } = useProducts();
  
  // Verificar se é produto de habitação - verifica ID e nome do produto
  const isHabitacao = useMemo(() => {
    // Primeiro verifica se contém habitacao/hab no productId
    if (productId?.toLowerCase().includes('habitacao') || productId?.toLowerCase().includes('hab')) {
      return true;
    }
    
    // Se não encontrou no ID, procura pelo nome do produto registrado
    const registeredProduct = products.find(p => p.id === productId);
    if (registeredProduct) {
      const productName = registeredProduct.name.toLowerCase();
      return productName.includes('habitação') || productName.includes('habitacao');
    }
    
    return false;
  }, [productId, products]);
  
  // Estado para alternar entre PRICE e SAC (apenas para habitação)
  const [amortizationType, setAmortizationType] = useState<'PRICE' | 'SAC'>(result.amortizationType || 'PRICE');

  // Calcular cronograma de parcelas (PRICE e SAC para habitação)
  const loanSchedule = useMemo(() => {
    const numericAmount = parseFloat(amount.replace(/\./g, '').replace(',', '.'));
    const rateMonthly = result.rate / 100; // Converter % para decimal
    
    // Data da primeira parcela (15 do próximo mês)
    const firstDueDate = new Date();
    firstDueDate.setMonth(firstDueDate.getMonth() + 1);
    firstDueDate.setDate(15);
    
    // Para habitação, usar o tipo selecionado, senão usar o padrão
    const typeToUse = isHabitacao ? amortizationType : (result.amortizationType || 'PRICE');
    
    return calculateLoanSchedule({
      principal: numericAmount,
      rateMonthly,
      months,
      firstDueDate,
      amortizationType: typeToUse,
    });
  }, [amount, months, result, isHabitacao, amortizationType]);

  const handleBackPress = () => {
    navigation.navigate('ProductList');
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // Componente do header/resumo da simulação
  const renderHeader = () => (
    <View>
      <View style={styles.resultCard}>
        <View style={styles.successTitleContainer}>
          <Ionicons name="checkmark-circle" size={24} color="#22C55E" style={styles.successIcon} />
          <Text style={styles.successTitle}>Simulação Concluída!</Text>
        </View>
        
        <View style={styles.summarySection}>
          <Text style={styles.sectionTitle}>Resumo</Text>
          
          <View style={styles.summaryRow}>
            <Text style={styles.label}>Valor do empréstimo:</Text>
            <Text style={styles.value}>R$ {amount}</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.label}>Parcelas:</Text>
            <Text style={styles.value}>
              {isHabitacao && amortizationType === 'SAC' 
                ? `${months}x`
                : `${months}x de ${formatCurrency(loanSchedule.monthlyInstallment)}`
              }
            </Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.label}>Sistema de amortização:</Text>
            <Text style={styles.value}>{isHabitacao ? amortizationType : (result.amortizationType || 'Price')}</Text>
          </View>
          
          {/* Toggle PRICE/SAC apenas para habitação */}
          {isHabitacao && (
            <View style={styles.amortizationToggle}>
              <Text style={styles.toggleLabel}>Comparar sistemas:</Text>
              <View style={styles.toggleButtons}>
                <TouchableOpacity
                  style={[
                    styles.toggleButton,
                    amortizationType === 'PRICE' ? styles.toggleButtonActive : styles.toggleButtonInactive
                  ]}
                  onPress={() => setAmortizationType('PRICE')}
                >
                  <Text style={StyleSheet.flatten([
                    styles.toggleButtonText,
                    amortizationType === 'PRICE' ? styles.toggleButtonTextActive : styles.toggleButtonTextInactive
                  ])}>
                    PRICE
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.toggleButton,
                    amortizationType === 'SAC' ? styles.toggleButtonActive : styles.toggleButtonInactive
                  ]}
                  onPress={() => setAmortizationType('SAC')}
                >
                  <Text style={StyleSheet.flatten([
                    styles.toggleButtonText,
                    amortizationType === 'SAC' ? styles.toggleButtonTextActive : styles.toggleButtonTextInactive
                  ])}>
                    SAC
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          
          <View style={styles.summaryRow}>
            <Text style={styles.label}>Valor da parcela:</Text>
            <Text style={StyleSheet.flatten([styles.value, styles.highlightValue])}>
              {isHabitacao && amortizationType === 'SAC' 
                ? 'Parcela Decrescente'
                : formatCurrency(loanSchedule.monthlyInstallment)
              }
            </Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.label}>Total a pagar:</Text>
            <Text style={styles.value}>
              {formatCurrency(loanSchedule.totalWithInterest)}
            </Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.label}>Total de juros:</Text>
            <Text style={styles.value}>
              {formatCurrency(loanSchedule.totalInterest)}
            </Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.label}>Taxa de juros:</Text>
            <Text style={styles.value}>
              {(result.rate).toFixed(2)}% a.m. ({(result.rateAnnual || ((Math.pow(1 + result.rate/100, 12) - 1) * 100)).toFixed(1)}% a.a. efetiva)
            </Text>
          </View>
        </View>
      </View>
      
      {/* Título "Parcelas" com espaçamento */}
      <View style={styles.installmentsHeader}>
        <Text style={styles.installmentsTitle}>Parcelas</Text>
      </View>
    </View>
  );

  // Componente do footer
  const renderFooter = () => (
    <View style={styles.footer}>
      <Button
        title="Nova Simulação"
        onPress={handleBackPress}
        style={styles.newSimulationButton}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#005CA9" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Resultado da Simulação</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ExpandPanel
        schedule={loanSchedule.schedule}
        totalWithInterest={loanSchedule.totalWithInterest}
        monthlyInstallment={loanSchedule.monthlyInstallment}
        testID="cronograma-pagamentos"
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        contentContainerStyle={styles.contentContainer}
        hideInternalHeader={true} // Esconde o header interno do ExpandPanel
      />
    </View>
  );
};

export default SimulationResult;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F8FB',
  },
  
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F4F8FB', // Mudado para branco gelo
    // Removido borderBottomWidth e borderBottomColor para consistência
  },
  backButton: {
    padding: 8, // Reduzido de 16 para 8 para ficar mais próximo da borda
    marginLeft: -8, // Adiciona margem negativa para compensar e ficar ainda mais à esquerda
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    textAlign: 'center',
    flex: 1,
  },
  headerSpacer: {
    width: 48,
  },

  // Content
  content: {
    flex: 1,
    paddingHorizontal: 24, // Aumentado de 16 para 24 para mais espaço lateral
  },
  
  contentContainer: {
    paddingTop: 24,
    paddingBottom: 24,
    paddingHorizontal: 8, // Adiciona mais espaço interno
  },

  // Result Card
  resultCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 32, // Aumentado de 24 para 32 para mais espaço interno
    marginHorizontal: 8, // Adiciona margem lateral
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },

  successTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },

  successIcon: {
    marginRight: 8,
  },

  successTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#004AAD',
  },

  summarySection: {
    marginBottom: 16,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 16,
  },

  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },

  label: {
    fontSize: 14,
    color: '#757575',
  },

  value: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
  },

  highlightValue: {
    fontSize: 16,
    color: '#004AAD',
  },

  // Seção de Parcelas
  installmentsHeader: {
    paddingHorizontal: 0, // Reduzido para 16px para alinhar exatamente com as parcelas
    paddingTop: 32, // Espaço entre o card e o título
    paddingBottom: 16, // Espaço entre o título e a primeira parcela
  },

  installmentsTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1565C0', // Mudado para azul (mesma cor usada em outros títulos)
    textAlign: 'left', // Alinhado à esquerda conforme solicitado
  },

  // Footer
  footer: {
    paddingHorizontal: 24, // Aumentado de 16 para 24 para consistência
    paddingVertical: 16,
    backgroundColor: '#F4F8FB', // Mudado para branco gelo
  },

  newSimulationButton: {
    backgroundColor: '#F7931E',
    borderRadius: 8,
    height: 56,
    justifyContent: 'center',
  },

  // Toggle PRICE/SAC para habitação
  amortizationToggle: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },

  toggleLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 12,
  },

  toggleButtons: {
    flexDirection: 'row',
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 4,
  },

  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
  },

  toggleButtonActive: {
    backgroundColor: '#005CA9',
  },

  toggleButtonInactive: {
    backgroundColor: 'transparent',
  },

  toggleButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },

  toggleButtonTextActive: {
    color: '#FFFFFF',
  },

  toggleButtonTextInactive: {
    color: '#666666',
  },
});
