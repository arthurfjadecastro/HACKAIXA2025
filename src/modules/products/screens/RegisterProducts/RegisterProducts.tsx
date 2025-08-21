import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Text, Button } from '@/design-system/components';
import { AppStackParamList } from '@/navigation/AppStack';
import { styles } from './RegisterProducts.styles';
import { useProductManagement } from '@/modules/products/hooks/useProductManagement';
import { useCreateProduct } from '@/hooks/useCreateProduct';
import { useDeleteProduct } from '@/hooks/useDeleteProduct';

type NavigationProps = NativeStackNavigationProp<AppStackParamList>;

interface ProductTemplate {
  id: string;
  title: string;
  icon: string;
  interest: string;
  maxTerm: string;
  normative: string;
  selected: boolean;
}

const RegisterProducts: React.FC = () => {
  const navigation = useNavigation<NavigationProps>();
  const { products, toggleProductStatus } = useProductManagement();
  const { createProduct } = useCreateProduct();
  const { deleteProduct } = useDeleteProduct();

  // Verificar se já existe um produto Consignado
  const existingConsignado = products.find(p => p.name === 'Consignado');

  const [productTemplates, setProductTemplates] = useState<ProductTemplate[]>([
    {
      id: 'consignado-template',
      title: 'Consignado',
      icon: 'document-text-outline',
      interest: '1,36% a.m. (ou 18% a.a.)',
      maxTerm: '32 meses',
      normative: 'CO055',
      selected: false,
    },
  ]);

  // Estado para controlar seleções dos produtos cadastrados
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  
  // Criar lista unificada: template + produtos cadastrados
  const allItems = [
    // Template Consignado (sempre presente)
    {
      id: 'consignado-template',
      type: 'template' as const,
      name: 'Consignado',
      icon: 'document-text-outline',
      juros: 1.36,
      prazoMaximo: 32,
      normativo: 'CO055',
      active: existingConsignado?.active || false,
      isTemplate: true,
      selected: productTemplates[0]?.selected || false
    },
    // Produtos cadastrados (exceto Consignado que já está como template)
    ...products
      .filter(p => p.name !== 'Consignado')
      .map(p => ({
        ...p,
        type: 'product' as const,
        icon: 'briefcase-outline',
        isTemplate: false,
        selected: selectedProducts.includes(p.id)
      }))
  ];  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleToggleProduct = (productId: string) => {
    setProductTemplates(prev => 
      prev.map(product => 
        product.id === productId 
          ? { ...product, selected: !product.selected }
          : product
      )
    );
  };

  // Função unificada para lidar com seleção de qualquer item
  const handleToggleItem = (itemId: string, isTemplate: boolean) => {
    if (isTemplate) {
      handleToggleProduct(itemId);
    } else {
      setSelectedProducts(prev => 
        prev.includes(itemId)
          ? prev.filter(id => id !== itemId)
          : [...prev, itemId]
      );
    }
  };

  const handleSaveProducts = async () => {
    // Processar template selecionado
    const selectedTemplate = productTemplates.find(template => template.selected);
    if (selectedTemplate) {
      try {
        const existingConsignado = products.find(p => p.name === 'Consignado');
        
        if (existingConsignado) {
          await toggleProductStatus(existingConsignado.id);
        } else {
          await createProduct({
            name: selectedTemplate.title,
            juros: 1.36,
            prazoMaximo: 32,
            normativo: selectedTemplate.normative,
          });
        }
        
        // Desmarcar template
        setProductTemplates(prev => 
          prev.map(p => ({ ...p, selected: false }))
        );
      } catch (error) {
        console.error('Erro ao processar template:', error);
      }
    }

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

  const selectedTemplateCount = productTemplates.filter(product => product.selected).length;
  const selectedProductCount = selectedProducts.length;
  const selectedCount = selectedTemplateCount + selectedProductCount;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={handleGoBack}
          style={styles.backButton}
          testID="back-button"
        >
          <Ionicons name="arrow-back" size={24} color="#1976D2" />
        </TouchableOpacity>
        <Text variant="h2" style={styles.title}>
          Cadastre um novo produto
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Botão Cadastrar Novo Produto */}
        <TouchableOpacity 
          style={styles.createNewButton}
          onPress={handleCreateNewProduct}
          testID="create-new-product-button"
        >
          <View style={styles.createNewContent}>
            <Ionicons name="add-circle-outline" size={24} color="#1976D2" />
            <Text style={styles.createNewText}>
              Cadastrar novo produto
            </Text>
          </View>
        </TouchableOpacity>

        {/* Lista Unificada de Produtos */}
        <View style={styles.productsList}>
          {allItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.productCard,
                item.selected && styles.productCardSelected
              ]}
              onPress={() => handleToggleItem(item.id, item.isTemplate)}
              testID={`product-item-${item.id}`}
            >
              <View style={styles.productHeader}>
                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                  <View style={styles.productIconContainer}>
                    <Ionicons 
                      name={item.icon as any} 
                      size={20} 
                      color="#1976D2" 
                    />
                  </View>
                  <Text style={styles.productTitle}>
                    {item.name}
                  </Text>
                </View>
                {/* Badge de Status */}
                <View style={[
                  styles.statusBadge, 
                  item.active ? styles.activeBadge : styles.inactiveBadge
                ]}>
                  <Text style={[
                    styles.statusText,
                    item.active ? styles.activeText : styles.inactiveText
                  ] as any}>
                    {item.active ? 'ATIVO' : 'INATIVO'}
                  </Text>
                </View>
                
                {/* Botão de deletar - apenas para produtos cadastrados, não template */}
                {!item.isTemplate && (
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
                )}
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
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Botão de Ação */}
      {selectedCount > 0 && (
        <View style={styles.footer}>
          <Button
            title={`Aplicar alterações (${selectedCount} produto${selectedCount > 1 ? 's' : ''})`}
            onPress={handleSaveProducts}
            style={styles.saveButton}
            testID="save-products-button"
          />
        </View>
      )}
    </View>
  );
};

export default RegisterProducts;
