import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '../../../../../design-system';
import { theme } from '../../../../../design-system/tokens';
import { SimulationState } from '../types';

interface StatusDisplayProps {
  state: SimulationState;
  requestId: string;
}

export const StatusDisplay: React.FC<StatusDisplayProps> = ({ state, requestId }) => {
  const getStatusIcon = () => {
    switch (state) {
      case 'loading':
        return '⏳';
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      default:
        return '🔄';
    }
  };

  const getStatusMessage = () => {
    switch (state) {
      case 'idle':
        return 'Preparando simulação...';
      case 'loading':
        return 'Processando simulação...';
      case 'success':
        return 'Simulação concluída com sucesso!';
      case 'error':
        return 'Erro ao processar simulação';
      default:
        return 'Status desconhecido';
    }
  };

  const getStatusColor = () => {
    switch (state) {
      case 'loading':
        return theme.colors.primary.main;
      case 'success':
        return theme.colors.status.success;
      case 'error':
        return theme.colors.status.error;
      default:
        return theme.colors.text.secondary;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.statusRow}>
        <Text style={styles.icon}>{getStatusIcon()}</Text>
        <Text 
          variant="body1" 
          style={{
            ...styles.statusText,
            color: getStatusColor(),
          }}
        >
          {getStatusMessage()}
        </Text>
      </View>
      
      {__DEV__ && (
        <Text variant="caption" style={styles.debugText}>
          ID: {requestId}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: theme.spacing[4],
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing[2],
  },
  icon: {
    fontSize: 20,
    marginRight: theme.spacing[2],
  },
  statusText: {
    fontWeight: '500',
  },
  debugText: {
    color: theme.colors.text.disabled,
    fontSize: 12,
  },
});
