import React from 'react';
import { View } from 'react-native';
import ExpandPanel from '@/components/ExpandPanel';
import {
  Header,
  ResultSummary,
  InstallmentsHeader,
  Footer
} from './components';
import { useSimulationResult } from './hooks/useSimulationResult';
import { styles } from './SimulationResult.styles';

const SimulationResult: React.FC = () => {
  const {
    amount,
    months,
    result,
    loanSchedule,
    isHabitacao,
    amortizationType,
    setAmortizationType,
    handleBackPress,
    formatCurrency,
  } = useSimulationResult();

  // Componente do header/resumo da simulação
  const renderHeader = () => (
    <View>
      <ResultSummary
        amount={amount}
        months={months}
        result={result}
        loanSchedule={loanSchedule}
        isHabitacao={isHabitacao}
        amortizationType={amortizationType}
        onAmortizationToggle={setAmortizationType}
        formatCurrency={formatCurrency}
      />
      
      {/* Título "Parcelas" com espaçamento */}
      <InstallmentsHeader />
    </View>
  );

  // Componente do footer
  const renderFooter = () => (
    <Footer onNewSimulation={handleBackPress} />
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <Header onBackPress={handleBackPress} />

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
