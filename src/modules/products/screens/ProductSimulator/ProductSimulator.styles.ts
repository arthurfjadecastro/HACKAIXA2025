import { StyleSheet } from 'react-native';
import { colors, spacing } from '@/design-system/tokens';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F8FB', // Mudado para branco gelo
  },
  
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F4F8FB', // Mudado para branco gelo
    // Removido borderBottomWidth e borderBottomColor
  },
  backButton: {
    padding: 8, // Reduzido de 16 para 8 para ficar mais próximo da borda
    marginLeft: -8, // Adiciona margem negativa para compensar e ficar ainda mais à esquerda
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '400',
    color: '#757575',
    textAlign: 'right',
    flex: 1,
    marginRight: 16,
  },
  headerSpacer: {
    width: 0, // Remove spacer pois título vai à direita
  },
  
  // Content
  content: {
    flex: 1,
    paddingHorizontal: spacing[6],
  },
  
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center', // Adiciona centralização horizontal
    paddingTop: 32, // Reduzido o padding top
  },
  titleContainer: {
    paddingHorizontal: 16,
    paddingTop: 8, // Reduzido para ficar mais próximo do header
    paddingBottom: 24, // Aumentado para dar mais espaço antes do input
  },
  mainTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1565C0',
    textAlign: 'left', // Mantém alinhado à esquerda, abaixo do ícone
  },
  
  // Amount Input
  amountContainer: {
    alignItems: 'center', // Centraliza o input
    justifyContent: 'center', // Centraliza verticalmente
    marginBottom: 16,
    width: '100%', // Ocupa toda a largura
  },
  currencyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // Centraliza o R$ e input juntos
    minHeight: 60,
  },
  currencySymbol: {
    fontSize: 48,
    fontWeight: '300',
    color: colors.text.primary,
    marginRight: 8,
    lineHeight: 56,
  },
  amountInput: {
    fontSize: 48,
    fontWeight: '300',
    color: colors.text.primary,
    minWidth: 200,
    textAlign: 'center', // Voltou para centralizar o texto
    paddingVertical: 0,
    paddingHorizontal: 0,
    lineHeight: 56,
    height: 56,
  },
  
  // Info
  infoContainer: {
    alignItems: 'flex-start', // Mudado para alinhar à esquerda
    marginTop: 16,
  },
  infoText: {
    fontSize: 14,
    color: '#BDBDBD',
    textAlign: 'left', // Mudado para alinhar à esquerda
  },
  
  // Error message
  errorContainer: {
    alignItems: 'flex-start', // Mudado para alinhar à esquerda
    marginTop: 8,
  },
  errorText: {
    fontSize: 14,
    color: '#D32F2F',
    textAlign: 'left', // Mudado para alinhar à esquerda
  },
  
  // Footer
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#F4F8FB', // Mudado para branco gelo
  },
  continueButton: {
    backgroundColor: '#F7931E',
    borderRadius: 8,
    height: 56,
    justifyContent: 'center',
  },
  continueButtonDisabled: {
    backgroundColor: '#FBBF77',
    opacity: 0.4,
  },
  
  // Legacy styles (mantidos para compatibilidade)
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
  },
  centerText: {
    textAlign: 'center',
  },
  productIdText: {
    textAlign: 'center',
    marginTop: spacing[2],
    fontSize: 14,
    color: colors.text.secondary,
  },
});
