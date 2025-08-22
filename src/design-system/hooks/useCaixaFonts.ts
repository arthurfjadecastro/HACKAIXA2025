import { useFonts } from 'expo-font';

/**
 * Hook para carregar as fontes da CAIXA
 * 
 * @returns {boolean} fontsLoaded - se as fontes foram carregadas
 * @returns {Error | null} error - erro no carregamento
 * 
 * @example
 * ```tsx
 * function App() {
 *   const [fontsLoaded, fontError] = useCaixaFonts();
 * 
 *   if (!fontsLoaded && !fontError) {
 *     return <AppLoading />;
 *   }
 * 
 *   return <YourApp />;
 * }
 * ```
 */
export const useCaixaFonts = () => {
  return useFonts({
    'CAIXAStd-Regular': require('../../../assets/fonts/caixa/CAIXAStd-Regular.ttf'),
    'CAIXAStd-SemiBold': require('../../../assets/fonts/caixa/CAIXAStd-SemiBold.ttf'),
  });
};

export default useCaixaFonts;
