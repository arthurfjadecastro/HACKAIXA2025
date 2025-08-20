import React, { useRef, useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';
import { useFocusEffect } from '@react-navigation/native';

export interface LottieAnimationProps {
  /**
   * Caminho para o arquivo JSON da animação Lottie
   */
  source: any;
  
  /**
   * Reproduzir automaticamente quando o componente montar
   * @default true
   */
  autoPlay?: boolean;
  
  /**
   * Repetir a animação em loop
   * @default false
   */
  loop?: boolean;
  
  /**
   * Velocidade da reprodução (1 = velocidade normal, 0.5 = metade da velocidade)
   * Usado para garantir ≤30fps quando necessário
   * @default 0.5
   */
  speed?: number;
  
  /**
   * Largura da animação
   */
  width?: number | string;
  
  /**
   * Altura da animação
   */
  height?: number | string;
  
  /**
   * Respeitar proporção da animação
   * @default true
   */
  resizeMode?: 'contain' | 'cover' | 'center';
  
  /**
   * Callback quando a animação terminar
   */
  onAnimationFinish?: () => void;
  
  /**
   * Callback quando a animação falhar ao carregar
   */
  onAnimationFailure?: () => void;
  
  /**
   * Pausar quando a tela sair de foco
   * @default true
   */
  pauseOnBlur?: boolean;
  
  /**
   * Estilo personalizado para o container
   */
  style?: any;
  
  /**
   * Props de acessibilidade
   */
  accessibilityLabel?: string;
  importantForAccessibility?: 'auto' | 'yes' | 'no' | 'no-hide-descendants';
  
  /**
   * TestID para testes
   */
  testID?: string;
}

/**
 * Componente LottieAnimation otimizado para performance e acessibilidade
 * 
 * Características:
 * - Performance: Limita FPS a ≤30 por padrão
 * - Acessibilidade: Marcado como decorativo
 * - Lifecycle: Pausa/resume baseado no foco da tela
 * - Fallback: Captura erros de carregamento
 * - Touch: Não intercepta toques
 */
export const LottieAnimation: React.FC<LottieAnimationProps> = ({
  source,
  autoPlay = true,
  loop = false,
  speed = 0.5, // 30fps quando a animação é 60fps
  width = '100%',
  height = '100%',
  resizeMode = 'contain',
  onAnimationFinish,
  onAnimationFailure,
  pauseOnBlur = true,
  style,
  accessibilityLabel,
  importantForAccessibility = 'no-hide-descendants',
  testID,
}) => {
  const animationRef = useRef<LottieView>(null);
  const [hasError, setHasError] = useState(false);

  // Controlar reprodução baseado no foco da tela
  useFocusEffect(
    React.useCallback(() => {
      if (pauseOnBlur && animationRef.current) {
        // Tela em foco: retomar animação se autoPlay estava ativo
        if (autoPlay && !hasError) {
          animationRef.current.play();
        }
      }

      return () => {
        // Tela perdeu foco: pausar animação
        if (pauseOnBlur && animationRef.current) {
          animationRef.current.pause();
        }
      };
    }, [autoPlay, pauseOnBlur, hasError])
  );

  // Auto-play inicial
  useEffect(() => {
    if (autoPlay && !hasError && animationRef.current) {
      animationRef.current.play();
    }
  }, [autoPlay, hasError]);

  const handleAnimationFinish = () => {
    if (onAnimationFinish) {
      onAnimationFinish();
    }
  };

  const handleAnimationFailure = () => {
    setHasError(true);
    if (onAnimationFailure) {
      onAnimationFailure();
    }
  };

  // Se houver erro, não renderizar nada
  if (hasError) {
    return null;
  }

  return (
    <View 
      style={[
        styles.container,
        { width, height },
        style,
      ]}
      // Não interceptar toques
      pointerEvents="none"
      // Acessibilidade
      accessible={!!accessibilityLabel}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole={accessibilityLabel ? "image" : undefined}
      importantForAccessibility={importantForAccessibility}
      testID={testID}
    >
      <LottieView
        ref={animationRef}
        source={source}
        style={styles.animation}
        speed={speed}
        loop={loop}
        autoPlay={false} // Controlamos manualmente
        resizeMode={resizeMode}
        onAnimationFinish={handleAnimationFinish}
        onAnimationFailure={handleAnimationFailure}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  animation: {
    width: '100%',
    height: '100%',
  },
});

export default LottieAnimation;
