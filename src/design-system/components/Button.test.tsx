import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from './Button';

describe('Button', () => {
  it('renders with title', () => {
    const { getByText } = render(
      <Button title="Test Button" onPress={() => {}} />
    );
    
    expect(getByText('Test Button')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const mockOnPress = jest.fn();
    const { getByText } = render(
      <Button title="Pressable Button" onPress={mockOnPress} />
    );
    
    fireEvent.press(getByText('Pressable Button'));
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('renders without crashing', () => {
    expect(() => 
      render(<Button title="Simple Button" onPress={() => {}} />)
    ).not.toThrow();
  });
});
