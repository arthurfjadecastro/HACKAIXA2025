import React, { useRef, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';

import LoadingFallback from '../LoadingFallback/LoadingFallback';

type Props = {
  isLoading: boolean;         // true = loop, false = finaliza e congela
  onFinish?: () => void;      // callback para navegar ao resultado
  size?: number;              // opcional (default 220)
  testID?: string;            // para testes
};

const SimulationLottieAnimation: React.FC<Props> = ({
  isLoading,
  onFinish,
  size = 220,
  testID = 'simulation-lottie-animation'
}) => {
  const animationRef = useRef<LottieView>(null);
  const [hasError, setHasError] = React.useState(false);

  useEffect(() => {
    if (!isLoading && animationRef.current) {
      // Para o loop e reproduz uma vez até o final
      console.log('🔄 Parando loop, reproduzindo animação até o final...');
      animationRef.current.play?.();
    } else if (isLoading && animationRef.current) {
      // Reinicia o loop quando volta a carregar
      animationRef.current.play?.();
    }
  }, [isLoading]);

  const handleAnimationFinish = () => {
    console.log('🎬 Animação de simulação finalizada');
    // Sempre chama onFinish quando a animação termina
    // Independente do estado de isLoading
    onFinish?.();
  };

  if (hasError) {
    return (
      <LoadingFallback 
        size={size}
        testID={`${testID}-fallback`}
      />
    );
  }

  try {
    return (
      <View style={[styles.container, { width: size, height: size }]}>
        <LottieView
          ref={animationRef}
          source={require('../../../../../assets/loading_bar.json')}
          autoPlay={true}
          loop={isLoading}
          onAnimationFinish={handleAnimationFinish}
          style={[styles.animation, { width: size, height: size }]}
          testID={testID}
          resizeMode="contain" // Mudado para cover para melhor preenchimento
        />
      </View>
    );
  } catch (error) {
    console.warn('⚠️ Erro ao renderizar animação de simulação:', error);
    // Em caso de erro, renderiza o fallback diretamente
    return (
      <LoadingFallback 
        size={size}
        testID={`${testID}-fallback`}
      />
    );
  }
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    // Removido background, padding, sombras e border radius
    // Apenas a animação limpa na tela
  },
  animation: {
    alignSelf: 'center',
  },
});

export default React.memo(SimulationLottieAnimation);
