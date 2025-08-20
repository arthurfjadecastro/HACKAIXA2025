import React from 'react';
import { render } from '@testing-library/react-native';
import EmptyState from './EmptyState';

describe('EmptyState', () => {
  it('renders correctly with title and subtitle', () => {
    const { getByText } = render(
      <EmptyState
        icon="add"
        title="No products found"
        subtitle="Add your first product to get started"
      />
    );
    
    expect(getByText('No products found')).toBeTruthy();
    expect(getByText('Add your first product to get started')).toBeTruthy();
  });

  it('renders without subtitle', () => {
    const { getByText, queryByText } = render(
      <EmptyState
        icon="add"
        title="No products found"
      />
    );
    
    expect(getByText('No products found')).toBeTruthy();
    expect(queryByText('Add your first product to get started')).toBeNull();
  });
});
