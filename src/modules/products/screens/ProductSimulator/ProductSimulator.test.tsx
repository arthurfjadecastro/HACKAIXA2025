import { render } from '@testing-library/react-native';
import ProductSimulator from './ProductSimulator';

describe('ProductSimulator', () => {
  it('renders screen title', () => {
    const { getByText } = render(<ProductSimulator />);
    expect(getByText('Simular')).toBeTruthy();
  });
});
