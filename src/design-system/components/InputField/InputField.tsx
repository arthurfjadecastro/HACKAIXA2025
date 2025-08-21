import React, { useState, forwardRef, useImperativeHandle, useRef } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
} from 'react-native';

import { Icon } from '@/design-system/icons/Icon';
import { colors, spacing } from '@/design-system/tokens';

interface InputFieldProps {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  onBlur?: () => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'decimal-pad' | 'number-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  error?: string | undefined;
  helperText?: string;
  testID?: string;
  accessible?: boolean;
  accessibilityLabel?: string;
  returnKeyType?: 'done' | 'go' | 'next' | 'search' | 'send';
  onSubmitEditing?: () => void;
}

const InputField = forwardRef<TextInput, InputFieldProps>(({
  label,
  placeholder,
  value,
  onChangeText,
  onBlur,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  error,
  helperText,
  testID,
  accessible = true,
  accessibilityLabel,
  returnKeyType = 'done',
  onSubmitEditing,
}, ref) => {
  const [isSecureTextVisible, setIsSecureTextVisible] = useState(secureTextEntry);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);

  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current?.focus(),
    blur: () => inputRef.current?.blur(),
    clear: () => inputRef.current?.clear(),
  } as TextInput));

  const toggleSecureText = () => {
    setIsSecureTextVisible(!isSecureTextVisible);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
    onBlur?.();
  };

  const hasError = !!error;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={[
        styles.inputContainer,
        isFocused && styles.inputContainerFocused,
        value.length > 0 && styles.inputContainerWithValue,
        hasError && styles.inputContainerError,
      ]}>
        <TextInput
          ref={inputRef}
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={colors.component.placeholder}
          value={value}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          secureTextEntry={isSecureTextVisible}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
          testID={testID}
          accessible={accessible}
          accessibilityLabel={accessibilityLabel || label}
        />
        {secureTextEntry && (
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={toggleSecureText}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityLabel={isSecureTextVisible ? "Mostrar senha" : "Ocultar senha"}
            accessibilityRole="button"
            testID="password-toggle-button"
          >
            <Icon
              name={isSecureTextVisible ? 'visibility-off' : 'visibility'}
              size={20}
              color={colors.primary.main} // Azul #005CA9
            />
          </TouchableOpacity>
        )}
      </View>
      {/* Helper Text ou Error */}
      {helperText && (
        <Text 
          style={[
            styles.helperText,
            hasError && styles.errorText
          ]}
          testID={`${testID}-helper`}
          accessibilityRole="text"
        >
          {helperText}
        </Text>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing[2], // Reduzir para spacing[2] (8px) - espaçamento mínimo
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing[2],
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border.medium,
    borderRadius: 8,
    backgroundColor: colors.background.secondary,
    paddingHorizontal: 16,
    height: 48,
  },
  inputContainerFocused: {
    borderColor: colors.primary.main,
    borderWidth: 2,
  },
  inputContainerWithValue: {
    borderColor: colors.primary.light,
  },
  inputContainerError: {
    borderColor: colors.status.error,
    borderWidth: 2,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.text.primary,
    paddingVertical: 0,
  },
  eyeButton: {
    padding: 4,
    marginLeft: 8,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
  },
  helperText: {
    fontSize: 14,
    color: colors.text.secondary,
    marginTop: spacing[1],
    lineHeight: 20,
  },
  errorText: {
    color: colors.status.error,
  },
});

export default InputField;
