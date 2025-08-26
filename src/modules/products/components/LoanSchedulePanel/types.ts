export interface Installment {
  id: string | number;
  index: number;
  dueDate: Date;
  value: number;
  balanceAfterPayment: number;
  interestValue: number;
  principalValue: number;
  totalInterest: number;
}

export interface LoanSchedulePanelProps {
  data: Installment[];
  title?: string;
  subtitle?: string;
  onEndReached?: () => void;
  testID?: string;
  showSummary?: boolean;
  summaryData?: {
    totalFinanced: number;
    totalInterest: number;
    totalAmount: number;
  };
}
