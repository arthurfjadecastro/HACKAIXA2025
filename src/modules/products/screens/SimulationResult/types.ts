import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '@/navigation/AppStack';
import { LoanCalculationResult } from '@/utils/loanCalculator';

export type RouteProps = RouteProp<AppStackParamList, 'SimulationResult'>;
export type NavigationProps = NativeStackNavigationProp<AppStackParamList>;

export interface SimulationParams {
  productId: string;
  amount: string;
  months: number;
  result: {
    rate: number;
    rateAnnual?: number;
    amortizationType?: 'PRICE' | 'SAC';
  };
}

// Re-export the existing type from loanCalculator
export type LoanSchedule = LoanCalculationResult;
