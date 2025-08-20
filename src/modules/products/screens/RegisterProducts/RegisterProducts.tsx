import React from 'react';
import { View } from 'react-native';

import { Text } from '@/design-system/components';
import { styles } from './RegisterProducts.styles';

const RegisterProducts: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.centerContent}>
        <Text variant="h2" style={styles.centerText}>
          Register Products
        </Text>
      </View>
    </View>
  );
};

export default RegisterProducts;
