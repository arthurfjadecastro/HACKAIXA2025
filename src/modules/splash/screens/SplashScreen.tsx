import React, { useEffect, useRef } from 'react';
import { View, Animated, Easing, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Icon } from '@/design-system/icons';
import { AppStackParamList } from '@/navigation/AppStack';

type NavigationProps = NativeStackNavigationProp<AppStackParamList, 'Splash'>;

const SplashScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProps>();
  const scaleValue = useRef(new Animated.Value(0)).current;
  const rotateValue = useRef(new Animated.Value(0)).current;
  const opacityValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      // Fade in inicial
      Animated.timing(opacityValue, {
        toValue: 1,
        duration: 800,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
      // Scale up com bounce
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 1200,
        easing: Easing.bounce,
        useNativeDriver: true,
      }),
      // Rotação sutil
      Animated.timing(rotateValue, {
        toValue: 1,
        duration: 600,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Navegar para Home após animações
      setTimeout(() => {
        navigation.replace('Home');
      }, 500);
    });
  }, [navigation, scaleValue, rotateValue, opacityValue]);

  const rotateInterpolate = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <LinearGradient
      colors={['#005ca9', '#005fab', '#005fab', '#00a1d8', '#00b5e5']}
      locations={[0, 0.05, 0.45, 0.82, 1]}
      start={{ x: 0, y: 1 }}
      end={{ x: 1, y: 0 }}
      style={styles.container}
    >
      <View style={styles.logoContainer}>
        <Animated.View
          style={[
            styles.logoWrapper,
            {
              opacity: opacityValue,
              transform: [
                { scale: scaleValue },
                { rotate: rotateInterpolate },
              ],
            },
          ]}
        >
          <Icon name="x" size={120} color="#FFFFFF" />
        </Animated.View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
});

export default SplashScreen;
