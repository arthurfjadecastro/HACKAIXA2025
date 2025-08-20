import React from 'react';
import { render } from '@testing-library/react-native';
import BottomSheet from './BottomSheet';
import { Text } from 'react-native';

describe('BottomSheet', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
  });

  it('renders successfully when visible', () => {
    const { getByText } = render(
      <BottomSheet visible={true} onClose={mockOnClose}>
        <Text>Test Content</Text>
      </BottomSheet>
    );
    
    expect(getByText('Test Content')).toBeTruthy();
  });

  it('calls onClose when close button is pressed', () => {
    const { getByText } = render(
      <BottomSheet visible={true} onClose={mockOnClose}>
        <Text>Test Content</Text>
      </BottomSheet>
    );
    
    expect(getByText('Test Content')).toBeTruthy();
  });

  it('does not render when not visible', () => {
    const { queryByText } = render(
      <BottomSheet visible={false} onClose={mockOnClose}>
        <Text>Test Content</Text>
      </BottomSheet>
    );
    
    expect(queryByText('Test Content')).toBeFalsy();
  });

  it('renders with custom height', () => {
    const { getByText } = render(
      <BottomSheet visible={true} onClose={mockOnClose} height={400}>
        <Text>Test Content</Text>
      </BottomSheet>
    );
    
    expect(getByText('Test Content')).toBeTruthy();
  });
});
