import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Icon } from '@/design-system/icons';

export interface SplashFallbackProps {
  /**
   * Tamanho do ícone do fallback
   * @default 120
   */
  size?: number;
  
  /**
   * Cor do ícone do fallback
   * @default "#FFFFFF"
   */
  color?: string;
  
  /**
   * Estilo personalizado para o container
   */
  style?: any;
  
  /**
   * TestID para testes
   */
  testID?: string;
}

/**
 * Componente de fallback estático para a splash screen
 * Usado quando a animação Lottie falha ao carregar
 */
export const SplashFallback: React.FC<SplashFallbackProps> = ({
  size = 120,
  color = "#FFFFFF",
  style,
  testID = "splash-fallback",
}) => {
  return (
    <View 
      style={[styles.container, style]}
      testID={testID}
      accessibilityLabel="Logo da Caixa"
      accessibilityRole="image"
    >
      <Icon 
        name="x" 
        size={size} 
        color={color}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SplashFallback;
