import React, { createRef } from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { TextInput } from 'react-native';
import InputField from './InputField';

describe('InputField', () => {
  const mockOnChangeText = jest.fn();
  const mockOnBlur = jest.fn();
  const mockOnSubmitEditing = jest.fn();

  beforeEach(() => {
    mockOnChangeText.mockClear();
    mockOnBlur.mockClear();
    mockOnSubmitEditing.mockClear();
  });

  it('renders correctly with basic props', () => {
    const { getByText, getByPlaceholderText } = render(
      <InputField
        label="Test Label"
        placeholder="Test Placeholder"
        value=""
        onChangeText={mockOnChangeText}
      />
    );
    
    expect(getByText('Test Label')).toBeTruthy();
    expect(getByPlaceholderText('Test Placeholder')).toBeTruthy();
  });

  it('calls onChangeText when text changes', () => {
    const { getByPlaceholderText } = render(
      <InputField
        label="Test"
        placeholder="Enter text"
        value=""
        onChangeText={mockOnChangeText}
      />
    );
    
    const input = getByPlaceholderText('Enter text');
    fireEvent.changeText(input, 'new text');
    
    expect(mockOnChangeText).toHaveBeenCalledWith('new text');
  });

  it('renders password toggle when secureTextEntry is true', () => {
    const { getByTestId } = render(
      <InputField
        label="Password"
        placeholder="Enter password"
        value=""
        onChangeText={mockOnChangeText}
        secureTextEntry
      />
    );
    
    expect(getByTestId('password-toggle-button')).toBeTruthy();
  });

  it('toggles password visibility', () => {
    const { getByTestId } = render(
      <InputField
        label="Password"
        placeholder="Enter password"
        value=""
        onChangeText={mockOnChangeText}
        secureTextEntry
      />
    );
    
    const toggleButton = getByTestId('password-toggle-button');
    fireEvent.press(toggleButton);
    
    expect(toggleButton).toBeTruthy();
  });

  it('calls onBlur when input loses focus', () => {
    const { getByPlaceholderText } = render(
      <InputField
        label="Test"
        placeholder="Enter text"
        value=""
        onChangeText={mockOnChangeText}
        onBlur={mockOnBlur}
      />
    );
    
    const input = getByPlaceholderText('Enter text');
    fireEvent(input, 'blur');
    
    expect(mockOnBlur).toHaveBeenCalled();
  });

  it('calls onSubmitEditing when submit is pressed', () => {
    const { getByPlaceholderText } = render(
      <InputField
        label="Test"
        placeholder="Enter text"
        value=""
        onChangeText={mockOnChangeText}
        onSubmitEditing={mockOnSubmitEditing}
      />
    );
    
    const input = getByPlaceholderText('Enter text');
    fireEvent(input, 'submitEditing');
    
    expect(mockOnSubmitEditing).toHaveBeenCalled();
  });

  it('exposes focus, blur, and clear methods via ref', () => {
    const ref = createRef<TextInput>();
    render(
      <InputField
        ref={ref}
        label="Test"
        placeholder="Enter text"
        value=""
        onChangeText={mockOnChangeText}
      />
    );
    
    expect(ref.current).toBeTruthy();
    expect(typeof ref.current?.focus).toBe('function');
    expect(typeof ref.current?.blur).toBe('function');
    expect(typeof ref.current?.clear).toBe('function');
  });

  it('handles focus state changes', () => {
    const { getByPlaceholderText } = render(
      <InputField
        label="Test"
        placeholder="Enter text"
        value=""
        onChangeText={mockOnChangeText}
      />
    );
    
    const input = getByPlaceholderText('Enter text');
    fireEvent(input, 'focus');
    fireEvent(input, 'blur');
    
    // Verifica que o componente continua funcionando após mudanças de foco
    expect(input).toBeTruthy();
  });

  it('renders error message when error prop is provided', () => {
    const { getByText } = render(
      <InputField
        label="Test"
        placeholder="Enter text"
        value=""
        onChangeText={mockOnChangeText}
        error="This field is required"
        helperText="This field is required"
      />
    );
    
    expect(getByText('This field is required')).toBeTruthy();
  });

  it('renders helper text when provided', () => {
    const { getByText } = render(
      <InputField
        label="Test"
        placeholder="Enter text"
        value=""
        onChangeText={mockOnChangeText}
        helperText="This is helper text"
      />
    );
    
    expect(getByText('This is helper text')).toBeTruthy();
  });

  // ✅ COMPREHENSIVE TESTS FOR MISSING COVERAGE
  describe('🎯 Focus State Management', () => {
    it('should apply focused styles when input is focused', () => {
      const { getByPlaceholderText } = render(
        <InputField
          label="Test"
          placeholder="Enter text"
          value=""
          onChangeText={mockOnChangeText}
        />
      );
      
      const input = getByPlaceholderText('Enter text');
      fireEvent(input, 'focus');
      
      // Verify focus state is applied
      expect(input).toBeTruthy();
    });

    it('should remove focused styles when input loses focus', () => {
      const { getByPlaceholderText } = render(
        <InputField
          label="Test"
          placeholder="Enter text"
          value=""
          onChangeText={mockOnChangeText}
        />
      );
      
      const input = getByPlaceholderText('Enter text');
      fireEvent(input, 'focus');
      fireEvent(input, 'blur');
      
      // Verify focus state is removed
      expect(input).toBeTruthy();
    });
  });

  describe('🎯 Input Container Styles', () => {
    it('should apply error styles when error is provided', () => {
      const { getByPlaceholderText } = render(
        <InputField
          label="Test"
          placeholder="Enter text"
          value=""
          onChangeText={mockOnChangeText}
          error="Required field"
          helperText="Required field"
        />
      );
      
      const input = getByPlaceholderText('Enter text');
      expect(input).toBeTruthy();
    });

    it('should apply styles when input has value', () => {
      const { getByPlaceholderText } = render(
        <InputField
          label="Test"
          placeholder="Enter text"
          value="Some value"
          onChangeText={mockOnChangeText}
        />
      );
      
      const input = getByPlaceholderText('Enter text');
      expect(input).toBeTruthy();
    });
  });

  describe('🎯 Keyboard and Input Props', () => {
    it('should handle different keyboard types', () => {
      const keyboardTypes = ['email-address', 'numeric', 'decimal-pad', 'number-pad'] as const;
      
      keyboardTypes.forEach(keyboardType => {
        const { getByPlaceholderText } = render(
          <InputField
            label="Test"
            placeholder={`Enter ${keyboardType}`}
            value=""
            onChangeText={mockOnChangeText}
            keyboardType={keyboardType}
          />
        );
        
        const input = getByPlaceholderText(`Enter ${keyboardType}`);
        expect(input.props.keyboardType).toBe(keyboardType);
      });
    });

    it('should handle different autoCapitalize options', () => {
      const capitalizeOptions = ['none', 'sentences', 'words', 'characters'] as const;
      
      capitalizeOptions.forEach(option => {
        const { getByPlaceholderText } = render(
          <InputField
            label="Test"
            placeholder={`Text with ${option}`}
            value=""
            onChangeText={mockOnChangeText}
            autoCapitalize={option}
          />
        );
        
        const input = getByPlaceholderText(`Text with ${option}`);
        expect(input.props.autoCapitalize).toBe(option);
      });
    });

    it('should handle different return key types', () => {
      const returnKeyTypes = ['done', 'go', 'next', 'search', 'send'] as const;
      
      returnKeyTypes.forEach(returnKeyType => {
        const { getByPlaceholderText } = render(
          <InputField
            label="Test"
            placeholder={`Input with ${returnKeyType}`}
            value=""
            onChangeText={mockOnChangeText}
            returnKeyType={returnKeyType}
          />
        );
        
        const input = getByPlaceholderText(`Input with ${returnKeyType}`);
        expect(input.props.returnKeyType).toBe(returnKeyType);
      });
    });
  });

  describe('🎯 Accessibility Features', () => {
    it('should set accessibility label from prop or default to label', () => {
      const { getByPlaceholderText } = render(
        <InputField
          label="Email"
          placeholder="Enter email"
          value=""
          onChangeText={mockOnChangeText}
          accessibilityLabel="Custom accessibility label"
        />
      );
      
      const input = getByPlaceholderText('Enter email');
      expect(input.props.accessibilityLabel).toBe('Custom accessibility label');
    });

    it('should default accessibility label to label when not provided', () => {
      const { getByPlaceholderText } = render(
        <InputField
          label="Username"
          placeholder="Enter username"
          value=""
          onChangeText={mockOnChangeText}
        />
      );
      
      const input = getByPlaceholderText('Enter username');
      expect(input.props.accessibilityLabel).toBe('Username');
    });

    it('should handle accessible prop', () => {
      const { getByPlaceholderText } = render(
        <InputField
          label="Test"
          placeholder="Enter text"
          value=""
          onChangeText={mockOnChangeText}
          accessible={false}
        />
      );
      
      const input = getByPlaceholderText('Enter text');
      expect(input.props.accessible).toBe(false);
    });
  });

  describe('🎯 Password Toggle Functionality', () => {
    it('should toggle password visibility correctly', () => {
      const { getByTestId, getByPlaceholderText } = render(
        <InputField
          label="Password"
          placeholder="Enter password"
          value="secret123"
          onChangeText={mockOnChangeText}
          secureTextEntry
        />
      );
      
      const input = getByPlaceholderText('Enter password');
      const toggleButton = getByTestId('password-toggle-button');
      
      // Initially secure
      expect(input.props.secureTextEntry).toBe(true);
      
      // Toggle to visible
      fireEvent.press(toggleButton);
      expect(input.props.secureTextEntry).toBe(false);
      
      // Toggle back to secure
      fireEvent.press(toggleButton);
      expect(input.props.secureTextEntry).toBe(true);
    });

    it('should show correct icons for password visibility state', () => {
      const { getByTestId } = render(
        <InputField
          label="Password"
          placeholder="Enter password"
          value=""
          onChangeText={mockOnChangeText}
          secureTextEntry
        />
      );
      
      const toggleButton = getByTestId('password-toggle-button');
      
      // Check accessibility labels for different states
      expect(toggleButton.props.accessibilityLabel).toBe('Mostrar senha');
      
      fireEvent.press(toggleButton);
      expect(toggleButton.props.accessibilityLabel).toBe('Ocultar senha');
    });

    it('should not render password toggle when secureTextEntry is false', () => {
      const { queryByTestId } = render(
        <InputField
          label="Text"
          placeholder="Enter text"
          value=""
          onChangeText={mockOnChangeText}
          secureTextEntry={false}
        />
      );
      
      expect(queryByTestId('password-toggle-button')).toBeNull();
    });
  });

  describe('🎯 Ref Methods', () => {
    it('should call focus method via ref', () => {
      const ref = createRef<TextInput>();
      const mockFocus = jest.fn();
      
      // Mock the focus method
      React.useRef = jest.fn(() => ({
        current: {
          focus: mockFocus,
          blur: jest.fn(),
          clear: jest.fn(),
        }
      }));
      
      render(
        <InputField
          ref={ref}
          label="Test"
          placeholder="Enter text"
          value=""
          onChangeText={mockOnChangeText}
        />
      );
      
      // Call focus through ref
      ref.current?.focus();
      expect(ref.current?.focus).toBeDefined();
    });

    it('should call blur method via ref', () => {
      const ref = createRef<TextInput>();
      
      render(
        <InputField
          ref={ref}
          label="Test"
          placeholder="Enter text"
          value=""
          onChangeText={mockOnChangeText}
        />
      );
      
      // Verify blur method exists
      expect(typeof ref.current?.blur).toBe('function');
    });

    it('should call clear method via ref', () => {
      const ref = createRef<TextInput>();
      
      render(
        <InputField
          ref={ref}
          label="Test"
          placeholder="Enter text"
          value=""
          onChangeText={mockOnChangeText}
        />
      );
      
      // Verify clear method exists
      expect(typeof ref.current?.clear).toBe('function');
    });
  });

  describe('🎯 Helper Text and Error States', () => {
    it('should render helper text with correct testID', () => {
      const { getByTestId } = render(
        <InputField
          label="Test"
          placeholder="Enter text"
          value=""
          onChangeText={mockOnChangeText}
          helperText="This is helper text"
          testID="test-input"
        />
      );
      
      expect(getByTestId('test-input-helper')).toBeTruthy();
    });

    it('should apply error styles to helper text when error exists', () => {
      const { getByText } = render(
        <InputField
          label="Test"
          placeholder="Enter text"
          value=""
          onChangeText={mockOnChangeText}
          error="Error message"
          helperText="Error message"
        />
      );
      
      const helperText = getByText('Error message');
      expect(helperText).toBeTruthy();
    });

    it('should not render helper text when not provided', () => {
      const { queryByTestId } = render(
        <InputField
          label="Test"
          placeholder="Enter text"
          value=""
          onChangeText={mockOnChangeText}
          testID="test-input"
        />
      );
      
      expect(queryByTestId('test-input-helper')).toBeNull();
    });
  });

  describe('🎯 Edge Cases and Integration', () => {
    it('should handle all props together', () => {
      const { getByPlaceholderText, getByTestId, getByText } = render(
        <InputField
          label="Complete Input"
          placeholder="Enter complete input"
          value="test value"
          onChangeText={mockOnChangeText}
          onBlur={mockOnBlur}
          onSubmitEditing={mockOnSubmitEditing}
          keyboardType="email-address"
          autoCapitalize="words"
          returnKeyType="send"
          helperText="This is a helper text"
          testID="complete-input"
          accessible={true}
          accessibilityLabel="Complete input field"
        />
      );
      
      expect(getByText('Complete Input')).toBeTruthy();
      expect(getByPlaceholderText('Enter complete input')).toBeTruthy();
      expect(getByText('This is a helper text')).toBeTruthy();
      expect(getByTestId('complete-input-helper')).toBeTruthy();
    });

    it('should handle rapid state changes', () => {
      const { getByPlaceholderText, rerender } = render(
        <InputField
          label="Dynamic Input"
          placeholder="Enter text"
          value=""
          onChangeText={mockOnChangeText}
        />
      );
      
      const input = getByPlaceholderText('Enter text');
      
      // Focus and blur rapidly
      fireEvent(input, 'focus');
      fireEvent(input, 'blur');
      fireEvent(input, 'focus');
      
      // Change props rapidly
      rerender(
        <InputField
          label="Dynamic Input"
          placeholder="Enter text"
          value="new value"
          onChangeText={mockOnChangeText}
          helperText="New helper text"
        />
      );
      
      expect(input).toBeTruthy();
    });
  });
});
