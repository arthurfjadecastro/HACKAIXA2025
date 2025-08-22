import React, { useEffect, useRef, useState } from 'react';
import { View, Animated, Easing, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { LottieAnimation } from '@/modules/splash/components/LottieAnimation';
import { SplashFallback } from '@/modules/splash/components/SplashFallback';
import { AppStackParamList } from '@/navigation/AppStack';

// Importar animação Lottie
import splashAnimation from '@assets/splash.json';

type NavigationProps = NativeStackNavigationProp<AppStackParamList, 'Splash'>;

const SplashScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProps>();
  const [useLottie, setUseLottie] = useState(true);
  const [animationCompleted, setAnimationCompleted] = useState(false);
  
  // Fallback para animação simples caso Lottie falhe
  const scaleValue = useRef(new Animated.Value(0)).current;
  const rotateValue = useRef(new Animated.Value(0)).current;
  const opacityValue = useRef(new Animated.Value(0)).current;

  // Timeout de segurança para navegação
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (!animationCompleted) {
        navigation.replace('Home');
      }
    }, 4000); // 4 segundos máximo

    return () => clearTimeout(timeoutId);
  }, [navigation, animationCompleted]);

  // Animação de fallback (caso Lottie falhe)
  useEffect(() => {
    if (!useLottie) {
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
          setAnimationCompleted(true);
          navigation.replace('Home');
        }, 500);
      });
    }
  }, [navigation, scaleValue, rotateValue, opacityValue, useLottie]);

  const handleLottieFinish = () => {
    // Aguardar um pouco antes de navegar para uma transição suave
    setTimeout(() => {
      setAnimationCompleted(true);
      navigation.replace('Home');
    }, 300);
  };

  const handleLottieFailure = () => {
    console.warn('Lottie animation failed to load, falling back to simple animation');

    
    setUseLottie(false);
  };

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
      testID="splash-screen"
    >
      <View style={styles.logoContainer}>
        {useLottie ? (
          // Animação Lottie principal
          <LottieAnimation
            source={splashAnimation}
            autoPlay={true}
            loop={false}
            speed={0.5} // 30fps para performance
            width={430}
            height={430}
            resizeMode="contain"
            onAnimationFinish={handleLottieFinish}
            onAnimationFailure={handleLottieFailure}
            pauseOnBlur={true}
            accessibilityLabel="Animação do logo da Caixa com círculos e texto Hackathon 2025"
            testID="splash-lottie-animation"
          />
        ) : (
          // Fallback estático ou animação simples
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
            <SplashFallback 
              size={120}
              color="#FFFFFF"
              testID="splash-fallback-icon"
            />
          </Animated.View>
        )}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // Ajustar posição para coincidir com a Home
    marginTop: -50, // Move um pouco para cima para coincidir melhor
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
