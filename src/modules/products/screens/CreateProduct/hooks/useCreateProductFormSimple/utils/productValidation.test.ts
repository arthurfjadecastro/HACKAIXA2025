import { isConvenioAlreadyRegistered, isHabitacaoAlreadyRegistered } from './productValidation';
import { Product } from '@/services/products/types';

describe('productValidation', () => {
  const mockProducts: Product[] = [
    {
      id: '1',
      name: 'CONSIGNADO - INSS - Aposentados',
      juros: 1.5,
      prazoMaximo: 60,
      normativo: 'Test',
      categoria: 'CONSIGNADO',
      configuracoes: {},
      active: true,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01'
    },
    {
      id: '2',
      name: 'CONSIGNADO - Militar - Aeronáutica',
      juros: 1.8,
      prazoMaximo: 48,
      normativo: 'Test',
      categoria: 'CONSIGNADO',
      configuracoes: {},
      active: true,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01'
    },
    {
      id: '3',
      name: 'Habitação SAC',
      juros: 1.0,
      prazoMaximo: 360,
      normativo: 'Test',
      categoria: 'HABITACAO',
      configuracoes: {},
      active: true,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01'
    },
    {
      id: '4',
      name: 'CONSIGNADO - FUNCEF',
      juros: 2.0,
      prazoMaximo: 36,
      normativo: 'Test',
      categoria: 'CONSIGNADO',
      configuracoes: {},
      active: true,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01'
    },
    {
      id: '5',
      name: 'CONSIGNADO - TJDFT - Tribunal',
      juros: 1.9,
      prazoMaximo: 72,
      normativo: 'Test',
      categoria: 'CONSIGNADO',
      configuracoes: {},
      active: true,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01'
    }
  ];

  describe('isConvenioAlreadyRegistered', () => {
    it('should return true when INSS convenio is already registered', () => {
      // Act
      const result = isConvenioAlreadyRegistered('inss', mockProducts);

      // Assert
      expect(result).toBe(true);
    });

    it('should return true when militar convenio is already registered', () => {
      // Act
      const result = isConvenioAlreadyRegistered('militar', mockProducts);

      // Assert
      expect(result).toBe(true);
    });

    it('should return true when funcef convenio is already registered', () => {
      // Act
      const result = isConvenioAlreadyRegistered('funcef', mockProducts);

      // Assert
      expect(result).toBe(true);
    });

    it('should return true when tjdft convenio is already registered', () => {
      // Act
      const result = isConvenioAlreadyRegistered('tjdft', mockProducts);

      // Assert
      expect(result).toBe(true);
    });

    it('should return false when convenio is not registered', () => {
      // Act
      const result = isConvenioAlreadyRegistered('siape', mockProducts);

      // Assert
      expect(result).toBe(false);
    });

    it('should handle case insensitive search for convenio key', () => {
      // Act
      const resultUpper = isConvenioAlreadyRegistered('INSS', mockProducts);
      const resultMixed = isConvenioAlreadyRegistered('InSs', mockProducts);

      // Assert
      expect(resultUpper).toBe(true);
      expect(resultMixed).toBe(true);
    });

    it('should handle case insensitive search for product names', () => {
      // Arrange
      const productsWithUpperCase: Product[] = [
        {
          id: '1',
          name: 'CONSIGNADO - INSS - APOSENTADOS',
          juros: 1.5,
          prazoMaximo: 60,
          normativo: 'Test',
          categoria: 'CONSIGNADO',
          configuracoes: {}
        }
      ];

      // Act
      const result = isConvenioAlreadyRegistered('inss', productsWithUpperCase);

      // Assert
      expect(result).toBe(true);
    });

    it('should match multiple search terms for INSS', () => {
      // Arrange
      const productsWithAposentados: Product[] = [
        {
          id: '1',
          name: 'Produto para aposentados',
          juros: 1.5,
          prazoMaximo: 60,
          normativo: 'Test',
          categoria: 'CONSIGNADO',
          configuracoes: {}
        }
      ];

      const productsWithPensionistas: Product[] = [
        {
          id: '2',
          name: 'Produto para pensionistas',
          juros: 1.5,
          prazoMaximo: 60,
          normativo: 'Test',
          categoria: 'CONSIGNADO',
          configuracoes: {}
        }
      ];

      // Act
      const resultAposentados = isConvenioAlreadyRegistered('inss', productsWithAposentados);
      const resultPensionistas = isConvenioAlreadyRegistered('inss', productsWithPensionistas);

      // Assert
      expect(resultAposentados).toBe(true);
      expect(resultPensionistas).toBe(true);
    });

    it('should match multiple search terms for militar', () => {
      // Arrange
      const productsWithAeronautica: Product[] = [
        {
          id: '1',
          name: 'Produto para aeronáutica',
          juros: 1.8,
          prazoMaximo: 48,
          normativo: 'Test',
          categoria: 'CONSIGNADO',
          configuracoes: {}
        }
      ];

      const productsWithComando: Product[] = [
        {
          id: '2',
          name: 'Produto para comando militar',
          juros: 1.8,
          prazoMaximo: 48,
          normativo: 'Test',
          categoria: 'CONSIGNADO',
          configuracoes: {}
        }
      ];

      // Act
      const resultAeronautica = isConvenioAlreadyRegistered('militar', productsWithAeronautica);
      const resultComando = isConvenioAlreadyRegistered('militar', productsWithComando);

      // Assert
      expect(resultAeronautica).toBe(true);
      expect(resultComando).toBe(true);
    });

    it('should match multiple search terms for tjdft', () => {
      // Arrange
      const productsWithTribunal: Product[] = [
        {
          id: '1',
          name: 'Produto para tribunal',
          juros: 1.9,
          prazoMaximo: 72,
          normativo: 'Test',
          categoria: 'CONSIGNADO',
          configuracoes: {}
        }
      ];

      // Act
      const result = isConvenioAlreadyRegistered('tjdft', productsWithTribunal);

      // Assert
      expect(result).toBe(true);
    });

    it('should fallback to search key when no specific matches defined', () => {
      // Arrange
      const productsWithCustom: Product[] = [
        {
          id: '1',
          name: 'Produto para custom',
          juros: 2.0,
          prazoMaximo: 60,
          normativo: 'Test',
          categoria: 'CONSIGNADO',
          configuracoes: {}
        }
      ];

      // Act
      const result = isConvenioAlreadyRegistered('custom', productsWithCustom);

      // Assert
      expect(result).toBe(true);
    });

    it('should return false with empty products array', () => {
      // Act
      const result = isConvenioAlreadyRegistered('inss', []);

      // Assert
      expect(result).toBe(false);
    });

    it('should handle empty convenio key', () => {
      // Act
      const result = isConvenioAlreadyRegistered('', mockProducts);

      // Assert
      expect(result).toBe(true); // Empty string matches all products
    });

    it('should handle products with empty names', () => {
      // Arrange
      const productsWithEmptyName: Product[] = [
        {
          id: '1',
          name: '',
          juros: 1.5,
          prazoMaximo: 60,
          normativo: 'Test',
          categoria: 'CONSIGNADO',
          configuracoes: {}
        }
      ];

      // Act
      const result = isConvenioAlreadyRegistered('inss', productsWithEmptyName);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('isHabitacaoAlreadyRegistered', () => {
    it('should return true when habitação product exists', () => {
      // Act
      const result = isHabitacaoAlreadyRegistered(mockProducts);

      // Assert
      expect(result).toBe(true);
    });

    it('should return true when habitacao product exists (without accent)', () => {
      // Arrange
      const productsWithoutAccent: Product[] = [
        {
          id: '1',
          name: 'Produto habitacao',
          juros: 1.0,
          prazoMaximo: 360,
          normativo: 'Test',
          categoria: 'HABITACAO',
          configuracoes: {}
        }
      ];

      // Act
      const result = isHabitacaoAlreadyRegistered(productsWithoutAccent);

      // Assert
      expect(result).toBe(true);
    });

    it('should handle case insensitive search for habitação', () => {
      // Arrange
      const productsWithUpperCase: Product[] = [
        {
          id: '1',
          name: 'PRODUTO HABITAÇÃO',
          juros: 1.0,
          prazoMaximo: 360,
          normativo: 'Test',
          categoria: 'HABITACAO',
          configuracoes: {}
        }
      ];

      // Act
      const result = isHabitacaoAlreadyRegistered(productsWithUpperCase);

      // Assert
      expect(result).toBe(true);
    });

    it('should handle case insensitive search for habitacao', () => {
      // Arrange
      const productsWithUpperCase: Product[] = [
        {
          id: '1',
          name: 'PRODUTO HABITACAO',
          juros: 1.0,
          prazoMaximo: 360,
          normativo: 'Test',
          categoria: 'HABITACAO',
          configuracoes: {}
        }
      ];

      // Act
      const result = isHabitacaoAlreadyRegistered(productsWithUpperCase);

      // Assert
      expect(result).toBe(true);
    });

    it('should return false when no habitação product exists', () => {
      // Arrange
      const productsWithoutHabitacao: Product[] = [
        {
          id: '1',
          name: 'CONSIGNADO - INSS',
          juros: 1.5,
          prazoMaximo: 60,
          normativo: 'Test',
          categoria: 'CONSIGNADO',
          configuracoes: {}
        }
      ];

      // Act
      const result = isHabitacaoAlreadyRegistered(productsWithoutHabitacao);

      // Assert
      expect(result).toBe(false);
    });

    it('should return false with empty products array', () => {
      // Act
      const result = isHabitacaoAlreadyRegistered([]);

      // Assert
      expect(result).toBe(false);
    });

    it('should handle products with empty names', () => {
      // Arrange
      const productsWithEmptyName: Product[] = [
        {
          id: '1',
          name: '',
          juros: 1.0,
          prazoMaximo: 360,
          normativo: 'Test',
          categoria: 'HABITACAO',
          configuracoes: {}
        }
      ];

      // Act
      const result = isHabitacaoAlreadyRegistered(productsWithEmptyName);

      // Assert
      expect(result).toBe(false);
    });

    it('should match habitação when it appears in middle of product name', () => {
      // Arrange
      const productsWithMiddleName: Product[] = [
        {
          id: '1',
          name: 'Financiamento habitação SAC',
          juros: 1.0,
          prazoMaximo: 360,
          normativo: 'Test',
          categoria: 'HABITACAO',
          configuracoes: {}
        }
      ];

      // Act
      const result = isHabitacaoAlreadyRegistered(productsWithMiddleName);

      // Assert
      expect(result).toBe(true);
    });

    it('should match habitacao when it appears in middle of product name', () => {
      // Arrange
      const productsWithMiddleName: Product[] = [
        {
          id: '1',
          name: 'Financiamento habitacao PRICE',
          juros: 1.0,
          prazoMaximo: 360,
          normativo: 'Test',
          categoria: 'HABITACAO',
          configuracoes: {}
        }
      ];

      // Act
      const result = isHabitacaoAlreadyRegistered(productsWithMiddleName);

      // Assert
      expect(result).toBe(true);
    });
  });
});
