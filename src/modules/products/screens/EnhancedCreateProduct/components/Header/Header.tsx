import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/design-system/components';
import { styles } from '../../EnhancedCreateProduct.styles';

interface HeaderProps {
  onGoBack: () => void;
  title: string;
}

export const Header: React.FC<HeaderProps> = ({
  onGoBack,
  title,
}) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity 
        onPress={onGoBack} 
        style={styles.backButton}
      >
        <Ionicons name="chevron-back" size={24} color="#005CA9" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>{title}</Text>
      <View style={styles.headerSpacer} />
    </View>
  );
};
