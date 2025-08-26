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
  const [calculation, setCalculation] = useState<any>(null);

  // Simular cálculo financeiro simples
  useEffect(() => {
    const simulateCalculation = async () => {
      const amount = parseFloat((route.params?.amount || '0').replace(/[^\d,]/g, '').replace(',', '.'));
      const months = route.params?.months || 96;
      const monthlyRate = 0.02; // 2% ao mês
      
      // Cálculo simples de empréstimo
      const monthlyInstallment = (amount * monthlyRate * Math.pow(1 + monthlyRate, months)) / 
                                (Math.pow(1 + monthlyRate, months) - 1);
      
      const result = {
        monthlyInstallment,
        totalAmount: monthlyInstallment * months,
        totalInterest: (monthlyInstallment * months) - amount,
        amount,
        months,
        rate: monthlyRate * 100, // Convertendo para porcentagem
        rateAnnual: ((Math.pow(1 + monthlyRate, 12) - 1) * 100) // Taxa anual efetiva
      };
      
      setTimeout(() => {
        setCalculation(result);
        setStatus('success');
      }, 4000); // 4 segundos
    };

    simulateCalculation();
  }, [route.params]);

  const handleAnimationFinish = async () => {
    try {
      navigation.navigate('SimulationResult', {
        productId: route.params?.productId,
        amount: route.params?.amount,
        months: route.params?.months || 96,
        result: calculation,
      });
    } catch (error) {
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
