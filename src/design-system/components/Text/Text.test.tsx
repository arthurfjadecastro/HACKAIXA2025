import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { Text } from '../Text';
import { colors, typography } from '@/design-system/tokens';

describe('Text Component', () => {
  it('should render children correctly', () => {
    render(<Text>Hello World</Text>);
    
    expect(screen.getByText('Hello World')).toBeTruthy();
  });

  it('should apply default props correctly', () => {
    const { getByText } = render(<Text>Default Text</Text>);
    const textElement = getByText('Default Text');
    
    expect(textElement).toBeTruthy();
    expect(textElement.props.style).toEqual(
      expect.arrayContaining([
        typography.body1,
        { color: colors.text.primary, textAlign: 'left' },
      ])
    );
  });

  it('should apply variant prop correctly', () => {
    const { getByText } = render(
      <Text variant="h1">Headline Text</Text>
    );
    const textElement = getByText('Headline Text');
    
    expect(textElement.props.style).toEqual(
      expect.arrayContaining([
        typography.h1,
      ])
    );
  });

  it('should apply color prop correctly', () => {
    const { getByText } = render(
      <Text color="secondary">Colored Text</Text>
    );
    const textElement = getByText('Colored Text');
    
    expect(textElement.props.style).toEqual(
      expect.arrayContaining([
        { color: colors.text.secondary, textAlign: 'left' },
      ])
    );
  });

  it('should apply custom color string', () => {
    const { getByText } = render(
      <Text color="#FF0000">Custom Color Text</Text>
    );
    const textElement = getByText('Custom Color Text');
    
    expect(textElement.props.style).toEqual(
      expect.arrayContaining([
        { color: '#FF0000', textAlign: 'left' },
      ])
    );
  });

  it('should apply align prop correctly', () => {
    const { getByText } = render(
      <Text align="center">Centered Text</Text>
    );
    const textElement = getByText('Centered Text');
    
    expect(textElement.props.style).toEqual(
      expect.arrayContaining([
        { color: colors.text.primary, textAlign: 'center' },
      ])
    );
  });

  it('should apply numberOfLines prop correctly', () => {
    const { getByText } = render(
      <Text numberOfLines={2}>Limited Lines Text</Text>
    );
    const textElement = getByText('Limited Lines Text');
    
    expect(textElement.props.numberOfLines).toBe(2);
  });

  it('should apply custom style prop correctly', () => {
    const customStyle = { fontSize: 20, fontWeight: '700' as const };
    const { getByText } = render(
      <Text style={customStyle}>Styled Text</Text>
    );
    const textElement = getByText('Styled Text');
    
    expect(textElement.props.style).toEqual(
      expect.arrayContaining([
        typography.body1,
        { color: colors.text.primary, textAlign: 'left' },
        customStyle,
      ])
    );
  });

  it('should combine all props correctly', () => {
    const customStyle = { marginTop: 10 };
    const { getByText } = render(
      <Text 
        variant="caption" 
        color="secondary" 
        align="right" 
        numberOfLines={1}
        style={customStyle}
      >
        Complex Text
      </Text>
    );
    const textElement = getByText('Complex Text');
    
    expect(textElement.props.style).toEqual(
      expect.arrayContaining([
        typography.caption,
        { color: colors.text.secondary, textAlign: 'right' },
        customStyle,
      ])
    );
    expect(textElement.props.numberOfLines).toBe(1);
  });
});
