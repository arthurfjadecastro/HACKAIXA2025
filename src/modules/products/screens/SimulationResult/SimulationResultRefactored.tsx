import React from 'react';
import { View } from 'react-native';
import { LoanSchedulePanel } from '../../components';
import { convertLoanToInstallmentArray } from '../../utils/installmentConverter';
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

      {/* Container com header personalizado */}
      <View style={styles.contentWrapper}>
        {renderHeader()}
        
        {/* LoanSchedulePanel sem header próprio */}
        <LoanSchedulePanel
          data={convertLoanToInstallmentArray(loanSchedule.schedule)}
          testID="cronograma-pagamentos"
          showSummary={false}
          title="" // Remove título para evitar duplicação
        />
        
        {renderFooter()}
      </View>
    </View>
  );
};

export default SimulationResult;
