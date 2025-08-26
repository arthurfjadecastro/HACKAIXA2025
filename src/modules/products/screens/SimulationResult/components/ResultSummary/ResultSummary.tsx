import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/design-system/components';
import { AmortizationToggle } from '../AmortizationToggle';
import { LoanSchedule } from '../../types';

interface ResultSummaryProps {
  amount: string;
  months: number;
  result: {
    rate: number;
    rateAnnual?: number;
    amortizationType?: 'PRICE' | 'SAC';
  };
  loanSchedule: LoanSchedule;
  isHabitacao: boolean;
  amortizationType: 'PRICE' | 'SAC';
  onAmortizationToggle: (type: 'PRICE' | 'SAC') => void;
  formatCurrency: (value: number) => string;
}

export const ResultSummary: React.FC<ResultSummaryProps> = ({
  amount,
  months,
  result,
  loanSchedule,
  isHabitacao,
  amortizationType,
  onAmortizationToggle,
  formatCurrency,
}) => {
  return (
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
          <Text style={styles.value}>
            {isHabitacao ? amortizationType : (result.amortizationType || 'Price')}
          </Text>
        </View>
        
        {/* Toggle PRICE/SAC apenas para habitação */}
        {isHabitacao && (
          <AmortizationToggle
            amortizationType={amortizationType}
            onToggle={onAmortizationToggle}
          />
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
  );
};

const styles = StyleSheet.create({
  resultCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 32,
    marginHorizontal: 8,
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
});
