import { renderWithNavigation, fireEvent } from '@/utils/test-utils';
import HomeScreen from './HomeScreen';

describe('HomeScreen', () => {
  it('renders main title', () => {
    const { getByText } = renderWithNavigation(<HomeScreen />);
    expect(getByText('C150713 CAIXA')).toBeTruthy();
  });

  it('renders subtitle', () => {
    const { getByText } = renderWithNavigation(<HomeScreen />);
    expect(getByText('Sistema de Empréstimos')).toBeTruthy();
  });

  it('renders all menu buttons', () => {
    const { getByText } = renderWithNavigation(<HomeScreen />);
    expect(getByText('Register Products')).toBeTruthy();
    expect(getByText('Listar Produtos')).toBeTruthy();
    expect(getByText('Simular')).toBeTruthy();
  });

  it('handles button presses without crashing', () => {
    const { getByText } = renderWithNavigation(<HomeScreen />);
    
    // Test clicking buttons doesn't crash
    expect(() => {
      fireEvent.press(getByText('Register Products'));
      fireEvent.press(getByText('Listar Produtos'));
      fireEvent.press(getByText('Simular'));
    }).not.toThrow();
  });
});
