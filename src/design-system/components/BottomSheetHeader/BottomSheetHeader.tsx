import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';

import { Text } from '@/design-system/components/Text/Text';
import { Icon, IconName } from '@/design-system/icons/Icon';
import { colors, spacing } from '@/design-system/tokens';

interface BottomSheetHeaderProps {
  title: string;
  icon?: IconName;
  onClose: () => void;
  showCloseButton?: boolean;
}

const BottomSheetHeader: React.FC<BottomSheetHeaderProps> = ({
  title,
  icon,
  onClose,
  showCloseButton = true,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {icon && (
          <Icon 
            name={icon} 
            size={24} 
            color={colors.text.primary} 
          />
        )}
        <Text variant="h3" color="primary" style={styles.title}>
          {title}
        </Text>
      </View>
      
      {showCloseButton && (
        <TouchableOpacity
          style={styles.closeButton}
          onPress={onClose}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityLabel="Fechar"
          accessibilityRole="button"
          testID="close-bottom-sheet"
        >
          <Icon 
            name="close" 
            size={20} 
            color={colors.brand.orange.primary} 
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing[5], // Aumentar um pouco o padding vertical
    paddingHorizontal: spacing[6],
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    flex: 1,
  },
  title: {
    fontWeight: '500', // Diminuir peso da fonte
    flex: 1,
  },
  closeButton: {
    width: 40, // Diminuir um pouco
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: 'transparent',
  },
});

export default BottomSheetHeader;
