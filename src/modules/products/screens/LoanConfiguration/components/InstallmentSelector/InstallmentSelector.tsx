import React from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../../LoanConfiguration.styles';

interface InstallmentSelectorProps {
  months: number;
  inputValue: string;
  productMinMonths: number;
  productMaxMonths: number;
  showValidationWarning: boolean;
  onDecrease: () => void;
  onIncrease: () => void;
  onChangeText: (text: string) => void;
  onBlur: () => void;
}

export const InstallmentSelector: React.FC<InstallmentSelectorProps> = ({
  months,
  inputValue,
  productMinMonths,
  productMaxMonths,
  showValidationWarning,
  onDecrease,
  onIncrease,
  onChangeText,
  onBlur,
}) => {
  return (
    <View style={styles.installmentSelector}>
      <Text style={styles.sectionLabel}>Parcelas</Text>
      
      <View style={styles.controlsRow}>
        <TouchableOpacity 
          onPress={onDecrease}
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
          onChangeText={onChangeText}
          onBlur={onBlur}
          keyboardType="number-pad"
          maxLength={3}
          textAlign="center"
        />

        <TouchableOpacity 
          onPress={onIncrease}
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
  );
};
