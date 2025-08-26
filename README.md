# CAIXA - Sistema de Gerenciamento de Produtos Financeiros

Um aplicativo mobile desenvolvido em React Native para gerenciar produtos financeiros da CAIXA, incluindo crédito consignado e financiamento habitacional.

## � Tecnologias Utilizadas

### Core Technologies
- **React Native** (0.79.5) - Framework para desenvolvimento mobile multiplataforma
- **TypeScript** (5.8.3) - Superset do JavaScript que adiciona tipagem estática
- **Expo** (53.0.20) - Plataforma para desenvolvimento React Native
- **React Navigation** (7.0.0) - Biblioteca para navegação entre telas

### Gerenciamento de Estado
- **React Hooks** - useState, useEffect, useRef para gerenciamento local
- **Custom Hooks** - Hooks personalizados para lógica reutilizável

### UI/UX
- **React Native Safe Area Context** - Gerenciamento de áreas seguras
- **Design System** - Componentes padronizados e reutilizáveis
- **Lottie React Native** (7.1.0) - Animações vetoriais
- **StyleSheet** - Estilização otimizada do React Native

### Estrutura de Dados
- **JSON** - Configurações de produtos em arquivos JSON estruturados
- **Service Layer** - Camada de serviços para acesso aos dados

### Testes e Qualidade
- **Jest** (30.0.0) - Framework de testes unitários
- **ESLint** - Análise estática de código
- **TypeScript Strict Mode** - Tipagem rigorosa

## 📁 Estrutura do Projeto

```
src/
├── design-system/          # Sistema de design e componentes base
│   ├── components/         # Button, Card, InputField, Text, etc.
│   ├── tokens/            # Colors, spacing, typography, shadows
│   └── icons/             # Sistema de ícones unificado
├── hooks/                 # Hooks globais reutilizáveis
├── modules/               # Módulos da aplicação
│   ├── home/             # Módulo da tela inicial
│   │   ├── screens/      # HomeScreen
│   │   └── components/   # LoginBottomSheet
│   ├── products/         # Módulo de produtos financeiros
│   │   ├── screens/      # ProductList, CreateProduct, ProductSimulator
│   │   │   ├── CreateProduct/    # Criação de produtos
│   │   │   │   ├── components/   # CreateProductForm, Header, Footer
│   │   │   │   ├── hooks/        # useCreateProductForm
│   │   │   │   ├── types/        # FormData, FieldName interfaces
│   │   │   │   └── validations/  # Validações de formulários
│   │   │   ├── ProductList/      # Listagem de produtos
│   │   │   └── ProductSimulator/ # Simulador com ExpandPanel
│   │   └── services/     # Serviços do módulo
│   └── splash/           # Módulo de splash screen
│       ├── screens/      # SplashScreen
│       └── components/   # LottieAnimation, SplashFallback
├── services/             # Serviços globais
│   └── ProductDataService.ts  # Singleton para dados de produtos
├── types/                # Tipagens TypeScript globais
├── navigation/           # Sistema de navegação
└── data/                 # Dados estruturados em JSON
    ├── products.index.json      # Índice principal de produtos
    ├── consignado/              # Configurações de consignado
    │   ├── _common_rules.json   # Regras comuns
    │   ├── inss.json           # Configurações INSS
    │   └── convenios/          # Convênios específicos
    │       ├── militar.json    # Comando da Aeronáutica
    │       ├── funcef_new.json # FUNCEF
    │       └── tjdft_new.json  # TJDFT
    └── habitacao/              # Configurações habitacionais
        ├── index.json          # Índice de modelos
        ├── sac.json           # Sistema SAC
        └── price.json         # Sistema Price
```

## 🎯 Boas Práticas Implementadas

### 1. **Arquitetura Modular e Limpa**
```typescript
// Separação por domínio com responsabilidades claras
modules/
├── products/           # Domínio de produtos financeiros
│   ├── screens/       # Apresentação
│   ├── services/      # Lógica de negócio
│   └── types/         # Contratos de dados
```

### 2. **TypeScript Rigoroso**
```typescript
// Tipagem robusta em todas as interfaces
export interface FormData {
  categoria: 'CONSIGNADO' | 'HABITACAO' | '';
  subtipo: 'INSS' | 'CONVENIO' | 'CLT_SUSPENSO' | 'N/A' | '';
  convenio_selected?: string;
  // Campos específicos de Consignado
  prazo_minimo?: number;
  prazo_maximo?: number;
  taxa_faixa_a_concessao?: number;
  // Campos específicos de Habitação
  sistema_amortizacao?: 'SAC' | 'PRICE' | '';
  ltv_max_percentual?: number;
  entrada_min_percentual?: number;
}

// Union types para garantir valores válidos
export type FieldName = keyof FormData;
```

### 3. **Hooks Personalizados**
```typescript
// Encapsulamento de lógica complexa
export const useCreateProductForm = (): UseSimpleFormReturn => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  
  // Função para verificar produtos já cadastrados
  const isConvenioAlreadyRegistered = (convenioKey: string): boolean => {
    return products.some(product => {
      const productName = product.name.toLowerCase();
      const convenioMatches = {
        'inss': ['inss', 'aposentados', 'pensionistas'],
        'militar': ['militar', 'aeronáutica', 'comando'],
        'funcef': ['funcef'],
        'tjdft': ['tjdft', 'tribunal']
      };
      // Lógica de detecção inteligente
    });
  };
  
  // Auto-preenchimento baseado na seleção
  const updateField = (fieldName: FieldName, value: string | number | boolean | string[]) => {
    setFormData(prev => {
      const updatedData = { ...prev, [fieldName]: value };
      
      if (fieldName === 'categoria' && value === 'CONSIGNADO') {
        updatedData.normative = 'CO055 - Crédito Consignado';
      }
      if (fieldName === 'categoria' && value === 'HABITACAO') {
        updatedData.normative = 'HH200 - Financiamento Habitacional';
        updatedData.subtipo = 'N/A';
      }
      return updatedData;
    });
    
    // Carregamento automático de dados
    if (fieldName === 'convenio_selected' && typeof value === 'string') {
      loadConvenioDataSimple(value);
    }
    if (fieldName === 'subtipo' && value === 'INSS') {
      loadConvenioDataSimple('inss');
    }
    if (fieldName === 'categoria' && value === 'HABITACAO') {
      loadHabitacaoDataSimple();
    }
  };
};
```

### 4. **Service Layer com Singleton Pattern**
```typescript
class ProductDataService {
  private static instance: ProductDataService;
  private productCache: Map<string, ProductCategory> = new Map();
  
  static getInstance(): ProductDataService {
    if (!ProductDataService.instance) {
      ProductDataService.instance = new ProductDataService();
    }
    return ProductDataService.instance;
  }

  // Carregamento otimizado com cache
  async loadProduct(productId: string): Promise<ProductCategory> {
    if (this.productCache.has(productId)) {
      return this.productCache.get(productId)!;
    }
    
    // Mapeamento direto dos produtos disponíveis
    switch (productId) {
      case 'consignado_inss':
        product = inssData as unknown as ProductCategory;
        break;
      case 'habitacao_sac':
        product = habitacaoSacData as unknown as ProductCategory;
        break;
      // ... outros casos
    }
    
    this.productCache.set(productId, product);
    return product;
  }
}
```

### 5. **Estrutura de Dados JSON Normalizada**
```json
// data/consignado/inss.json
{
  "id": "consignado_inss",
  "categoria": "CONSIGNADO",
  "subtipo": "INSS",
  "nome_exibicao": "INSS – Consignado",
  "status_contratacao": "ATIVO",
  "prazo": { "minimoMeses": 1, "maximoMeses": 96 },
  "margem_consignavel_max": 35,
  "faixas": {
    "A": {
      "concessao_taxa_am": 1.55,
      "renovacao_taxa_am": 1.55,
      "condicoes_acesso": ["Agência/AgD", "Seguro prestamista"]
    },
    "B": {
      "concessao_taxa_am": 1.58,
      "renovacao_taxa_am": 1.61,
      "condicoes_acesso": ["Crédito salário", "Open Finance"]
    },
    "C": {
      "concessao_taxa_am": 1.66,
      "renovacao_taxa_am": 1.75,
      "condicoes_acesso": ["Sem requisitos adicionais"]
    }
  },
  "auditoria": {
    "fonte": "Tabela interna de taxas; 21/08",
    "atualizado_em": "2025-08-21T09:35:00-03:00"
  }
}

// data/habitacao/sac.json
{
  "id": "habitacao_sac",
  "categoria": "HABITACAO",
  "sistema_amortizacao": "SAC",
  "nome_exibicao": "Habitação",
  "prazo": { "minimoMeses": 60, "maximoMeses": 420 },
  "ltv_limites": {
    "financiamento_max_percentual": 70,
    "entrada_min_percentual": 30
  },
  "indexadores_permitidos": [
    { "id": "TR", "descricao": "Taxa Referencial" },
    { "id": "IPCA", "descricao": "Índice de Preços ao Consumidor Amplo" }
  ],
  "seguros_obrigatorios": [
    { "id": "MIP", "descricao": "Morte e Invalidez Permanente" },
    { "id": "DFI", "descricao": "Danos Físicos ao Imóvel" }
  ]
}
```

### 6. **Validação Granular de Formulários**
```typescript
// Validações específicas por campo
export const validateCategoria = (value: string): FieldValidation => {
  if (!value.trim()) {
    return { isValid: false, error: 'Categoria é obrigatória' };
  }
  const validCategories = ['CONSIGNADO', 'HABITACAO'];
  if (!validCategories.includes(value)) {
    return { isValid: false, error: 'Categoria inválida' };
  }
  return { isValid: true };
};

// Validação contextual
export const validateForm = (formData: FormData): boolean => {
  const categoriaValid = validateCategoria(formData.categoria).isValid;
  const subtipoValid = validateSubtipo(formData.subtipo).isValid;

  return categoriaValid && 
         subtipoValid && 
         (formData.categoria === 'HABITACAO' || 
          (formData.subtipo && 
           (formData.subtipo !== 'CONVENIO' || formData.convenio_selected)));
};
```

### 7. **Design System Consistente**
```typescript
// Tokens de design centralizados
export const tokens = {
  colors: {
    primary: '#1E40AF',
    secondary: '#64748B',
    background: '#F8FAFC',
    surface: '#FFFFFF',
    error: '#EF4444',
    success: '#10B981'
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32
  }
};

// Componentes reutilizáveis tipados
interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  disabled?: boolean;
  loading?: boolean;
}
```

### 8. **Error Handling e Logging**
```typescript
// Tratamento gracioso de erros
const handleSubmit = async () => {
  try {
    console.log('🚀 Criando produto:', productData);
    await createProduct(productData);
    navigation.goBack();
  } catch (error) {
    console.error('❌ Erro ao criar produto:', error);
    // UI feedback para o usuário
  }
};

// Logging estruturado
const loadConvenioDataSimple = async (convenioKey: string) => {
  try {
    console.log(`🔄 Carregando dados do convênio: ${convenioKey}`);
    const convenioData = await productService.loadConvenio(convenioKey);
    if (convenioData) {
      console.log(`✅ Dados carregados: ${convenioData.nome_exibicao}`);
      // Processamento dos dados
    }
  } catch (error) {
    console.error(`❌ Erro ao carregar convênio ${convenioKey}:`, error);
    throw error;
  }
};
```

## 🏗️ Funcionalidades Implementadas

### ✅ Gestão de Produtos Consignado
- **INSS**: Aposentados e pensionistas com 3 faixas de taxas
- **Convênios Específicos**: 
  - Militar (Comando da Aeronáutica)
  - FUNCEF (Empregados da FUNCEF)  
  - TJDFT (Tribunal de Justiça do DF)
- **Auto-preenchimento**: Configurações automáticas baseadas na seleção
- **Prevenção de Duplicatas**: Detecção inteligente de produtos já cadastrados
- **Normativo CO055**: Aplicação automática do normativo de crédito consignado

### ✅ Gestão de Produtos Habitação
- **Sistema SAC**: Configuração automática com dados completos
- **Normativo HH200**: Aplicação automática do normativo habitacional
- **Dados Estruturados**: 
  - LTV máximo (70% SAC, 50% Price)
  - Prazos (60-420 meses)
  - Indexadores (TR, IPCA)
  - Seguros obrigatórios (MIP, DFI)
- **Simplificação UX**: Um clique para criar produto completo

### ✅ Simulador de Empréstimos Avançado
- **Cálculos Dinâmicos**: Parcelas, juros totais, cronograma detalhado
- **ExpandPanel Accordion**: Detalhamento progressivo das informações
- **Formatação Brasileira**: Moeda (R$) e datas no padrão nacional
- **Validações em Tempo Real**: Feedback imediato sobre valores inseridos

### ✅ Interface e Experiência do Usuário
- **Componentes Reutilizáveis**: Sistema de design consistente
- **Navegação Fluida**: Stack navigation otimizada
- **Feedback Visual**: Estados de loading, sucesso e erro
- **Responsividade**: Adaptação para diferentes tamanhos de tela

## 📊 Métricas de Qualidade

### Cobertura de Testes
```
Statements   : 83.78% ( 279/333 ) ✅
Branches     : 77.94% ( 159/204 ) ✅  
Functions    : 69.6%  ( 71/102 )  🔸
Lines        : 84.52% ( 273/323 ) ✅
```

### Testes Implementados
- **23 test suites** executando com sucesso
- **102 testes** cobrindo funcionalidades críticas
- **Componentes 100% testados**: ActionCard, Card, Divider, EmptyState, CreateProductHeader
- **Hooks testados**: useCreateProductForm (87.5% coverage)

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm start              # Inicia o Expo dev server
npm run android        # Executa no Android
npm run ios           # Executa no iOS
npm run web           # Executa no navegador

# Qualidade e Testes
npm test              # Executa testes unitários
npm test -- --coverage # Gera relatório de cobertura
npm run type-check    # Verificação TypeScript
npm run lint          # Análise estática com ESLint

# Build e Deploy
npm run build         # Build de produção
```

## 📱 Compatibilidade

- **Android**: API 21+ (Android 5.0+)
- **iOS**: iOS 11+
- **Expo SDK**: 53+
- **Node.js**: 18+

## 🚀 Como Executar

1. **Clone o repositório**
```bash
git clone [repository-url]
cd C150713_CAIXA
```

2. **Instale as dependências**
```bash
npm install
```

3. **Execute o projeto**
```bash
npm start
```

4. **Execute em dispositivo/emulador**
```bash
npm run android  # Para Android
npm run ios      # Para iOS
```

## 📝 Convenções do Projeto

### Commits Semânticos
```
feat: nova funcionalidade
fix: correção de bug
docs: documentação
style: formatação, estilo
refactor: refatoração sem mudança funcional
test: adição ou correção de testes
chore: tarefas de manutenção
```

### Nomenclatura
- **Arquivos**: PascalCase para componentes (`CreateProductForm.tsx`)
- **Variáveis**: camelCase (`formData`, `isLoading`)
- **Constantes**: UPPER_SNAKE_CASE (`INITIAL_FORM_DATA`)
- **Interfaces**: PascalCase com sufixo (`FormDataProps`)

### Estrutura de Pastas
- **Co-location**: Arquivos relacionados próximos fisicamente
- **Barrel exports**: `index.ts` para facilitar imports
- **Separação por responsabilidade**: `components/`, `hooks/`, `types/`, `validations/`

## 🤝 Contribuindo

1. **Fork** o projeto
2. **Crie** uma branch para sua feature (`git checkout -b feat/amazing-feature`)
3. **Commit** suas mudanças (`git commit -m 'feat: add amazing feature'`)
4. **Push** para a branch (`git push origin feat/amazing-feature`)
5. **Abra** um Pull Request

## 🏆 Destaques Técnicos

### Arquitetura Escalável
- **Separação clara** entre camadas (UI, Business Logic, Data)
- **Injeção de dependências** através de hooks personalizados
- **Single Responsibility Principle** aplicado consistentemente

### Performance e Otimização
- **Lazy Loading** de componentes não críticos
- **Memoização** de cálculos complexos
- **Cache de dados** para reduzir requisições
- **Refs** para elementos que não precisam re-render

### Manutenibilidade
- **Código auto-documentado** com TypeScript rigoroso
- **Padrões consistentes** em todo o projeto
- **Configurações externalizadas** em arquivos JSON
- **Testes automatizados** para regressões

### Experiência do Desenvolvedor
- **Hot Reload** instantâneo com Expo
- **Type Safety** completa com TypeScript
- **Debugging** facilitado com logs estruturados
- **Tooling** moderno com ESLint e Jest

---

## 📄 Licença

Este projeto está sob a licença [MIT](LICENSE).

**🛠️ Desenvolvido com foco em qualidade, escalabilidade e manutenibilidade.**
