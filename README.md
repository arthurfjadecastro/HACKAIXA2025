# C150713_CAIXA - Arquitetura de Software

> **Documentação técnica** do projeto de simulação de empréstimos React Native/Expo com foco em boas práticas, arquitetura e evolução do software.

��� **Documentação de Negócio**: Veja [README-BUSINESS.md](./README-BUSINESS.md) para requisitos funcionais, regras de negócio e especificações.

## ���️ Arquitetura do Projeto

### ��� Estrutura de Diretórios

```
C150713_CAIXA/
├── src/                          # Código fonte principal
│   ├── components/               # Componentes reutilizáveis
│   │   ├── common/              # Componentes base (Button, Input, etc)
│   │   ├── forms/               # Componentes específicos de formulários
│   │   └── ui/                  # Componentes de interface
│   ├── screens/                 # Telas da aplicação
│   │   ├── Home/               # Tela principal
│   │   ├── ProductForm/        # Cadastro de produtos
│   │   ├── ProductList/        # Listagem de produtos
│   │   └── Simulation/         # Simulação de empréstimos
│   ├── services/               # Serviços e APIs
│   ├── utils/                 # Utilitários e helpers
│   ├── hooks/                 # Custom React Hooks
│   ├── contexts/              # Context API para estado global
│   └── types/                 # Definições TypeScript
└── config/                    # Configurações do projeto
```

## ��� Princípios Arquiteturais

### 1. **Clean Architecture**
- **Separação de responsabilidades** entre camadas
- **Inversão de dependências** com abstrações
- **Independência de frameworks** para lógica de negócio

### 2. **Type Safety First**
- **TypeScript strict mode** habilitado
- **Interfaces explícitas** para todas as entidades
- **Validação em runtime** com schemas

## ��� Stack Tecnológica

```json
{
  "expo": "53.0.20",           // Plataforma de desenvolvimento
  "react": "19.0.0",           // Framework base  
  "react-native": "0.79.5",    // Mobile framework
  "typescript": "5.8.3"        // Type safety
}
```

## ��� Scripts de Desenvolvimento

```bash
# Desenvolvimento
npm start                    # Inicia Expo dev server
npm run android             # Roda no Android
npm run web                 # Roda no navegador

# Qualidade de Código  
npm run type-check          # Verificação TypeScript
npm run lint                # ESLint check
npm run format              # Prettier formatting
```

## ��� Roadmap de Evolução

### ��� **Fase 1: MVP** (Atual)
- [x] Setup inicial do projeto
- [x] Configuração de desenvolvimento  
- [x] Estrutura arquitetural
- [x] Documentação técnica
- [ ] Implementação das telas base
- [ ] Cálculos financeiros core

---

**��� Contato Técnico**: Para questões arquiteturais e técnicas
