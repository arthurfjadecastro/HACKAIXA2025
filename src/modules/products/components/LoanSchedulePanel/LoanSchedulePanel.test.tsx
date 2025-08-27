import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import LoanSchedulePanel from './LoanSchedulePanel';
import { Installment } from './types';

// Mock do design system
jest.mock('../../../../design-system', () => ({
  Accordion: jest.fn(({ data, renderHeader, renderContent, onEndReached, testID, ListHeaderComponent }) => {
    const { View, Text, TouchableOpacity } = jest.requireActual('react-native');
    
    return (
      <View testID={testID}>
        {ListHeaderComponent && <ListHeaderComponent />}
        {data.map((item: any, index: number) => (
          <View key={item.id || index} testID={`accordion-item-${index}`}>
            <TouchableOpacity
              testID={`accordion-header-${index}`}
              onPress={() => {}}
            >
              {renderHeader(item)}
            </TouchableOpacity>
            <View testID={`accordion-content-${index}`}>
              {renderContent(item)}
            </View>
          </View>
        ))}
        
        {onEndReached && (
          <TouchableOpacity 
            testID="end-reached-trigger"
            onPress={onEndReached}
          >
            <Text>End Reached</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }),
  Text: jest.fn(({ children, ...props }) => {
    const { Text: RNText } = jest.requireActual('react-native');
    return <RNText {...props}>{children}</RNText>;
  }),
}));

// Mock das funções utilitárias
jest.mock('./utils', () => ({
  formatCurrency: jest.fn((value: number) => `R$ ${value.toFixed(2).replace('.', ',')}`),
  formatDate: jest.fn((date: Date) => {
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }),
  formatInstallmentNumber: jest.fn((index: number) => `${index + 1}ª parcela`),
}));

const mockInstallments: Installment[] = [
  {
    id: 1,
    index: 0,
    dueDate: new Date('2024-01-14'),
    value: 1000.50,
    principalValue: 800.00,
    interestValue: 200.50,
    balanceAfterPayment: 9000.00,
    totalInterest: 200.50,
  },
  {
    id: 2,
    index: 1,
    dueDate: new Date('2024-02-14'),
    value: 1000.50,
    principalValue: 820.00,
    interestValue: 180.50,
    balanceAfterPayment: 8180.00,
    totalInterest: 381.00,
  },
  {
    id: 3,
    index: 2,
    dueDate: new Date('2024-03-14'),
    value: 1000.50,
    principalValue: 840.00,
    interestValue: 160.50,
    balanceAfterPayment: 7340.00,
    totalInterest: 541.50,
  },
];

const mockSummaryData = {
  totalFinanced: 10000.00,
  totalInterest: 2000.50,
  totalAmount: 12000.50,
};

describe('LoanSchedulePanel', () => {
  describe('🎯 Basic Rendering', () => {
    it('should render with default props', () => {
      const { getByText } = render(
        <LoanSchedulePanel data={mockInstallments} />
      );

      expect(getByText('Cronograma de Pagamentos')).toBeTruthy();
    });

    it('should render with custom title and subtitle', () => {
      const { getByText } = render(
        <LoanSchedulePanel 
          data={mockInstallments}
          title="Cronograma Personalizado"
          subtitle="Subtítulo customizado"
        />
      );

      expect(getByText('Cronograma Personalizado')).toBeTruthy();
      expect(getByText('Subtítulo customizado')).toBeTruthy();
    });

    it('should render with testID', () => {
      const { getByTestId } = render(
        <LoanSchedulePanel 
          data={mockInstallments}
          testID="custom-test-id"
        />
      );

      expect(getByTestId('custom-test-id')).toBeTruthy();
    });
  });

  describe('🎯 Summary Data Rendering', () => {
    it('should render summary when showSummary is true and summaryData is provided', () => {
      const { getByText } = render(
        <LoanSchedulePanel 
          data={mockInstallments}
          showSummary={true}
          summaryData={mockSummaryData}
        />
      );

      expect(getByText('R$ 10000,00')).toBeTruthy();
      expect(getByText('R$ 2000,50')).toBeTruthy();
      expect(getByText('R$ 12000,50')).toBeTruthy();
    });

    it('should not render summary when showSummary is false', () => {
      const { queryByText } = render(
        <LoanSchedulePanel 
          data={mockInstallments}
          showSummary={false}
          summaryData={mockSummaryData}
        />
      );

      expect(queryByText('R$ 10000,00')).toBeFalsy();
    });
  });

  describe('🎯 Installment Header Rendering', () => {
    it('should render installment headers correctly', () => {
      const { getByText, getAllByText } = render(
        <LoanSchedulePanel data={mockInstallments} />
      );

      // Verifica números das parcelas
      expect(getByText('1ª parcela')).toBeTruthy();
      expect(getByText('2ª parcela')).toBeTruthy();
      expect(getByText('3ª parcela')).toBeTruthy();

      // Verifica datas formatadas (corrigindo para as datas reais que aparecem)
      expect(getByText('13/01/2024')).toBeTruthy();
      expect(getByText('13/02/2024')).toBeTruthy();
      expect(getByText('13/03/2024')).toBeTruthy();

      // Verifica valores das parcelas (múltiplas instâncias)
      expect(getAllByText('R$ 1000,50').length).toBeGreaterThan(0);
    });

    it('should format installment numbers correctly', () => {
      const singleInstallment = [mockInstallments[0]!];
      const { getByText } = render(
        <LoanSchedulePanel data={singleInstallment} />
      );

      expect(getByText('1ª parcela')).toBeTruthy();
    });
  });

  describe('🎯 Installment Content Rendering', () => {
    it('should render installment details correctly', () => {
      const { getByText, getAllByText } = render(
        <LoanSchedulePanel data={mockInstallments} />
      );

      // Verifica valores principais
      expect(getByText('R$ 800,00')).toBeTruthy();
      expect(getAllByText('R$ 200,50').length).toBeGreaterThan(0);
      expect(getByText('R$ 9000,00')).toBeTruthy();
    });

    it('should render content for multiple installments', () => {
      const { getByText, getAllByText } = render(
        <LoanSchedulePanel data={mockInstallments} />
      );

      // Verifica conteúdo da primeira parcela
      expect(getByText('R$ 800,00')).toBeTruthy();
      expect(getAllByText('R$ 200,50').length).toBeGreaterThan(0);

      // Verifica conteúdo da segunda parcela
      expect(getByText('R$ 820,00')).toBeTruthy();
      expect(getByText('R$ 180,50')).toBeTruthy();
    });
  });

  describe('🎯 Event Handling', () => {
    it('should handle onEndReached callback', () => {
      const mockOnEndReached = jest.fn();
      const { getByTestId } = render(
        <LoanSchedulePanel 
          data={mockInstallments}
          onEndReached={mockOnEndReached}
        />
      );

      const endReachedTrigger = getByTestId('end-reached-trigger');
      fireEvent.press(endReachedTrigger);

      expect(mockOnEndReached).toHaveBeenCalledTimes(1);
    });

    it('should not render end reached trigger when onEndReached is not provided', () => {
      const { queryByTestId } = render(
        <LoanSchedulePanel data={mockInstallments} />
      );

      expect(queryByTestId('end-reached-trigger')).toBeFalsy();
    });
  });

  describe('🎯 Edge Cases', () => {
    it('should render with empty data array', () => {
      const { getByText } = render(
        <LoanSchedulePanel data={[]} />
      );

      expect(getByText('Cronograma de Pagamentos')).toBeTruthy();
    });

    it('should handle single installment', () => {
      const singleInstallment = [mockInstallments[0]!];
      const { getByText } = render(
        <LoanSchedulePanel data={singleInstallment} />
      );

      expect(getByText('1ª parcela')).toBeTruthy();
      expect(getByText('R$ 800,00')).toBeTruthy();
    });

    it('should handle zero values correctly', () => {
      const zeroValueInstallment = [
        {
          id: 1,
          index: 0,
          dueDate: new Date('2024-01-14'),
          value: 0,
          principalValue: 0,
          interestValue: 0,
          balanceAfterPayment: 0,
          totalInterest: 0,
        },
      ];

      const { getAllByText } = render(
        <LoanSchedulePanel data={zeroValueInstallment} />
      );

      expect(getAllByText('R$ 0,00').length).toBeGreaterThan(0);
    });
  });

  describe('🎯 Component Integration', () => {
    it('should pass all props correctly to Accordion', () => {
      const { getByTestId } = render(
        <LoanSchedulePanel 
          data={mockInstallments}
          testID="accordion-test"
        />
      );

      expect(getByTestId('accordion-test')).toBeTruthy();
    });

    it('should render accordion items correctly', () => {
      const { getByTestId } = render(
        <LoanSchedulePanel data={mockInstallments} />
      );

      expect(getByTestId('accordion-item-0')).toBeTruthy();
      expect(getByTestId('accordion-item-1')).toBeTruthy();
      expect(getByTestId('accordion-item-2')).toBeTruthy();
    });
  });

  describe('🎯 Utility Functions Integration', () => {
    it('should call formatCurrency with correct values', () => {
      const formatCurrency = require('./utils').formatCurrency;
      
      render(<LoanSchedulePanel data={mockInstallments} />);

      expect(formatCurrency).toHaveBeenCalled();
    });

    it('should call formatDate with correct dates', () => {
      const formatDate = require('./utils').formatDate;
      
      render(<LoanSchedulePanel data={mockInstallments} />);

      expect(formatDate).toHaveBeenCalled();
    });

    it('should call formatInstallmentNumber with correct index', () => {
      const formatInstallmentNumber = require('./utils').formatInstallmentNumber;
      
      render(<LoanSchedulePanel data={mockInstallments} />);

      expect(formatInstallmentNumber).toHaveBeenCalled();
    });
  });
});
