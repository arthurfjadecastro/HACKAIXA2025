import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F8FB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F4F8FB', // Mudado para manter consistência
    // Removido borderBottomWidth e borderBottomColor para consistência
  },
  backButton: {
    padding: 8, // Mantido em 8
    marginLeft: -8, // Adiciona margem negativa para ficar mais à esquerda
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    textAlign: 'center',
    flex: 1,
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#667085',
    marginBottom: 16,
  },
  radioGroup: {
    gap: 12,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  radioOptionSelected: {
    borderColor: '#005CA9',
    backgroundColor: '#F0F7FF',
  },
  radioOptionDisabled: {
    backgroundColor: '#F9FAFB',
    opacity: 0.6,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonSelected: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#005CA9',
  },
  radioContent: {
    flex: 1,
  },
  radioLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  radioLabelDisabled: {
    color: '#9CA3AF',
  },
  radioDescription: {
    fontSize: 14,
    color: '#667085',
  },
  radioDescriptionDisabled: {
    color: '#D1D5DB',
  },
  input: {
    marginBottom: 16,
  },
  autoFilledBadge: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '400',
  },
  autoFilledContainer: {
    backgroundColor: '#F0FDF4',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D1FAE5',
  },
  autoFilledRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  autoFilledLabel: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  autoFilledValue: {
    fontSize: 14,
    color: '#059669',
    fontWeight: '600',
  },
  observacoesContainer: {
    marginTop: 16,
    backgroundColor: '#FEF3C7',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FCD34D',
  },
  observacoesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400E',
    marginBottom: 8,
  },
  observacaoItem: {
    fontSize: 13,
    color: '#92400E',
    marginBottom: 4,
  },
  footer: {
    marginTop: 24,
    marginBottom: 32,
  },
  submitButton: {
    backgroundColor: '#005CA9',
  },
});
