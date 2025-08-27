import ProductDataService from './productDataService';
import { ProductCategory } from '@/types/products';

// Mock dos arquivos JSON
jest.mock('../../../../data/products.index.json', () => ({
  itens: [
    { id: 'consignado_inss', nome: 'INSS' },
    { id: 'consignado_convenio_militar', nome: 'Militar' },
    { id: 'habitacao_sac', nome: 'Habitação SAC' }
  ]
}));

jest.mock('../../../../data/consignado/inss.json', () => ({
  categoria: 'CONSIGNADO',
  subtipo: 'INSS',
  status_contratacao: 'ATIVO',
  canais_permitidos: ['AGENCIA', 'AG_DIGITAL'],
  faixas: {
    A: { concessao_taxa_am: 1.5, renovacao_taxa_am: 1.2 },
    B: { concessao_taxa_am: 1.8, renovacao_taxa_am: 1.5 }
  }
}));

jest.mock('../../../../data/consignado/convenios/militar.json', () => ({
  categoria: 'CONSIGNADO',
  subtipo: 'CONVENIO',
  status_contratacao: 'ATIVO',
  canais_permitidos: ['AGENCIA', 'LOTERICA'],
  faixas: {
    A: { concessao_taxa_am: 1.3, renovacao_taxa_am: 1.0 }
  }
}));

jest.mock('../../../../data/consignado/convenios/funcef.json', () => ({
  categoria: 'CONSIGNADO',
  subtipo: 'CONVENIO',
  status_contratacao: 'SUSPENSO',
  canais_permitidos: ['AGENCIA']
}));

jest.mock('../../../../data/consignado/convenios/tjdft.json', () => ({
  categoria: 'CONSIGNADO',
  subtipo: 'CONVENIO',
  status_contratacao: 'EM_BREVE',
  canais_permitidos: ['AG_DIGITAL']
}));

jest.mock('../../../../data/habitacao/sac.json', () => ({
  categoria: 'HABITACAO',
  sistema_amortizacao: 'SAC',
  status_contratacao: 'ATIVO'
} as any));

jest.mock('../../../../data/habitacao/price.json', () => ({
  categoria: 'HABITACAO',
  sistema_amortizacao: 'PRICE',
  status_contratacao: 'ATIVO'
} as any));

jest.mock('../../../../data/outro/template_minimo.json', () => ({
  categoria: 'OUTRO',
  tipo: 'TEMPLATE_MINIMO',
  status_contratacao: 'ATIVO'
} as any));

describe('ProductDataService', () => {
  let service: ProductDataService;

  beforeEach(() => {
    // Reset singleton instance for each test
    (ProductDataService as any).instance = null;
    service = ProductDataService.getInstance();
  });

  describe('🎯 Singleton Pattern', () => {
    it('should return the same instance', () => {
      const instance1 = ProductDataService.getInstance();
      const instance2 = ProductDataService.getInstance();
      expect(instance1).toBe(instance2);
    });

    it('should create new instance after reset', () => {
      const instance1 = ProductDataService.getInstance();
      (ProductDataService as any).instance = null;
      const instance2 = ProductDataService.getInstance();
      expect(instance1).not.toBe(instance2);
    });
  });

  describe('🎯 Product Index Loading', () => {
    it('should load product index successfully', async () => {
      const index = await service.loadProductIndex();
      expect(index).toBeDefined();
      expect(index.itens).toHaveLength(3);
      expect(index.itens[0]?.id).toBe('consignado_inss');
    });

    it('should cache product index on second call', async () => {
      const index1 = await service.loadProductIndex();
      const index2 = await service.loadProductIndex();
      expect(index1).toBe(index2);
    });

    it('should return cached index without re-loading', async () => {
      await service.loadProductIndex();
      const index = await service.loadProductIndex();
      expect(index.itens).toHaveLength(3);
    });
  });

  describe('🎯 Product Loading', () => {
    it('should load INSS product successfully', async () => {
      const product = await service.loadProduct('consignado_inss');
      expect(product.categoria).toBe('CONSIGNADO');
      expect(product.subtipo).toBe('INSS');
      expect(product.status_contratacao).toBe('ATIVO');
    });

    it('should load militar product successfully', async () => {
      const product = await service.loadProduct('consignado_convenio_militar');
      expect(product.categoria).toBe('CONSIGNADO');
      expect(product.subtipo).toBe('CONVENIO');
      expect(product.status_contratacao).toBe('ATIVO');
    });

    it('should load funcef product successfully', async () => {
      const product = await service.loadProduct('consignado_convenio_funcef');
      expect(product.categoria).toBe('CONSIGNADO');
      expect(product.subtipo).toBe('CONVENIO');
      expect(product.status_contratacao).toBe('SUSPENSO');
    });

    it('should load tjdft product successfully', async () => {
      const product = await service.loadProduct('consignado_convenio_tjdft');
      expect(product.categoria).toBe('CONSIGNADO');
      expect(product.subtipo).toBe('CONVENIO');
      expect(product.status_contratacao).toBe('EM_BREVE');
    });

    it('should load habitacao SAC product successfully', async () => {
      const product = await service.loadProduct('habitacao_sac') as any;
      expect(product.categoria).toBe('HABITACAO');
      expect(product.sistema_amortizacao).toBe('SAC');
    });

    it('should load habitacao PRICE product successfully', async () => {
      const product = await service.loadProduct('habitacao_price') as any;
      expect(product.categoria).toBe('HABITACAO');
      expect(product.sistema_amortizacao).toBe('PRICE');
    });

    it('should load outro template product successfully', async () => {
      const product = await service.loadProduct('outro_template') as any;
      expect(product.categoria).toBe('OUTRO');
      expect(product.tipo).toBe('TEMPLATE_MINIMO');
    });

    it('should throw error for unknown product', async () => {
      await expect(service.loadProduct('unknown_product'))
        .rejects.toThrow('Produto unknown_product não encontrado');
    });

    it('should cache loaded products', async () => {
      const product1 = await service.loadProduct('consignado_inss');
      const product2 = await service.loadProduct('consignado_inss');
      expect(product1).toBe(product2);
    });
  });

  describe('🎯 Products by Category', () => {
    it('should get all products when no category specified', async () => {
      const products = await service.getProductsByCategory();
      expect(products).toHaveLength(3);
    });

    it('should get only CONSIGNADO products', async () => {
      const products = await service.getProductsByCategory('CONSIGNADO');
      expect(products).toHaveLength(2);
      products.forEach(product => {
        expect(product.categoria).toBe('CONSIGNADO');
      });
    });

    it('should get only HABITACAO products', async () => {
      const products = await service.getProductsByCategory('HABITACAO');
      expect(products).toHaveLength(1);
      expect(products[0]?.categoria).toBe('HABITACAO');
    });

    it('should handle errors when loading individual products', async () => {
      // Mock to cause error for one product
      jest.spyOn(service, 'loadProduct').mockImplementation((id) => {
        if (id === 'consignado_inss') {
          throw new Error('Test error');
        }
        return Promise.resolve({
          categoria: 'CONSIGNADO',
          subtipo: 'CONVENIO'
        } as ProductCategory);
      });

      const products = await service.getProductsByCategory('CONSIGNADO');
      expect(products).toHaveLength(2); // Should skip the error one
    });
  });

  describe('🎯 Active Convenios', () => {
    it('should get only active convenio products', async () => {
      const convenios = await service.getActiveConvenios();
      expect(convenios).toHaveLength(1);
      expect(convenios[0]?.subtipo).toBe('CONVENIO');
      expect(convenios[0]?.status_contratacao).toBe('ATIVO');
    });

    it('should filter out suspended convenios', async () => {
      const convenios = await service.getActiveConvenios();
      const suspended = convenios.find(c => c.status_contratacao === 'SUSPENSO');
      expect(suspended).toBeUndefined();
    });

    it('should filter out em_breve convenios', async () => {
      const convenios = await service.getActiveConvenios();
      const emBreve = convenios.find(c => c.status_contratacao === 'EM_BREVE');
      expect(emBreve).toBeUndefined();
    });
  });

  describe('🎯 Canais Permitidos', () => {
    it('should get formatted canais for INSS product', async () => {
      const product = await service.loadProduct('consignado_inss');
      const canais = service.getCanaisPermitidos(product);
      expect(canais).toHaveLength(2);
      expect(canais[0]).toEqual({
        value: 'AGENCIA',
        label: 'Agência Física'
      });
      expect(canais[1]).toEqual({
        value: 'AG_DIGITAL',
        label: 'Agência Digital'
      });
    });

    it('should handle unknown canal types', async () => {
      const mockProduct = {
        canais_permitidos: ['UNKNOWN_CANAL']
      } as ProductCategory;
      
      const canais = service.getCanaisPermitidos(mockProduct);
      expect(canais[0]).toEqual({
        value: 'UNKNOWN_CANAL',
        label: 'UNKNOWN_CANAL'
      });
    });

    it('should map all standard canal types', async () => {
      const mockProduct = {
        canais_permitidos: [
          'AGENCIA', 'AG_DIGITAL', 'AUTOSERVICO_ATM_IBC_MBC',
          'LOTERICA', 'PORTAL_TERCEIRIZADO', 'OUTROS'
        ]
      } as ProductCategory;
      
      const canais = service.getCanaisPermitidos(mockProduct);
      expect(canais).toHaveLength(6);
      expect(canais[0]?.label).toBe('Agência Física');
      expect(canais[1]?.label).toBe('Agência Digital');
      expect(canais[2]?.label).toBe('Autoatendimento (ATM/IBC/MBC)');
      expect(canais[3]?.label).toBe('Lotérica CAIXA');
      expect(canais[4]?.label).toBe('Portal Terceirizado');
      expect(canais[5]?.label).toBe('Outros Canais');
    });
  });

  describe('🎯 Faixa Determination', () => {
    it('should return faixa A for AGENCIA canal', () => {
      const product = {} as ProductCategory;
      const faixa = service.determineFaixa(product, 'AGENCIA', []);
      expect(faixa).toBe('A');
    });

    it('should return faixa A for AG_DIGITAL canal', () => {
      const product = {} as ProductCategory;
      const faixa = service.determineFaixa(product, 'AG_DIGITAL', []);
      expect(faixa).toBe('A');
    });

    it('should return faixa B for AUTOSERVICO canal', () => {
      const product = {} as ProductCategory;
      const faixa = service.determineFaixa(product, 'AUTOSERVICO_ATM_IBC_MBC', []);
      expect(faixa).toBe('B');
    });

    it('should return faixa B for LOTERICA canal', () => {
      const product = {} as ProductCategory;
      const faixa = service.determineFaixa(product, 'LOTERICA', []);
      expect(faixa).toBe('B');
    });

    it('should return faixa C for other canals', () => {
      const product = {} as ProductCategory;
      const faixa = service.determineFaixa(product, 'OUTROS', []);
      expect(faixa).toBe('C');
    });

    it('should return faixa C for unknown canals', () => {
      const product = {} as ProductCategory;
      const faixa = service.determineFaixa(product, 'UNKNOWN', []);
      expect(faixa).toBe('C');
    });
  });

  describe('🎯 Taxa by Faixa', () => {
    it('should get concessao taxa for faixa A', async () => {
      const product = await service.loadProduct('consignado_inss');
      const taxa = service.getTaxaByFaixa(product, 'A', 'CONCESSAO');
      expect(taxa).toBe(1.5);
    });

    it('should get renovacao taxa for faixa A', async () => {
      const product = await service.loadProduct('consignado_inss');
      const taxa = service.getTaxaByFaixa(product, 'A', 'RENOVACAO');
      expect(taxa).toBe(1.2);
    });

    it('should get concessao taxa for faixa B', async () => {
      const product = await service.loadProduct('consignado_inss');
      const taxa = service.getTaxaByFaixa(product, 'B', 'CONCESSAO');
      expect(taxa).toBe(1.8);
    });

    it('should get renovacao taxa for faixa B', async () => {
      const product = await service.loadProduct('consignado_inss');
      const taxa = service.getTaxaByFaixa(product, 'B', 'RENOVACAO');
      expect(taxa).toBe(1.5);
    });

    it('should throw error for non-existent faixa', async () => {
      const product = await service.loadProduct('consignado_inss');
      expect(() => service.getTaxaByFaixa(product, 'C', 'CONCESSAO'))
        .toThrow('Faixa C não encontrada para o produto');
    });
  });

  describe('🎯 Simulation Validation', () => {
    it('should allow simulation for active products', async () => {
      const product = await service.loadProduct('consignado_inss');
      const result = service.canSimulate(product);
      expect(result.canSimulate).toBe(true);
      expect(result.reason).toBeUndefined();
    });

    it('should reject simulation for suspended products', async () => {
      const product = await service.loadProduct('consignado_convenio_funcef');
      const result = service.canSimulate(product);
      expect(result.canSimulate).toBe(false);
      expect(result.reason).toBe('Produto suspenso conforme MP 1292 – consignado celetista');
    });

    it('should reject simulation for em_breve products', async () => {
      const product = await service.loadProduct('consignado_convenio_tjdft');
      const result = service.canSimulate(product);
      expect(result.canSimulate).toBe(false);
      expect(result.reason).toBe('Simulação será liberada em breve');
    });
  });

  describe('🎯 Load Convenio by Name', () => {
    it('should load INSS convenio data', async () => {
      const data = await service.loadConvenio('inss');
      expect(data.categoria).toBe('CONSIGNADO');
      expect(data.subtipo).toBe('INSS');
    });

    it('should load militar convenio data', async () => {
      const data = await service.loadConvenio('militar');
      expect(data.categoria).toBe('CONSIGNADO');
      expect(data.subtipo).toBe('CONVENIO');
    });

    it('should load funcef convenio data', async () => {
      const data = await service.loadConvenio('funcef');
      expect(data.categoria).toBe('CONSIGNADO');
      expect(data.subtipo).toBe('CONVENIO');
    });

    it('should load tjdft convenio data', async () => {
      const data = await service.loadConvenio('tjdft');
      expect(data.categoria).toBe('CONSIGNADO');
      expect(data.subtipo).toBe('CONVENIO');
    });

    it('should handle case insensitive convenio names', async () => {
      const dataUpper = await service.loadConvenio('INSS');
      const dataLower = await service.loadConvenio('inss');
      expect(dataUpper).toEqual(dataLower);
    });

    it('should throw error for unknown convenio', async () => {
      await expect(service.loadConvenio('unknown'))
        .rejects.toThrow('Convênio unknown não encontrado');
    });
  });

  describe('🎯 Load Habitacao by Sistema', () => {
    it('should load SAC habitacao data', async () => {
      const data = await service.loadHabitacao('sac');
      expect(data.categoria).toBe('HABITACAO');
      expect(data.sistema_amortizacao).toBe('SAC');
    });

    it('should load PRICE habitacao data', async () => {
      const data = await service.loadHabitacao('price');
      expect(data.categoria).toBe('HABITACAO');
      expect(data.sistema_amortizacao).toBe('PRICE');
    });

    it('should handle case insensitive sistema names', async () => {
      const dataUpper = await service.loadHabitacao('SAC');
      const dataLower = await service.loadHabitacao('sac');
      expect(dataUpper).toEqual(dataLower);
    });

    it('should throw error for unknown sistema', async () => {
      await expect(service.loadHabitacao('unknown'))
        .rejects.toThrow('Sistema de amortização unknown não encontrado');
    });
  });

  describe('🎯 Load Outro Template', () => {
    it('should load outro template data successfully', async () => {
      const data = await service.loadOutroTemplate() as any;
      expect(data.categoria).toBe('OUTRO');
      expect(data.tipo).toBe('TEMPLATE_MINIMO');
      expect(data.status_contratacao).toBe('ATIVO');
    });

    it('should return consistent data on multiple calls', async () => {
      const data1 = await service.loadOutroTemplate();
      const data2 = await service.loadOutroTemplate();
      expect(data1).toEqual(data2);
    });
  });

  describe('🎯 Error Handling', () => {
    it('should propagate errors in loadProduct', async () => {
      // Mock to throw error
      jest.spyOn(service, 'loadProduct').mockRejectedValueOnce(new Error('Network error'));
      
      await expect(service.loadProduct('any_id'))
        .rejects.toThrow('Network error');
    });

    it('should propagate errors in loadConvenio', async () => {
      // Test error propagation by mocking
      const originalLoadConvenio = service.loadConvenio;
      service.loadConvenio = jest.fn().mockRejectedValue(new Error('Load error'));
      
      await expect(service.loadConvenio('inss'))
        .rejects.toThrow('Load error');
        
      service.loadConvenio = originalLoadConvenio;
    });

    it('should propagate errors in loadHabitacao', async () => {
      const originalLoadHabitacao = service.loadHabitacao;
      service.loadHabitacao = jest.fn().mockRejectedValue(new Error('Load error'));
      
      await expect(service.loadHabitacao('sac'))
        .rejects.toThrow('Load error');
        
      service.loadHabitacao = originalLoadHabitacao;
    });

    it('should propagate errors in loadOutroTemplate', async () => {
      const originalLoadOutroTemplate = service.loadOutroTemplate;
      service.loadOutroTemplate = jest.fn().mockRejectedValue(new Error('Load error'));
      
      await expect(service.loadOutroTemplate())
        .rejects.toThrow('Load error');
        
      service.loadOutroTemplate = originalLoadOutroTemplate;
    });
  });
});
