import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Text, ActionCard } from '@/design-system/components';
import LoginBottomSheet from '@/modules/home/components/LoginBottomSheet';
import { spacing } from '@/design-system/tokens';
import { AppStackParamList } from '@/navigation/AppStack';

type NavigationProps = NativeStackNavigationProp<AppStackParamList, 'Home'>;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProps>();
  const [showLoginBottomSheet, setShowLoginBottomSheet] = useState(false);

  // Auto-abre o BottomSheet após 1 segundo
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoginBottomSheet(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleCloseBottomSheet = () => {
    setShowLoginBottomSheet(false);
  };

  const handleOpenLogin = () => {
    setShowLoginBottomSheet(true);
  };

  const handleLogin = (username: string, password: string) => {
    setShowLoginBottomSheet(false);
    
    setTimeout(() => {
      navigation.navigate('ProductList');
    }, 300);
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#005CA9" />
      
      {/* Gradiente de fundo */}
      <LinearGradient
        colors={['#005ca9', '#005fab', '#005fab', '#00a1d8', '#00b5e5']}
        locations={[0, 0.05, 0.45, 0.82, 1]}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 0 }}
        style={styles.container}
      >
        {/* Header com dados pessoais */}
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>ARTHUR DE CASTRO</Text>
            <Text style={styles.userCode}>C150713-2</Text>
          </View>
          <View style={styles.unitsInfo}>
            <Text style={styles.unitText}>TEIA - BOX DE RELACIONAMENTO DIGITAL</Text>
            <Text style={styles.unitText}>GECDI - GN CANAIS DIGITAIS</Text>
          </View>
        </View>

        {/* Logo centralizada */}
        <View style={styles.logoContainer}>
          <Image 
            source={require('../../../../assets/symbol_home.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* Área de ação - Texto + Botão */}
        <View style={styles.actionArea}>
          {/* Overlay para contraste */}
          <View style={styles.actionOverlay} />
          
          <Text style={styles.welcomeMessage}>
            Bem‑vindo! Vamos começar?
          </Text>
          <ActionCard
            icon="login"
            title="Entrar"
            onPress={handleOpenLogin}
            testID="login-action-card"
          />
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
  header: {
    paddingTop: 44, // Status bar + padding
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[3],
  },
  userInfo: {
    marginBottom: spacing[2],
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  userCode: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  unitsInfo: {
    marginTop: spacing[1],
  },
  unitText: {
    fontSize: 11,
    color: '#FFFFFF',
    opacity: 0.8,
    lineHeight: 14,
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 200,
  },
  bottomInfo: {
    alignItems: 'center',
    paddingBottom: spacing[8],
  },
  actionArea: {
    alignItems: 'center',
    paddingHorizontal: 24, // space.xl conforme especificação
    paddingBottom: 24, // space.xl - margem inferior safe-area
    position: 'relative',
    zIndex: 10, // Garante que fica acima do gradiente
  },
  actionOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.10)', // Overlay sutil 10% para contraste
    borderRadius: 16, // Cantos suaves
  },
  welcomeMessage: {
    fontSize: 18, // font.title conforme especificação
    fontWeight: '600', // Semibold
    fontFamily: 'Caixa-Std-Semibold', // Fonte institucional
    color: 'rgba(255, 255, 255, 0.92)', // #FFFFFF com 92% opacidade
    textAlign: 'center',
    lineHeight: 26, // Line-height 26sp
    maxWidth: '80%', // Largura máxima 80% da tela
    marginTop: 24, // space.xl - espaçamento do fim da marca
    marginBottom: 16, // space.l - espaçamento para o botão
    zIndex: 11, // Acima do overlay
  },
});

export default HomeScreen;
