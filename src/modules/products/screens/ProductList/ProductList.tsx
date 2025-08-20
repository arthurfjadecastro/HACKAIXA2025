import React from 'react';
import { View } from 'react-native';

import { Text } from '@/design-system/components';
import { styles } from './ProductList.styles';

const ProductList: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.centerContent}>
        <Text variant="h2" style={styles.centerText}>
          Listar Produtos
        </Text>
      </View>
    </View>
  );
};

export default ProductList;
