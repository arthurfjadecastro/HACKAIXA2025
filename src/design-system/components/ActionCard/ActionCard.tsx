import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';

import { Text } from '@/design-system/components/Text/Text';
import { Icon, IconName } from '@/design-system/icons/Icon';
import { colors, spacing, radius, elevation } from '@/design-system/tokens';

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
          size={24} 
          color={colors.primary.main} 
        />
        <Text variant="body1" color="primary" style={styles.title}>
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface.background,
    borderRadius: radius.card,
    ...elevation.low,
    minHeight: 88,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[3],
  },
  content: {
    alignItems: 'center',
    gap: spacing[2],
  },
  title: {
    textAlign: 'center',
    fontWeight: '600',
  },
});

export default ActionCard;
