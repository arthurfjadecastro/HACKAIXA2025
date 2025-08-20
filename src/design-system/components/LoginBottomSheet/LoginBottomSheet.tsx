import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';

import BottomSheet from '@/design-system/components/BottomSheet';
import BottomSheetHeader from '@/design-system/components/BottomSheetHeader';
import Divider from '@/design-system/components/Divider';
import InputField from '@/design-system/components/InputField';
import { Button } from '@/design-system/components/Button/Button';
import { colors, spacing } from '@/design-system/tokens';

interface LoginBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  onLogin?: (username: string, password: string) => void;
}

const LoginBottomSheet: React.FC<LoginBottomSheetProps> = ({
  visible,
  onClose,
  onLogin,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Reset form when closed
  useEffect(() => {
    if (!visible) {
      setUsername('');
      setPassword('');
    }
  }, [visible]);

  const isFormValid = username.trim().length > 0 && password.trim().length > 0;

  const handleLogin = () => {
    if (isFormValid) {
      if (onLogin) {
        onLogin(username, password);
      } else {
        // Simular login para demonstração
        Alert.alert(
          'Login',
          `Usuário: ${username}\nSenha: ${'*'.repeat(password.length)}`,
          [{ text: 'OK', onPress: onClose }]
        );
      }
    }
  };

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      height={Platform.OS === 'ios' ? 430 : 410}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        {/* Header com ícone e título + botão fechar */}
        <BottomSheetHeader
          title="Entrar"
          icon="login"
          onClose={onClose}
        />
        
        {/* Divider */}
        <Divider marginVertical={spacing[2]} />

        {/* Formulário diretamente sem ScrollView desnecessário */}
        <View style={styles.content}>
          <InputField
            label="Usuário"
            placeholder="Insira seu usuário"
            value={username}
            onChangeText={setUsername}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <InputField
            label="Senha"
            placeholder="Insira sua senha"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
          />
        </View>

        {/* Rodapé sticky com botão CTA */}
        <View style={styles.footer}>
          <Button
            title="Entrar"
            variant="primary"
            size="lg"
            fullWidth
            onPress={handleLogin}
            disabled={!isFormValid}
            style={
              !isFormValid 
                ? styles.ctaButtonDisabled 
                : styles.ctaButtonEnabled
            }
            testID="login-button"
          />
        </View>
      </KeyboardAvoidingView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing[6],
    paddingTop: spacing[2], // Reduzir um pouco o padding superior
    paddingBottom: spacing[3], // Adicionar respiro entre inputs e botão
  },
  footer: {
    paddingHorizontal: spacing[6],
    paddingTop: spacing[3], // Aumentar respiro entre botão e footer
    paddingBottom: spacing[6], // Respiro do botão até o rodapé da tela
    borderTopWidth: 1,
    borderTopColor: colors.surface.divider,
    backgroundColor: colors.surface.background,
  },
  ctaButtonDisabled: {
    backgroundColor: colors.action.disabled.bg, // #D0E0E3
  },
  ctaButtonEnabled: {
    backgroundColor: colors.brand.orange.primary, // #F39200
  },
});

export default LoginBottomSheet;
