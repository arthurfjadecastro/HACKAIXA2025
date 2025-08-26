import React from 'react';
import { View } from 'react-native';
import { Text } from '@/design-system/components';

// Importar componentes modulares
import {
  CategorySelector,
  SubtypeSelector,
  ConvenioSelector,
  AutoFilledSummary,
  OutroProductFields,
} from './CreateProductForm/components';

import { styles } from './CreateProductForm/CreateProductForm.styles';
import { CreateProductFormProps } from './CreateProductForm/types';

export const CreateProductForm: React.FC<CreateProductFormProps> = ({
  formData,
  updateField,
  isConvenioAlreadyRegistered,
  isHabitacaoAlreadyRegistered,
}) => {
  return (
    <View style={styles.formContainer}>
      {/* Seletor de Categoria */}
      <CategorySelector
        selectedCategory={formData.categoria}
        onCategorySelect={(categoria: string) => updateField('categoria', categoria)}
        isHabitacaoAlreadyRegistered={isHabitacaoAlreadyRegistered}
      />

      {/* Seletor de Subtipo */}
      <SubtypeSelector
        categoria={formData.categoria}
        selectedSubtipo={formData.subtipo}
        onSubtipoSelect={(subtipo: string) => updateField('subtipo', subtipo)}
        isConvenioAlreadyRegistered={isConvenioAlreadyRegistered}
      />

      {/* Seletor de Convênio */}
      <ConvenioSelector
        subtipo={formData.subtipo}
        selectedConvenio={formData.convenio_selected || ''}
        onConvenioSelect={(convenio: string) => updateField('convenio_selected', convenio)}
        isConvenioAlreadyRegistered={isConvenioAlreadyRegistered}
      />

      {/* Resumo dos dados preenchidos automaticamente */}
      <AutoFilledSummary formData={formData} />

      {/* Normativo Legal - Se foi preenchido automaticamente */}
      {(formData.categoria === 'CONSIGNADO' || formData.categoria === 'HABITACAO') && formData.normative && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Normativo Legal</Text>
          
          <View style={styles.normativoContainer}>
            <Text style={styles.normativoText}>{formData.normative}</Text>
            <Text style={styles.normativoDescription}>
              {formData.categoria === 'CONSIGNADO' 
                ? 'Normativo aplicável para produtos de crédito consignado'
                : 'Normativo aplicável para financiamento habitacional'
              }
            </Text>
          </View>
        </View>
      )}

      {/* Campos manuais para categoria OUTRO */}
      <OutroProductFields 
        formData={formData} 
        updateField={updateField} 
      />

      {/* Por enquanto, produtos específicos (CONSIGNADO/HABITACAO) são configurados automaticamente */}
    </View>
  );
};
