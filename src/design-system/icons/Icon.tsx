import React from 'react';
import { TextStyle } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export const iconNames = {
  home: 'home',
  back: 'arrow-back',
  close: 'close',
  menu: 'menu',
  
  add: 'add',
  edit: 'edit',
  delete: 'delete',
  save: 'save',
  
  'attach-money': 'attach-money',
  'account-balance': 'account-balance',
  calculator: 'calculate',
  
  info: 'info-outline',
  warning: 'warning',
  error: 'error-outline',
  check: 'check-circle',
} as const;

export const iconSizes = {
  sm: 16,
  md: 24,
  lg: 32,
  xl: 40,
} as const;

export type IconName = keyof typeof iconNames;
export type IconSize = keyof typeof iconSizes;

interface IconProps {
  name: IconName;
  size?: IconSize | number;
  color?: string;
  style?: TextStyle;
}

export const Icon: React.FC<IconProps> = ({
  name,
  size = 'md',
  color = '#000000',
  style,
}) => {
  const iconSize = typeof size === 'number' ? size : iconSizes[size];
  
  return (
    <MaterialIcons
      name={iconNames[name]}
      size={iconSize}
      color={color}
      style={style}
    />
  );
};

export const useIcon = () => ({
  iconNames,
  iconSizes,
});
