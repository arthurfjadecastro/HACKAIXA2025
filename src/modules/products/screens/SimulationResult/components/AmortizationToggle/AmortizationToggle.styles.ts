import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  amortizationToggle: {
    marginTop: 12, // Reduzido de 16 para 12
    paddingTop: 12, // Reduzido de 16 para 12
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },

  toggleLabel: {
    fontSize: 13, // Reduzido de 14 para 13
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8, // Reduzido de 12 para 8
  },

  toggleButtons: {
    flexDirection: 'row',
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 3, // Reduzido de 4 para 3
  },

  toggleButton: {
    flex: 1,
    paddingVertical: 10, // Reduzido de 12 para 10
    paddingHorizontal: 14, // Reduzido de 16 para 14
    borderRadius: 6,
    alignItems: 'center',
  },

  toggleButtonActive: {
    backgroundColor: '#005CA9',
  },

  toggleButtonInactive: {
    backgroundColor: 'transparent',
  },

  toggleButtonText: {
    fontSize: 13, // Reduzido de 14 para 13
    fontWeight: '600',
  },

  toggleButtonTextActive: {
    color: '#FFFFFF',
  },

  toggleButtonTextInactive: {
    color: '#666666',
  },
});
