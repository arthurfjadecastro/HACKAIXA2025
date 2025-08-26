import React from 'react';
import { View, StyleSheet } from 'react-native';

import { Text } from '../Text/Text';
import { Icon } from '@/design-system/icons';
import { colors, spacing } from '@/design-system/tokens';

interface EmptyStateProps {
  icon: string;
  title: string;
  subtitle?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  subtitle,
}) => {
  return (
    <View style={styles.container}>
      {/* Ícone ilustrativo */}
      <View style={styles.iconContainer}>
        <Icon 
          name={icon as any} 
          size={64} 
          color={colors.text.inverse} 
        />
      </View>

      {/* Mensagem principal */}
      <Text variant="h2" color="inverse" style={styles.title}>
        {title}
      </Text>

      {/* Mensagem de apoio */}
      {subtitle && (
        <Text variant="body1" color="subtle" style={styles.subtitle}>
          {subtitle}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: spacing[6],
    marginVertical: spacing[8],
  },
  iconContainer: {
    marginBottom: spacing[4], // spacing/md
    opacity: 0.8,
  },
  title: {
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: spacing[3], // spacing/md
    lineHeight: 28,
  },
  subtitle: {
    textAlign: 'center',
    opacity: 0.8,
    lineHeight: 20,
  },
});

export default EmptyState;
