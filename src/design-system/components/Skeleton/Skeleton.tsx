import React, { useEffect, useRef } from 'react';
import { Animated, ViewStyle, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export interface SkeletonProps {
  width: number | string;
  height: number;
  variant?: 'rectangle' | 'circle' | 'line';
  style?: ViewStyle;
  duration?: number;
  shimmerColors?: [string, string, string];
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width,
  height,
  variant = 'rectangle',
  style,
  duration = 1500,
  shimmerColors = [
    '#E8EDF2',
    '#F4F7FA', 
    '#E8EDF2'
  ],
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const startAnimation = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(animatedValue, {
            toValue: 1,
            duration: duration,
            useNativeDriver: false,
          }),
        ])
      ).start();
    };

    startAnimation();
  }, [animatedValue, duration]);

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

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [typeof width === 'number' ? -width * 1.2 : -100, typeof width === 'number' ? width * 1.2 : 100],
  });

  return (
    <View
      style={[
        {
          width,
          height,
          backgroundColor: shimmerColors[0],
          overflow: 'hidden',
        } as ViewStyle,
        getVariantStyle(),
        style,
      ]}
    >
      <Animated.View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          transform: [{ translateX }],
        }}
      >
        <LinearGradient
          colors={shimmerColors}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          locations={[0.2, 0.5, 0.8]}
          style={{
            flex: 1,
            width: '200%',
          }}
        />
      </Animated.View>
    </View>
  );
};
