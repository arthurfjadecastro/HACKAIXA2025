import React from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Card } from '@/design-system/components';
import { colors } from '@/design-system/tokens/colors';
import { spacing } from '@/design-system/tokens/spacing';
import { typography } from '@/design-system/tokens/typography';
import { Product } from '@/services/products/productTypes';

interface ProductManagementListProps {
  products: Product[];
  onToggleStatus: (productId: string) => void;
  toggleLoading?: string | null;
}

const ProductManagementList: React.FC<ProductManagementListProps> = ({
  products,
  onToggleStatus,
  toggleLoading
}) => {
  const renderProduct = ({ item }: { item: Product }) => (
    <Card style={{ marginBottom: spacing[4] }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <View style={{ flex: 1, marginRight: spacing[4] }}>
          <Text style={[typography.h4, { color: colors.text.primary, marginBottom: spacing[2] }]}>
            {item.name}
          </Text>
          
          <View style={{ flexDirection: 'row', marginBottom: spacing[1] }}>
            <Text style={[typography.body1, { color: colors.text.secondary, marginRight: spacing[2] }]}>
              Juros:
            </Text>
            <Text style={[typography.body1, { color: colors.text.primary }]}>
              {item.juros}% a.a.
            </Text>
          </View>
          
          <View style={{ flexDirection: 'row', marginBottom: spacing[1] }}>
            <Text style={[typography.body1, { color: colors.text.secondary, marginRight: spacing[2] }]}>
              Prazo:
            </Text>
            <Text style={[typography.body1, { color: colors.text.primary }]}>
              {item.prazoMaximo} meses
            </Text>
          </View>
          
          <View style={{ flexDirection: 'row' }}>
            <Text style={[typography.body1, { color: colors.text.secondary, marginRight: spacing[2] }]}>
              Normativo:
            </Text>
            <Text style={[typography.body1, { color: colors.text.primary }]}>
              {item.normativo}
            </Text>
          </View>
        </View>
        
        <View style={{ alignItems: 'center' }}>
          <View style={{ 
            backgroundColor: item.active ? '#4CAF50' : '#F44336', 
            paddingHorizontal: spacing[3], 
            paddingVertical: spacing[1], 
            borderRadius: 12,
            marginBottom: spacing[3]
          }}>
            <Text style={[typography.caption, { color: colors.text.inverse }]}>
              {item.active ? 'ATIVO' : 'INATIVO'}
            </Text>
          </View>
          
          <TouchableOpacity
            onPress={() => onToggleStatus(item.id)}
            disabled={toggleLoading === item.id}
            style={{
              backgroundColor: item.active ? '#FF5722' : '#4CAF50',
              paddingHorizontal: spacing[4],
              paddingVertical: spacing[2],
              borderRadius: 8,
              minWidth: 80,
              alignItems: 'center'
            }}
          >
            {toggleLoading === item.id ? (
              <ActivityIndicator size="small" color={colors.text.inverse} />
            ) : (
              <Text style={[typography.caption, { color: colors.text.inverse }]}>
                {item.active ? 'DESATIVAR' : 'ATIVAR'}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Card>
  );

  if (products.length === 0) {
    return (
      <View style={{ padding: spacing[6], alignItems: 'center' }}>
        <Text style={[typography.body1, { color: colors.text.secondary, textAlign: 'center' }]}>
          Nenhum produto cadastrado ainda.{'\n'}Cadastre o primeiro produto acima.
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={products}
      renderItem={renderProduct}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ padding: spacing[6] }}
      showsVerticalScrollIndicator={false}
    />
  );
};

export { ProductManagementList };
