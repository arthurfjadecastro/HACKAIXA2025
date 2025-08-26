import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../../LoanConfiguration.styles';

interface AmountSummaryProps {
  amount: string;
  onEditAmount: () => void;
}

export const AmountSummary: React.FC<AmountSummaryProps> = ({
  amount,
  onEditAmount,
}) => {
  return (
    <View style={styles.amountSummary}>
      <View style={styles.amountRow}>
        <Text style={styles.amountValue}>{amount ? `R$ ${amount}` : 'R$ 0,00'}</Text>
        <TouchableOpacity onPress={onEditAmount} style={styles.editButton}>
          <Ionicons name="pencil" size={16} color="#005CA9" />
        </TouchableOpacity>
      </View>
    </View>
  );
};
