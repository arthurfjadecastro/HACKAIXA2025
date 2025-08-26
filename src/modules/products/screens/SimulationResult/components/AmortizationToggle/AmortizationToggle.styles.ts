import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  amortizationToggle: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },

  toggleLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 12,
  },

  toggleButtons: {
    flexDirection: 'row',
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 4,
  },

  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
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
    fontSize: 14,
    fontWeight: '600',
  },

  toggleButtonTextActive: {
    color: '#FFFFFF',
  },

  toggleButtonTextInactive: {
    color: '#666666',
  },
});
