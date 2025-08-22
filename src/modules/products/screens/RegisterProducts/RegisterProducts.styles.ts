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
  headerTitle: {
    flex: 1,
    color: colors.primary.main,
    fontSize: 20,
    fontWeight: '600',
  },
  addButton: {
    padding: spacing[2],
    marginLeft: spacing[3],
  },
  
  // Content
  scrollView: {
    flex: 1,
    paddingHorizontal: spacing[4],
  },
  
  // Empty state
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing[12],
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.secondary,
    marginTop: spacing[4],
    marginBottom: spacing[2],
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
    paddingHorizontal: spacing[6],
  },
  
  // Products
  productsContainer: {
    paddingVertical: spacing[4],
    gap: spacing[4], // Adiciona espaçamento vertical entre os cards
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
    backgroundColor: '#FFFFFF', // Fundo branco para melhor contraste
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0', // Borda mais visível
    elevation: 8, // Sombra para destacar
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  saveButton: {
    width: '100%',
    backgroundColor: '#F59E0B', // Laranja CAIXA para melhor visibilidade
    borderRadius: 12,
    elevation: 4, // Sombra no Android
    shadowColor: '#000', // Sombra no iOS
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
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
  
  // Status badge
  statusBadgeActive: {
    backgroundColor: '#E8F5E8',
  },
  statusBadgeInactive: {
    backgroundColor: '#FFF3E0',
  },
  statusTextActive: {
    color: '#2E7D32',
  },
  statusTextInactive: {
    color: '#F57C00',
  },
  
  // Produto info
  productInfo: {
    flex: 1,
    flexDirection: 'row', // Organiza badge e conteúdo em linha
    alignItems: 'center', // Alinha verticalmente
    justifyContent: 'space-between', // Distribui espaço
  },
  productTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4, // Margem reduzida
    flex: 1, // Ocupa espaço disponível
  },
  productIcon: {
    marginRight: spacing[2],
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    flex: 1,
  },
  
  // Row para badge e botão de deletar
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8, // Espaçamento entre badge e botão
  },
  
  // Selection indicator
  selectionIndicator: {
    position: 'absolute',
    top: spacing[2],
    right: spacing[2],
  },
  
  // Botão de deletar
  deleteButton: {
    marginLeft: 8, // Margem reduzida
    padding: 6, // Padding menor para ficar mais sutil
    borderRadius: 12, // Cantos mais suaves
    backgroundColor: 'rgba(220, 38, 38, 0.08)', // Fundo vermelho muito sutil
    alignItems: 'center',
    justifyContent: 'center',
    width: 28, // Largura fixa
    height: 28, // Altura fixa para melhor alinhamento
  },
});
