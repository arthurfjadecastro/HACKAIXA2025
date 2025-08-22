import { StyleSheet } from 'react-native';
import { colors } from '@/design-system/tokens';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface.background,
  },
  
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20, // Espaçamento lateral otimizado
    paddingTop: 16, // Padding top reduzido
    paddingBottom: 20, // Padding bottom aumentado para mais respiro
    backgroundColor: colors.surface.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
    minHeight: 64, // Altura mínima para melhor proporção
  },
  backButton: {
    padding: 8, // Padding reduzido
    marginRight: 16, // Margem direita otimizada
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20, // Cantos arredondados para melhor visual
  },
  title: {
    flex: 1,
    color: colors.primary.main,
    fontSize: 18, // Fonte ligeiramente menor para melhor proporção
    fontWeight: '600',
    lineHeight: 24, // Line height para melhor legibilidade
  },
  
  // Content
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 32, // Padding bottom aumentado
  },
  form: {
    paddingHorizontal: 0, // Removido - padding será aplicado no FormContainer
    paddingTop: 24, // Padding top otimizado
    gap: 24, // Gap aumentado entre seções
  },
  
  // Footer
  footer: {
    padding: 20, // Padding consistente
    backgroundColor: colors.surface.background,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
    elevation: 4, // Sombra no Android
    shadowColor: '#000', // Sombra no iOS
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  submitButton: {
    width: '100%',
    minHeight: 48, // Altura mínima aumentada
    borderRadius: 12, // Cantos arredondados
  },
  submitButtonEnabled: {
    backgroundColor: colors.brand.orange.primary,
  },
  submitButtonDisabled: {
    backgroundColor: colors.action.disabled.bg,
  },
});
