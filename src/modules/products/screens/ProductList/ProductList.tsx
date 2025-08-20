import React from 'react';
import { View } from 'react-native';

import { Text } from '@/design-system/components';
import { styles } from './ProductList.styles';

const ProductList: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.centerContent}>
        <Text variant="h1" style={styles.centerText}>
          LISTA DE PRODUTOS
        </Text>
        <Text variant="body1" style={[styles.centerText, { marginTop: 16 }] as any}>
          Você foi redirecionado após o login!
        </Text>
      </View>
    </View>
  );
};

export default ProductList;
