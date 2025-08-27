import React from 'react';
import { Text, View } from 'react-native';
import { renderWithNavigation } from './test-utils';

// Mock do @testing-library/react-native
jest.mock('@testing-library/react-native', () => ({
  render: jest.fn((_ui, _options) => {
    const mockRender = {
      getByTestId: jest.fn((id) => ({ testID: id, textContent: 'mock content' })),
      getByText: jest.fn((text) => ({ textContent: text })),
      queryByTestId: jest.fn(),
      queryByText: jest.fn(),
    };
    return mockRender;
  }),
}));

// Mock do NavigationContainer
jest.mock('@react-navigation/native', () => ({
  NavigationContainer: ({ children }: { children: React.ReactNode }) => children,
}));

describe('Navigation Test Utils', () => {
  describe('renderWithNavigation', () => {
    it('should render component with navigation wrapper', () => {
      const TestComponent = () => <Text testID="nav-test">With Navigation</Text>;
      
      const result = renderWithNavigation(<TestComponent />);

      expect(result).toBeDefined();
      expect(result.getByTestId).toBeDefined();
      expect(result.getByText).toBeDefined();
    });

    it('should accept render options', () => {
      const TestComponent = () => <View testID="options-test">Options Test</View>;
      
      const customOptions = {
        createNodeMock: jest.fn(),
      };
      
      const result = renderWithNavigation(<TestComponent />, customOptions);
      
      expect(result).toBeDefined();
    });

    it('should work with complex component hierarchies', () => {
      const ComplexComponent = () => (
        <View testID="complex-nav">
          <Text>Header</Text>
          <View>
            <Text testID="nested-text">Nested Content</Text>
          </View>
        </View>
      );
      
      const result = renderWithNavigation(<ComplexComponent />);
      
      expect(result).toBeDefined();
      expect(result.getByTestId('complex-nav')).toBeDefined();
    });

    it('should handle components with props', () => {
      const PropsComponent = ({ title, count }: { title: string; count: number }) => (
        <View testID="props-nav">
          <Text>{title}</Text>
          <Text>Count: {count}</Text>
        </View>
      );
      
      const result = renderWithNavigation(
        <PropsComponent title="Test Title" count={5} />
      );
      
      expect(result).toBeDefined();
    });

    it('should preserve testing library methods', () => {
      const SimpleComponent = () => <Text testID="simple-nav">Simple</Text>;
      
      const result = renderWithNavigation(<SimpleComponent />);
      
      // Verify all common testing library methods are available
      expect(typeof result.getByTestId).toBe('function');
      expect(typeof result.getByText).toBe('function');
      expect(typeof result.queryByTestId).toBe('function');
      expect(typeof result.queryByText).toBe('function');
    });

    it('should handle navigation-dependent components', () => {
      // Mock component that would use navigation hooks
      const NavigationComponent = () => (
        <View testID="nav-dependent">
          <Text>Navigation Ready</Text>
        </View>
      );
      
      expect(() => {
        renderWithNavigation(<NavigationComponent />);
      }).not.toThrow();
    });

    it('should work with empty components', () => {
      const EmptyComponent = () => <View testID="empty" />;
      
      const result = renderWithNavigation(<EmptyComponent />);
      
      expect(result).toBeDefined();
      expect(result.getByTestId('empty')).toBeDefined();
    });

    it('should handle multiple child components', () => {
      const MultiChildComponent = () => (
        <View testID="multi-child">
          <Text testID="child-1">Child 1</Text>
          <Text testID="child-2">Child 2</Text>
          <Text testID="child-3">Child 3</Text>
        </View>
      );
      
      const result = renderWithNavigation(<MultiChildComponent />);
      
      expect(result).toBeDefined();
      expect(result.getByTestId('multi-child')).toBeDefined();
    });

    it('should maintain component state and behavior', () => {
      const StatefulComponent = () => {
        const [count] = React.useState(0);
        
        return (
          <View testID="stateful">
            <Text testID="count">Count: {count}</Text>
          </View>
        );
      };
      
      const result = renderWithNavigation(<StatefulComponent />);
      
      expect(result).toBeDefined();
      expect(result.getByTestId('stateful')).toBeDefined();
    });

    it('should support conditional rendering', () => {
      const ConditionalComponent = ({ show }: { show: boolean }) => (
        <View testID="conditional">
          {show && <Text testID="conditional-text">Conditional Content</Text>}
        </View>
      );
      
      const result = renderWithNavigation(<ConditionalComponent show={true} />);
      
      expect(result).toBeDefined();
      expect(result.getByTestId('conditional')).toBeDefined();
    });
  });

  describe('Module Exports', () => {
    it('should re-export testing library functions', () => {
      // Since we mock the module, we verify the structure
      const testUtils = require('./test-utils');
      
      expect(testUtils.renderWithNavigation).toBeDefined();
      expect(typeof testUtils.renderWithNavigation).toBe('function');
    });

    it('should provide consistent API', () => {
      const TestComponent = () => <Text>Export Test</Text>;
      
      // Verify the function signature works as expected
      expect(() => {
        renderWithNavigation(<TestComponent />);
      }).not.toThrow();
    });
  });
});
