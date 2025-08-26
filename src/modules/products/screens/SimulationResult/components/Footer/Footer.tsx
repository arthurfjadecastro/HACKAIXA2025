import React from 'react';
import { View } from 'react-native';
import { Button } from '@/design-system/components';
import { styles } from './Footer.styles';

interface FooterProps {
  onNewSimulation: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNewSimulation }) => {
  return (
    <View style={styles.footer}>
      <Button
        title="Nova Simulação"
        onPress={onNewSimulation}
        style={styles.newSimulationButton}
      />
    </View>
  );
};
