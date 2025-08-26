import React, { useState, useEffect } from 'react';
import { View, SafeAreaView } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '@/navigation/AppStack';
import { useFinancialCalculation } from '@/modules/simulations/hooks/useFinancialCalculation';

import SimulationLottieAnimation from '../components/LottieAnimation';
import { styles } from './SimulationLoadingScreen.styles';

type RouteProps = RouteProp<AppStackParamList, 'SimulationLoading'>;
type NavigationProps = NativeStackNavigationProp<AppStackParamList>;

type LoadingStatus = 'loading' | 'success';

const SimulationLoadingScreen: React.FC = () => {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation<NavigationProps>();
  const [status, setStatus] = useState<LoadingStatus>('loading');

  // Usar o hook de cálculo financeiro
  const { calculation } = useFinancialCalculation({
    productId: route.params?.productId || '',
    amount: route.params?.amount || '0',
    months: route.params?.months || 96
  });

  // Simula o processamento da simulação
  useEffect(() => {
    const simulateCalculation = async () => {
      console.log('🧮 Iniciando cálculo da simulação...');
      
      const calculationTime = 4000; // 4 segundos
      
      setTimeout(() => {
        console.log('✅ Cálculo da simulação concluído');
        setStatus('success');
      }, calculationTime);
    };

    simulateCalculation();
  }, []);

  const handleAnimationFinish = async () => {
    console.log('🎬 Animação finalizada - Status atual:', status);
    
    try {
      // Usar o cálculo financeiro correto
      const calculatedResult = await calculation;
      
      console.log('🚀 Navegando para resultado da simulação com dados corretos:', calculatedResult);
      navigation.navigate('SimulationResult', {
        productId: route.params?.productId,
        amount: route.params?.amount,
        months: route.params?.months || 96,
        result: calculatedResult,
      });
    } catch (error) {
      console.error('❌ Erro no cálculo da simulação:', error);
      
      // Fallback com valores básicos em caso de erro
      const numericAmount = parseFloat(route.params?.amount?.replace(/\./g, '').replace(',', '.') || '0');
      const months = route.params?.months || 96;
      const rateMonthly = 0.0156; // Taxa de fallback
      
      const installment = numericAmount * rateMonthly / (1 - Math.pow(1 + rateMonthly, -months));
      const roundedInstallment = Math.round(installment * 100) / 100;
      const total = roundedInstallment * months;
      const totalInterest = total - numericAmount;
      
      const fallbackResult = {
        installment: roundedInstallment,
        total: total,
        totalInterest: totalInterest,
        rate: rateMonthly * 100,
        rateAnnual: (Math.pow(1 + rateMonthly, 12) - 1) * 100,
        amortizationType: 'PRICE' as const,
        schedule: []
      };
      
      navigation.navigate('SimulationResult', {
        productId: route.params?.productId,
        amount: route.params?.amount,
        months: months,
        result: fallbackResult,
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Apenas a animação centralizada */}
        <SimulationLottieAnimation
          isLoading={status === 'loading'}
          onFinish={handleAnimationFinish}
          size={400} // Aumentado para ocupar mais da largura da tela
          testID="simulation-loading-animation"
        />
      </View>
    </SafeAreaView>
  );
};

export default SimulationLoadingScreen;
