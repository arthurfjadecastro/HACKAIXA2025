import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Icon } from '@/design-system/icons';
import { Text } from '@/design-system/components/Text/Text';
import ActionCard from '@/design-system/components/ActionCard';
import LoginBottomSheet from '@/modules/home/components/LoginBottomSheet';
import { colors, spacing } from '@/design-system/tokens';
import { AppStackParamList } from '@/navigation/AppStack';

type NavigationProps = NativeStackNavigationProp<AppStackParamList, 'Home'>;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProps>();
  const [showLoginBottomSheet, setShowLoginBottomSheet] = useState(false);

  const handleOpenLogin = () => {
    setShowLoginBottomSheet(true);
  };

  const handleCloseBottomSheet = () => {
    setShowLoginBottomSheet(false);
  };

  const handleLogin = (username: string, password: string) => {
    // Simular processo de login
    console.log('Login attempt:', { username, passwordLength: password.length });
    
    // Fechar o modal
    setShowLoginBottomSheet(false);
    
    // Navegar para ProductList após login bem-sucedido
    setTimeout(() => {
      navigation.navigate('ProductList');
    }, 300); // Pequeno delay para a animação do modal
  };

  return (
    <>
      {/* Base gradient */}
      <LinearGradient
        colors={['#005ca9', '#005fab', '#005fab', '#00a1d8', '#00b5e5']}
        locations={[0, 0.05, 0.45, 0.82, 1]}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 0 }}
        style={styles.container}
      >
        {/* Faixa de profundidade (overlay) */}
        <LinearGradient
          colors={['transparent', 'rgba(0, 74, 138, 0.88)']}
          locations={[0.58, 1]}
          style={styles.depthOverlay}
        />

        {/* Logo */}
        <View style={styles.logoContainer}>
          <Icon name="x" size={120} color="#FFFFFF" />
        </View>

        {/* Conteúdo */}
        <View style={styles.content}>
          {/* Mensagem de boas-vindas */}
          <Text variant="h2" color="inverse" style={styles.welcomeMessage}>
            Que bom ter você aqui!
          </Text>

          {/* Ação principal */}
          <View style={styles.actionsContainer}>
            <ActionCard
              icon="login"
              title="Entrar"
              onPress={handleOpenLogin}
              testID="login-action-card"
            />
          </View>

        
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
  depthOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 2,
  },
  logoContainer: {
    position: 'absolute',
    top: '15%',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 3,
  },
  content: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: spacing[6],
    paddingBottom: spacing[10],
    zIndex: 3,
  },
  welcomeMessage: {
    textAlign: 'center',
    marginBottom: spacing[8],
    fontWeight: '600',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing[4],
    marginBottom: spacing[6],
  },
  secondaryButton: {
    marginBottom: spacing[4],
    borderColor: colors.text.inverse,
  },
  servicesLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
    paddingVertical: spacing[3],
  },
  servicesText: {
    color: colors.text.inverse,
    textDecorationLine: 'underline',
  },
});

export default HomeScreen;
