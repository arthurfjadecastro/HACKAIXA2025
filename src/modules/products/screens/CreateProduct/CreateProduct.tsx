import React from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CreateProductHeader, CreateProductForm, CreateProductFooter } from './components';
import { useCreateProductForm } from './hooks/useCreateProductForm';
import { styles } from './CreateProduct.styles';

const CreateProduct: React.FC = () => {
  const {
    formData,
    errors,
    isLoading,
    isFormValid,
    updateField,
    handleBlur,
    handleSubmit,
    scrollViewRef,
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
          errors={errors}
          updateField={updateField}
          handleBlur={handleBlur}
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