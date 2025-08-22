import React, { useState, useEffect } from 'react';
import { View, SafeAreaView } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '@/navigation/AppStack';

import SimulationLottieAnimation from '../components/LottieAnimation';
import { styles } from './SimulationLoadingScreen.styles';

type RouteProps = RouteProp<AppStackParamList, 'SimulationLoading'>;
type NavigationProps = NativeStackNavigationProp<AppStackParamList>;

type LoadingStatus = 'loading' | 'success';

const SimulationLoadingScreen: React.FC = () => {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation<NavigationProps>();
  const [status, setStatus] = useState<LoadingStatus>('loading');

  // Simula o processamento da simulação
  useEffect(() => {
    const simulateCalculation = async () => {
      console.log('🧮 Iniciando cálculo da simulação...');
      
      // Tempo total: permite que a animação complete pelo menos uma vez
      // A animação tem 282 frames a 60fps = ~4.7 segundos
      const calculationTime = 4000; // 4 segundos fixos
      
      setTimeout(() => {
        console.log('✅ Cálculo da simulação concluído');
        setStatus('success');
      }, calculationTime);
    };

    simulateCalculation();
  }, []);

  const handleAnimationFinish = () => {
    console.log('🎬 Animação finalizada - Status atual:', status);
    
    // Simula resultado do cálculo
    const mockResult = {
      installment: 450.25,
      total: 5403.00,
      rate: 12.5,
      schedule: [] // Array vazio por enquanto
    };
    
    console.log('🚀 Navegando para resultado da simulação');
    navigation.navigate('SimulationResult', {
      productId: route.params?.productId,
      amount: route.params?.amount,
      months: route.params?.months,
      result: mockResult,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.animationContainer}>
          <SimulationLottieAnimation
            isLoading={status === 'loading'}
            onFinish={handleAnimationFinish}
            size={280}
            testID="simulation-loading-animation"
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SimulationLoadingScreen;
