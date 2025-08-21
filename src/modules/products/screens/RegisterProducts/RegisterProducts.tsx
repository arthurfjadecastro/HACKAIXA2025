import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Text, Button } from '@/design-system/components';
import { AppStackParamList } from '@/navigation/AppStack';
import { styles } from './RegisterProducts.styles';
import { useProductManagement } from '@/modules/products/hooks/useProductManagement';
import { useDeleteProduct } from '@/hooks/useDeleteProduct';

type NavigationProps = NativeStackNavigationProp<AppStackParamList>;

const RegisterProducts: React.FC = () => {
  const navigation = useNavigation<NavigationProps>();
  const { products, toggleProductStatus } = useProductManagement();
  const { deleteProduct } = useDeleteProduct();

  // Estado para controlar seleções dos produtos cadastrados
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  
  // Lista de produtos cadastrados (sem template)
  const allItems = products.map(p => ({
    ...p,
    type: 'product' as const,
    icon: 'briefcase-outline',
    isTemplate: false,
    selected: selectedProducts.includes(p.id)
  }));

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleToggleItem = (itemId: string) => {
    setSelectedProducts(prev => 
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleSaveProducts = async () => {
    // Processar produtos cadastrados selecionados
    for (const productId of selectedProducts) {
      try {
        await toggleProductStatus(productId);
      } catch (error) {
        console.error('Erro ao processar produto:', error);
      }
    }
    
    // Limpar seleções de produtos
    setSelectedProducts([]);
  };

  const handleCreateNewProduct = () => {
    // Navegar para o formulário de criação de produto
    navigation.navigate('CreateProduct');
  };

  const selectedCount = selectedProducts.length;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={handleGoBack}
          style={styles.backButton}
          testID="back-button"
        >
          <Ionicons name="arrow-back" size={24} color="#195C5B" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Produtos</Text>
        
        <TouchableOpacity 
          onPress={handleCreateNewProduct}
          style={styles.addButton}
          testID="add-product-button"
        >
          <Ionicons name="add" size={24} color="#195C5B" />
        </TouchableOpacity>
      </View>

      {/* Lista de produtos */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {allItems.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="folder-open-outline" size={64} color="#B0B0B0" />
            <Text style={styles.emptyTitle}>Nenhum produto cadastrado</Text>
            <Text style={styles.emptySubtitle}>
              Clique no botão + para criar seu primeiro produto
            </Text>
          </View>
        ) : (
          <View style={styles.productsContainer}>
            {allItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.productCard,
                  item.selected && styles.productCardSelected
                ]}
                onPress={() => handleToggleItem(item.id)}
                testID={`product-item-${item.id}`}
              >
                <View style={styles.productHeader}>
                  <View style={styles.productInfo}>
                    <View style={styles.productTitleRow}>
                      <Ionicons 
                        name={item.icon as any} 
                        size={20} 
                        color="#195C5B" 
                        style={styles.productIcon}
                      />
                      <Text style={styles.productName}>{item.name}</Text>
                    </View>
                    
                    <View style={[
                      styles.statusBadge,
                      item.active ? styles.statusBadgeActive : styles.statusBadgeInactive
                    ]}>
                      <Text style={[
                        styles.statusText,
                        item.active ? styles.statusTextActive : styles.statusTextInactive
                      ] as any}>
                        {item.active ? 'ATIVO' : 'INATIVO'}
                      </Text>
                    </View>
                  </View>
                  
                  {/* Botão de deletar */}
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => {
                      Alert.alert(
                        'Excluir produto',
                        `Tem certeza que deseja excluir "${item.name}"?`,
                        [
                          { text: 'Cancelar', style: 'cancel' },
                          { 
                            text: 'Excluir', 
                            style: 'destructive', 
                            onPress: () => deleteProduct(item.id) 
                          }
                        ]
                      );
                    }}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Ionicons name="trash-outline" size={20} color="#F44336" />
                  </TouchableOpacity>
                </View>
                
                <View style={styles.productDetails}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Juros</Text>
                    <Text style={styles.detailValue}>{item.juros}% a.a.</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Prazo máximo</Text>
                    <Text style={styles.detailValue}>{item.prazoMaximo} meses</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Normativo</Text>
                    <Text style={styles.detailValue}>{item.normativo}</Text>
                  </View>
                </View>
                
                {/* Indicador de seleção */}
                {item.selected && (
                  <View style={styles.selectionIndicator}>
                    <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Footer com botão de salvar */}
      {selectedCount > 0 && (
        <View style={styles.footer}>
          <Button
            onPress={handleSaveProducts}
            variant="primary"
            style={styles.saveButton}
            testID="save-button"
            title={`Salvar alterações (${selectedCount})`}
          />
        </View>
      )}
    </View>
  );
};

export default RegisterProducts;
