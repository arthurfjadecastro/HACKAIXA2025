import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Text } from '@/design-system/components';
import { styles } from './AmortizationToggle.styles';

interface AmortizationToggleProps {
  amortizationType: 'PRICE' | 'SAC';
  onToggle: (type: 'PRICE' | 'SAC') => void;
}

export const AmortizationToggle: React.FC<AmortizationToggleProps> = ({
  amortizationType,
  onToggle,
}) => {
  return (
    <View style={styles.amortizationToggle}>
      <Text style={styles.toggleLabel}>Comparar sistemas:</Text>
      <View style={styles.toggleButtons}>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            amortizationType === 'PRICE' 
              ? styles.toggleButtonActive 
              : styles.toggleButtonInactive
          ]}
          onPress={() => onToggle('PRICE')}
        >
          <Text style={StyleSheet.flatten([
            styles.toggleButtonText,
            amortizationType === 'PRICE' 
              ? styles.toggleButtonTextActive 
              : styles.toggleButtonTextInactive
          ])}>
            PRICE
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            amortizationType === 'SAC' 
              ? styles.toggleButtonActive 
              : styles.toggleButtonInactive
          ]}
          onPress={() => onToggle('SAC')}
        >
          <Text style={StyleSheet.flatten([
            styles.toggleButtonText,
            amortizationType === 'SAC' 
              ? styles.toggleButtonTextActive 
              : styles.toggleButtonTextInactive
          ])}>
            SAC
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
