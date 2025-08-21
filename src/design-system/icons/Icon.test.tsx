import React from 'react';
import { render } from '@testing-library/react-native';
import { Icon, useIcon, iconNames, iconSizes } from './Icon';

describe('Icon', () => {
  it('renders correctly with default props', () => {
    const { toJSON } = render(<Icon name="home" />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders with custom size number', () => {
    const { toJSON } = render(<Icon name="home" size={32} />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders with size from iconSizes', () => {
    const { toJSON } = render(<Icon name="home" size="lg" />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders with custom color', () => {
    const { toJSON } = render(<Icon name="home" color="#FF0000" />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders with custom style', () => {
    const customStyle = { marginTop: 10 };
    const { toJSON } = render(<Icon name="home" style={customStyle} />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders all icon names correctly', () => {
    Object.keys(iconNames).forEach((iconName) => {
      const { toJSON } = render(<Icon name={iconName as any} />);
      expect(toJSON()).toBeTruthy();
    });
  });

  it('renders all icon sizes correctly', () => {
    Object.keys(iconSizes).forEach((size) => {
      const { toJSON } = render(<Icon name="home" size={size as any} />);
      expect(toJSON()).toBeTruthy();
    });
  });
});

describe('useIcon hook', () => {
  it('returns iconNames and iconSizes', () => {
    const result = useIcon();
    
    expect(result).toEqual({
      iconNames,
      iconSizes,
    });
  });

  it('returns correct iconNames object', () => {
    const result = useIcon();
    
    expect(result.iconNames).toBe(iconNames);
    expect(result.iconNames.home).toBe('home');
    expect(result.iconNames.add).toBe('add');
    expect(result.iconNames.visibility).toBe('visibility');
  });

  it('returns correct iconSizes object', () => {
    const result = useIcon();
    
    expect(result.iconSizes).toBe(iconSizes);
    expect(result.iconSizes.sm).toBe(16);
    expect(result.iconSizes.md).toBe(24);
    expect(result.iconSizes.lg).toBe(32);
    expect(result.iconSizes.xl).toBe(40);
  });
});
