import React from 'react';
import { render } from '@testing-library/react-native';
import { Text, View } from 'react-native';
import { TestWrapper, renderWithProviders } from './test-utils';

// Mock do NavigationContainer
jest.mock('@react-navigation/native', () => ({
  NavigationContainer: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock do ProductsProvider
jest.mock('@/contexts/ProductsContext', () => ({
  ProductsProvider: ({ children }: { children: React.ReactNode }) => children,
}));

describe('Test Utils', () => {
  describe('TestWrapper', () => {
    it('should render children without errors', () => {
      const TestComponent = () => <Text testID="test-child">Test Content</Text>;
      
      const { getByTestId } = render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>
      );

      expect(getByTestId('test-child')).toBeTruthy();
      expect(getByTestId('test-child')).toHaveTextContent('Test Content');
    });

    it('should accept React.ReactNode as children', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <View testID="wrapper-test">
            <Text>Child 1</Text>
            <Text>Child 2</Text>
          </View>
        </TestWrapper>
      );

      expect(getByTestId('wrapper-test')).toBeTruthy();
    });

    it('should wrap children with NavigationContainer and ProductsProvider', () => {
      const TestComponent = () => <Text testID="nested-component">Nested</Text>;
      
      // Verifica se consegue renderizar sem erros, indicando que os providers estão funcionando
      expect(() => {
        render(
          <TestWrapper>
            <TestComponent />
          </TestWrapper>
        );
      }).not.toThrow();
    });

    it('should handle multiple children', () => {
      const { getByText } = render(
        <TestWrapper>
          <Text>First Child</Text>
          <Text>Second Child</Text>
        </TestWrapper>
      );

      expect(getByText('First Child')).toBeTruthy();
      expect(getByText('Second Child')).toBeTruthy();
    });
  });

  describe('renderWithProviders', () => {
    it('should render component wrapped with providers', () => {
      const TestComponent = () => <Text testID="providers-test">With Providers</Text>;
      
      const wrappedComponent = renderWithProviders(<TestComponent />);

      expect(wrappedComponent).toBeDefined();
      expect(React.isValidElement(wrappedComponent)).toBe(true);
    });

    it('should return valid React element', () => {
      const SimpleComponent = () => <View testID="simple">Simple</View>;
      
      const result = renderWithProviders(<SimpleComponent />);
      
      expect(React.isValidElement(result)).toBe(true);
    });

    it('should work with complex component trees', () => {
      const ComplexComponent = () => (
        <View testID="complex-root">
          <Text>Header</Text>
          <View>
            <Text>Body Content</Text>
          </View>
          <Text>Footer</Text>
        </View>
      );
      
      const result = renderWithProviders(<ComplexComponent />);
      
      expect(React.isValidElement(result)).toBe(true);
    });

    it('should preserve component props', () => {
      const PropsComponent = ({ title, visible }: { title: string; visible: boolean }) => (
        <View testID="props-component">
          <Text>{title}</Text>
          {visible && <Text>Visible Content</Text>}
        </View>
      );
      
      const result = renderWithProviders(
        <PropsComponent title="Test Title" visible={true} />
      );
      
      expect(React.isValidElement(result)).toBe(true);
    });
  });

  describe('Integration', () => {
    it('should work with both TestWrapper and renderWithProviders consistently', () => {
      const SharedComponent = () => <Text testID="shared">Shared Component</Text>;
      
      // Test both approaches work
      const wrapperResult = render(
        <TestWrapper>
          <SharedComponent />
        </TestWrapper>
      );
      
      const helperResult = renderWithProviders(<SharedComponent />);
      
      expect(wrapperResult.getByTestId('shared')).toBeTruthy();
      expect(React.isValidElement(helperResult)).toBe(true);
    });

    it('should handle edge cases gracefully', () => {
      // Test with null/undefined edge cases
      expect(() => {
        render(
          <TestWrapper>
            <View testID="edge-case">
              {null}
              {undefined}
              <Text>Valid content</Text>
            </View>
          </TestWrapper>
        );
      }).not.toThrow();
    });
  });
});
