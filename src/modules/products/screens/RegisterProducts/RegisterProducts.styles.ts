import { StyleSheet } from 'react-native';
import { colors, spacing } from '@/design-system/tokens';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    paddingTop: spacing[8],
    paddingBottom: spacing[4],
    backgroundColor: colors.background.primary,
  },
  backButton: {
    padding: spacing[2],
    marginRight: spacing[3],
  },
  title: {
    flex: 1,
    color: colors.primary.main,
    fontSize: 20,
    fontWeight: '600',
  },
  
  // Content
  content: {
    flex: 1,
    paddingHorizontal: spacing[4],
  },
  
  // Botão Criar Novo Produto
  createNewButton: {
    borderWidth: 2,
    borderColor: colors.primary.main,
    borderStyle: 'dashed',
    borderRadius: 8,
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[4],
    marginBottom: spacing[6],
    backgroundColor: 'transparent',
  },
  createNewContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  createNewText: {
    marginLeft: spacing[2],
    color: colors.primary.main,
    fontSize: 16,
    fontWeight: '500',
  },
  
  // Lista de Produtos
  productsList: {
    gap: spacing[4],
  },
  productCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border.light,
    padding: spacing[4],
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  productCardSelected: {
    borderColor: colors.primary.main,
    borderWidth: 2,
    backgroundColor: '#F0F7FF', // Fundo levemente azul quando selecionado
  },
  
  // Header do Card
  productHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing[3],
  },
  productIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: colors.background.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing[3],
  },
  productTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  
  // Detalhes do Produto
  productDetails: {
    gap: spacing[2],
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  detailValue: {
    fontSize: 14,
    color: colors.text.primary,
    fontWeight: '500',
  },
  
  // Footer
  footer: {
    padding: spacing[4],
    backgroundColor: colors.background.primary,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  saveButton: {
    width: '100%',
  },
  
  // Legacy (manter para compatibilidade)
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
  },
  centerText: {
    textAlign: 'center',
  },
  
  // Badge de Status
  statusBadge: {
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: 8,
    minWidth: 60,
    alignItems: 'center',
  },
  activeBadge: {
    backgroundColor: '#E8F5E8',
  },
  inactiveBadge: {
    backgroundColor: '#FFF3E0',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  activeText: {
    color: '#2E7D32',
  },
  inactiveText: {
    color: '#F57C00',
  },
  
  // Botão de deletar
  deleteButton: {
    marginLeft: spacing[2],
    padding: spacing[1],
    borderRadius: 16,
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
