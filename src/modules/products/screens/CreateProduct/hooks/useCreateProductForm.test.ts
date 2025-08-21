import { renderHook, act } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useCreateProductForm } from './useCreateProductForm';

// Mock do react-navigation
jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}));

// Mock do Alert
jest.spyOn(Alert, 'alert');

describe('useCreateProductForm', () => {
  const mockGoBack = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigation as jest.Mock).mockReturnValue({
      goBack: mockGoBack,
    });
  });

  it('initializes with default values', () => {
    const { result } = renderHook(() => useCreateProductForm());

    expect(result.current.formData).toEqual({
      name: '',
      interestRate: '',
      maxTerm: '',
      normative: '',
    });
    expect(result.current.errors).toEqual({});
    expect(result.current.touched).toEqual({});
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isFormValid).toBe(false);
  });

  it('updates field value correctly', () => {
    const { result } = renderHook(() => useCreateProductForm());

    act(() => {
      result.current.updateField('name', 'Test Product');
    });

    expect(result.current.formData.name).toBe('Test Product');
  });

  it('handles blur correctly', () => {
    const { result } = renderHook(() => useCreateProductForm());

    act(() => {
      result.current.handleBlur('name');
    });

    expect(result.current.touched['name']).toBe(true);
    expect(result.current.errors.name).toBeDefined(); // Campo vazio deve ter erro
  });

  it('validates all fields on submit with errors', async () => {
    const { result } = renderHook(() => useCreateProductForm());

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(result.current.touched['name']).toBe(true);
    expect(result.current.touched['interestRate']).toBe(true);
    expect(result.current.touched['maxTerm']).toBe(true);
    expect(result.current.touched['normative']).toBe(true);
    expect(Object.keys(result.current.errors)).toHaveLength(4); // Todos os campos devem ter erro
  });

  it('submits successfully with valid data', async () => {
    const { result } = renderHook(() => useCreateProductForm());

    // Preenche com dados válidos
    act(() => {
      result.current.updateField('name', 'Produto de Teste');
      result.current.updateField('interestRate', '5.5');
      result.current.updateField('maxTerm', '12');
      result.current.updateField('normative', 'Normativa de teste');
    });

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(Alert.alert).toHaveBeenCalledWith(
      'Sucesso!',
      'Produto cadastrado com sucesso.',
      expect.any(Array)
    );
  });

  it('handles loading state during submit', async () => {
    const { result } = renderHook(() => useCreateProductForm());

    // Preenche com dados válidos
    act(() => {
      result.current.updateField('name', 'Produto de Teste');
      result.current.updateField('interestRate', '5.5');
      result.current.updateField('maxTerm', '12');
      result.current.updateField('normative', 'Normativa de teste');
    });

    // Inicia submit sem esperar
    act(() => {
      result.current.handleSubmit();
    });

    expect(result.current.isLoading).toBe(true);
  });

  it('has scrollViewRef initialized', () => {
    const { result } = renderHook(() => useCreateProductForm());

    expect(result.current.scrollViewRef).toBeDefined();
    expect(result.current.scrollViewRef.current).toBeNull();
  });

  it('calls scrollToFirstError when form has errors on submit', async () => {
    const { result } = renderHook(() => useCreateProductForm());
    
    const mockScrollTo = jest.fn();
    result.current.scrollViewRef.current = {
      scrollTo: mockScrollTo,
    } as any;

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(mockScrollTo).toHaveBeenCalledWith({ y: 0, animated: true });
  });

  it('validates field in real time when field was already touched', () => {
    const { result } = renderHook(() => useCreateProductForm());

    // Primeiro, marcar o campo como tocado
    act(() => {
      result.current.handleBlur('name');
    });

    // Agora ao atualizar o campo, deve validar em tempo real
    act(() => {
      result.current.updateField('name', ''); // valor inválido
    });

    expect(result.current.errors.name).toBeDefined();

    // Testar com valor válido
    act(() => {
      result.current.updateField('name', 'Produto Válido');
    });

    expect(result.current.errors.name).toBeUndefined();
  });

  it('handles error during submit process', async () => {
    const { result } = renderHook(() => useCreateProductForm());

    // Preenche com dados válidos
    act(() => {
      result.current.updateField('name', 'Produto de Teste');
      result.current.updateField('interestRate', '5.5');
      result.current.updateField('maxTerm', '12');
      result.current.updateField('normative', 'Normativa de teste');
    });

    // Mock para forçar erro no setTimeout
    const mockSetTimeout = jest.spyOn(global, 'setTimeout');
    mockSetTimeout.mockImplementation(() => {
      throw new Error('Network error');
    });

    await act(async () => {
      try {
        await result.current.handleSubmit();
      } catch (error) {
        // Ignorar erro para continuar o teste
      }
    });

    expect(Alert.alert).toHaveBeenCalledWith('Erro', 'Falha ao cadastrar produto. Tente novamente.');
    
    // Limpar mock
    mockSetTimeout.mockRestore();
  });

  it('can call scrollToFirstError directly', () => {
    const { result } = renderHook(() => useCreateProductForm());
    
    const mockScrollTo = jest.fn();
    result.current.scrollViewRef.current = {
      scrollTo: mockScrollTo,
    } as any;

    act(() => {
      result.current.scrollToFirstError();
    });

    expect(mockScrollTo).toHaveBeenCalledWith({ y: 0, animated: true });
  });
});
