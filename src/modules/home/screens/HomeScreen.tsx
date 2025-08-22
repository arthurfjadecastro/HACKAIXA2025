import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing, Image, Dimensions, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Text } from '@/design-system/components/Text/Text';
import IdentityHeader from '@/modules/home/components/IdentityHeader';
import LoginBottomSheet from '@/modules/home/components/LoginBottomSheet';
import { colors, spacing, fontFamilies } from '@/design-system/tokens';
import { AppStackParamList } from '@/navigation/AppStack';

type NavigationProps = NativeStackNavigationProp<AppStackParamList, 'Home'>;

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProps>();
  const [showLoginBottomSheet, setShowLoginBottomSheet] = useState(false);

  // Valores de animação para transição suave
  const headerOpacity = useRef(new Animated.Value(0)).current;
  const headerTranslateY = useRef(new Animated.Value(-8)).current;

  useEffect(() => {
    // Animação de entrada conforme Figma
    const animateIn = () => {
      // Header aparece (slide down) - 220ms
      Animated.parallel([
        Animated.timing(headerOpacity, {
          toValue: 1,
          duration: 220,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(headerTranslateY, {
          toValue: 0,
          duration: 220,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Abrir bottom sheet automaticamente após animações
        setTimeout(() => {
          setShowLoginBottomSheet(true);
        }, 300);
      });
    };

    // Iniciar animações
    const timeoutId = setTimeout(animateIn, 100);
    return () => clearTimeout(timeoutId);
  }, []);

  const handleOpenLogin = () => {
    setShowLoginBottomSheet(true);
  };

  const handleCloseBottomSheet = () => {
    setShowLoginBottomSheet(false);
  };

  const handleLogin = (username: string, password: string) => {
    console.log('Login attempt:', { username, passwordLength: password.length });
    setShowLoginBottomSheet(false);
    
    setTimeout(() => {
      navigation.navigate('ProductList');
    }, 300);
  };

  return (
    <>
      {/* Gradiente base conforme Figma */}
      <LinearGradient
        colors={['#3AB3EE', '#0E5AA8']}
        locations={[0.0, 1.0]}
        style={styles.container}
      >
        {/* Header de identificação animado */}
        <Animated.View 
          style={[
            styles.headerContainer,
            {
              opacity: headerOpacity,
              transform: [{ translateY: headerTranslateY }],
            },
          ]}
        >
          <IdentityHeader
            name="ARTHUR DE CASTRO"
            registration="C150713-2"
            department="TEIA"
            description="BOX DE RELACIONAMENTO DIGITAL GECDI - GN CANAIS DIGITAIS"
          />
        </Animated.View>

        {/* Logo fixa (mesma posição da splash) */}
        <View style={styles.logoContainer}>
          <Image 
            source={require('../../../../assets/symbol_home.png')} 
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>

        {/* Conteúdo da tela */}
        <View style={styles.content}>
          <Text variant="h4" color="inverse" style={styles.welcomeMessage}>
            Que bom ter você aqui!
          </Text>
          
          <TouchableOpacity
            style={styles.enterButton}
            onPress={handleOpenLogin}
            activeOpacity={0.92}
          >
            <Text style={styles.enterButtonText}>Entrar</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <LoginBottomSheet
        visible={showLoginBottomSheet}
        onClose={handleCloseBottomSheet}
        onLogin={handleLogin}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    position: 'absolute',
    top: 60, // Abaixo da status bar
    left: 0,
    right: 0,
    zIndex: 4,
  },
  logoContainer: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ translateY: -60 }], // Centralizado conforme Figma
    zIndex: 3,
  },
  logoImage: {
    width: SCREEN_WIDTH * 0.45, // 45% da largura da tela
    height: SCREEN_WIDTH * 0.45 * 1.385, // Mantendo aspect ratio
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  content: {
    position: 'absolute',
    bottom: 120,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: spacing[6],
  },
  welcomeMessage: {
    fontSize: 20,
    fontWeight: '600',
    fontFamily: fontFamilies.caixaSemiBold,
    color: colors.text.inverse,
    textAlign: 'center',
    marginBottom: spacing[6],
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  enterButton: {
    backgroundColor: colors.surface.background,
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[8],
    borderRadius: 12,
    minWidth: 200,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  enterButtonText: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: fontFamilies.caixaSemiBold,
    color: colors.primary.main,
  },
});

export default HomeScreen;
