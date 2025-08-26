import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Accordion, Text } from '../../../../design-system';
import { Installment, LoanSchedulePanelProps } from './types';
import { formatCurrency, formatDate, formatInstallmentNumber } from './utils';

const LoanSchedulePanel: React.FC<LoanSchedulePanelProps> = ({
  data,
  title = "Cronograma de Pagamentos",
  subtitle,
  onEndReached,
  testID,
  showSummary = false,
  summaryData
}) => {
  const renderInstallmentHeader = (installment: Installment) => (
    <View style={styles.headerContainer}>
      <View style={styles.headerLeft}>
        <Text style={styles.installmentNumber}>
          {formatInstallmentNumber(installment.index)}
        </Text>
        <Text style={styles.dueDate}>
          {formatDate(installment.dueDate)}
        </Text>
      </View>
      <View style={styles.headerRight}>
        <Text style={styles.installmentValue}>
          {formatCurrency(installment.value)}
        </Text>
      </View>
    </View>
  );

  const renderInstallmentContent = (installment: Installment) => (
    <View style={styles.contentContainer}>
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Valor Principal:</Text>
        <Text style={styles.detailValue}>
          {formatCurrency(installment.principalValue)}
        </Text>
      </View>
      
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Juros:</Text>
        <Text style={styles.detailValue}>
          {formatCurrency(installment.interestValue)}
        </Text>
      </View>
      
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Saldo após pagamento:</Text>
        <Text style={styles.detailValue}>
          {formatCurrency(installment.balanceAfterPayment)}
        </Text>
      </View>
      
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Total de juros acumulados:</Text>
        <Text style={styles.detailValue}>
          {formatCurrency(installment.totalInterest)}
        </Text>
      </View>
    </View>
  );

  const HeaderComponent = () => (
    <View style={styles.titleContainer}>
      <Text style={styles.title}>{title}</Text>
      {subtitle && (
        <Text style={styles.subtitle}>{subtitle}</Text>
      )}
      {showSummary && summaryData && (
        <View style={styles.summaryContainer}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Valor Financiado:</Text>
            <Text style={styles.summaryValue}>
              {formatCurrency(summaryData.totalFinanced)}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total de Juros:</Text>
            <Text style={styles.summaryValue}>
              {formatCurrency(summaryData.totalInterest)}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Valor Total:</Text>
            <Text style={StyleSheet.flatten([styles.summaryValue, { color: '#007AFF', fontWeight: 'bold' as const }])}>
              {formatCurrency(summaryData.totalAmount)}
            </Text>
          </View>
        </View>
      )}
    </View>
  );

  return (
    <Accordion<Installment>
      data={data}
      renderHeader={renderInstallmentHeader}
      renderContent={renderInstallmentContent}
      {...(onEndReached && { onEndReached })}
      {...(testID && { testID })}
      ListHeaderComponent={HeaderComponent}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12, // Reduzido de 16 para 12
  },
  titleContainer: {
    marginBottom: 12, // Reduzido de 16 para 12
  },
  title: {
    fontSize: 18, // Reduzido de 20 para 18
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13, // Reduzido de 14 para 13
    color: '#666',
    marginBottom: 6, // Reduzido de 8 para 6
  },
  summaryContainer: {
    backgroundColor: '#F8F9FA',
    padding: 10, // Reduzido de 12 para 10
    borderRadius: 8,
    marginTop: 6, // Reduzido de 8 para 6
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 3, // Reduzido de 4 para 3
  },
  summaryLabel: {
    fontSize: 13, // Reduzido de 14 para 13
    color: '#666',
  },
  summaryValue: {
    fontSize: 13, // Reduzido de 14 para 13
    fontWeight: '600',
    color: '#333',
  },
  summaryTotal: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  installmentNumber: {
    fontSize: 15, // Reduzido de 16 para 15
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  dueDate: {
    fontSize: 13, // Reduzido de 14 para 13
    color: '#666',
  },
  installmentValue: {
    fontSize: 15, // Reduzido de 16 para 15
    fontWeight: 'bold',
    color: '#007AFF',
  },
  contentContainer: {
    gap: 6, // Reduzido de 8 para 6
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 3, // Reduzido de 4 para 3
  },
  detailLabel: {
    fontSize: 13, // Reduzido de 14 para 13
    color: '#666',
    flex: 1,
  },
  detailValue: {
    fontSize: 13, // Reduzido de 14 para 13
    fontWeight: '600',
    color: '#333',
    textAlign: 'right',
  },
});

export default LoanSchedulePanel;
