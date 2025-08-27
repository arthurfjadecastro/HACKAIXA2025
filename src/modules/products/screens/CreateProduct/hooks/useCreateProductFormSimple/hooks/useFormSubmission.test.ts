import { renderHook, act } from '@testing-library/react-native';
import { useNavigation } from '@react-navigation/native';
import { useFormSubmission } from './useFormSubmission';
import { useCreateProduct } from '../../../../../hooks';
import { FormData } from '../../../types';

// Mocks
jest.mock('@react-navigation/native');
jest.mock('../../../../../hooks');

const mockNavigation = useNavigation as jest.MockedFunction<typeof useNavigation>;
const mockUseCreateProduct = useCreateProduct as jest.MockedFunction<typeof useCreateProduct>;

describe('useFormSubmission', () => {
  let mockNavigate: jest.Mock;
  let mockGoBack: jest.Mock;
  let mockCreateProduct: jest.Mock;

  beforeEach(() => {
    mockNavigate = jest.fn();
    mockGoBack = jest.fn();
    mockCreateProduct = jest.fn();

    mockNavigation.mockReturnValue({
      navigate: mockNavigate,
      goBack: mockGoBack,
    } as any);

    mockUseCreateProduct.mockReturnValue({
      createProduct: mockCreateProduct,
      loading: false,
      error: null,
      clearError: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('handleSubmit', () => {
    it('should create HABITACAO product correctly', async () => {
      // Arrange
      const formData: FormData = {
        categoria: 'HABITACAO',
        subtipo: '',
        name: '',
        interestRate: '',
        maxTerm: '',
        normative: 'Normativo Habitação',
        observacoes: [],
        fonte_dados: 'Cadastro automático',
        prazo_min_meses: 1,
        prazo_max_meses: 420
      };

      mockCreateProduct.mockResolvedValue({});

      // Act
      const { result } = renderHook(() => useFormSubmission());
      await act(async () => {
        await result.current.handleSubmit(formData);
      });

      // Assert
      expect(mockCreateProduct).toHaveBeenCalledWith({
        name: 'Habitação',
        juros: 1.0,
        prazoMaximo: 0,
        normativo: 'Normativo Habitação',
        categoria: 'HABITACAO',
        subtipo: 'SAC',
        configuracoes: formData
      });
      expect(mockGoBack).toHaveBeenCalled();
    });

    it('should create OUTRO product with custom name', async () => {
      // Arrange
      const formData: FormData = {
        categoria: 'OUTRO',
        subtipo: '',
        name: 'Serviço Personalizado',
        interestRate: '2.5',
        maxTerm: '',
        normative: 'Normativo Outro',
        observacoes: [],
        fonte_dados: 'Cadastro automático',
        prazo_min_meses: 6,
        prazo_max_meses: 24,
        subcategoria_outro: 'Serviço Especial'
      };

      mockCreateProduct.mockResolvedValue({});

      // Act
      const { result } = renderHook(() => useFormSubmission());
      await act(async () => {
        await result.current.handleSubmit(formData);
      });

      // Assert
      expect(mockCreateProduct).toHaveBeenCalledWith({
        name: 'Serviço Personalizado',
        juros: 2.5,
        prazoMaximo: 24,
        normativo: 'Normativo Outro',
        categoria: 'OUTRO',
        subtipo: 'GENERICO',
        configuracoes: formData,
        prazoMinimo: 6
      });
      expect(mockGoBack).toHaveBeenCalled();
    });

    it('should create OUTRO product with subcategoria fallback when no custom name', async () => {
      // Arrange
      const formData: FormData = {
        categoria: 'OUTRO',
        subtipo: '',
        name: '',
        interestRate: '1.8',
        maxTerm: '',
        normative: '',
        observacoes: [],
        fonte_dados: 'Cadastro automático',
        prazo_min_meses: 3,
        prazo_max_meses: 12,
        subcategoria_outro: 'Categoria Test'
      };

      mockCreateProduct.mockResolvedValue({});

      // Act
      const { result } = renderHook(() => useFormSubmission());
      await act(async () => {
        await result.current.handleSubmit(formData);
      });

      // Assert
      expect(mockCreateProduct).toHaveBeenCalledWith({
        name: 'OUTRO - Categoria Test',
        juros: 1.8,
        prazoMaximo: 12,
        normativo: '',
        categoria: 'OUTRO',
        subtipo: 'GENERICO',
        configuracoes: formData,
        prazoMinimo: 3
      });
    });

    it('should create OUTRO product with generic fallback when no name or subcategoria', async () => {
      // Arrange
      const formData: FormData = {
        categoria: 'OUTRO',
        subtipo: '',
        name: '',
        interestRate: '',
        maxTerm: '',
        normative: '',
        observacoes: [],
        fonte_dados: 'Cadastro automático',
        prazo_min_meses: 1,
        prazo_max_meses: 6
      };

      mockCreateProduct.mockResolvedValue({});

      // Act
      const { result } = renderHook(() => useFormSubmission());
      await act(async () => {
        await result.current.handleSubmit(formData);
      });

      // Assert
      expect(mockCreateProduct).toHaveBeenCalledWith({
        name: 'OUTRO - Serviço Genérico',
        juros: 1.0,
        prazoMaximo: 6,
        normativo: '',
        categoria: 'OUTRO',
        subtipo: 'GENERICO',
        configuracoes: formData,
        prazoMinimo: 1
      });
    });

    it('should create CONSIGNADO product with convenio', async () => {
      // Arrange
      const formData: FormData = {
        categoria: 'CONSIGNADO',
        subtipo: 'INSS',
        name: '',
        interestRate: '',
        maxTerm: '',
        normative: 'Normativo INSS',
        observacoes: [],
        fonte_dados: 'Cadastro automático',
        prazo_min_meses: 1,
        prazo_max_meses: 420,
        convenio_selected: 'INSS Aposentados',
        taxa_faixa_a_concessao: 1.5,
        prazo_maximo: 60
      };

      mockCreateProduct.mockResolvedValue({});

      // Act
      const { result } = renderHook(() => useFormSubmission());
      await act(async () => {
        await result.current.handleSubmit(formData);
      });

      // Assert
      expect(mockCreateProduct).toHaveBeenCalledWith({
        name: 'CONSIGNADO - INSS - INSS Aposentados',
        juros: 1.5,
        prazoMaximo: 60,
        normativo: 'Normativo INSS',
        categoria: 'CONSIGNADO',
        subtipo: 'INSS',
        configuracoes: formData
      });
    });

    it('should create CONSIGNADO product without convenio', async () => {
      // Arrange
      const formData: FormData = {
        categoria: 'CONSIGNADO',
        subtipo: 'CONVENIO',
        name: '',
        interestRate: '',
        maxTerm: '',
        normative: 'Normativo FUNCEF',
        observacoes: [],
        fonte_dados: 'Cadastro automático',
        prazo_min_meses: 1,
        prazo_max_meses: 420,
        taxa_faixa_a_concessao: 2.0,
        prazo_maximo: 48
      };

      mockCreateProduct.mockResolvedValue({});

      // Act
      const { result } = renderHook(() => useFormSubmission());
      await act(async () => {
        await result.current.handleSubmit(formData);
      });

      // Assert
      expect(mockCreateProduct).toHaveBeenCalledWith({
        name: 'CONSIGNADO - CONVENIO',
        juros: 2.0,
        prazoMaximo: 48,
        normativo: 'Normativo FUNCEF',
        categoria: 'CONSIGNADO',
        subtipo: 'CONVENIO',
        configuracoes: formData
      });
    });

    it('should handle invalid interestRate for OUTRO category', async () => {
      // Arrange
      const formData: FormData = {
        categoria: 'OUTRO',
        subtipo: '',
        name: 'Test Service',
        interestRate: 'invalid',
        maxTerm: '',
        normative: '',
        observacoes: [],
        fonte_dados: 'Cadastro automático',
        prazo_min_meses: 1,
        prazo_max_meses: 12
      };

      mockCreateProduct.mockResolvedValue({});

      // Act
      const { result } = renderHook(() => useFormSubmission());
      await act(async () => {
        await result.current.handleSubmit(formData);
      });

      // Assert
      expect(mockCreateProduct).toHaveBeenCalledWith(
        expect.objectContaining({
          juros: 1.0 // Should fallback to 1.0
        })
      );
    });

    it('should not add prazoMinimo when OUTRO prazo_min_meses is 0', async () => {
      // Arrange
      const formData: FormData = {
        categoria: 'OUTRO',
        subtipo: '',
        name: 'Test Service',
        interestRate: '2.0',
        maxTerm: '',
        normative: '',
        observacoes: [],
        fonte_dados: 'Cadastro automático',
        prazo_min_meses: 0,
        prazo_max_meses: 12
      };

      mockCreateProduct.mockResolvedValue({});

      // Act
      const { result } = renderHook(() => useFormSubmission());
      await act(async () => {
        await result.current.handleSubmit(formData);
      });

      // Assert
      expect(mockCreateProduct).toHaveBeenCalledWith({
        name: 'Test Service',
        juros: 2.0,
        prazoMaximo: 12,
        normativo: '',
        categoria: 'OUTRO',
        subtipo: 'GENERICO',
        configuracoes: formData
        // prazoMinimo should not be present
      });
    });

    it('should not add prazoMinimo when OUTRO prazo_min_meses is undefined', async () => {
      // Arrange
      const formData: FormData = {
        categoria: 'OUTRO',
        subtipo: '',
        name: 'Test Service',
        interestRate: '1.5',
        maxTerm: '',
        normative: '',
        observacoes: [],
        fonte_dados: 'Cadastro automático',
        prazo_max_meses: 24
      };

      mockCreateProduct.mockResolvedValue({});

      // Act
      const { result } = renderHook(() => useFormSubmission());
      await act(async () => {
        await result.current.handleSubmit(formData);
      });

      // Assert
      const callArgs = mockCreateProduct.mock.calls[0][0];
      expect(callArgs).not.toHaveProperty('prazoMinimo');
    });

    it('should handle createProduct error gracefully', async () => {
      // Arrange
      const formData: FormData = {
        categoria: 'HABITACAO',
        subtipo: '',
        name: '',
        interestRate: '',
        maxTerm: '',
        normative: '',
        observacoes: [],
        fonte_dados: 'Cadastro automático',
        prazo_min_meses: 1,
        prazo_max_meses: 420
      };

      mockCreateProduct.mockRejectedValue(new Error('Creation failed'));

      // Act
      const { result } = renderHook(() => useFormSubmission());
      await act(async () => {
        await result.current.handleSubmit(formData);
      });

      // Assert
      expect(mockCreateProduct).toHaveBeenCalled();
      expect(mockGoBack).not.toHaveBeenCalled(); // Should not navigate on error
    });

    it('should handle default values correctly for HABITACAO', async () => {
      // Arrange
      const formData: FormData = {
        categoria: 'HABITACAO',
        subtipo: '',
        name: '',
        interestRate: '',
        maxTerm: '',
        normative: '',
        observacoes: [],
        fonte_dados: 'Cadastro automático',
        prazo_min_meses: 1,
        prazo_max_meses: 420
      };

      mockCreateProduct.mockResolvedValue({});

      // Act
      const { result } = renderHook(() => useFormSubmission());
      await act(async () => {
        await result.current.handleSubmit(formData);
      });

      // Assert
      expect(mockCreateProduct).toHaveBeenCalledWith({
        name: 'Habitação',
        juros: 1.0,
        prazoMaximo: 0,
        normativo: '',
        categoria: 'HABITACAO',
        subtipo: 'SAC',
        configuracoes: formData
      });
    });
  });

  describe('isLoading', () => {
    it('should return loading state from useCreateProduct', () => {
      // Arrange
      mockUseCreateProduct.mockReturnValue({
        createProduct: mockCreateProduct,
        loading: true,
        error: null,
        clearError: jest.fn(),
      });

      // Act
      const { result } = renderHook(() => useFormSubmission());

      // Assert
      expect(result.current.isLoading).toBe(true);
    });

    it('should return false when not loading', () => {
      // Arrange
      mockUseCreateProduct.mockReturnValue({
        createProduct: mockCreateProduct,
        loading: false,
        error: null,
        clearError: jest.fn(),
      });

      // Act
      const { result } = renderHook(() => useFormSubmission());

      // Assert
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('hook dependencies', () => {
    it('should call useNavigation and useCreateProduct', () => {
      // Act
      renderHook(() => useFormSubmission());

      // Assert
      expect(mockNavigation).toHaveBeenCalled();
      expect(mockUseCreateProduct).toHaveBeenCalled();
    });
  });
});
