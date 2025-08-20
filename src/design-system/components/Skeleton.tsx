import React from 'react';
import { ViewStyle } from 'react-native';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';

export interface SkeletonProps {
  width: number | string;
  height: number;
  variant?: 'rectangle' | 'circle' | 'line';
  style?: ViewStyle;
  // Novas props para controlar a animação
  duration?: number;
  shimmerColors?: string[];
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width,
  height,
  variant = 'rectangle',
  style,
  duration = 1500, // Duração um pouco mais lenta para efeito suave
  shimmerColors = [
    '#E8EDF2', // Cor base mais suave
    '#F4F7FA', // Cor clara do shimmer
    '#E8EDF2'  // Volta para cor base
  ], // Cores do gradiente shimmer mais refinadas
}) => {
  const getVariantStyle = (): ViewStyle => {
    switch (variant) {
      case 'circle':
        return { borderRadius: height / 2 };
      case 'line':
        return { borderRadius: 2 };
      case 'rectangle':
      default:
        return { borderRadius: 4 };
    }
  };

  return (
    <ShimmerPlaceholder
      LinearGradient={LinearGradient} // Componente de gradiente personalizado
      visible={false} // false = mostra a animação
      duration={duration} // Duração da animação
      shimmerColors={shimmerColors} // Cores do gradiente
      style={[
        { width, height },
        getVariantStyle(),
        style,
      ]}
      // Configurações da animação para efeito mais profissional
      shimmerWidthPercent={1.2} // Largura da onda um pouco maior
      location={[0.2, 0.5, 0.8]} // Posições do gradiente mais equilibradas
    />
  );
};
