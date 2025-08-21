import { renderWithNavigation } from '@/navigation/test-utils';
import { fireEvent } from '@testing-library/react-native';
import ProductList from './ProductList';

const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

describe('ProductList', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('renders screen components', () => {
    const { getByText } = renderWithNavigation(<ProductList />);
    
    expect(getByText('Olá, Arthur de Castro')).toBeTruthy();
    expect(getByText('Cliente Singular')).toBeTruthy();
    expect(getByText('Você ainda não tem produtos cadastrados. Cadastre o primeiro e comece a simular agora.')).toBeTruthy();
    expect(getByText('Cadastrar produto')).toBeTruthy();
  });

  it('navigates to RegisterProducts when button is pressed', () => {
    const { getByText } = renderWithNavigation(<ProductList />);
    
    const button = getByText('Cadastrar produto');
    fireEvent.press(button);
    
    expect(mockNavigate).toHaveBeenCalledWith('RegisterProducts');
  });

  it('renders WelcomeBanner with correct props', () => {
    const { getByText } = renderWithNavigation(<ProductList />);
    
    expect(getByText('Olá, Arthur de Castro')).toBeTruthy();
    expect(getByText('Cliente Singular')).toBeTruthy();
  });

  it('renders EmptyState with correct content', () => {
    const { getByText } = renderWithNavigation(<ProductList />);
    
    expect(getByText('Você ainda não tem produtos cadastrados. Cadastre o primeiro e comece a simular agora.')).toBeTruthy();
    expect(getByText('É rápido e leva menos de 1 minuto.')).toBeTruthy();
  });
});
