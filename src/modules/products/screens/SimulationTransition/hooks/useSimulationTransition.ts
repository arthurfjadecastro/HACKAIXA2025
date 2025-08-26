import { useState, useEffect, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import { SimulationState, NavigationProps, MIN_DWELL_TIME, TIMEOUT_DURATION } from '../types';
import { simulateAPI } from '../utils/simulationAPI';
import { useStatusRotation } from './useStatusRotation';

interface UseSimulationTransitionReturn {
  state: SimulationState;
  statusText: string;
  requestId: string;
}

interface UseSimulationTransitionProps {
  productId: string;
  amount: string;
  months: number;
}

export const useSimulationTransition = ({
  productId,
  amount,
  months
}: UseSimulationTransitionProps): UseSimulationTransitionReturn => {
  const navigation = useNavigation<NavigationProps>();
  const [state, setState] = useState<SimulationState>('idle');
  const [requestId] = useState<string>(() => 
    `sim_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  );
  
  const startTimeRef = useRef<number>(Date.now());
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const { statusText, startStatusRotation, stopStatusRotation } = useStatusRotation();

  // Executar simulação
  const executeSimulation = async () => {
    console.log('🔄 Iniciando simulação:', { 
      requestId, 
      productId, 
      amount, 
      months 
    });

    setState('loading');
    startStatusRotation();
    startTimeRef.current = Date.now();

    // Timeout de 15 segundos
    timeoutRef.current = setTimeout(() => {
      setState('error');
      stopStatusRotation();
      console.log('⏰ Timeout da simulação:', { 
        requestId, 
        duration_ms: Date.now() - startTimeRef.current,
        reason: 'timeout' 
      });
    }, TIMEOUT_DURATION);

    try {
      await simulateAPI(amount, months); // Apenas valida os dados
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      const duration = Date.now() - startTimeRef.current;
      const remainingDwell = Math.max(0, MIN_DWELL_TIME - duration);

      // Garantir dwell mínimo
      setTimeout(() => {
        stopStatusRotation();
        setState('success');
        
        console.log('✅ Simulação concluída:', { 
          requestId, 
          duration_ms: Date.now() - startTimeRef.current 
        });

        // Navegar após microanimação para a nova tela de loading
        setTimeout(() => {
          navigation.replace('SimulationLoading', {
            productId,
            amount,
            months
          });
        }, 500);
      }, remainingDwell);

    } catch (error) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      stopStatusRotation();
      setState('error');
      
      console.log('❌ Erro na simulação:', { 
        requestId, 
        duration_ms: Date.now() - startTimeRef.current,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  // Iniciar simulação quando hook é usado
  useEffect(() => {
    const timer = setTimeout(() => {
      executeSimulation();
    }, 100); // 100ms delay inicial

    return () => {
      clearTimeout(timer);
      stopStatusRotation();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Cleanup ao desmontar
  useEffect(() => {
    return () => {
      stopStatusRotation();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [stopStatusRotation]);

  return {
    state,
    statusText,
    requestId,
  };
};
