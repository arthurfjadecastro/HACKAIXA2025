import React from 'react';
import { render } from '@testing-library/react-native';
import { Text } from 'react-native';
import { Card } from './Card';

describe('Card', () => {
  it('renders with children', () => {
    const { getByText } = render(
      <Card>
        <Text>Test content</Text>
      </Card>
    );
    expect(getByText('Test content')).toBeTruthy();
  });

  it('renders with different variants', () => {
    expect(() => {
      render(<Card variant="default"><Text>Content</Text></Card>);
      render(<Card variant="elevated"><Text>Content</Text></Card>);
      render(<Card variant="outlined"><Text>Content</Text></Card>);
    }).not.toThrow();
  });

  it('renders with different padding', () => {
    expect(() => {
      render(<Card padding="sm"><Text>Content</Text></Card>);
      render(<Card padding="md"><Text>Content</Text></Card>);
      render(<Card padding="lg"><Text>Content</Text></Card>);
    }).not.toThrow();
  });
});
