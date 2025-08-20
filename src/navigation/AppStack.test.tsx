import { render } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import AppStackNavigator from './AppStack';

describe('AppStack', () => {
  it('renders without crashing', () => {
    expect(() => {
      render(
        <NavigationContainer>
          <AppStackNavigator />
        </NavigationContainer>
      );
    }).not.toThrow();
  });
});
