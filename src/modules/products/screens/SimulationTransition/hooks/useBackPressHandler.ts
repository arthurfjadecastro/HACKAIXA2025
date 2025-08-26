import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { SimulationState, NavigationProps } from '../types';

interface UseBackPressHandlerProps {
  state: SimulationState;
}

export const useBackPressHandler = ({ state }: UseBackPressHandlerProps) => {
  const navigation = useNavigation<NavigationProps>();

  // Interceptar botão voltar durante loading
  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      if (state === 'loading') {
        e.preventDefault();
        console.log('🚫 Navegação bloqueada durante simulação');
      }
    });

    return unsubscribe;
  }, [navigation, state]);

  // Configurar botão voltar no header
  useEffect(() => {
    const canGoBack = state !== 'loading';
    
    navigation.setOptions({
      gestureEnabled: canGoBack,
    });
  }, [navigation, state]);
};
