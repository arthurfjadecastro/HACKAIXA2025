import React from 'react';
import { Text as RNText, TextStyle } from 'react-native';
import { colors, typography } from '@/design-system/tokens';

interface TextProps {
  children: React.ReactNode;
  variant?: keyof typeof typography;
  color?: keyof typeof colors.text | string;
  align?: 'left' | 'center' | 'right';
  numberOfLines?: number;
  style?: TextStyle;
}

export const Text: React.FC<TextProps> = ({
  children,
  variant = 'body1',
  color = 'primary',
  align = 'left',
  numberOfLines,
  style,
}) => {
  const textColor = colors.text[color as keyof typeof colors.text] || color;
  
  const textStyle = [
    typography[variant],
    { color: textColor, textAlign: align },
    style,
  ];

  return (
    <RNText 
      style={textStyle} 
      numberOfLines={numberOfLines}
    >
      {children}
    </RNText>
  );
};
