# Fontes Oficiais da CAIXA

Esta pasta contém as fontes oficiais da CAIXA Econômica Federal para uso no aplicativo.

## 📁 Arquivos de Fonte

### CAIXAStd (Família Principal)
- **CAIXAStd-Regular.ttf** - Fonte regular para textos gerais
- **CAIXAStd-SemiBold.ttf** - Fonte semi-negrito para títulos e destaques

## 🎯 Como Usar

### 1. No Design System
```typescript
import { fontFamilies } from '@/design-system/tokens';

// Fonte regular
fontFamily: fontFamilies.caixa

// Fonte semi-negrito
fontFamily: fontFamilies.caixaSemiBold
```

### 2. Tipografias Predefinidas
```typescript
import { typography } from '@/design-system/tokens';

// Títulos (usa SemiBold)
style={typography.h1}
style={typography.h2}
style={typography.h3}

// Textos (usa Regular)
style={typography.body1}
style={typography.body2}
style={typography.caption}
```

### 3. Uso Direto
```typescript
const styles = StyleSheet.create({
  title: {
    fontFamily: 'CAIXAStd-SemiBold',
    fontSize: 24,
  },
  text: {
    fontFamily: 'CAIXAStd-Regular',
    fontSize: 16,
  },
});
```

## ⚡ Carregamento

As fontes são carregadas automaticamente através do hook `useCaixaFonts()` no `App.tsx`.

## 📋 Convenções

### Hierarquia de Uso:
1. **CAIXAStd-SemiBold**: Títulos, botões, destaques
2. **CAIXAStd-Regular**: Textos gerais, legendas, conteúdo

### Alias no Design System:
- `fontFamilies.caixa` → CAIXAStd-Regular
- `fontFamilies.caixaSemiBold` → CAIXAStd-SemiBold
- `fontFamilies.primary` → CAIXAStd-Regular (alias)
- `fontFamilies.primaryBold` → CAIXAStd-SemiBold (alias)

## 🚀 Propagação

Estas fontes fazem parte do design system e devem ser usadas em todos os componentes para manter a identidade visual da CAIXA consistente em todo o aplicativo.
