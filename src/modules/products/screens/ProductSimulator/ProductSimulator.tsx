import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '@/navigation/AppStack';

import { Text, Button } from '@/design-system/components';
import { styles } from './ProductSimulator.styles';

type RouteProps = RouteProp<AppStackParamList, 'ProductSimulator'>;
type NavigationProps = NativeStackNavigationProp<AppStackParamList>;

const ProductSimulator: React.FC = () => {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation<NavigationProps>();
  const productId = route.params?.productId;
  
  const [amount, setAmount] = useState<string>('');
  const [error, setError] = useState<string>('');
  
  console.log('ProductSimulator - ProductId recebido:', productId);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleContinue = () => {
    console.log('Continuar com valor:', amount);
    if (productId && amount) {
      navigation.navigate('LoanConfiguration', { 
        productId, 
        amount 
      });
    }
  };

  const formatCurrency = (value: string) => {
    // Remove tudo que não for número
    const numericValue = value.replace(/[^0-9]/g, '');
    
    if (!numericValue) return '';
    
    // Limita ao valor máximo (R$ 10.000.000,00 = 1000000000 centavos)
    const maxValue = 1000000000;
    const limitedValue = Math.min(parseInt(numericValue), maxValue);
    
    // Converte para formato de moeda
    const number = limitedValue / 100;
    return number.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const validateAmount = (formattedValue: string) => {
    if (!formattedValue) {
      setError('');
      return;
    }
    
    // Converte o valor formatado para número
    const numericValue = parseFloat(formattedValue.replace(/\./g, '').replace(',', '.'));
    
    if (numericValue < 100) {
      setError('O valor mínimo para empréstimo é R$ 100,00');
    } else {
      setError('');
    }
  };

  const handleAmountChange = (value: string) => {
    const formatted = formatCurrency(value);
    setAmount(formatted);
    validateAmount(formatted);
  };

  const isValidAmount = () => {
    if (!amount) return false;
    const numericValue = parseFloat(amount.replace(/\./g, '').replace(',', '.'));
    return numericValue >= 100;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#005CA9" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Valor do empréstimo 1/3</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Título principal movido para abaixo do header */}
      <View style={styles.titleContainer}>
        <Text style={styles.mainTitle}>Valor do empréstimo</Text>
      </View>

      <ScrollView 
        style={styles.content} 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.amountContainer}>
          <View style={styles.currencyContainer}>
            <Text style={styles.currencySymbol}>R$</Text>
            <TextInput
              style={styles.amountInput}
              value={amount}
              onChangeText={handleAmountChange}
              placeholder="0,00"
              placeholderTextColor="#CCCCCC"
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            Valor Mín. R$ 100 • Valor Máx. R$ 10.000.000
          </Text>
        </View>

        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Continuar"
          onPress={handleContinue}
          style={!isValidAmount() ? 
            {...styles.continueButton, ...styles.continueButtonDisabled} : 
            styles.continueButton
          }
          disabled={!isValidAmount()}
        />
      </View>
    </View>
  );
};

export default ProductSimulator;
