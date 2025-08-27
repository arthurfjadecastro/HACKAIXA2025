import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Header } from './Header';

// Mock do Ionicons
jest.mock('@expo/vector-icons', () => ({
  Ionicons: ({ name, size, color, ...props }: any) => {
    const { View } = require('react-native');
    return <View testID={`icon-${name}`} {...props} />;
  },
}));

// Mock do design-system components
jest.mock('@/design-system/components', () => ({
  Text: ({ children, style, ...props }: any) => {
    const { Text: RNText } = require('react-native');
    return <RNText style={style} {...props}>{children}</RNText>;
  },
}));

// Mock dos styles
jest.mock('../../EnhancedCreateProduct.styles', () => ({
  styles: {
    header: { flexDirection: 'row' },
    backButton: { padding: 10 },
    headerTitle: { fontSize: 18 },
    headerSpacer: { flex: 1 },
  },
}));

describe('Header', () => {
  const defaultProps = {
    onGoBack: jest.fn(),
    title: 'Test Title',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render correctly', () => {
    const { getByText, getByTestId } = render(<Header {...defaultProps} />);

    expect(getByText('Test Title')).toBeTruthy();
    expect(getByTestId('icon-chevron-back')).toBeTruthy();
  });

  it('should call onGoBack when back button is pressed', () => {
    const { getByTestId } = render(<Header {...defaultProps} />);

    const backButton = getByTestId('icon-chevron-back').parent;
    fireEvent.press(backButton);

    expect(defaultProps.onGoBack).toHaveBeenCalledTimes(1);
  });

  it('should display the provided title', () => {
    const customTitle = 'Custom Header Title';
    const { getByText } = render(<Header {...defaultProps} title={customTitle} />);

    expect(getByText(customTitle)).toBeTruthy();
  });

  it('should have correct structure', () => {
    const { getByText, getByTestId } = render(<Header {...defaultProps} />);

    expect(getByTestId('icon-chevron-back')).toBeTruthy();
    expect(getByText('Test Title')).toBeTruthy();
  });

  it('should render back icon with correct props', () => {
    const { getByTestId } = render(<Header {...defaultProps} />);

    const backIcon = getByTestId('icon-chevron-back');
    expect(backIcon).toBeTruthy();
  });

  it('should match snapshot', () => {
    const component = render(<Header {...defaultProps} />);
    expect(component.toJSON()).toMatchSnapshot();
  });

  it('should handle empty title', () => {
    const { getByText } = render(<Header {...defaultProps} title="" />);
    expect(getByText('')).toBeTruthy();
  });

  it('should handle long title', () => {
    const longTitle = 'This is a very long title that should still render properly';
    const { getByText } = render(<Header {...defaultProps} title={longTitle} />);
    expect(getByText(longTitle)).toBeTruthy();
  });
});
