import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import EnhancedCreateProduct from './EnhancedCreateProduct';
import { useEnhancedCreateProduct } from './hooks';

// Mock dos hooks
jest.mock('./hooks');
jest.mock('@react-navigation/native', () => {
  const actual = jest.requireActual('@react-navigation/native');
  return {
    ...actual,
    useNavigation: jest.fn(),
  };
});

// Mock dos componentes filhos
jest.mock('./components', () => ({
  Header: ({ onGoBack, title }: { onGoBack: () => void; title: string }) => {
    const { View, Text, TouchableOpacity } = require('react-native');
    return (
      <View testID="header-component">
        <TouchableOpacity testID="back-button" onPress={onGoBack}>
          <Text>Back</Text>
        </TouchableOpacity>
        <Text testID="header-title">{title}</Text>
      </View>
    );
  },
  CategorySelector: ({ selectedCategory, onCategorySelect }: { 
    selectedCategory: string; 
    onCategorySelect: (category: string) => void; 
  }) => {
    const { View, Text, TouchableOpacity } = require('react-native');
    return (
      <View testID="category-selector">
        <Text testID="selected-category">{selectedCategory || 'None'}</Text>
        <TouchableOpacity 
          testID="select-consignado" 
          onPress={() => onCategorySelect('CONSIGNADO')}
        >
          <Text>CONSIGNADO</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          testID="select-habitacao" 
          onPress={() => onCategorySelect('HABITACAO')}
        >
          <Text>HABITACAO</Text>
        </TouchableOpacity>
      </View>
    );
  },
  BasicInfoFields: ({ formData, onUpdateField, showFields }: { 
    formData: any; 
    onUpdateField: (field: string, value: any) => void; 
    showFields: boolean; 
  }) => {
    const { View, Text, TextInput } = require('react-native');
    if (!showFields) return null;
    return (
      <View testID="basic-info-fields">
        <Text>Basic Info Fields</Text>
        <TextInput
          testID="name-input"
          value={formData.nome || ''}
          onChangeText={(value: string) => onUpdateField('nome', value)}
          placeholder="Nome do produto"
        />
        <TextInput
          testID="description-input"
          value={formData.descricao || ''}
          onChangeText={(value: string) => onUpdateField('descricao', value)}
          placeholder="Descrição do produto"
        />
      </View>
    );
  },
  SubmitButton: ({ canSubmit, loading, onSubmit }: { 
    canSubmit: string | false; 
    loading: boolean; 
    onSubmit: () => void; 
  }) => {
    const { View, Text, TouchableOpacity } = require('react-native');
    const isDisabled = !canSubmit || loading;
    return (
      <View testID="submit-button">
        <TouchableOpacity 
          testID="submit-btn" 
          onPress={onSubmit}
          disabled={isDisabled}
          accessibilityState={{ disabled: isDisabled }}
        >
          <Text>{loading ? 'Saving...' : 'Save Product'}</Text>
        </TouchableOpacity>
      </View>
    );
  },
}));

// Mock dos estilos
jest.mock('./EnhancedCreateProduct.styles', () => ({
  styles: {
    container: { flex: 1 },
    content: { padding: 16 },
  },
}));

const mockUseEnhancedCreateProduct = useEnhancedCreateProduct as jest.MockedFunction<typeof useEnhancedCreateProduct>;
const mockUseNavigation = require('@react-navigation/native').useNavigation as jest.MockedFunction<any>;

const createMockNavigation = () => ({
  goBack: jest.fn(),
  navigate: jest.fn(),
  replace: jest.fn(),
  dispatch: jest.fn(),
  setParams: jest.fn(),
  addListener: jest.fn(),
  removeListener: jest.fn(),
  isFocused: jest.fn(() => true),
  canGoBack: jest.fn(() => true),
  getId: jest.fn(() => 'test-id'),
  getParent: jest.fn(),
  getState: jest.fn(() => ({ index: 0, routes: [] })),
  setOptions: jest.fn(),
  reset: jest.fn(),
  push: jest.fn(),
  pop: jest.fn(),
  popToTop: jest.fn(),
});

const renderWithNavigation = () => {
  const navigation = createMockNavigation();
  mockUseNavigation.mockReturnValue(navigation);
  
  return {
    ...render(
      <NavigationContainer>
        <EnhancedCreateProduct />
      </NavigationContainer>
    ),
    navigation,
  };
};

describe('EnhancedCreateProduct', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup padrão do hook
    mockUseEnhancedCreateProduct.mockReturnValue({
      formData: {
        categoria: '',
        subtipo: '',
        nome: '',
        descricao: '',
        prazo_minimo: 1,
        prazo_maximo: 96,
        margem_consignavel: 35,
        canais_permitidos: [],
        taxa_faixa_a_concessao: 0,
        taxa_faixa_a_renovacao: 0,
        taxa_faixa_b_concessao: 0,
        taxa_faixa_b_renovacao: 0,
        taxa_faixa_c_concessao: 0,
        taxa_faixa_c_renovacao: 0,
        exige_validacao_remota: true,
        exige_validacao_presencial: false,
        exige_certificacao_digital: false,
        observacoes: []
      },
      availableConvenios: [],
      selectedConvenio: null,
      loading: false,
      canSubmit: '', // string vazia representa false
      updateFormField: jest.fn(),
      handleCategorySelect: jest.fn(),
      handleSubmit: jest.fn(),
      setSelectedConvenio: jest.fn(),
    });
  });

  it('should render correctly with default state', () => {
    renderWithNavigation();
    
    expect(screen.getByTestId('header-component')).toBeTruthy();
    expect(screen.getByTestId('header-title')).toHaveTextContent('Novo Produto');
    expect(screen.getByTestId('category-selector')).toBeTruthy();
    expect(screen.getByTestId('submit-button')).toBeTruthy();
  });

  it('should call navigation goBack when header back button is pressed', () => {
    const { navigation } = renderWithNavigation();
    
    fireEvent.press(screen.getByTestId('back-button'));
    
    expect(navigation.goBack).toHaveBeenCalled();
  });

  it('should call handleCategorySelect when category is selected', () => {
    const mockHandleCategorySelect = jest.fn();
    mockUseEnhancedCreateProduct.mockReturnValue({
      formData: {
        categoria: '',
        subtipo: '',
        nome: '',
        descricao: '',
        prazo_minimo: 1,
        prazo_maximo: 96,
        margem_consignavel: 35,
        canais_permitidos: [],
        taxa_faixa_a_concessao: 0,
        taxa_faixa_a_renovacao: 0,
        taxa_faixa_b_concessao: 0,
        taxa_faixa_b_renovacao: 0,
        taxa_faixa_c_concessao: 0,
        taxa_faixa_c_renovacao: 0,
        exige_validacao_remota: true,
        exige_validacao_presencial: false,
        exige_certificacao_digital: false,
        observacoes: []
      },
      availableConvenios: [],
      selectedConvenio: null,
      loading: false,
      canSubmit: '',
      updateFormField: jest.fn(),
      handleCategorySelect: mockHandleCategorySelect,
      handleSubmit: jest.fn(),
      setSelectedConvenio: jest.fn(),
    });
    
    renderWithNavigation();
    
    fireEvent.press(screen.getByTestId('select-consignado'));
    
    expect(mockHandleCategorySelect).toHaveBeenCalledWith('CONSIGNADO');
  });

  it('should show basic info fields when category and subtipo are selected', () => {
    mockUseEnhancedCreateProduct.mockReturnValue({
      formData: {
        categoria: 'CONSIGNADO',
        subtipo: 'INSS',
        nome: '',
        descricao: '',
        prazo_minimo: 1,
        prazo_maximo: 96,
        margem_consignavel: 35,
        canais_permitidos: [],
        taxa_faixa_a_concessao: 0,
        taxa_faixa_a_renovacao: 0,
        taxa_faixa_b_concessao: 0,
        taxa_faixa_b_renovacao: 0,
        taxa_faixa_c_concessao: 0,
        taxa_faixa_c_renovacao: 0,
        exige_validacao_remota: true,
        exige_validacao_presencial: false,
        exige_certificacao_digital: false,
        observacoes: []
      },
      availableConvenios: [],
      selectedConvenio: null,
      loading: false,
      canSubmit: 'Test Product',
      updateFormField: jest.fn(),
      handleCategorySelect: jest.fn(),
      handleSubmit: jest.fn(),
      setSelectedConvenio: jest.fn(),
    });
    
    renderWithNavigation();
    
    expect(screen.getByTestId('basic-info-fields')).toBeTruthy();
    expect(screen.getByText('Basic Info Fields')).toBeTruthy();
  });

  it('should hide basic info fields when category or subtipo is not selected', () => {
    mockUseEnhancedCreateProduct.mockReturnValue({
      formData: {
        categoria: 'CONSIGNADO',
        subtipo: '', // subtipo vazio
        nome: '',
        descricao: '',
        prazo_minimo: 1,
        prazo_maximo: 96,
        margem_consignavel: 35,
        canais_permitidos: [],
        taxa_faixa_a_concessao: 0,
        taxa_faixa_a_renovacao: 0,
        taxa_faixa_b_concessao: 0,
        taxa_faixa_b_renovacao: 0,
        taxa_faixa_c_concessao: 0,
        taxa_faixa_c_renovacao: 0,
        exige_validacao_remota: true,
        exige_validacao_presencial: false,
        exige_certificacao_digital: false,
        observacoes: []
      },
      availableConvenios: [],
      selectedConvenio: null,
      loading: false,
      canSubmit: "",
      updateFormField: jest.fn(),
      handleCategorySelect: jest.fn(),
      handleSubmit: jest.fn(),
      setSelectedConvenio: jest.fn(),
    });
    
    renderWithNavigation();
    
    expect(screen.queryByTestId('basic-info-fields')).toBeNull();
  });

  it('should call updateFormField when form inputs change', () => {
    const mockUpdateFormField = jest.fn();
    mockUseEnhancedCreateProduct.mockReturnValue({
      formData: {
        categoria: 'CONSIGNADO',
        subtipo: 'INSS',
        nome: 'Test Product',
        descricao: 'Test Description',
        prazo_minimo: 1,
        prazo_maximo: 96,
        margem_consignavel: 35,
        canais_permitidos: [],
        taxa_faixa_a_concessao: 0,
        taxa_faixa_a_renovacao: 0,
        taxa_faixa_b_concessao: 0,
        taxa_faixa_b_renovacao: 0,
        taxa_faixa_c_concessao: 0,
        taxa_faixa_c_renovacao: 0,
        exige_validacao_remota: true,
        exige_validacao_presencial: false,
        exige_certificacao_digital: false,
        observacoes: []
      },
      availableConvenios: [],
      selectedConvenio: null,
      loading: false,
      canSubmit: 'Test Product',
      updateFormField: mockUpdateFormField,
      handleCategorySelect: jest.fn(),
      handleSubmit: jest.fn(),
      setSelectedConvenio: jest.fn(),
    });
    
    renderWithNavigation();
    
    fireEvent.changeText(screen.getByTestId('name-input'), 'New Product Name');
    fireEvent.changeText(screen.getByTestId('description-input'), 'New Description');
    
    expect(mockUpdateFormField).toHaveBeenCalledWith('nome', 'New Product Name');
    expect(mockUpdateFormField).toHaveBeenCalledWith('descricao', 'New Description');
  });

  it('should call handleSubmit when submit button is pressed', () => {
    const mockHandleSubmit = jest.fn();
    
    mockUseEnhancedCreateProduct.mockReturnValue({
      formData: {
        categoria: 'CONSIGNADO',
        subtipo: 'INSS',
        nome: 'Test Product',
        descricao: 'Test Description',
        prazo_minimo: 1,
        prazo_maximo: 96,
        margem_consignavel: 35,
        canais_permitidos: [],
        taxa_faixa_a_concessao: 0,
        taxa_faixa_a_renovacao: 0,
        taxa_faixa_b_concessao: 0,
        taxa_faixa_b_renovacao: 0,
        taxa_faixa_c_concessao: 0,
        taxa_faixa_c_renovacao: 0,
        exige_validacao_remota: true,
        exige_validacao_presencial: false,
        exige_certificacao_digital: false,
        observacoes: []
      },
      availableConvenios: [],
      selectedConvenio: null,
      loading: false,
      canSubmit: 'Test Product',
      updateFormField: jest.fn(),
      handleCategorySelect: jest.fn(),
      handleSubmit: mockHandleSubmit,
      setSelectedConvenio: jest.fn(),
    });
    
    const { navigation } = renderWithNavigation();
    
    fireEvent.press(screen.getByTestId('submit-btn'));
    
    expect(mockHandleSubmit).toHaveBeenCalledWith(expect.any(Function));
    
    // Verificar se a callback faz goBack
    const callback = mockHandleSubmit.mock.calls[0][0];
    callback();
    expect(navigation.goBack).toHaveBeenCalled();
  });

  it('should disable submit button when canSubmit is false', () => {
    renderWithNavigation(); // uses default mock with canSubmit: ''
    
    const submitButton = screen.getByTestId('submit-btn');
    expect(submitButton.props.accessibilityState?.disabled).toBe(true);
  });

  it('should disable submit button when loading is true', () => {
    mockUseEnhancedCreateProduct.mockReturnValue({
      formData: {
        categoria: 'CONSIGNADO',
        subtipo: 'INSS',
        nome: 'Test',
        descricao: 'Test Description',
        prazo_minimo: 1,
        prazo_maximo: 96,
        margem_consignavel: 35,
        canais_permitidos: [],
        taxa_faixa_a_concessao: 0,
        taxa_faixa_a_renovacao: 0,
        taxa_faixa_b_concessao: 0,
        taxa_faixa_b_renovacao: 0,
        taxa_faixa_c_concessao: 0,
        taxa_faixa_c_renovacao: 0,
        exige_validacao_remota: true,
        exige_validacao_presencial: false,
        exige_certificacao_digital: false,
        observacoes: []
      },
      availableConvenios: [],
      selectedConvenio: null,
      loading: true,
      canSubmit: 'Test',
      updateFormField: jest.fn(),
      handleCategorySelect: jest.fn(),
      handleSubmit: jest.fn(),
      setSelectedConvenio: jest.fn(),
    });
    
    renderWithNavigation();
    
    const submitButton = screen.getByTestId('submit-btn');
    expect(submitButton.props.accessibilityState?.disabled).toBe(true);
    expect(screen.getByText('Saving...')).toBeTruthy();
  });

  it('should show different categories in category selector', () => {
    renderWithNavigation();
    
    expect(screen.getByText('CONSIGNADO')).toBeTruthy();
    expect(screen.getByText('HABITACAO')).toBeTruthy();
  });

  it('should display selected category correctly', () => {
    mockUseEnhancedCreateProduct.mockReturnValue({
      formData: {
        categoria: 'HABITACAO',
        subtipo: '',
        nome: '',
        descricao: '',
        prazo_minimo: 1,
        prazo_maximo: 96,
        margem_consignavel: 35,
        canais_permitidos: [],
        taxa_faixa_a_concessao: 0,
        taxa_faixa_a_renovacao: 0,
        taxa_faixa_b_concessao: 0,
        taxa_faixa_b_renovacao: 0,
        taxa_faixa_c_concessao: 0,
        taxa_faixa_c_renovacao: 0,
        exige_validacao_remota: true,
        exige_validacao_presencial: false,
        exige_certificacao_digital: false,
        observacoes: []
      },
      availableConvenios: [],
      selectedConvenio: null,
      loading: false,
      canSubmit: "",
      updateFormField: jest.fn(),
      handleCategorySelect: jest.fn(),
      handleSubmit: jest.fn(),
      setSelectedConvenio: jest.fn(),
    });
    
    renderWithNavigation();
    
    expect(screen.getByTestId('selected-category')).toHaveTextContent('HABITACAO');
  });

  it('should display "None" when no category is selected', () => {
    renderWithNavigation();
    
    expect(screen.getByTestId('selected-category')).toHaveTextContent('None');
  });

  it('should handle all category selections', () => {
    const mockHandleCategorySelect = jest.fn();
    mockUseEnhancedCreateProduct.mockReturnValue({
      formData: {
        categoria: '',
        subtipo: '',
        nome: '',
        descricao: '',
        prazo_minimo: 1,
        prazo_maximo: 96,
        margem_consignavel: 35,
        canais_permitidos: [],
        taxa_faixa_a_concessao: 0,
        taxa_faixa_a_renovacao: 0,
        taxa_faixa_b_concessao: 0,
        taxa_faixa_b_renovacao: 0,
        taxa_faixa_c_concessao: 0,
        taxa_faixa_c_renovacao: 0,
        exige_validacao_remota: true,
        exige_validacao_presencial: false,
        exige_certificacao_digital: false,
        observacoes: []
      },
      availableConvenios: [],
      selectedConvenio: null,
      loading: false,
      canSubmit: "",
      updateFormField: jest.fn(),
      handleCategorySelect: mockHandleCategorySelect,
      handleSubmit: jest.fn(),
      setSelectedConvenio: jest.fn(),
    });
    
    renderWithNavigation();
    
    fireEvent.press(screen.getByTestId('select-consignado'));
    expect(mockHandleCategorySelect).toHaveBeenCalledWith('CONSIGNADO');
    
    fireEvent.press(screen.getByTestId('select-habitacao'));
    expect(mockHandleCategorySelect).toHaveBeenCalledWith('HABITACAO');
  });

  it('should render with complete form data', () => {
    mockUseEnhancedCreateProduct.mockReturnValue({
      formData: {
        categoria: 'HABITACAO',
        subtipo: 'N/A',
        nome: 'Produto Completo',
        descricao: 'Descrição completa',
        prazo_minimo: 1,
        prazo_maximo: 96,
        margem_consignavel: 35,
        canais_permitidos: [],
        taxa_faixa_a_concessao: 0,
        taxa_faixa_a_renovacao: 0,
        taxa_faixa_b_concessao: 0,
        taxa_faixa_b_renovacao: 0,
        taxa_faixa_c_concessao: 0,
        taxa_faixa_c_renovacao: 0,
        exige_validacao_remota: true,
        exige_validacao_presencial: false,
        exige_certificacao_digital: false,
        observacoes: []
      },
      availableConvenios: [],
      selectedConvenio: null,
      loading: false,
      canSubmit: 'Produto Completo',
      updateFormField: jest.fn(),
      handleCategorySelect: jest.fn(),
      handleSubmit: jest.fn(),
      setSelectedConvenio: jest.fn(),
    });
    
    renderWithNavigation();
    
    expect(screen.getByTestId('selected-category')).toHaveTextContent('HABITACAO');
    expect(screen.getByTestId('basic-info-fields')).toBeTruthy();
    expect(screen.getByDisplayValue('Produto Completo')).toBeTruthy();
    expect(screen.getByDisplayValue('Descrição completa')).toBeTruthy();
    expect(screen.getByText('Save Product')).toBeTruthy();
  });

  it('should handle loading state correctly', () => {
    mockUseEnhancedCreateProduct.mockReturnValue({
      formData: {
        categoria: 'CONSIGNADO',
        subtipo: 'INSS',
        nome: 'Test',
        descricao: 'Test Description',
        prazo_minimo: 1,
        prazo_maximo: 96,
        margem_consignavel: 35,
        canais_permitidos: [],
        taxa_faixa_a_concessao: 0,
        taxa_faixa_a_renovacao: 0,
        taxa_faixa_b_concessao: 0,
        taxa_faixa_b_renovacao: 0,
        taxa_faixa_c_concessao: 0,
        taxa_faixa_c_renovacao: 0,
        exige_validacao_remota: true,
        exige_validacao_presencial: false,
        exige_certificacao_digital: false,
        observacoes: []
      },
      availableConvenios: [],
      selectedConvenio: null,
      loading: true,
      canSubmit: 'Test',
      updateFormField: jest.fn(),
      handleCategorySelect: jest.fn(),
      handleSubmit: jest.fn(),
      setSelectedConvenio: jest.fn(),
    });
    
    renderWithNavigation();
    
    expect(screen.getByText('Saving...')).toBeTruthy();
    expect(screen.getByTestId('submit-btn').props.accessibilityState?.disabled).toBe(true);
  });

  it('should calculate showBasicFields correctly for different states', () => {
    // Test case 1: No category, no subtipo
    const { rerender } = renderWithNavigation();
    expect(screen.queryByTestId('basic-info-fields')).toBeNull();
    
    // Test case 2: Category but no subtipo
    mockUseEnhancedCreateProduct.mockReturnValue({
      formData: {
        categoria: 'CONSIGNADO',
        subtipo: '',
        nome: '',
        descricao: '',
        prazo_minimo: 1,
        prazo_maximo: 96,
        margem_consignavel: 35,
        canais_permitidos: [],
        taxa_faixa_a_concessao: 0,
        taxa_faixa_a_renovacao: 0,
        taxa_faixa_b_concessao: 0,
        taxa_faixa_b_renovacao: 0,
        taxa_faixa_c_concessao: 0,
        taxa_faixa_c_renovacao: 0,
        exige_validacao_remota: true,
        exige_validacao_presencial: false,
        exige_certificacao_digital: false,
        observacoes: []
      },
      availableConvenios: [],
      selectedConvenio: null,
      loading: false,
      canSubmit: "",
      updateFormField: jest.fn(),
      handleCategorySelect: jest.fn(),
      handleSubmit: jest.fn(),
      setSelectedConvenio: jest.fn(),
    });
    
    rerender(
      <NavigationContainer>
        <EnhancedCreateProduct />
      </NavigationContainer>
    );
    expect(screen.queryByTestId('basic-info-fields')).toBeNull();
    
    // Test case 3: Both category and subtipo
    mockUseEnhancedCreateProduct.mockReturnValue({
      formData: {
        categoria: 'CONSIGNADO',
        subtipo: 'INSS',
        nome: '',
        descricao: '',
        prazo_minimo: 1,
        prazo_maximo: 96,
        margem_consignavel: 35,
        canais_permitidos: [],
        taxa_faixa_a_concessao: 0,
        taxa_faixa_a_renovacao: 0,
        taxa_faixa_b_concessao: 0,
        taxa_faixa_b_renovacao: 0,
        taxa_faixa_c_concessao: 0,
        taxa_faixa_c_renovacao: 0,
        exige_validacao_remota: true,
        exige_validacao_presencial: false,
        exige_certificacao_digital: false,
        observacoes: []
      },
      availableConvenios: [],
      selectedConvenio: null,
      loading: false,
      canSubmit: 'Product Name',
      updateFormField: jest.fn(),
      handleCategorySelect: jest.fn(),
      handleSubmit: jest.fn(),
      setSelectedConvenio: jest.fn(),
    });
    
    rerender(
      <NavigationContainer>
        <EnhancedCreateProduct />
      </NavigationContainer>
    );
    expect(screen.getByTestId('basic-info-fields')).toBeTruthy();
  });

  it('should handle form data variations', () => {
    // Test with minimal data
    mockUseEnhancedCreateProduct.mockReturnValue({
      formData: {
        categoria: '',
        subtipo: '',
        nome: '',
        descricao: '',
        prazo_minimo: 1,
        prazo_maximo: 96,
        margem_consignavel: 35,
        canais_permitidos: [],
        taxa_faixa_a_concessao: 0,
        taxa_faixa_a_renovacao: 0,
        taxa_faixa_b_concessao: 0,
        taxa_faixa_b_renovacao: 0,
        taxa_faixa_c_concessao: 0,
        taxa_faixa_c_renovacao: 0,
        exige_validacao_remota: true,
        exige_validacao_presencial: false,
        exige_certificacao_digital: false,
        observacoes: []
      },
      availableConvenios: [],
      selectedConvenio: null,
      loading: false,
      canSubmit: "",
      updateFormField: jest.fn(),
      handleCategorySelect: jest.fn(),
      handleSubmit: jest.fn(),
      setSelectedConvenio: jest.fn(),
    });
    
    expect(() => renderWithNavigation()).not.toThrow();
    expect(screen.getByTestId('selected-category')).toHaveTextContent('None');
  });

  it('should render all required components', () => {
    renderWithNavigation();
    
    // Check all main components are present
    expect(screen.getByTestId('header-component')).toBeTruthy();
    expect(screen.getByTestId('category-selector')).toBeTruthy();
    expect(screen.getByTestId('submit-button')).toBeTruthy();
    
    // Check header content
    expect(screen.getByTestId('header-title')).toHaveTextContent('Novo Produto');
    expect(screen.getByTestId('back-button')).toBeTruthy();
  });
});
