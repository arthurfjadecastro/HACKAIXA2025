import { renderHook } from '@testing-library/react-native';
import { useDataLoading } from './useDataLoading';
import ProductDataService from '@/services/products/data';

// Mock do ProductDataService
jest.mock('@/services/products/data');
const mockProductDataService = ProductDataService as jest.Mocked<typeof ProductDataService>;

describe('useDataLoading', () => {
  let mockSetFormData: jest.Mock;
  let mockService: any;

  beforeEach(() => {
    mockSetFormData = jest.fn();
    mockService = {
      loadConvenio: jest.fn(),
      loadHabitacao: jest.fn(),
      loadOutroTemplate: jest.fn(),
    };
    mockProductDataService.getInstance.mockReturnValue(mockService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('loadConvenioData', () => {
    it('should load convenio data successfully', async () => {
      // Arrange
      const convenioData = {
        prazo: { minimoMeses: 6, maximoMeses: 60 },
        margem_consignavel_max: 30.5,
        faixas: {
          A: { concessao_taxa_am: 1.8, renovacao_taxa_am: 1.6 },
          B: { concessao_taxa_am: 2.1, renovacao_taxa_am: 1.9 },
          C: { concessao_taxa_am: 2.5, renovacao_taxa_am: 2.3 }
        },
        observacoes: ['Observação 1', 'Observação 2'],
        nome_exibicao: 'INSS Test'
      };
      mockService.loadConvenio.mockResolvedValue(convenioData);

      // Act
      const { result } = renderHook(() => useDataLoading());
      await result.current.loadConvenioData('inss', mockSetFormData);

      // Assert
      expect(mockService.loadConvenio).toHaveBeenCalledWith('inss');
      expect(mockSetFormData).toHaveBeenCalledWith(expect.any(Function));
      
      const setFormDataCall = mockSetFormData.mock.calls[0][0];
      const updatedData = setFormDataCall({ existing: 'data' });
      
      expect(updatedData).toEqual({
        existing: 'data',
        prazo_minimo: 6,
        prazo_maximo: 60,
        margem_consignavel: 30.5,
        taxa_faixa_a_concessao: 1.8,
        taxa_faixa_a_renovacao: 1.6,
        taxa_faixa_b_concessao: 2.1,
        taxa_faixa_b_renovacao: 1.9,
        taxa_faixa_c_concessao: 2.5,
        taxa_faixa_c_renovacao: 2.3,
        observacoes: ['Observação 1', 'Observação 2'],
        fonte_dados: 'Baseado em INSS Test'
      });
    });

    it('should handle error when loading convenio data', async () => {
      // Arrange
      mockService.loadConvenio.mockRejectedValue(new Error('Load error'));
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      // Act
      const { result } = renderHook(() => useDataLoading());
      await result.current.loadConvenioData('invalid', mockSetFormData);

      // Assert
      expect(mockService.loadConvenio).toHaveBeenCalledWith('invalid');
      expect(mockSetFormData).not.toHaveBeenCalled();
      
      consoleSpy.mockRestore();
    });

    it('should handle null convenio data', async () => {
      // Arrange
      mockService.loadConvenio.mockResolvedValue(null);

      // Act
      const { result } = renderHook(() => useDataLoading());
      await result.current.loadConvenioData('empty', mockSetFormData);

      // Assert
      expect(mockService.loadConvenio).toHaveBeenCalledWith('empty');
      expect(mockSetFormData).not.toHaveBeenCalled();
    });

    it('should handle partial convenio data', async () => {
      // Arrange
      const partialData = {
        prazo: { minimoMeses: 12, maximoMeses: 120 },
        faixas: {
          A: { concessao_taxa_am: 2.0, renovacao_taxa_am: 1.8 },
          B: { concessao_taxa_am: 2.3, renovacao_taxa_am: 2.1 },
          C: { concessao_taxa_am: 2.8, renovacao_taxa_am: 2.6 }
        },
        nome_exibicao: 'Partial Test'
      };
      mockService.loadConvenio.mockResolvedValue(partialData);

      // Act
      const { result } = renderHook(() => useDataLoading());
      await result.current.loadConvenioData('partial', mockSetFormData);

      // Assert
      const setFormDataCall = mockSetFormData.mock.calls[0][0];
      const updatedData = setFormDataCall({});
      
      expect(updatedData.observacoes).toEqual([]);
      expect(updatedData.margem_consignavel).toBeUndefined();
    });
  });

  describe('loadHabitacaoData', () => {
    it('should load habitacao data successfully', async () => {
      // Arrange
      const habitacaoData = {
        prazo: { minimoMeses: 24, maximoMeses: 360 },
        sistema_amortizacao: 'SAC',
        ltv_limites: {
          financiamento_max_percentual: 80,
          entrada_min_percentual: 20
        },
        indexadores_permitidos: ['TR', 'IPCA'],
        seguros_obrigatorios: ['DFI', 'MIP'],
        condicoes_gerais: ['Condição 1', 'Condição 2'],
        nome_exibicao: 'Habitação SAC'
      };
      mockService.loadHabitacao.mockResolvedValue(habitacaoData);

      // Act
      const { result } = renderHook(() => useDataLoading());
      await result.current.loadHabitacaoData(mockSetFormData);

      // Assert
      expect(mockService.loadHabitacao).toHaveBeenCalledWith('sac');
      expect(mockSetFormData).toHaveBeenCalledWith(expect.any(Function));
      
      const setFormDataCall = mockSetFormData.mock.calls[0][0];
      const updatedData = setFormDataCall({ existing: 'data' });
      
      expect(updatedData).toEqual({
        existing: 'data',
        prazo_minimo: 24,
        prazo_maximo: 360,
        sistema_amortizacao: 'SAC',
        ltv_max_percentual: 80,
        entrada_min_percentual: 20,
        indexadores_permitidos: ['TR', 'IPCA'],
        seguros_obrigatorios: ['DFI', 'MIP'],
        observacoes: ['Condição 1', 'Condição 2'],
        fonte_dados: 'Baseado em Habitação SAC'
      });
    });

    it('should handle error when loading habitacao data', async () => {
      // Arrange
      mockService.loadHabitacao.mockRejectedValue(new Error('Habitacao error'));

      // Act
      const { result } = renderHook(() => useDataLoading());
      await result.current.loadHabitacaoData(mockSetFormData);

      // Assert
      expect(mockService.loadHabitacao).toHaveBeenCalledWith('sac');
      expect(mockSetFormData).not.toHaveBeenCalled();
    });

    it('should handle null habitacao data', async () => {
      // Arrange
      mockService.loadHabitacao.mockResolvedValue(null);

      // Act
      const { result } = renderHook(() => useDataLoading());
      await result.current.loadHabitacaoData(mockSetFormData);

      // Assert
      expect(mockService.loadHabitacao).toHaveBeenCalledWith('sac');
      expect(mockSetFormData).not.toHaveBeenCalled();
    });

    it('should handle habitacao data with missing condicoes_gerais', async () => {
      // Arrange
      const habitacaoData = {
        prazo: { minimoMeses: 36, maximoMeses: 420 },
        sistema_amortizacao: 'SAC',
        ltv_limites: {
          financiamento_max_percentual: 70,
          entrada_min_percentual: 30
        },
        indexadores_permitidos: ['TR'],
        seguros_obrigatorios: ['DFI'],
        nome_exibicao: 'Habitação Minimal'
      };
      mockService.loadHabitacao.mockResolvedValue(habitacaoData);

      // Act
      const { result } = renderHook(() => useDataLoading());
      await result.current.loadHabitacaoData(mockSetFormData);

      // Assert
      const setFormDataCall = mockSetFormData.mock.calls[0][0];
      const updatedData = setFormDataCall({});
      
      expect(updatedData.observacoes).toEqual([]);
    });
  });

  describe('loadOutroTemplate', () => {
    it('should load outro template data successfully', async () => {
      // Arrange
      const outroData = {
        subcategoria: 'Serviço Personalizado',
        limites: {
          valor_min: 1000,
          valor_max: 50000,
          prazo_min_meses: 3,
          prazo_max_meses: 36,
          quantidade: { min: 1, max: 10 }
        },
        taxas_personalizadas: {
          percentual: 2.5,
          valor_fixo: 100,
          por_unidade: 15,
          observacao: 'Taxas especiais'
        },
        canais_permitidos: ['APP', 'WEB', 'AGENCIA'],
        elegibilidade: {
          faixa_etaria: { min: 18, max: 65 }
        },
        observacoes: ['Obs 1', 'Obs 2'],
        nome_exibicao: 'Template OUTRO'
      };
      mockService.loadOutroTemplate.mockResolvedValue(outroData);

      // Act
      const { result } = renderHook(() => useDataLoading());
      await result.current.loadOutroTemplate(mockSetFormData);

      // Assert
      expect(mockService.loadOutroTemplate).toHaveBeenCalled();
      expect(mockSetFormData).toHaveBeenCalledWith(expect.any(Function));
      
      const setFormDataCall = mockSetFormData.mock.calls[0][0];
      const updatedData = setFormDataCall({ existing: 'data' });
      
      expect(updatedData).toEqual({
        existing: 'data',
        subcategoria_outro: 'Serviço Personalizado',
        valor_min: 1000,
        valor_max: 50000,
        prazo_min_meses: 3,
        prazo_max_meses: 36,
        quantidade_min: 1,
        quantidade_max: 10,
        taxa_percentual: 2.5,
        taxa_valor_fixo: 100,
        taxa_por_unidade: 15,
        taxa_observacao: 'Taxas especiais',
        canais_selecionados: ['APP', 'WEB', 'AGENCIA'],
        faixa_etaria_min: 18,
        faixa_etaria_max: 65,
        observacoes: ['Obs 1', 'Obs 2'],
        fonte_dados: 'Baseado em template Template OUTRO'
      });
    });

    it('should handle error when loading outro template', async () => {
      // Arrange
      mockService.loadOutroTemplate.mockRejectedValue(new Error('Template error'));

      // Act
      const { result } = renderHook(() => useDataLoading());
      await result.current.loadOutroTemplate(mockSetFormData);

      // Assert
      expect(mockService.loadOutroTemplate).toHaveBeenCalled();
      expect(mockSetFormData).not.toHaveBeenCalled();
    });

    it('should handle null outro template data', async () => {
      // Arrange
      mockService.loadOutroTemplate.mockResolvedValue(null);

      // Act
      const { result } = renderHook(() => useDataLoading());
      await result.current.loadOutroTemplate(mockSetFormData);

      // Assert
      expect(mockService.loadOutroTemplate).toHaveBeenCalled();
      expect(mockSetFormData).not.toHaveBeenCalled();
    });

    it('should handle outro template with minimal data', async () => {
      // Arrange
      const minimalData = {
        subcategoria: 'Básico',
        limites: {
          prazo_min_meses: 1,
          prazo_max_meses: 12,
          quantidade: { min: 1, max: 5 }
        },
        nome_exibicao: 'Template Básico'
      };
      mockService.loadOutroTemplate.mockResolvedValue(minimalData);

      // Act
      const { result } = renderHook(() => useDataLoading());
      await result.current.loadOutroTemplate(mockSetFormData);

      // Assert
      const setFormDataCall = mockSetFormData.mock.calls[0][0];
      const updatedData = setFormDataCall({});
      
      expect(updatedData.subcategoria_outro).toBe('Básico');
      expect(updatedData.observacoes).toEqual([]);
      expect(updatedData.taxa_percentual).toBeUndefined();
      expect(updatedData.elegibilidade).toBeUndefined();
    });

    it('should handle outro template with undefined nested properties', async () => {
      // Arrange
      const dataWithUndefined = {
        subcategoria: 'Test',
        limites: {
          prazo_min_meses: 6,
          prazo_max_meses: 24,
          quantidade: { min: 2, max: 8 }
        },
        taxas_personalizadas: undefined,
        elegibilidade: undefined,
        nome_exibicao: 'Test Template'
      };
      mockService.loadOutroTemplate.mockResolvedValue(dataWithUndefined);

      // Act
      const { result } = renderHook(() => useDataLoading());
      await result.current.loadOutroTemplate(mockSetFormData);

      // Assert
      const setFormDataCall = mockSetFormData.mock.calls[0][0];
      const updatedData = setFormDataCall({});
      
      expect(updatedData.taxa_percentual).toBeUndefined();
      expect(updatedData.faixa_etaria_min).toBeUndefined();
      expect(updatedData.faixa_etaria_max).toBeUndefined();
    });
  });

  describe('hook return value', () => {
    it('should return all three functions', () => {
      // Act
      const { result } = renderHook(() => useDataLoading());

      // Assert
      expect(result.current).toHaveProperty('loadConvenioData');
      expect(result.current).toHaveProperty('loadHabitacaoData');
      expect(result.current).toHaveProperty('loadOutroTemplate');
      expect(typeof result.current.loadConvenioData).toBe('function');
      expect(typeof result.current.loadHabitacaoData).toBe('function');
      expect(typeof result.current.loadOutroTemplate).toBe('function');
    });
  });

  describe('service getInstance call', () => {
    it('should call ProductDataService.getInstance() once per hook instance', () => {
      // Act
      renderHook(() => useDataLoading());

      // Assert
      expect(ProductDataService.getInstance).toHaveBeenCalledTimes(1);
    });

    it('should reuse service instance across multiple function calls', async () => {
      // Act
      const { result } = renderHook(() => useDataLoading());
      await result.current.loadConvenioData('test1', mockSetFormData);
      await result.current.loadHabitacaoData(mockSetFormData);
      await result.current.loadOutroTemplate(mockSetFormData);

      // Assert
      expect(ProductDataService.getInstance).toHaveBeenCalledTimes(1);
    });
  });
});
