import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, BackHandler, Alert } from 'react-native';
import { useRoute, RouteProp, useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '@/navigation/AppStack';

import { Text } from '@/design-system/components';

type RouteProps = RouteProp<AppStackParamList, 'SimulationTransition'>;
type NavigationProps = NativeStackNavigationProp<AppStackParamList>;

type SimulationState = 'idle' | 'loading' | 'success' | 'error';

interface SimulationResult {
  installment: number;
  total: number;
  rate: number;
  months: number;
  amount: number;
}

const SimulationTransition: React.FC = () => {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation<NavigationProps>();
  const { productId, amount, months } = route.params;
  
  const [state, setState] = useState<SimulationState>('idle');
  const [statusText, setStatusText] = useState<string>('');
  const [requestId] = useState<string>(() => `sim_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  
  const startTimeRef = useRef<number>(Date.now());
  const minDwellTimeRef = useRef<number>(900); // 900ms mínimo
  const statusInterval = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Status texts que alternam
  const statusTexts = [
    'Validando dados…',
    'Calculando parcelas…',
    'Confirmando cenário…'
  ];

  // Simular API de simulação (substituir pela real)
  const simulateAPI = async (): Promise<SimulationResult> => {
    // Simula delay de rede
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1000));
    
    const numericAmount = parseFloat(amount.replace(/\./g, '').replace(',', '.'));
    // TODO: Buscar taxa real do produto
    const rateAm = 0.01; // 1% ao mês (deve vir do produto)
    
    // Cálculo Price com arredondamento bancário
    const installment = numericAmount * rateAm / (1 - Math.pow(1 + rateAm, -months));
    const roundedInstallment = Math.round(installment * 100) / 100; // Arredondamento bancário
    const total = roundedInstallment * months;
    
    return {
      installment: roundedInstallment,
      total,
      rate: rateAm * 100, // Taxa em %
      months,
      amount: numericAmount
    };
  };

  // Gerenciar textos de status alternados
  const startStatusRotation = () => {
    let currentIndex = 0;
    setStatusText(statusTexts[0] || '');
    
    statusInterval.current = setInterval(() => {
      currentIndex = (currentIndex + 1) % statusTexts.length;
      setStatusText(statusTexts[currentIndex] || '');
    }, 1200);
  };

  const stopStatusRotation = () => {
    if (statusInterval.current) {
      clearInterval(statusInterval.current);
      statusInterval.current = null;
    }
  };

  // Executar simulação
  const executeSimulation = async () => {
    console.log('📊 Telemetria: simulation_request_started', { 
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
      console.log('❌ Telemetria: simulation_request_failed', { 
        requestId, 
        duration_ms: Date.now() - startTimeRef.current,
        reason: 'timeout' 
      });
    }, 15000);

    try {
      await simulateAPI(); // Apenas valida os dados, o cálculo será feito na próxima tela
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      const duration = Date.now() - startTimeRef.current;
      const remainingDwell = Math.max(0, minDwellTimeRef.current - duration);

      // Garantir dwell mínimo
      setTimeout(() => {
        stopStatusRotation();
        setState('success');
        
        console.log('✅ Telemetria: simulation_request_succeeded', { 
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
      
      console.log('❌ Telemetria: simulation_request_failed', { 
        requestId, 
        duration_ms: Date.now() - startTimeRef.current,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  // Interceptar botão voltar
  const handleBackPress = () => {
    if (state === 'loading') {
      Alert.alert(
        'Cancelar simulação',
        'Deseja cancelar a simulação agora? As alterações não serão salvas.',
        [
          {
            text: 'Cancelar',
            style: 'cancel'
          },
          {
            text: 'Sim, voltar',
            style: 'destructive',
            onPress: () => {
              console.log('🚫 Telemetria: simulation_request_aborted', { 
                requestId, 
                reason: 'back_press' 
              });
              navigation.goBack();
            }
          }
        ]
      );
      return true; // Impede o comportamento padrão
    }
    return false; // Permite o comportamento padrão
  };

  // Setup do interceptor de volta
  useFocusEffect(
    React.useCallback(() => {
      const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
      return () => backHandler.remove();
    }, [state])
  );

  // Iniciar simulação quando componente monta
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
  }, []);

  const getHeadlineText = () => {
    switch (state) {
      case 'loading':
        return 'Realizando a simulação';
      case 'success':
        return 'Tudo pronto!';
      case 'error':
        return 'Simulação não concluída';
      default:
        return 'Preparando...';
    }
  };

  const getSubtext = () => {
    switch (state) {
      case 'loading':
        return 'Isso leva poucos segundos.';
      case 'success':
        return 'Valores confirmados. Abrindo o resultado…';
      case 'error':
        return 'Tente novamente mais tarde.';
      default:
        return '';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={StyleSheet.flatten([styles.headline, state === 'success' && styles.headlineSuccess])}>
            {getHeadlineText()}
          </Text>
          <View style={StyleSheet.flatten([styles.accentLine, state === 'success' && styles.accentLineSuccess])} />
        </View>

        {/* Animation Area */}
        <View style={styles.animationContainer}>
          <View style={StyleSheet.flatten([styles.animationPlaceholder, state === 'success' && styles.animationSuccess])}>
            <Text style={styles.animationText}>
              {state === 'loading' && '⏳'}
              {state === 'success' && '✅'}
              {state === 'error' && '❌'}
            </Text>
          </View>
        </View>

        {/* Status */}
        <View style={styles.statusContainer}>
          {state === 'loading' && statusText && (
            <Text style={styles.statusText}>{statusText}</Text>
          )}
          <Text style={styles.subtext}>{getSubtext()}</Text>
        </View>
      </View>
    </View>
  );
};

export default SimulationTransition;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F8FB',
    padding: 16,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 32,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  headline: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#004AAD',
    textAlign: 'center',
    marginBottom: 8,
  },
  headlineSuccess: {
    color: '#004AAD',
  },
  accentLine: {
    width: 60,
    height: 3,
    backgroundColor: '#D0D7E2',
    borderRadius: 2,
  },
  accentLineSuccess: {
    backgroundColor: '#004AAD',
  },
  animationContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  animationPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F0F4F8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  animationSuccess: {
    backgroundColor: '#E8F5E8',
  },
  animationText: {
    fontSize: 48,
  },
  statusContainer: {
    alignItems: 'center',
    minHeight: 60,
  },
  statusText: {
    fontSize: 14,
    color: '#667085',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtext: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
  },
});
