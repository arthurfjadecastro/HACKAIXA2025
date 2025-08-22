import React, { useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '@/navigation/AppStack';

import { Text, Button } from '@/design-system/components';
import ExpandPanel from '@/components/ExpandPanel';
import { calculateLoanSchedule } from '@/utils/loanCalculator';

type RouteProps = RouteProp<AppStackParamList, 'SimulationResult'>;
type NavigationProps = NativeStackNavigationProp<AppStackParamList>;

const SimulationResult: React.FC = () => {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation<NavigationProps>();
  const { amount, months, result } = route.params;

  // Calcular cronograma de parcelas
  const loanSchedule = useMemo(() => {
    const numericAmount = parseFloat(amount.replace(/\./g, '').replace(',', '.'));
    const rateMonthly = result.rate / 100; // Converter % para decimal
    
    // Data da primeira parcela (15 do próximo mês)
    const firstDueDate = new Date();
    firstDueDate.setMonth(firstDueDate.getMonth() + 1);
    firstDueDate.setDate(15);
    
    return calculateLoanSchedule({
      principal: numericAmount,
      rateMonthly,
      months,
      firstDueDate,
    });
  }, [amount, months, result]);

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
    <View style={styles.resultCard}>
      <Text style={styles.successTitle}>✅ Simulação Concluída!</Text>
      
      <View style={styles.summarySection}>
        <Text style={styles.sectionTitle}>Resumo</Text>
        
        <View style={styles.summaryRow}>
          <Text style={styles.label}>Valor do empréstimo:</Text>
          <Text style={styles.value}>R$ {amount}</Text>
        </View>
        
        <View style={styles.summaryRow}>
          <Text style={styles.label}>Parcelas:</Text>
          <Text style={styles.value}>{months}x de {formatCurrency(loanSchedule.monthlyInstallment)}</Text>
        </View>
        
        <View style={styles.summaryRow}>
          <Text style={styles.label}>Sistema de amortização:</Text>
          <Text style={styles.value}>{result.amortizationType || 'Price'}</Text>
        </View>
        
        <View style={styles.summaryRow}>
          <Text style={styles.label}>Valor da parcela:</Text>
          <Text style={StyleSheet.flatten([styles.value, styles.highlightValue])}>
            {formatCurrency(loanSchedule.monthlyInstallment)}
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
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  backButton: {
    padding: 16,
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
    paddingHorizontal: 16,
  },
  
  contentContainer: {
    paddingTop: 24,
    paddingBottom: 24,
  },

  // Result Card
  resultCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },

  successTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#004AAD',
    textAlign: 'center',
    marginBottom: 24,
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

  // Footer
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#F4F8FB', // Mudado para branco gelo
  },

  newSimulationButton: {
    backgroundColor: '#F7931E',
    borderRadius: 8,
    height: 56,
    justifyContent: 'center',
  },
});
