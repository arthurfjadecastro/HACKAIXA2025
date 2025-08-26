import React from 'react';
import { View } from 'react-native';
import { Text } from '@/design-system/components';
import { styles } from './InstallmentsHeader.styles';

export const InstallmentsHeader: React.FC = () => {
  return (
    <View style={styles.installmentsHeader}>
      <Text style={styles.installmentsTitle}>Parcelas</Text>
    </View>
  );
};
