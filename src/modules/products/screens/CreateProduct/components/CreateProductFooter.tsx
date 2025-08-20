import React from 'react';
import { View } from 'react-native';

import { Button } from '@/design-system/components';
import { styles } from '../CreateProduct.styles';

interface CreateProductFooterProps {
  onSubmit: () => void;
  isLoading: boolean;
  isFormValid: boolean;
}

export const CreateProductFooter: React.FC<CreateProductFooterProps> = ({
  onSubmit,
  isLoading,
  isFormValid,
}) => {
  return (
    <View style={styles.footer}>
      <Button
        title="Cadastrar"
        onPress={onSubmit}
        disabled={!isFormValid || isLoading}
        loading={isLoading}
        style={isFormValid ? styles.submitButtonEnabled : styles.submitButtonDisabled}
        testID="submit-button"
      />
    </View>
  );
};
