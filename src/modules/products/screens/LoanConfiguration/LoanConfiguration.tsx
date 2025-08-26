import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '@/navigation/AppStack';

import { Text, Button } from '@/design-system/components';
import { useProducts } from '@/hooks/useProducts';
import ProductDataService from '@/services/ProductDataService';

type RouteProps = RouteProp<AppStackParamList, 'LoanConfiguration'>;
type NavigationProps = NativeStackNavigationProp<AppStackParamList>;

interface QuoteData {
  installment: number;
  total: number;
  rate: number;
}

const LoanConfiguration: React.FC = () => {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation<NavigationProps>();
  const { productId, amount } = route.params;
  const { products } = useProducts();
  const productService = ProductDataService.getInstance();
  
  // Estados para dados do produto
  const [productMaxMonths, setProductMaxMonths] = useState<number>(12);
  const [productMinMonths, setProductMinMonths] = useState<number>(3);
  const [productRateAm, setProductRateAm] = useState<number>(0.01);
  
  const [months, setMonths] = useState<number>(60); // Iniciamos com 60 meses (mínimo para habitação)
  const [quote, setQuote] = useState<QuoteData | null>(null);
  const [inputValue, setInputValue] = useState<string>('60');
  const [validationTimeout, setValidationTimeout] = useState<NodeJS.Timeout | null>(null);
  const [showValidationWarning, setShowValidationWarning] = useState(false);

  // Carregar dados do produto
  useEffect(() => {
    const loadProductData = async () => {
      try {
        console.log('🔍 Carregando dados do produto:', productId);
        
        // Primeiro, busca o produto na lista de produtos cadastrados
        const registeredProduct = products.find(p => p.id === productId);
        
        if (registeredProduct) {
          console.log('✅ Produto encontrado na lista:', registeredProduct.name);
          console.log('📝 Nome do produto registrado:', registeredProduct.name);
          console.log('🔍 DEBUG - Dados completos do produto registrado:', {
            id: registeredProduct.id,
            name: registeredProduct.name,
            categoria: registeredProduct.categoria,
            prazoMinimo: registeredProduct.prazoMinimo,
            prazoMaximo: registeredProduct.prazoMaximo,
            juros: registeredProduct.juros
          });
          
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
            console.log('🏠 Detectado produto de habitação, carregando dados...');
            detailedData = await productService.loadHabitacao('sac');
          } else if (productId.includes('outro') || productNameLower.includes('outro') || 
                     registeredProduct.categoria === 'OUTRO') {
            // Para produtos OUTRO, usar dados específicos do produto registrado
            console.log('🔧 Detectado produto OUTRO, usando dados específicos:', registeredProduct.name);
            console.log('🔍 DEBUG - Verificando valores salvos:', {
              prazoMinimo: registeredProduct.prazoMinimo,
              prazoMaximo: registeredProduct.prazoMaximo,
              categoria: registeredProduct.categoria,
              configuracoes: registeredProduct.configuracoes
            });
            
            const minMonths = registeredProduct.prazoMinimo || 1;
            const maxMonths = registeredProduct.prazoMaximo || 420;
            const rate = registeredProduct.juros > 10 ? (registeredProduct.juros / 100) / 12 : registeredProduct.juros / 100;
            
            console.log('📊 Aplicando configurações para produto OUTRO:', {
              minMonths,
              maxMonths,
              rate: (rate * 100).toFixed(2) + '% a.m.'
            });
            
            setProductMaxMonths(maxMonths);
            setProductMinMonths(minMonths);
            setProductRateAm(rate);
            
            // Inicializa com valor dentro do intervalo
            const initialMonths = Math.max(minMonths, Math.min(maxMonths, minMonths));
            setMonths(initialMonths);
            setInputValue(initialMonths.toString());
            
            console.log(`📊 Configurações do produto OUTRO específico:
              - Prazo: ${minMonths} a ${maxMonths} meses
              - Taxa: ${(rate * 100).toFixed(2)}% a.m.
              - Inicializando com: ${initialMonths} meses`);
            
            // Sai do if sem ir para o fallback
            return;
          }
          
          if (detailedData) {
            console.log('✅ Dados detalhados carregados:', detailedData.nome_exibicao);
            
            // Define limites de prazo SEMPRE a partir do JSON (sem fallback que sobrescreva)
            const maxMonths = detailedData.prazo?.maximoMeses || registeredProduct.prazoMaximo || 96;
            const minMonths = detailedData.prazo?.minimoMeses || 60; // Para habitação, usa 60 como fallback
            
            console.log(`🔍 DEBUG - Limites de prazo carregados:
              - JSON minimoMeses: ${detailedData.prazo?.minimoMeses}
              - JSON maximoMeses: ${detailedData.prazo?.maximoMeses}
              - Final minMonths: ${minMonths}
              - Final maxMonths: ${maxMonths}`);
            
            setProductMaxMonths(maxMonths);
            setProductMinMonths(minMonths);
            
            // Define taxa de juros
            let rate = 0.01; // Default 1% a.m.
            if (detailedData.faixas?.A?.concessao_taxa_am) {
              rate = detailedData.faixas.A.concessao_taxa_am / 100;
            } else if (registeredProduct.juros) {
              // Se o juros for > 10, assumimos que é percentual anual, senão é mensal
              rate = registeredProduct.juros > 10 ? (registeredProduct.juros / 100) / 12 : registeredProduct.juros / 100;
            }
            setProductRateAm(rate);
            
            // Inicializa com valor mínimo válido
            const initialMonths = Math.max(minMonths, Math.min(maxMonths, 60)); // Usa o mínimo ou 60 meses como padrão
            setMonths(initialMonths);
            setInputValue(initialMonths.toString());
            
            console.log(`📊 Configurações do produto:
              - Prazo: ${minMonths} a ${maxMonths} meses
              - Taxa: ${(rate * 100).toFixed(2)}% a.m.
              - Inicializando com: ${initialMonths} meses`);
          } else {
            console.warn('⚠️ Não foi possível determinar o tipo do produto');
            // Usa dados básicos do produto registrado com limites mais conservadores
            const maxMonths = registeredProduct.prazoMaximo || 96;
            // Para produtos OUTRO, usa o prazoMinimo salvo, senão usa 1 como padrão
            const minMonths = registeredProduct.prazoMinimo || 1;
            
            setProductMaxMonths(maxMonths);
            setProductMinMonths(minMonths);
            
            const rate = registeredProduct.juros > 10 ? (registeredProduct.juros / 100) / 12 : registeredProduct.juros / 100;
            setProductRateAm(rate);
            
            // Inicializa com valor dentro do intervalo
            const initialMonths = Math.max(minMonths, Math.min(maxMonths, 12));
            setMonths(initialMonths);
            setInputValue(initialMonths.toString());
            
            console.log(`📊 Configurações do produto (fallback):
              - Prazo: ${minMonths} a ${maxMonths} meses
              - Taxa: ${(rate * 100).toFixed(2)}% a.m.
              - Inicializando com: ${initialMonths} meses`);
          }
        } else {
          console.warn('⚠️ Produto não encontrado na lista de cadastrados');
        }
      } catch (error) {
        console.error('❌ Erro ao carregar dados do produto:', error);
      }
    };

    if (productId && products.length > 0) {
      loadProductData();
    }
  }, [productId, products]);

  // Função de cálculo usando dados reais do produto
  const calculateQuote = (principal: number, monthsCount: number): QuoteData => {
    const rateAm = productRateAm; // Usar taxa real do produto
    const installment = principal * rateAm / (1 - Math.pow(1 + rateAm, -monthsCount));
    const total = installment * monthsCount;
    const rateAa = Math.pow(1 + rateAm, 12) - 1; // Taxa anual
    
    return {
      installment,
      total,
      rate: rateAa * 100
    };
  };

  useEffect(() => {
    if (amount) {
      const numericAmount = parseFloat(amount.replace(/\./g, '').replace(',', '.'));
      const newQuote = calculateQuote(numericAmount, months);
      setQuote(newQuote);
    }
  }, [amount, months]);

  // Limpa o timeout quando o componente é desmontado
  useEffect(() => {
    return () => {
      if (validationTimeout) {
        clearTimeout(validationTimeout);
      }
    };
  }, [validationTimeout]);

  // Debug do showValidationWarning
  useEffect(() => {
    console.log(`🎨 showValidationWarning changed to: ${showValidationWarning}`);
  }, [showValidationWarning]);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleEditAmount = () => {
    navigation.goBack();
  };

  const handleContinue = () => {
    console.log('Continuar com configuração:', { 
      productId, 
      amount, 
      months, 
      quote 
    });
    
    navigation.navigate('SimulationLoading', {
      productId,
      amount,
      months
    });
  };

  const handleMonthsChange = (value: string) => {
    // Permite entrada completamente livre
    setInputValue(value);
    
    // Verifica se o valor está fora dos limites em tempo real
    const numericValue = parseInt(value);
    if (!isNaN(numericValue)) {
      const isOutOfRange = numericValue < productMinMonths || numericValue > productMaxMonths;
      console.log(`🔍 Validation Debug: value=${value}, min=${productMinMonths}, max=${productMaxMonths}, isOutOfRange=${isOutOfRange}`);
      setShowValidationWarning(isOutOfRange);
      
      // Atualiza o state interno se for um número válido
      if (numericValue > 0) {
        setMonths(numericValue);
      }
    } else if (value === '') {
      // Campo vazio - não mostra warning imediatamente
      console.log('🔍 Empty field, removing warning');
      setShowValidationWarning(false);
    } else {
      // Valor inválido (não numérico)
      console.log('🔍 Invalid numeric value, showing warning');
      setShowValidationWarning(true);
    }
    
    // Limpa o timeout anterior se existir
    if (validationTimeout) {
      clearTimeout(validationTimeout);
    }
    
    // Agenda a correção automática para valores fora do limite após 1.25 segundos
    const newTimeout = setTimeout(() => {
      const finalNumericValue = parseInt(value);
      
      if (!isNaN(finalNumericValue)) {
        if (finalNumericValue < productMinMonths) {
          // Menor que o mínimo - corrige automaticamente
          setMonths(productMinMonths);
          setInputValue(productMinMonths.toString());
          setShowValidationWarning(false);
        } else if (finalNumericValue > productMaxMonths) {
          // Maior que o máximo - corrige automaticamente
          setMonths(productMaxMonths);
          setInputValue(productMaxMonths.toString());
          setShowValidationWarning(false);
        }
      } else if (value === '') {
        // Campo vazio - força o mínimo
        setMonths(productMinMonths);
        setInputValue(productMinMonths.toString());
        setShowValidationWarning(false);
      }
    }, 1250);
    
    setValidationTimeout(newTimeout);
  };

  const decreaseMonths = () => {
    const currentValue = months;
    
    // Se está fora do intervalo, primeiro ajusta para dentro do intervalo
    if (currentValue > productMaxMonths) {
      setMonths(productMaxMonths);
      setInputValue(productMaxMonths.toString());
      setShowValidationWarning(false); // Remove warning ao ajustar
    } else if (currentValue <= productMinMonths) {
      // Já está no mínimo ou abaixo, não faz nada
      return;
    } else {
      // Valor válido, decrementa normalmente
      const newMonths = currentValue - 1;
      setMonths(newMonths);
      setInputValue(newMonths.toString());
      setShowValidationWarning(false); // Garante que não há warning
    }
  };

  const increaseMonths = () => {
    const currentValue = months;
    
    // Se está fora do intervalo, primeiro ajusta para dentro do intervalo
    if (currentValue < productMinMonths) {
      setMonths(productMinMonths);
      setInputValue(productMinMonths.toString());
      setShowValidationWarning(false); // Remove warning ao ajustar
    } else if (currentValue >= productMaxMonths) {
      // Já está no máximo ou acima, não faz nada
      return;
    } else {
      // Valor válido, incrementa normalmente
      const newMonths = currentValue + 1;
      setMonths(newMonths);
      setInputValue(newMonths.toString());
      setShowValidationWarning(false); // Garante que não há warning
    }
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#005CA9" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Quantos meses 2/2</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView 
        style={styles.content} 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Valor do empréstimo (resumo editável) */}
        <View style={styles.amountSummary}>
          <View style={styles.amountRow}>
            <Text style={styles.amountValue}>{amount ? `R$ ${amount}` : 'R$ 0,00'}</Text>
            <TouchableOpacity onPress={handleEditAmount} style={styles.editButton}>
              <Ionicons name="pencil" size={16} color="#005CA9" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Seletor de parcelas */}
        <View style={styles.installmentSelector}>
          <Text style={styles.sectionLabel}>Parcelas</Text>
          
          <View style={styles.controlsRow}>
            <TouchableOpacity 
              onPress={decreaseMonths}
              style={[
                styles.controlButton, 
                months <= productMinMonths && styles.controlButtonDisabled
              ]}
              disabled={months <= productMinMonths}
            >
              <Ionicons 
                name="remove" 
                size={20} 
                color={months <= productMinMonths ? "#CCCCCC" : "#005CA9"} 
              />
            </TouchableOpacity>

            <TextInput
              style={styles.monthsInput}
              value={inputValue}
              onChangeText={handleMonthsChange}
              onBlur={() => {
                // Só corrige se o campo estiver vazio ou com valor inválido
                if (inputValue === '' || isNaN(parseInt(inputValue))) {
                  setMonths(productMinMonths);
                  setInputValue(productMinMonths.toString());
                }
              }}
              keyboardType="number-pad"
              maxLength={3}
              textAlign="center"
            />

            <TouchableOpacity 
              onPress={increaseMonths}
              style={[styles.controlButton, months >= productMaxMonths && styles.controlButtonDisabled]}
              disabled={months >= productMaxMonths}
            >
              <Ionicons name="add" size={20} color={months >= productMaxMonths ? "#CCCCCC" : "#005CA9"} />
            </TouchableOpacity>
          </View>

          <View style={styles.limitsHelper}>
            <Text style={{
              ...styles.helperText,
              color: showValidationWarning ? '#FF0000' : styles.helperText.color
            }}>
              Mín: {productMinMonths} • Máx: {productMaxMonths}
            </Text>
          </View>
        </View>

        {/* Valor por parcela */}
        <View style={styles.installmentValue}>
          <Text style={styles.installmentLabel}>de</Text>
          <Text style={styles.installmentAmount}>
            {quote ? formatCurrency(quote.installment) : 'R$ 0,00'}
          </Text>
        </View>

        {/* Resumo financeiro */}
        <View style={styles.financialSummary}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total a pagar</Text>
            <Text style={styles.summaryValue}>
              {quote ? formatCurrency(quote.total) : 'R$ 0,00'}
            </Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Juros</Text>
            <Text style={styles.summaryValue}>
              {(productRateAm * 100).toFixed(2)}% a.m. ({((Math.pow(1 + productRateAm, 12) - 1) * 100).toFixed(1)}% a.a. efetiva)
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Continuar"
          onPress={handleContinue}
          style={{
            ...styles.continueButton,
            backgroundColor: showValidationWarning ? '#D0D0D0' : '#F7931E'
          }}
          disabled={showValidationWarning}
        />
      </View>
    </View>
  );
};

export default LoanConfiguration;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F8FB',
  },
  
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F4F8FB', // Mudado para branco gelo
    // Removido borderBottomWidth e borderBottomColor para consistência
  },
  backButton: {
    padding: 8, // Reduzido de 16 para 8 para ficar mais próximo da borda
    marginLeft: -8, // Adiciona margem negativa para compensar e ficar ainda mais à esquerda
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '400',
    color: '#757575',
    textAlign: 'right',
    flex: 1,
    marginRight: 16,
  },
  headerSpacer: {
    width: 0,
  },

  // Content
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  
  contentContainer: {
    paddingTop: 24,
    paddingBottom: 24,
  },

  // Amount Summary
  amountSummary: {
    marginBottom: 24,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  amountValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
  },
  editButton: {
    padding: 8,
    backgroundColor: '#F5F5F5',
    borderRadius: 6,
  },

  // Installment Selector
  installmentSelector: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 12,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  controlButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 16,
  },
  controlButtonDisabled: {
    backgroundColor: '#F0F0F0',
  },
  monthsInput: {
    width: 100,
    height: 40,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  limitsHelper: {
    alignItems: 'center',
    marginTop: 8,
  },
  helperText: {
    fontSize: 12,
    color: '#BDBDBD',
  },

  // Installment Value
  installmentValue: {
    alignItems: 'center',
    marginBottom: 24,
  },
  installmentLabel: {
    fontSize: 16,
    color: '#757575',
    marginBottom: 4,
  },
  installmentAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1565C0',
  },

  // Financial Summary
  financialSummary: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#757575',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
  },

  // Footer
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#F4F8FB', // Mudado para branco gelo
  },
  continueButton: {
    backgroundColor: '#F7931E',
    borderRadius: 8,
    height: 56,
    justifyContent: 'center',
  },
});
