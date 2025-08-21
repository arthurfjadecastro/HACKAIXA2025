import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '@/navigation/AppStack';

import { Text, Button } from '@/design-system/components';

type RouteProps = RouteProp<AppStackParamList, 'LoanConfiguration'>;
type NavigationProps = NativeStackNavigationProp<AppStackParamList>;

interface QuoteData {
  installment: number;
  total: number;
  rate: number;
}

const LoanConfiguration: React.FC = () => {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation<NavigationProps>();
  const { productId, amount } = route.params;
  
  // TODO: Buscar dados reais do produto
  const productMaxMonths = 12; // Vem do produto
  const productRateAm = 0.01; // 1% ao mês (vem do produto)
  
  const [months, setMonths] = useState<number>(Math.min(12, productMaxMonths));
  const [quote, setQuote] = useState<QuoteData | null>(null);
  const [inputValue, setInputValue] = useState<string>(Math.min(12, productMaxMonths).toString());

  // Função de cálculo usando dados reais do produto
  const calculateQuote = (principal: number, monthsCount: number): QuoteData => {
    const rateAm = productRateAm; // Usar taxa real do produto
    const installment = principal * rateAm / (1 - Math.pow(1 + rateAm, -monthsCount));
    const total = installment * monthsCount;
    const rateAa = Math.pow(1 + rateAm, 12) - 1; // Taxa anual
    
    return {
      installment,
      total,
      rate: rateAa * 100
    };
  };

  useEffect(() => {
    if (amount) {
      const numericAmount = parseFloat(amount.replace(/\./g, '').replace(',', '.'));
      const newQuote = calculateQuote(numericAmount, months);
      setQuote(newQuote);
    }
  }, [amount, months]);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleEditAmount = () => {
    navigation.goBack();
  };

  const handleContinue = () => {
    console.log('Continuar com configuração:', { 
      productId, 
      amount, 
      months, 
      quote 
    });
    
    navigation.navigate('SimulationTransition', {
      productId,
      amount,
      months
    });
  };

  const handleMonthsChange = (value: string) => {
    const numericValue = parseInt(value) || 0;
    if (numericValue >= 3 && numericValue <= productMaxMonths) {
      setMonths(numericValue);
      setInputValue(value);
    } else if (numericValue < 3) {
      setMonths(3);
      setInputValue('3');
    } else if (numericValue > productMaxMonths) {
      setMonths(productMaxMonths);
      setInputValue(productMaxMonths.toString());
    }
  };

  const decreaseMonths = () => {
    if (months > 3) {
      const newMonths = months - 1;
      setMonths(newMonths);
      setInputValue(newMonths.toString());
    }
  };

  const increaseMonths = () => {
    if (months < productMaxMonths) {
      const newMonths = months + 1;
      setMonths(newMonths);
      setInputValue(newMonths.toString());
    }
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#005CA9" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Quantos meses 2/2</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView 
        style={styles.content} 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Valor do empréstimo (resumo editável) */}
        <View style={styles.amountSummary}>
          <View style={styles.amountRow}>
            <Text style={styles.amountValue}>{amount ? `R$ ${amount}` : 'R$ 0,00'}</Text>
            <TouchableOpacity onPress={handleEditAmount} style={styles.editButton}>
              <Ionicons name="pencil" size={16} color="#005CA9" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Seletor de parcelas */}
        <View style={styles.installmentSelector}>
          <Text style={styles.sectionLabel}>Parcelas</Text>
          
          <View style={styles.controlsRow}>
            <TouchableOpacity 
              onPress={decreaseMonths}
              style={[styles.controlButton, months <= 3 && styles.controlButtonDisabled]}
              disabled={months <= 3}
            >
              <Ionicons name="remove" size={20} color={months <= 3 ? "#CCCCCC" : "#005CA9"} />
            </TouchableOpacity>

            <TextInput
              style={styles.monthsInput}
              value={inputValue}
              onChangeText={handleMonthsChange}
              keyboardType="number-pad"
              maxLength={2}
              textAlign="center"
            />

            <TouchableOpacity 
              onPress={increaseMonths}
              style={[styles.controlButton, months >= productMaxMonths && styles.controlButtonDisabled]}
              disabled={months >= productMaxMonths}
            >
              <Ionicons name="add" size={20} color={months >= productMaxMonths ? "#CCCCCC" : "#005CA9"} />
            </TouchableOpacity>
          </View>

          <View style={styles.limitsHelper}>
            <Text style={styles.helperText}>Mín: 3 • Máx: {productMaxMonths}</Text>
          </View>
        </View>

        {/* Valor por parcela */}
        <View style={styles.installmentValue}>
          <Text style={styles.installmentLabel}>de</Text>
          <Text style={styles.installmentAmount}>
            {quote ? formatCurrency(quote.installment) : 'R$ 0,00'}
          </Text>
        </View>

        {/* Resumo financeiro */}
        <View style={styles.financialSummary}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total a pagar</Text>
            <Text style={styles.summaryValue}>
              {quote ? formatCurrency(quote.total) : 'R$ 0,00'}
            </Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Juros</Text>
            <Text style={styles.summaryValue}>
              {(productRateAm * 100).toFixed(2)}% a.m. (≈{((Math.pow(1 + productRateAm, 12) - 1) * 100).toFixed(1)}% a.a.)
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Continuar"
          onPress={handleContinue}
          style={styles.continueButton}
        />
      </View>
    </View>
  );
};

export default LoanConfiguration;

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
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  backButton: {
    padding: 16,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '400',
    color: '#757575',
    textAlign: 'right',
    flex: 1,
    marginRight: 16,
  },
  headerSpacer: {
    width: 0,
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

  // Amount Summary
  amountSummary: {
    marginBottom: 24,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  amountValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
  },
  editButton: {
    padding: 8,
    backgroundColor: '#F5F5F5',
    borderRadius: 6,
  },

  // Installment Selector
  installmentSelector: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 12,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  controlButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 16,
  },
  controlButtonDisabled: {
    backgroundColor: '#F0F0F0',
  },
  monthsInput: {
    width: 80,
    height: 40,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  limitsHelper: {
    alignItems: 'center',
    marginTop: 8,
  },
  helperText: {
    fontSize: 12,
    color: '#BDBDBD',
  },

  // Installment Value
  installmentValue: {
    alignItems: 'center',
    marginBottom: 24,
  },
  installmentLabel: {
    fontSize: 16,
    color: '#757575',
    marginBottom: 4,
  },
  installmentAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1565C0',
  },

  // Financial Summary
  financialSummary: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#757575',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
  },

  // Footer
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
  },
  continueButton: {
    backgroundColor: '#F7931E',
    borderRadius: 8,
    height: 56,
    justifyContent: 'center',
  },
});
