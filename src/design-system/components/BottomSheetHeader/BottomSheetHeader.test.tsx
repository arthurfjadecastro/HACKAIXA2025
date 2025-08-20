import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import BottomSheetHeader from './BottomSheetHeader';

describe('BottomSheetHeader', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
  });

  it('renders successfully with title', () => {
    const { getByText } = render(
      <BottomSheetHeader 
        title="Test Title" 
        onClose={mockOnClose} 
      />
    );
    
    expect(getByText('Test Title')).toBeTruthy();
  });

  it('renders with icon', () => {
    const { getByText } = render(
      <BottomSheetHeader 
        title="Test Title" 
        icon="login"
        onClose={mockOnClose} 
      />
    );
    
    expect(getByText('Test Title')).toBeTruthy();
  });

  it('calls onClose when close button is pressed', () => {
    const { getByLabelText } = render(
      <BottomSheetHeader 
        title="Test Title" 
        onClose={mockOnClose} 
      />
    );
    
    const closeButton = getByLabelText('Fechar');
    fireEvent.press(closeButton);
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('hides close button when showCloseButton is false', () => {
    const { queryByLabelText } = render(
      <BottomSheetHeader 
        title="Test Title" 
        onClose={mockOnClose} 
        showCloseButton={false}
      />
    );
    
    expect(queryByLabelText('Fechar')).toBeNull();
  });

  it('renders without crashing', () => {
    expect(() => {
      render(
        <BottomSheetHeader 
          title="Test Title" 
          onClose={mockOnClose} 
        />
      );
    }).not.toThrow();
  });
});
