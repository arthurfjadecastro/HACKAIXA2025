import React, { useState, useEffect } from 'react';
import { View, ScrollView } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '@/navigation/AppStack';

import { Text, Button } from '@/design-system/components';
import { useProducts } from '../../hooks';
import ProductDataService from '@/services/products/data';

// Importar componentes modulares
import { 
  LoanHeader, 
  AmountSummary, 
  InstallmentSelector, 
  FinancialSummary 
} from './components';
import { useLoanCalculation } from './hooks';
import { styles } from './LoanConfiguration.styles';

type RouteProps = RouteProp<AppStackParamList, 'LoanConfiguration'>;
type NavigationProps = NativeStackNavigationProp<AppStackParamList>;

const LoanConfiguration: React.FC = () => {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation<NavigationProps>();
  const { productId, amount } = route.params;
  const { products } = useProducts();
  const productService = ProductDataService.getInstance();
  
  // Estado para dados do produto
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Hook customizado para cálculos
  const {
    months,
    inputValue,
    quote,
    showValidationWarning,
    productMinMonths,
    productMaxMonths,
    productRateAm,
    formatCurrency,
    decreaseMonths,
    increaseMonths,
    handleMonthsChange,
    handleMonthsBlur,
  } = useLoanCalculation({ product, amount });

  // Carregar dados do produto
  useEffect(() => {
    const loadProductData = async () => {
      try {
        setLoading(true);
        console.log('🔍 Carregando dados do produto:', productId);
        
        // Primeiro, busca o produto na lista de produtos cadastrados
        const registeredProduct = products.find(p => p.id === productId);
        
        if (registeredProduct) {
          // Busca os dados completos baseado no productId
          let detailedData = null;
          
          // Determina o tipo do produto baseado no ID ou nome (incluindo variações de acentuação)
          const productNameLower = registeredProduct.name.toLowerCase();
          
          if (productId.includes('inss') || productNameLower.includes('inss')) {
            detailedData = await productService.loadConvenio('inss');
          } else if (productId.includes('militar') || productNameLower.includes('militar')) {
            detailedData = await productService.loadConvenio('militar');
          } else if (productId.includes('funcef') || productNameLower.includes('funcef')) {
            detailedData = await productService.loadConvenio('funcef');
          } else if (productId.includes('tjdft') || productNameLower.includes('tjdft')) {
            detailedData = await productService.loadConvenio('tjdft');
          } else if (productId.includes('habitacao') || 
                     productNameLower.includes('habitacao') || 
                     productNameLower.includes('habitação')) {
            // Para habitação, carrega os dados do SAC por padrão (ambos têm os mesmos limites de prazo)
            detailedData = await productService.loadHabitacao('sac');
          } else if (productId.includes('outro') || productNameLower.includes('outro') || 
                     registeredProduct.categoria === 'OUTRO') {
            // Para produtos OUTRO, usar dados específicos do produto registrado
            setProduct(registeredProduct);
            return;
          }
          
          if (detailedData) {
            // Combinar dados do produto registrado com dados detalhados
            const productData = {
              ...registeredProduct,
              prazoMaximo: detailedData.prazo?.maximoMeses || registeredProduct.prazoMaximo,
              prazoMinimo: detailedData.prazo?.minimoMeses || registeredProduct.prazoMinimo,
              juros: detailedData.juros?.mensal || registeredProduct.juros,
            };
            setProduct(productData);
          } else {
            setProduct(registeredProduct);
          }
        }
      } catch (error) {
        console.error('❌ Erro ao carregar dados do produto:', error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    if (products.length > 0) {
      loadProductData();
    }
  }, [productId, products]);

  // Navegação
  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleEditAmount = () => {
    navigation.navigate('CreateProduct');
  };

  const handleContinue = () => {
    if (!quote) return;
    
    navigation.navigate('SimulationLoading', {
      productId,
      amount,
      months
    });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.container}>
        <Text>Produto não encontrado</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <LoanHeader 
        onGoBack={handleBackPress}
        productName="Quantos meses 2/2"
      />

      <ScrollView 
        style={styles.content} 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Valor do empréstimo (resumo editável) */}
        <AmountSummary 
          amount={amount}
          onEditAmount={handleEditAmount}
        />

        {/* Seletor de parcelas */}
        <InstallmentSelector
          months={months}
          inputValue={inputValue}
          productMinMonths={productMinMonths}
          productMaxMonths={productMaxMonths}
          showValidationWarning={showValidationWarning}
          onDecrease={decreaseMonths}
          onIncrease={increaseMonths}
          onChangeText={handleMonthsChange}
          onBlur={handleMonthsBlur}
        />

        {/* Resumo financeiro */}
        <FinancialSummary
          quote={quote}
          productRateAm={productRateAm}
          formatCurrency={formatCurrency}
        />
      </ScrollView>

      {/* Footer com botão de continuar */}
      <View style={styles.footer}>
        <Button
          title="Continuar"
          onPress={handleContinue}
          style={{
            ...styles.continueButton,
            backgroundColor: showValidationWarning ? '#D0D0D0' : '#F7931E'
          }}
          disabled={showValidationWarning || !quote}
        />
      </View>
    </View>
  );
};

export default LoanConfiguration;
