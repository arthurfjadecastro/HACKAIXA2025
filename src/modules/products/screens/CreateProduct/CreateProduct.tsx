import React from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CreateProductHeader, CreateProductForm, CreateProductFooter } from './components';
import { useCreateProductForm } from './hooks/useCreateProductFormSimple';
import { styles } from './CreateProduct.styles';

const CreateProduct: React.FC = () => {
  const {
    formData,
    isLoading,
    isFormValid,
    updateField,
    handleSubmit,
    scrollViewRef,
    isConvenioAlreadyRegistered,
  } = useCreateProductForm();

  return (
    <SafeAreaView style={styles.container}>
      <CreateProductHeader />
      
      <ScrollView
        ref={scrollViewRef}
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <CreateProductForm
          formData={formData}
          updateField={updateField}
          isConvenioAlreadyRegistered={isConvenioAlreadyRegistered}
        />
      </ScrollView>

      <CreateProductFooter
        isLoading={isLoading}
        isFormValid={isFormValid}
        onSubmit={handleSubmit}
      />
    </SafeAreaView>
  );
};

export default CreateProduct;