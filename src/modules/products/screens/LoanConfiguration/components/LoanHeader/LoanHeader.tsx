import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../../LoanConfiguration.styles';

interface LoanHeaderProps {
  onGoBack: () => void;
  productName: string;
}

export const LoanHeader: React.FC<LoanHeaderProps> = ({
  onGoBack,
  productName,
}) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onGoBack} style={styles.backButton}>
        <Ionicons name="chevron-back" size={24} color="#005CA9" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>{productName}</Text>
      <View style={styles.headerSpacer} />
    </View>
  );
};
