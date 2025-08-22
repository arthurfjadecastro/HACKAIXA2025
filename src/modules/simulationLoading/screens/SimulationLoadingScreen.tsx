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
    
    // Calcular resultado real baseado nos parâmetros
    const numericAmount = parseFloat(route.params?.amount?.replace(/\./g, '').replace(',', '.') || '0');
    const months = route.params?.months || 96;
    
    // Taxa padrão para CONSIGNADO INSS: 1.56% a.m. (conforme dados reais)
    const rateMonthly = 0.0156; // 1.56% a.m.
    
    // Cálculo usando Sistema Price
    const installment = numericAmount * rateMonthly / (1 - Math.pow(1 + rateMonthly, -months));
    const roundedInstallment = Math.round(installment * 100) / 100;
    const total = roundedInstallment * months;
    const totalInterest = total - numericAmount;
    
    const calculatedResult = {
      installment: roundedInstallment,
      total: total,
      totalInterest: totalInterest,
      rate: rateMonthly * 100, // Taxa mensal em %
      rateAnnual: (Math.pow(1 + rateMonthly, 12) - 1) * 100, // Taxa anual em %
      amortizationType: 'PRICE' as const,
      schedule: [] // Será calculado na tela de resultado
    };
    
    console.log('🚀 Navegando para resultado da simulação com dados corretos:', calculatedResult);
    navigation.navigate('SimulationResult', {
      productId: route.params?.productId,
      amount: route.params?.amount,
      months: months,
      result: calculatedResult,
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
