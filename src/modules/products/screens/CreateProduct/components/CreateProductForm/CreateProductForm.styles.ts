import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  formContainer: {
    paddingHorizontal: 20, // Padding lateral para respiro visual
  },
  section: {
    marginBottom: 32, // Espaçamento aumentado entre seções
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 12, // Espaçamento aumentado
  },
  sectionDescription: {
    fontSize: 14,
    color: '#667085',
    marginBottom: 20, // Espaçamento aumentado
    lineHeight: 20, // Melhor legibilidade
  },
  radioGroup: {
    gap: 16, // Gap aumentado entre opções
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20, // Padding aumentado para melhor toque
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    elevation: 1, // Sombra sutil no Android
    shadowColor: '#000', // Sombra no iOS
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  radioOptionSelected: {
    borderColor: '#005CA9',
    backgroundColor: '#F0F7FF',
    elevation: 2, // Sombra maior quando selecionado
    shadowOpacity: 0.1,
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
  radioSubInfo: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '500',
    marginTop: 4,
  },
  radioDescriptionDisabled: {
    color: '#D1D5DB',
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

  // Container destacado para informações principais
  highlightedInfoContainer: {
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#28a745',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },

  highlightedInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e8f5e8',
  },

  highlightedInfoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
  },

  highlightedInfoValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#28a745',
  },

  // Container para as taxas
  taxasContainer: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderRadius: 6,
    padding: 10,
  },

  taxasTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 8,
    textAlign: 'center',
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

  // Estilos para normativo legal
  normativoContainer: {
    backgroundColor: '#EEF2FF',
    borderWidth: 1,
    borderColor: '#C7D2FE',
    borderRadius: 8,
    padding: 12,
  },

  normativoText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3730A3',
    marginBottom: 4,
  },

  normativoDescription: {
    fontSize: 12,
    color: '#6366F1',
    fontStyle: 'italic',
  },

  // Estilos específicos para formulário OUTRO
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  inputContainer: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
  },
  input: {
    fontSize: 14,
    color: '#111827',
  },
  checkboxGroup: {
    gap: 12,
  },
  checkboxItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  checkboxChecked: {
    backgroundColor: '#005CA9',
    borderColor: '#005CA9',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
  },
  rowContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  halfWidth: {
    flex: 1,
  },
  fieldHint: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    fontStyle: 'italic',
  },
  warningContainer: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  warningText: {
    fontSize: 14,
    color: '#DC2626',
    fontWeight: '500',
    textAlign: 'center',
  },
});
