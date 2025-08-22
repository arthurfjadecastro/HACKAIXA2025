import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Product } from '@/services/products/productTypes';
import { Card } from '@/design-system/components';
import { colors, spacing } from '@/design-system/tokens';
import { AppStackParamList } from '@/navigation/AppStack';

interface ProductsListProps {
  products: Product[];
}

type NavigationProps = NativeStackNavigationProp<AppStackParamList>;

export const ProductsList: React.FC<ProductsListProps> = ({ products }) => {
  const navigation = useNavigation<NavigationProps>();

  const handleProductPress = (product: Product) => {
    if (product.active) {
      navigation.navigate('ProductSimulator', { productId: product.id });
    }
  };

  const getProductIcon = (productName: string) => {
    const name = productName.toLowerCase();
    if (name.includes('consignado') || name.includes('inss')) {
      return 'document-text';
    } else if (name.includes('habitação') || name.includes('habitacao')) {
      return 'home';
    } else {
      return 'create';
    }
  };

  const getProductCategory = (productName: string) => {
    const name = productName.toLowerCase();
    if (name.includes('consignado') || name.includes('inss')) {
      return 'Consignado';
    } else if (name.includes('habitação') || name.includes('habitacao')) {
      return 'Habitação';
    } else {
      return 'Produto criado pelo usuário';
    }
  };

  return (
    <View style={styles.container}>      
      {products.map((product) => (
        <TouchableOpacity
          key={product.id}
          onPress={() => handleProductPress(product)}
          disabled={!product.active}
          style={styles.cardTouchable}
        >
          <Card style={styles.productCard}>
            <View style={styles.cardContent}>
              {/* Ícone circular leading */}
              <View style={styles.iconContainer}>
                <Ionicons 
                  name={getProductIcon(product.name) as any} 
                  size={24} 
                  color={colors.primary.main} 
                />
              </View>

              {/* Conteúdo principal */}
              <View style={styles.mainContent}>
                {/* Título */}
                <Text style={styles.productTitle}>
                  {product.name}
                </Text>
                
                {/* Categoria como subtítulo */}
                <Text style={styles.productCategory}>
                  {getProductCategory(product.name)}
                </Text>
                
                {/* Subinformações */}
                <View style={styles.productInfo}>
                  <Text style={styles.infoItem}>
                    Juros: {product.juros}% a.m.
                  </Text>
                  
                  <Text style={styles.infoItem}>
                    Prazo máximo: {product.prazoMaximo} meses
                  </Text>
                  
                  {product.normativo && (
                    <Text style={styles.infoItem}>
                      Normativo: {product.normativo}
                    </Text>
                  )}
                </View>
              </View>
            </View>
          </Card>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing[4], // 16dp margin lateral
  },
  cardTouchable: {
    marginBottom: spacing[3], // 12dp espaçamento vertical
  },
  productCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: spacing[4], // 16dp padding interno
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // Sombra leve (elevation 2-3)
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    backgroundColor: '#E6F0FA', // Container azul-claro
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing[3], // 12dp
  },
  mainContent: {
    flex: 1,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: '600', // semibold
    color: colors.text.primary, // neutral-900
    marginBottom: spacing[1], // 4dp
  },
  productCategory: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.text.secondary, // neutral-700
    marginBottom: spacing[2], // 8dp
  },
  productInfo: {
    gap: 4, // Espaçamento entre linhas
  },
  infoItem: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.text.secondary, // neutral-700
    lineHeight: 18,
  },
});
