import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product, CreateProductRequest } from './productTypes';
import productsData from './products.json';

const STORAGE_KEY = '@caixa:products';

export const productService = {
  // Utilitário para carregar produtos do storage
  async getStoredProducts(): Promise<Product[]> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : productsData;
    } catch {
      return productsData;
    }
  },

  // Utilitário para salvar produtos no storage
  async saveProducts(products: Product[]): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  },

  // CREATE - Criar novo produto
  async createProduct(data: CreateProductRequest): Promise<Product> {
    // Simula delay de rede
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Validação básica
    if (!data.name.trim()) {
      throw new Error('Nome do produto é obrigatório');
    }
    if (data.juros <= 0 || data.juros > 100) {
      throw new Error('Taxa de juros deve estar entre 0 e 100');
    }
    if (data.prazoMaximo <= 0) {
      throw new Error('Prazo máximo deve ser maior que 0');
    }
    if (!data.normativo.trim()) {
      throw new Error('Normativo é obrigatório');
    }

    const products = await this.getStoredProducts();
    
    // Verifica se já existe produto com mesmo nome
    const existingProduct = products.find(p => 
      p.name.toLowerCase() === data.name.toLowerCase()
    );
    
    if (existingProduct) {
      throw new Error('Já existe um produto com este nome');
    }
    
    const newProduct: Product = {
      id: Date.now().toString(),
      name: data.name.trim(),
      juros: Number(data.juros),
      prazoMaximo: Number(data.prazoMaximo),
      normativo: data.normativo.trim(),
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    const updatedProducts = [...products, newProduct];
    await this.saveProducts(updatedProducts);
    
    return newProduct;
  },

  async updateProduct(id: string, updatedData: Partial<Omit<Product, 'id' | 'createdAt'>>): Promise<Product> {
    // Simular delay da API
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const products = await this.getStoredProducts();
    const productIndex = products.findIndex(p => p.id === id);
    
    if (productIndex === -1) {
      throw new Error('Produto não encontrado');
    }
    
    const currentProduct = products[productIndex];
    if (!currentProduct) {
      throw new Error('Produto não encontrado');
    }
    const updatedProduct: Product = {
      id: currentProduct.id,
      name: updatedData.name ?? currentProduct.name,
      juros: updatedData.juros ?? currentProduct.juros,
      prazoMaximo: updatedData.prazoMaximo ?? currentProduct.prazoMaximo,
      normativo: updatedData.normativo ?? currentProduct.normativo,
      active: updatedData.active ?? currentProduct.active,
      createdAt: currentProduct.createdAt,
      updatedAt: new Date().toISOString(),
    };
    
    products[productIndex] = updatedProduct;
    await this.saveProducts(products);
    
    return updatedProduct;
  },

  async deleteProduct(id: string): Promise<void> {
    // Simular delay da API
    await new Promise(resolve => setTimeout(resolve, 500));
    const products = await this.getStoredProducts();
    const updated = products.filter(p => p.id !== id);
    await this.saveProducts(updated);
  },
};
