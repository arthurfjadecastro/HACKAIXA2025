import AsyncStorage from '@react-native-async-storage/async-storage';

// Hook para debugar o AsyncStorage
export const useDebugStorage = () => {
  const checkStorage = async () => {
    try {
      const products = await AsyncStorage.getItem('@caixa:products');
      console.log('📦 Produtos no AsyncStorage:', products ? JSON.parse(products) : 'Nenhum produto encontrado');
      return products ? JSON.parse(products) : null;
    } catch (error) {
      console.error('❌ Erro ao ler AsyncStorage:', error);
    }
  };

  const clearStorage = async () => {
    try {
      await AsyncStorage.removeItem('@caixa:products');
      console.log('🗑️ AsyncStorage limpo');
    } catch (error) {
      console.error('❌ Erro ao limpar AsyncStorage:', error);
    }
  };

  const getAllKeys = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      console.log('🔑 Todas as chaves no AsyncStorage:', keys);
      return keys;
    } catch (error) {
      console.error('❌ Erro ao obter chaves:', error);
    }
  };

  return {
    checkStorage,
    clearStorage,
    getAllKeys,
  };
};
