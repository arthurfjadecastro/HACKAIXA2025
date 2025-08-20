import { render } from '@testing-library/react-native';
import ProductList from './ProductList';

describe('ProductList', () => {
  it('renders screen title', () => {
    const { getByText } = render(<ProductList />);
    expect(getByText('Listar Produtos')).toBeTruthy();
  });
});
