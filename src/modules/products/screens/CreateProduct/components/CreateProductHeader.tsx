import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { Text } from '@/design-system/components';
import { colors } from '@/design-system/tokens';
import { styles } from '../CreateProduct.styles';

export const CreateProductHeader: React.FC = () => {
  const navigation = useNavigation();

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.header}>
      <TouchableOpacity 
        onPress={handleGoBack}
        style={styles.backButton}
        testID="back-button"
        accessible={true}
        accessibilityLabel="Voltar"
        accessibilityRole="button"
      >
        <Ionicons name="arrow-back" size={24} color={colors.primary.main} />
      </TouchableOpacity>
      <Text variant="h2" style={styles.title}>
        Cadastre um novo produto
      </Text>
    </View>
  );
};
