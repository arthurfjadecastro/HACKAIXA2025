import React from 'react';
import { render } from '@testing-library/react-native';
import { FinancialSummary } from './FinancialSummary';
import { QuoteData } from '../../types';

// Mock dos styles
jest.mock('../../LoanConfiguration.styles', () => ({
  styles: {
    installmentValue: { padding: 10 },
    installmentLabel: { fontSize: 14 },
    installmentAmount: { fontSize: 24 },
    financialSummary: { padding: 15 },
    summaryRow: { flexDirection: 'row' },
    summaryLabel: { fontSize: 16 },
    summaryValue: { fontSize: 16 },
  },
}));

describe('FinancialSummary', () => {
  const mockQuote: QuoteData = {
    installment: 2500,
    total: 60000,
    rate: 0.025,
  };

  const defaultProps = {
    quote: mockQuote,
    productRateAm: 0.025,
    formatCurrency: jest.fn((value: number) => `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render correctly with quote data', () => {
    const { getByText } = render(<FinancialSummary {...defaultProps} />);

    expect(getByText('de')).toBeTruthy();
    expect(getByText('Total a pagar')).toBeTruthy();
    expect(getByText('Juros')).toBeTruthy();
  });

  it('should display installment amount when quote is provided', () => {
    render(<FinancialSummary {...defaultProps} />);

    expect(defaultProps.formatCurrency).toHaveBeenCalledWith(2500);
  });

  it('should display total amount when quote is provided', () => {
    render(<FinancialSummary {...defaultProps} />);

    expect(defaultProps.formatCurrency).toHaveBeenCalledWith(60000);
  });

  it('should display default values when quote is null', () => {
    const { getAllByText } = render(<FinancialSummary {...defaultProps} quote={null} />);

    // Verifica se existe pelo menos um elemento com R$ 0,00
    const zeroValues = getAllByText('R$ 0,00');
    expect(zeroValues.length).toBeGreaterThan(0);
  });

  it('should calculate and display interest rates correctly', () => {
    const { getByText } = render(<FinancialSummary {...defaultProps} />);

    // Monthly rate: 2.50% a.m.
    expect(getByText('2.50% a.m. (34.5% a.a. efetiva)')).toBeTruthy();
  });

  it('should handle different interest rates', () => {
    const { getByText } = render(<FinancialSummary {...defaultProps} productRateAm={0.03} />);

    // Monthly rate: 3.00% a.m.
    expect(getByText('3.00% a.m. (42.6% a.a. efetiva)')).toBeTruthy();
  });

  it('should handle zero interest rate', () => {
    const { getByText } = render(<FinancialSummary {...defaultProps} productRateAm={0} />);

    expect(getByText('0.00% a.m. (0.0% a.a. efetiva)')).toBeTruthy();
  });

  it('should match snapshot with quote', () => {
    const component = render(<FinancialSummary {...defaultProps} />);
    expect(component.toJSON()).toMatchSnapshot();
  });

  it('should match snapshot without quote', () => {
    const component = render(<FinancialSummary {...defaultProps} quote={null} />);
    expect(component.toJSON()).toMatchSnapshot();
  });

  it('should render installment label', () => {
    const { getByText } = render(<FinancialSummary {...defaultProps} />);

    expect(getByText('de')).toBeTruthy();
  });

  it('should handle high interest rates correctly', () => {
    const { getByText } = render(<FinancialSummary {...defaultProps} productRateAm={0.1} />);

    expect(getByText('10.00% a.m. (213.8% a.a. efetiva)')).toBeTruthy();
  });

  it('should display all summary sections', () => {
    const { getByText } = render(<FinancialSummary {...defaultProps} />);

    expect(getByText('de')).toBeTruthy();
    expect(getByText('Total a pagar')).toBeTruthy();
    expect(getByText('Juros')).toBeTruthy();
  });
});
