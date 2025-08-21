import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Product } from '@/services/products/productTypes';
import { Card } from '@/design-system/components';
import { colors, spacing } from '@/design-system/tokens';

interface ProductsListProps {
  products: Product[];
}

export const ProductsList: React.FC<ProductsListProps> = ({ products }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Produtos Cadastrados ({products.length})</Text>
      
      {products.map((product) => (
        <Card key={product.id} style={styles.productCard}>
          <View style={styles.productHeader}>
            <Text style={styles.productName}>{product.name}</Text>
          </View>
          
          <View style={styles.productDetails}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Juros:</Text>
              <Text style={styles.detailValue}>{product.juros}% a.a.</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Prazo máximo:</Text>
              <Text style={styles.detailValue}>{product.prazoMaximo} meses</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Normativo:</Text>
              <Text style={styles.detailValue}>{product.normativo}</Text>
            </View>
          </View>
        </Card>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[4],
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.inverse,
    marginBottom: spacing[4],
    textAlign: 'center',
  },
  productCard: {
    marginBottom: spacing[4],
    padding: spacing[4],
  },
  productHeader: {
    marginBottom: spacing[3],
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    flex: 1,
  },
  productDetails: {
    gap: spacing[2],
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  detailValue: {
    fontSize: 14,
    color: colors.text.primary,
    fontWeight: '600',
  },
});
