import { renderWithNavigation } from '@/utils/test-utils';
import HomeScreen from './HomeScreen';

describe('HomeScreen', () => {
  it('renders successfully', () => {
    const { toJSON } = renderWithNavigation(<HomeScreen />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders without crashing', () => {
    expect(() => {
      renderWithNavigation(<HomeScreen />);
    }).not.toThrow();
  });
});
