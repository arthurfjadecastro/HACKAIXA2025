import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type NavigationProps = NativeStackNavigationProp<any>;

export type SimulationState = 'idle' | 'loading' | 'success' | 'error';

export interface SimulationResult {
  installment: number;
  total: number;
  rate: number;
  months: number;
  amount: number;
}

export interface SimulationParams {
  productId: string;
  amount: string;
  months: number;
}

export const STATUS_TEXTS = [
  'Validando dados…',
  'Calculando parcelas…',
  'Confirmando cenário…'
] as const;

export const MIN_DWELL_TIME = 900; // 900ms mínimo
export const TIMEOUT_DURATION = 15000; // 15 segundos
export const STATUS_ROTATION_INTERVAL = 1200; // 1.2 segundos
