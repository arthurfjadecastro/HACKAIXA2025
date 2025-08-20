import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';

import ActionCard from './ActionCard';

describe('ActionCard', () => {
  const mockOnPress = jest.fn();

  beforeEach(() => {
    mockOnPress.mockClear();
  });

  it('renders correctly with icon and title', () => {
    const { getByText, getByTestId } = render(
      <ActionCard
        icon="login"
        title="Entrar"
        onPress={mockOnPress}
        testID="action-card"
      />
    );

    expect(getByText('Entrar')).toBeTruthy();
    expect(getByTestId('action-card')).toBeTruthy();
  });

  it('calls onPress when touched', () => {
    const { getByTestId } = render(
      <ActionCard
        icon="login"
        title="Entrar"
        onPress={mockOnPress}
        testID="action-card"
      />
    );

    fireEvent.press(getByTestId('action-card'));
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('has accessibility properties', () => {
    const { getByTestId } = render(
      <ActionCard
        icon="account-circle"
        title="Abrir conta"
        onPress={mockOnPress}
        testID="action-card"
      />
    );

    const card = getByTestId('action-card');
    expect(card.props.accessibilityRole).toBe('button');
  });
});
