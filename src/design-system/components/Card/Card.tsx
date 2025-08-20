import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors, padding, radius, shadows } from '@/design-system/tokens';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: keyof typeof padding;
  style?: ViewStyle;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding: paddingSize = 'md',
  style,
}) => {
  const cardStyle = [
    styles.base,
    styles[variant],
    { padding: padding[paddingSize] },
    style,
  ];

  return (
    <View style={cardStyle}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.background.card,
    borderRadius: radius.card,
  },

  default: {
    ...shadows.card,
  },

  elevated: {
    ...shadows.lg,
  },

  outlined: {
    borderWidth: 1,
    borderColor: colors.border.light,
    ...shadows.none,
  },
});
