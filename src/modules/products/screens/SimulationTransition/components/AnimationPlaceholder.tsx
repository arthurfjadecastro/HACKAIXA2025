import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { theme } from '../../../../../design-system/tokens';
import { SimulationState } from '../types';

interface AnimationPlaceholderProps {
  state: SimulationState;
}

export const AnimationPlaceholder: React.FC<AnimationPlaceholderProps> = ({ state }) => {
  const pulseAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (state === 'loading') {
      // Animação de pulso
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 0,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      );

      // Animação de rotação
      const rotateAnimation = Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      );

      pulseAnimation.start();
      rotateAnimation.start();

      return () => {
        pulseAnimation.stop();
        rotateAnimation.stop();
      };
    }
    return undefined;
  }, [state, pulseAnim, rotateAnim]);

  if (state !== 'loading') {
    return null;
  }

  const pulseOpacity = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 1],
  });

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container} testID="animation-container">
      <Animated.View 
        style={[
          styles.circle,
          {
            opacity: pulseOpacity,
            transform: [{ rotate: rotation }],
          }
        ]}
        testID="animated-circle"
      >
        <View style={styles.innerCircle} testID="inner-circle" />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: theme.spacing[8],
  },
  circle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: theme.colors.primary.main,
    borderStyle: 'solid',
    borderTopColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: theme.colors.primary.light,
  },
});
