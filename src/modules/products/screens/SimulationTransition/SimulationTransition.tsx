import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { Text } from '@/design-system/components';
import { theme } from '@/design-system/tokens';
import { StatusCard } from './components/StatusCard';
import { AnimationPlaceholder } from './components/AnimationPlaceholder';
import { StatusDisplay } from './components/StatusDisplay';
import { useSimulationTransition } from './hooks/useSimulationTransition';
import { useBackPressHandler } from './hooks/useBackPressHandler';

const SimulationTransition: React.FC = () => {
  const route = useRoute();
  const params = route.params as {
    productId: string;
    amount: string;
    months: number;
  };
  
  const { productId, amount, months } = params;
  
  const { state, statusText, requestId } = useSimulationTransition({
    productId,
    amount,
    months,
  });

  useBackPressHandler({ state });

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text variant="h2" style={styles.title}>
          Processando Simulação
        </Text>
        
        <Text variant="body1" style={styles.subtitle}>
          Estamos calculando as melhores condições para você.
        </Text>
        
        <AnimationPlaceholder state={state} />
        
        <StatusCard state={state} statusText={statusText} />
        
        <StatusDisplay state={state} requestId={requestId} />
        
        {state === 'error' && (
          <Text variant="body2" style={styles.errorHint}>
            Tente novamente ou verifique sua conexão.
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  content: {
    flex: 1,
    padding: theme.spacing[6],
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: theme.spacing[4],
    color: theme.colors.text.primary,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: theme.spacing[8],
    color: theme.colors.text.secondary,
  },
  errorHint: {
    textAlign: 'center',
    marginTop: theme.spacing[4],
    color: theme.colors.text.disabled,
  },
});

export default SimulationTransition;
