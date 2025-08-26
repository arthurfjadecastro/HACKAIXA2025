import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/design-system/components';
import { styles } from './Header.styles';

interface HeaderProps {
  onBackPress: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onBackPress }) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
        <Ionicons name="chevron-back" size={24} color="#005CA9" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Resultado da Simulação</Text>
      <View style={styles.headerSpacer} />
    </View>
  );
};
