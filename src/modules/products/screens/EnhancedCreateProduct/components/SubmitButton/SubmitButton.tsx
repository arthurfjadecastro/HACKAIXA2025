import React from 'react';
import { View } from 'react-native';
import { Button } from '@/design-system/components';
import { styles } from '../../EnhancedCreateProduct.styles';

interface SubmitButtonProps {
  canSubmit: boolean;
  loading: boolean;
  onSubmit: () => void;
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({
  canSubmit,
  loading,
  onSubmit,
}) => {
  if (!canSubmit) return null;

  return (
    <View style={styles.footer}>
      <Button
        title={loading ? "Salvando..." : "Cadastrar Produto"}
        onPress={onSubmit}
        disabled={loading}
        style={styles.submitButton}
      />
    </View>
  );
};
