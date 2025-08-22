import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';

import { Text } from '@/design-system/components/Text/Text';
import { Icon, IconName } from '@/design-system/icons/Icon';
import { spacing, elevation } from '@/design-system/tokens';

interface ActionCardProps {
  icon: IconName;
  title: string;
  onPress: () => void;
  testID?: string;
}

const ActionCard: React.FC<ActionCardProps> = ({
  icon,
  title,
  onPress,
  testID,
}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      testID={testID}
      activeOpacity={0.92}
      accessibilityRole="button"
    >
      <View style={styles.content}>
        <Icon 
          name={icon} 
          size={20} // 20sp conforme especificação CAIXA
          color="rgba(255, 255, 255, 0.95)" // Ícone branco com 95% opacidade
        />
        <Text variant="body1" style={styles.title}>
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F59E0B', // Laranja institucional CAIXA
    borderRadius: 12, // radius.l = 12sp conforme especificação
    ...elevation.low,
    minHeight: 52, // Altura conforme especificação CAIXA
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[5], // Mais padding horizontal
    width: '100%', // Largura total disponível
  },
  content: {
    flexDirection: 'row', // Ícone e texto em linha
    alignItems: 'center',
    gap: spacing[2], // 8sp de gap conforme especificação
  },
  title: {
    fontSize: 16, // font.button 16sp conforme especificação
    fontWeight: '600', // Semibold
    fontFamily: 'Caixa-Std-Semibold', // Fonte institucional
    color: '#FFFFFF', // #FFFFFF 100% conforme especificação
    textAlign: 'center',
  },
});

export default ActionCard;
