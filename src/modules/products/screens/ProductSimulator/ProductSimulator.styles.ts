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
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.background.secondary,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  backButton: {
    padding: 16,
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
  },
  titleContainer: {
    marginTop: 48,
    marginBottom: 64,
  },
  mainTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1565C0',
    textAlign: 'center',
  },
  
  // Amount Input
  amountContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  currencyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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
    textAlign: 'center',
    paddingVertical: 0,
    paddingHorizontal: 0,
    lineHeight: 56,
    height: 56,
  },
  
  // Info
  infoContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  infoText: {
    fontSize: 14,
    color: '#BDBDBD',
    textAlign: 'center',
  },
  
  // Error message
  errorContainer: {
    alignItems: 'center',
    marginTop: 8,
  },
  errorText: {
    fontSize: 14,
    color: '#D32F2F',
    textAlign: 'center',
  },
  
  // Footer
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: colors.background.secondary,
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
