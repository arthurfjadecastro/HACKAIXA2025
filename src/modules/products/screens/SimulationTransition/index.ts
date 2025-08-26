// Componente principal (manter compatibilidade)
export { default } from './SimulationTransition';

// Componentes modulares
export { StatusCard } from './components/StatusCard';
export { AnimationPlaceholder } from './components/AnimationPlaceholder';
export { StatusDisplay } from './components/StatusDisplay';

// Hooks
export { useSimulationTransition } from './hooks/useSimulationTransition';
export { useBackPressHandler } from './hooks/useBackPressHandler';
export { useStatusRotation } from './hooks/useStatusRotation';

// Tipos e constantes
export * from './types';

// Utilitários
export { simulateAPI } from './utils/simulationAPI';
