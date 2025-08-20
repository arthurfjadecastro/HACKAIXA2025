import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Text, Button } from '@/design-system/components';
import { AppStackParamList } from '@/navigation/AppStack';
import { styles } from './RegisterProducts.styles';

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
  
  const [productTemplates, setProductTemplates] = useState<ProductTemplate[]>([
    {
      id: '1',
      title: 'Consignado',
      icon: 'document-text-outline',
      interest: '1,36% a.m. (ou 18% a.a.)',
      maxTerm: '32 meses',
      normative: 'CO055',
      selected: false,
    },
    {
      id: '2',
      title: 'Crédito Pessoal',
      icon: 'person-outline',
      interest: '1,55% a.m. (ou 19,5% a.a.)',
      maxTerm: '48 meses',
      normative: 'CO055',
      selected: false,
    },
    {
      id: '3',
      title: 'Cheque Especial',
      icon: 'card-outline',
      interest: '1,79% a.m. (ou 19,5% a.a.)',
      maxTerm: '72 meses',
      normative: 'CO055',
      selected: false,
    },
  ]);

  const handleGoBack = () => {
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

  const handleSaveProducts = () => {
    const selectedProducts = productTemplates.filter(product => product.selected);
    console.log('Produtos selecionados:', selectedProducts);
    // Aqui você pode implementar a lógica de salvamento
  };

  const handleCreateNewProduct = () => {
    // Navegar para o formulário de criação de produto
    navigation.navigate('CreateProduct');
  };

  const selectedCount = productTemplates.filter(product => product.selected).length;

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

        {/* Lista de Produtos Template */}
        <View style={styles.productsList}>
          {productTemplates.map((product) => (
            <TouchableOpacity
              key={product.id}
              style={[
                styles.productCard,
                product.selected && styles.productCardSelected
              ]}
              onPress={() => handleToggleProduct(product.id)}
              testID={`product-template-${product.id}`}
            >
              <View style={styles.productHeader}>
                <View style={styles.productIconContainer}>
                  <Ionicons 
                    name={product.icon as any} 
                    size={20} 
                    color="#1976D2" 
                  />
                </View>
                <Text style={styles.productTitle}>
                  {product.title}
                </Text>
              </View>
              
              <View style={styles.productDetails}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Juros</Text>
                  <Text style={styles.detailValue}>{product.interest}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Prazo máximo</Text>
                  <Text style={styles.detailValue}>{product.maxTerm}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Normativo</Text>
                  <Text style={styles.detailValue}>{product.normative}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Botão Salvar */}
      <View style={styles.footer}>
        <Button
          title={`Salvar produto${selectedCount > 1 ? '(s)' : ''}`}
          onPress={handleSaveProducts}
          disabled={selectedCount === 0}
          style={styles.saveButton}
          testID="save-products-button"
        />
      </View>
    </View>
  );
};

export default RegisterProducts;
