import React from 'react';
import { ScrollView, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '@/navigation/AppStack';

// Importar componentes modulares
import {
  Header,
  CategorySelector,
  BasicInfoFields,
  SubmitButton,
} from './components';

import { useEnhancedCreateProduct } from './hooks';
import { styles } from './EnhancedCreateProduct.styles';

type NavigationProps = NativeStackNavigationProp<AppStackParamList>;

const EnhancedCreateProduct: React.FC = () => {
  const navigation = useNavigation<NavigationProps>();
  
  const {
    formData,
    loading,
    canSubmit,
    updateFormField,
    handleCategorySelect,
    handleSubmit,
  } = useEnhancedCreateProduct();

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleFormSubmit = () => {
    handleSubmit(() => navigation.goBack());
  };

  const showBasicFields = !!(formData.categoria && formData.subtipo);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <Header onGoBack={handleGoBack} title="Novo Produto" />

      <View style={styles.content}>
        {/* Seletor de Categoria */}
        <CategorySelector
          selectedCategory={formData.categoria}
          onCategorySelect={handleCategorySelect}
        />

        {/* TODO: Adicionar SubtypeSelector e ConvenioSelector quando necessário */}

        {/* Campos básicos */}
        <BasicInfoFields
          formData={formData}
          onUpdateField={updateFormField}
          showFields={showBasicFields}
        />

        {/* TODO: Adicionar AutoFilledFields quando necessário */}

        {/* Botão de salvar */}
        <SubmitButton
          canSubmit={!!canSubmit}
          loading={loading}
          onSubmit={handleFormSubmit}
        />
      </View>
    </ScrollView>
  );
};

export default EnhancedCreateProduct;
