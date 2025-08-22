# 🎨 Guia de Fontes da CAIXA

Este guia explica como usar as fontes oficiais da CAIXA no design system do aplicativo.

## 📝 Fontes Disponíveis

### CAIXAStd-Regular
- **Uso**: Textos gerais, corpo de texto, legendas
- **Peso**: Regular (400)
- **Casos**: Parágrafos, descrições, labels

### CAIXAStd-SemiBold  
- **Uso**: Títulos, botões, destaques
- **Peso**: SemiBold (600)
- **Casos**: Headings, CTAs, informações importantes

## 🎯 Como Usar no Design System

### 1. Importando Tokens
```typescript
import { fontFamilies, typography } from '@/design-system/tokens';
```

### 2. Usando FontFamilies
```typescript
const styles = StyleSheet.create({
  // Método 1: Direto
  regularText: {
    fontFamily: fontFamilies.caixa, // CAIXAStd-Regular
    fontSize: 16,
  },
  
  boldText: {
    fontFamily: fontFamilies.caixaSemiBold, // CAIXAStd-SemiBold
    fontSize: 18,
  },
  
  // Método 2: Usando alias
  primaryText: {
    fontFamily: fontFamilies.primary, // CAIXAStd-Regular
  },
  
  primaryBold: {
    fontFamily: fontFamilies.primaryBold, // CAIXAStd-SemiBold
  },
});
```

### 3. Usando Tipografias Predefinidas (Recomendado)
```typescript
const styles = StyleSheet.create({
  title: {
    ...typography.h1, // CAIXAStd-SemiBold, 26px
  },
  subtitle: {
    ...typography.h3, // CAIXAStd-SemiBold, 20px  
  },
  body: {
    ...typography.body1, // CAIXAStd-Regular, 16px
  },
  caption: {
    ...typography.caption, // CAIXAStd-Regular, 12px
  },
  button: {
    ...typography.button, // CAIXAStd-SemiBold, 16px
  },
});
```

## 🔧 Tipografias Disponíveis

| Tipografia | Fonte | Tamanho | Peso | Uso |
|------------|-------|---------|------|-----|
| `h1` | CAIXAStd-SemiBold | 26px | 700 | Títulos principais |
| `h2` | CAIXAStd-SemiBold | 24px | 700 | Títulos secundários |
| `h3` | CAIXAStd-SemiBold | 20px | 600 | Subtítulos |
| `h4` | CAIXAStd-SemiBold | 18px | 600 | Títulos menores |
| `h5` | CAIXAStd-SemiBold | 16px | 600 | Labels importantes |
| `body1` | CAIXAStd-Regular | 16px | 400 | Texto principal |
| `body2` | CAIXAStd-Regular | 14px | 400 | Texto secundário |
| `button` | CAIXAStd-SemiBold | 16px | 700 | Botões |
| `caption` | CAIXAStd-Regular | 12px | 500 | Legendas |
| `overline` | CAIXAStd-SemiBold | 10px | 700 | Texto em caixa alta |
| `account` | CAIXAStd-Regular | 12px | 500 | Informações de conta |
| `amount` | CAIXAStd-SemiBold | 24px | 700 | Valores monetários |

## 📱 Exemplos Práticos

### Componente de Card
```typescript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { typography, colors } from '@/design-system/tokens';

const ProductCard = ({ title, description, amount }) => (
  <View style={styles.card}>
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.description}>{description}</Text>
    <Text style={styles.amount}>{amount}</Text>
  </View>
);

const styles = StyleSheet.create({
  card: {
    padding: 16,
    backgroundColor: colors.surface.main,
    borderRadius: 8,
  },
  title: {
    ...typography.h3, // CAIXAStd-SemiBold
    color: colors.text.primary,
    marginBottom: 8,
  },
  description: {
    ...typography.body2, // CAIXAStd-Regular
    color: colors.text.secondary,
    marginBottom: 12,
  },
  amount: {
    ...typography.amount, // CAIXAStd-SemiBold para valores
    color: colors.primary.main,
  },
});
```

### Botão Customizado
```typescript
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { typography, colors } from '@/design-system/tokens';

const CaixaButton = ({ title, onPress }) => (
  <TouchableOpacity style={styles.button} onPress={onPress}>
    <Text style={styles.buttonText}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary.main,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    ...typography.button, // CAIXAStd-SemiBold
    color: colors.primary.contrast,
  },
});
```

## ✅ Boas Práticas

### 1. **Consistência**
- Use sempre as tipografias predefinidas quando possível
- Mantenha hierarquia visual com diferentes tamanhos/pesos

### 2. **Legibilidade**
- CAIXAStd-Regular para textos longos
- CAIXAStd-SemiBold para destaques e títulos

### 3. **Performance**
- As fontes são carregadas uma vez no `App.tsx`
- Use `React.memo()` em componentes que usam tipografias complexas

### 4. **Acessibilidade**
- Mantenha contraste adequado com as cores
- Use tamanhos mínimos legíveis (12px+)

## 🚀 Propagação Futura

Estas fontes estão integradas ao design system e serão:
- ✅ Automaticamente aplicadas em novos componentes
- ✅ Mantidas consistentes através de tokens
- ✅ Facilmente atualizáveis em um local central
- ✅ Exportadas para reutilização em outros projetos
