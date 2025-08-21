import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@caixa:products';

export const clearAllProducts = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
    console.log('✅ Todos os produtos foram removidos do storage');
    return true;
  } catch (error) {
    console.error('❌ Erro ao limpar storage:', error);
    return false;
  }
};

export const getAllStorageKeys = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    console.log('📦 Chaves no storage:', keys);
    return keys;
  } catch (error) {
    console.error('❌ Erro ao listar chaves:', error);
    return [];
  }
};

export const clearAllStorage = async () => {
  try {
    await AsyncStorage.clear();
    console.log('✅ Todo o storage foi limpo');
    return true;
  } catch (error) {
    console.error('❌ Erro ao limpar todo o storage:', error);
    return false;
  }
};
