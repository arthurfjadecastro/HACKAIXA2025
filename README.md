# C150713_CAIXA - Arquitetura de Software

> **Documentação técnica** do projeto de simulação de empréstimos React Native/Expo com foco em boas práticas, arquitetura e evolução do software.

📋 **Documentação de Negócio**: Veja [README-BUSINESS.md](./README-BUSINESS.md) para requisitos funcionais, regras de negócio e especificações.

## 📊 Métricas do Projeto

```bash
# Test Coverage (Última atualização: 20/08/2025)
Test Suites: 19 passou, 19 total
Tests: 60 passou, 60 total
Coverage: 58.85% statements | 52.45% branches | 47.05% functions | 60.06% lines
```

## 🏗️ Arquitetura do Projeto

### 📁 Estrutura de Diretórios

```
C150713_CAIXA/
├── src/                           # Código fonte principal
│   ├── components/                # Componentes específicos do domínio
│   │   └── ArthurAvatar.tsx      # Avatar customizado do usuário
│   ├── modules/                   # Módulos funcionais organizados por contexto
│   │   ├── home/                 # Módulo da tela inicial
│   │   │   ├── screens/          # HomeScreen
│   │   │   └── components/       # LoginBottomSheet
│   │   ├── products/             # Módulo de gestão de produtos
│   │   │   └── screens/          # ProductList, RegisterProducts, ProductSimulator
│   │   └── splash/               # Módulo de splash screen
│   │       ├── screens/          # SplashScreen
│   │       └── components/       # LottieAnimation, SplashFallback
│   ├── design-system/            # Sistema de design reutilizável
│   │   ├── components/           # Button, Card, InputField, EmptyState, etc
│   │   ├── tokens/               # Colors, spacing, typography, shadows
│   │   └── icons/                # Sistema de ícones unificado
│   └── navigation/               # Sistema de navegação
│       ├── AppStack.tsx          # Stack principal da aplicação
│       └── test-utils.tsx        # Utilitários para testes de navegação
```

## 🏛️ Princípios Arquiteturais

### 1. **Modular Architecture**
- **Separação por contexto** de negócio (modules/)
- **Design System** centralizado e reutilizável
- **Colocação por proximidade** (co-location)

### 2. **Type Safety First**
- **TypeScript strict mode** habilitado
- **Interfaces explícitas** para todas as entidades
- **Validação consistente** em toda aplicação

### 3. **Test Coverage**
- **19 test suites** cobrindo componentes críticos
- **60 testes** garantindo funcionalidade
- **Coverage em crescimento** com meta de 80%

## 🛠️ Stack Tecnológica

```json
{
  "expo": "53.0.20",              // Plataforma de desenvolvimento
  "react": "19.0.0",              // Framework base  
  "react-native": "0.79.5",       // Mobile framework
  "typescript": "5.8.3",          // Type safety
  "react-navigation": "7.0.0",    // Navegação (versão fixa)
  "lottie-react-native": "7.1.0", // Animações (versão fixa)
  "jest": "30.0.0"                // Framework de testes
}
```

## 📱 Scripts de Desenvolvimento

```bash
# Desenvolvimento
npm start                    # Inicia Expo dev server
npm run android             # Roda no Android
npm run web                 # Roda no navegador

# Qualidade de Código  
npm run type-check          # Verificação TypeScript
npm test                    # Executa todos os testes
npm test -- --coverage     # Gera relatório de coverage
npm run lint                # ESLint check
```

## 🚧 Status de Desenvolvimento

### ✅ **Concluído**
- [x] Setup inicial do projeto com Expo 53
- [x] Configuração de desenvolvimento estável
- [x] Arquitetura modular implementada
- [x] Design System consolidado
- [x] Sistema de navegação funcional
- [x] Testes automatizados (19 suites)
- [x] Dependências com versões fixas
- [x] Reorganização por contexto de uso

### 🏗️ **Em Desenvolvimento**
- [ ] Implementação dos cálculos financeiros
- [ ] Integração com APIs externas
- [ ] Melhoria do coverage para 80%+
- [ ] Performance optimization

## 📋 Roadmap de Evolução

### 🎯 **Próximos Passos**
1. **Funcionalidades Core**: Cálculos de empréstimo
2. **UX/UI Polish**: Refinamento da interface
3. **Performance**: Otimizações e métricas
4. **Integração**: APIs reais e persistência

---

**🛠️ Contato Técnico**: Para questões arquiteturais e implementação
