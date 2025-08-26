import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '../../../../../design-system';
import { theme } from '../../../../../design-system/tokens';
import { SimulationState } from '../types';

interface StatusCardProps {
  state: SimulationState;
  statusText: string;
}

export const StatusCard: React.FC<StatusCardProps> = ({ state, statusText }) => {
  const getCardStyle = () => {
    switch (state) {
      case 'loading':
        return [styles.statusCard, styles.loadingCard];
      case 'success':
        return [styles.statusCard, styles.successCard];
      case 'error':
        return [styles.statusCard, styles.errorCard];
      default:
        return styles.statusCard;
    }
  };

  const getTextColor = () => {
    switch (state) {
      case 'loading':
        return theme.colors.primary.dark;
      case 'success':
        return theme.colors.status.success;
      case 'error':
        return theme.colors.status.error;
      default:
        return theme.colors.text.secondary;
    }
  };

  return (
    <View style={getCardStyle()}>
      <Text 
        variant="body1" 
        style={{
          ...styles.statusText,
          color: getTextColor(),
        }}
      >
        {statusText}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  statusCard: {
    backgroundColor: theme.colors.background.card,
    borderRadius: theme.radius.card,
    padding: theme.spacing[6],
    marginVertical: theme.spacing[4],
    borderWidth: 1,
    borderColor: theme.colors.border.light,
  },
  loadingCard: {
    backgroundColor: theme.colors.background.primary,
    borderColor: theme.colors.primary.light,
  },
  successCard: {
    backgroundColor: theme.colors.background.card,
    borderColor: theme.colors.status.success,
  },
  errorCard: {
    backgroundColor: theme.colors.background.card,
    borderColor: theme.colors.status.error,
  },
  statusText: {
    textAlign: 'center',
    fontWeight: '500',
  },
});
