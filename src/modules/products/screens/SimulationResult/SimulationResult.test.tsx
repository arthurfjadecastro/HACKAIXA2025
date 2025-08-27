import React from 'react';
import { render } from '@testing-library/react-native';
import SimulationResult from './SimulationResult';
import { useSimulationResult } from './hooks/useSimulationResult';

// Mock das dependências
jest.mock('./hooks/useSimulationResult');
jest.mock('../../components', () => ({
  LoanSchedulePanel: ({ testID }: any) => {
    const { View, Text } = require('react-native');
    return (
      <View testID={testID}>
        <Text>Loan Schedule Panel</Text>
      </View>
    );
  },
}));

jest.mock('../../utils/installmentConverter', () => ({
  convertLoanToInstallmentArray: jest.fn(() => []),
}));

jest.mock('./components', () => ({
  Header: ({ onBackPress }: any) => {
    const { View, Text, TouchableOpacity } = require('react-native');
    return (
      <View testID="header">
        <TouchableOpacity onPress={onBackPress}>
          <Text>Header</Text>
        </TouchableOpacity>
      </View>
    );
  },
  ResultSummary: ({ amount, months }: any) => {
    const { View, Text } = require('react-native');
    return (
      <View testID="result-summary">
        <Text>Valor: {amount}</Text>
        <Text>Parcelas: {months}</Text>
      </View>
    );
  },
  InstallmentsHeader: () => {
    const { View, Text } = require('react-native');
    return (
      <View testID="installments-header">
        <Text>Parcelas</Text>
      </View>
    );
  },
  Footer: ({ onNewSimulation }: any) => {
    const { View, Text, TouchableOpacity } = require('react-native');
    return (
      <View testID="footer">
        <TouchableOpacity onPress={onNewSimulation}>
          <Text>Nova Simulação</Text>
        </TouchableOpacity>
      </View>
    );
  },
}));

const mockUseSimulationResult = useSimulationResult as jest.MockedFunction<typeof useSimulationResult>;

const defaultMockData = {
  productId: 'test-product-id',
  amount: '50000',
  months: 24,
  result: {
    rate: 2.5,
    rateAnnual: 30,
    amortizationType: 'PRICE' as const,
  },
  loanSchedule: {
    schedule: [] as any[],
    totalAmount: 60000,
    totalInterest: 10000,
    totalWithInterest: 60000,
    firstInstallment: 2500,
    monthlyInstallment: 2500,
  },
  isHabitacao: false,
  amortizationType: 'PRICE' as const,
  setAmortizationType: jest.fn(),
  handleBackPress: jest.fn(),
  formatCurrency: jest.fn((value: number) => `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`),
} as any;

describe('SimulationResult', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseSimulationResult.mockReturnValue(defaultMockData);
  });

  it('should render correctly', () => {
    const { getByTestId } = render(<SimulationResult />);

    expect(getByTestId('header')).toBeTruthy();
    expect(getByTestId('result-summary')).toBeTruthy();
    expect(getByTestId('installments-header')).toBeTruthy();
    expect(getByTestId('cronograma-pagamentos')).toBeTruthy();
    expect(getByTestId('footer')).toBeTruthy();
  });

  it('should display correct amount and months', () => {
    const { getByText } = render(<SimulationResult />);

    expect(getByText('Valor: 50000')).toBeTruthy();
    expect(getByText('Parcelas: 24')).toBeTruthy();
  });

  it('should render all main components', () => {
    const { getByTestId } = render(<SimulationResult />);

    expect(getByTestId('header')).toBeTruthy();
    expect(getByTestId('result-summary')).toBeTruthy();
    expect(getByTestId('installments-header')).toBeTruthy();
    expect(getByTestId('cronograma-pagamentos')).toBeTruthy();
    expect(getByTestId('footer')).toBeTruthy();
  });

  it('should call useSimulationResult hook', () => {
    render(<SimulationResult />);

    expect(mockUseSimulationResult).toHaveBeenCalledTimes(1);
  });

  it('should handle habitacao products', () => {
    mockUseSimulationResult.mockReturnValue({
      ...defaultMockData,
      isHabitacao: true,
    });

    const { getByTestId } = render(<SimulationResult />);

    expect(getByTestId('result-summary')).toBeTruthy();
  });

  it('should handle SAC amortization', () => {
    mockUseSimulationResult.mockReturnValue({
      ...defaultMockData,
      amortizationType: 'SAC',
    });

    const { getByTestId } = render(<SimulationResult />);

    expect(getByTestId('result-summary')).toBeTruthy();
  });

  it('should render InstallmentsHeader component', () => {
    const { getByTestId, getByText } = render(<SimulationResult />);

    expect(getByTestId('installments-header')).toBeTruthy();
    expect(getByText('Parcelas')).toBeTruthy();
  });

  it('should render LoanSchedulePanel with correct testID', () => {
    const { getByTestId } = render(<SimulationResult />);

    const loanSchedulePanel = getByTestId('cronograma-pagamentos');
    expect(loanSchedulePanel).toBeTruthy();
  });

  it('should render content in correct structure', () => {
    const { getByTestId } = render(<SimulationResult />);

    expect(getByTestId('header')).toBeTruthy();
    expect(getByTestId('result-summary')).toBeTruthy();
    expect(getByTestId('installments-header')).toBeTruthy();
    expect(getByTestId('footer')).toBeTruthy();
  });

  it('should handle empty loan schedule', () => {
    mockUseSimulationResult.mockReturnValue({
      ...defaultMockData,
      loanSchedule: {
        ...defaultMockData.loanSchedule,
        schedule: [],
      },
    });

    const { getByTestId } = render(<SimulationResult />);

    expect(getByTestId('cronograma-pagamentos')).toBeTruthy();
  });

  it('should match snapshot', () => {
    const component = render(<SimulationResult />);
    expect(component.toJSON()).toMatchSnapshot();
  });

  it('should render without errors', () => {
    expect(() => render(<SimulationResult />)).not.toThrow();
  });
});
