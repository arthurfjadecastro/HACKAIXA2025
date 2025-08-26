import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  resultCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 32,
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },

  successTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },

  successIcon: {
    marginRight: 8,
  },

  successTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#004AAD',
  },

  summarySection: {
    marginBottom: 16,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 16,
  },

  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },

  label: {
    fontSize: 14,
    color: '#757575',
  },

  value: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
  },

  highlightValue: {
    fontSize: 16,
    color: '#004AAD',
  },
});
