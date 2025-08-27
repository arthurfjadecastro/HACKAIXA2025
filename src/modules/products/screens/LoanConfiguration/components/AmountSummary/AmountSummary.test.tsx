import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { AmountSummary } from './AmountSummary';

// Mock do Ionicons
jest.mock('@expo/vector-icons', () => ({
  Ionicons: ({ name, size, color, ...props }: any) => {
    const { View } = require('react-native');
    return <View testID={`icon-${name}`} {...props} />;
  },
}));

// Mock dos styles
jest.mock('../../LoanConfiguration.styles', () => ({
  styles: {
    amountSummary: { padding: 10 },
    amountRow: { flexDirection: 'row' },
    amountValue: { fontSize: 16 },
    editButton: { padding: 5 },
  },
}));

describe('AmountSummary', () => {
  const defaultProps = {
    amount: '50000',
    onEditAmount: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render correctly with amount', () => {
    const { getByText, getByTestId } = render(<AmountSummary {...defaultProps} />);

    expect(getByText('R$ 50000')).toBeTruthy();
    expect(getByTestId('icon-pencil')).toBeTruthy();
  });

  it('should render default amount when amount is empty', () => {
    const { getByText } = render(<AmountSummary {...defaultProps} amount="" />);

    expect(getByText('R$ 0,00')).toBeTruthy();
  });

  it('should call onEditAmount when edit button is pressed', () => {
    const { getByTestId } = render(<AmountSummary {...defaultProps} />);

    const editButton = getByTestId('icon-pencil').parent;
    fireEvent.press(editButton);

    expect(defaultProps.onEditAmount).toHaveBeenCalledTimes(1);
  });

  it('should display formatted amount with R$ prefix', () => {
    const { getByText } = render(<AmountSummary {...defaultProps} amount="100000" />);

    expect(getByText('R$ 100000')).toBeTruthy();
  });

  it('should render edit icon', () => {
    const { getByTestId } = render(<AmountSummary {...defaultProps} />);

    expect(getByTestId('icon-pencil')).toBeTruthy();
  });

  it('should handle zero amount', () => {
    const { getByText } = render(<AmountSummary {...defaultProps} amount="0" />);

    expect(getByText('R$ 0')).toBeTruthy();
  });

  it('should handle null amount', () => {
    const { getByText } = render(<AmountSummary {...defaultProps} amount="" />);

    expect(getByText('R$ 0,00')).toBeTruthy();
  });

  it('should match snapshot', () => {
    const component = render(<AmountSummary {...defaultProps} />);
    expect(component.toJSON()).toMatchSnapshot();
  });

  it('should render with large amounts', () => {
    const { getByText } = render(<AmountSummary {...defaultProps} amount="999999" />);

    expect(getByText('R$ 999999')).toBeTruthy();
  });

  it('should have correct structure', () => {
    const { getByText, getByTestId } = render(<AmountSummary {...defaultProps} />);

    expect(getByText('R$ 50000')).toBeTruthy();
    expect(getByTestId('icon-pencil')).toBeTruthy();
  });
});
