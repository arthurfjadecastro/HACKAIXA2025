import { StyleSheet } from 'react-native';
import { colors, spacing } from '@/design-system/tokens';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface.background,
  },
  
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    paddingTop: spacing[4],
    paddingBottom: spacing[3],
    backgroundColor: colors.surface.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  backButton: {
    padding: spacing[2],
    marginRight: spacing[3],
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    flex: 1,
    color: colors.primary.main,
    fontSize: 20,
    fontWeight: '600',
  },
  
  // Content
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: spacing[8],
  },
  form: {
    paddingHorizontal: spacing[4],
    paddingTop: spacing[6],
    gap: spacing[6],
  },
  
  // Footer
  footer: {
    padding: spacing[4],
    backgroundColor: colors.surface.background,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  submitButton: {
    width: '100%',
    minHeight: 44,
  },
  submitButtonEnabled: {
    backgroundColor: colors.brand.orange.primary,
  },
  submitButtonDisabled: {
    backgroundColor: colors.action.disabled.bg,
  },
});
