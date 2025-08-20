import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';

import { colors, spacing } from '@/design-system/tokens';

interface DividerProps {
  style?: ViewStyle;
  color?: string;
  thickness?: number;
  marginVertical?: number;
}

const Divider: React.FC<DividerProps> = ({
  style,
  color = colors.surface.divider,
  thickness = 1,
  marginVertical = spacing[4],
}) => {
  return (
    <View
      style={[
        styles.divider,
        {
          backgroundColor: color,
          height: thickness,
          marginVertical,
        },
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  divider: {
    width: '100%',
  },
});

export default Divider;
