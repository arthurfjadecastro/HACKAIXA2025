import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { Icon } from '@/design-system/icons';
import LoginBottomSheet from '@/design-system/components/LoginBottomSheet';

const HomeScreen: React.FC = () => {
  const [showLoginBottomSheet, setShowLoginBottomSheet] = useState(false);

  useEffect(() => {
    // Mostrar o BottomSheet após 1 segundo do carregamento da Home
    const timer = setTimeout(() => {
      setShowLoginBottomSheet(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleCloseBottomSheet = () => {
    setShowLoginBottomSheet(false);
  };

  const handleLogin = (username: string, password: string) => {
    // Simular processo de login
    console.log('Login attempt:', { username, passwordLength: password.length });
    
    Alert.alert(
      'Login realizado!',
      `Bem-vindo, ${username}!`,
      [
        {
          text: 'OK',
          onPress: () => {
            setShowLoginBottomSheet(false);
            // Aqui você pode navegar para a próxima tela ou atualizar o estado da aplicação
          },
        },
      ]
    );
  };

  return (
    <>
      <LinearGradient
        colors={['#005ca9', '#005fab', '#005fab', '#00a1d8', '#00b5e5']}
        locations={[0, 0.05, 0.45, 0.82, 1]}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 0 }}
        style={styles.container}
      >
        <View style={styles.logoContainer}>
          <Icon name="x" size={120} color="#FFFFFF" />
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
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

export default HomeScreen;
