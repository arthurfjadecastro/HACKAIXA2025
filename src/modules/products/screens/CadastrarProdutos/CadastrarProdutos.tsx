import React from 'react';
import { View } from 'react-native';

import { Text } from '@/design-system/components';
import { styles } from './CadastrarProdutos.styles';

const CadastrarProdutos: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.centerContent}>
        <Text variant="h2" style={styles.centerText}>
          Cadastrar Produtos
        </Text>
      </View>
    </View>
  );
};

export default CadastrarProdutos;
