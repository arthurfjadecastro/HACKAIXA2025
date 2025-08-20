import { renderWithNavigation } from '@/navigation/test-utils';
import ProductList from './ProductList';

describe('ProductList', () => {
  it('renders screen components', () => {
    const { getByText } = renderWithNavigation(<ProductList />);
    
    expect(getByText('Olá, Arthur de Castro')).toBeTruthy();
    expect(getByText('Cliente Singular')).toBeTruthy();
    expect(getByText('Você ainda não tem produtos cadastrados. Cadastre o primeiro e comece a simular agora.')).toBeTruthy();
    expect(getByText('Cadastrar produto')).toBeTruthy();
  });
});
