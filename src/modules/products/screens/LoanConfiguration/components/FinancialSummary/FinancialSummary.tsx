import React from 'react';
import { View, Text } from 'react-native';
import { styles } from '../../LoanConfiguration.styles';
import { QuoteData } from '../../types';

interface FinancialSummaryProps {
  quote: QuoteData | null;
  productRateAm: number;
  formatCurrency: (value: number) => string;
}

export const FinancialSummary: React.FC<FinancialSummaryProps> = ({
  quote,
  productRateAm,
  formatCurrency,
}) => {
  return (
    <>
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
            {(productRateAm * 100).toFixed(2)}% a.m. ({((Math.pow(1 + productRateAm, 12) - 1) * 100).toFixed(1)}% a.a. efetiva)
          </Text>
        </View>
      </View>
    </>
  );
};
