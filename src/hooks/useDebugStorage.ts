import AsyncStorage from '@react-native-async-storage/async-storage';

// Hook para debugar o AsyncStorage
export const useDebugStorage = () => {
  const checkStorage = async () => {
    try {
      const products = await AsyncStorage.getItem('@caixa:products');
      return products ? JSON.parse(products) : null;
    } catch (error) {
    }
  };

  const clearStorage = async () => {
    try {
      await AsyncStorage.removeItem('@caixa:products');
    } catch (error) {
    }
  };

  const getAllKeys = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      return keys;
    } catch (error) {
    }
  };

  return {
    checkStorage,
    clearStorage,
    getAllKeys,
  };
};
