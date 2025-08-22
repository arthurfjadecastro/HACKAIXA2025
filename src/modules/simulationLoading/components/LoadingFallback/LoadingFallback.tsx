import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Text } from '@/design-system/components';

type Props = {
  size?: number;
  testID?: string;
};

const LoadingFallback: React.FC<Props> = ({ 
  size = 220, 
  testID = 'simulation-loading-fallback' 
}) => {
  return (
    <View 
      style={[styles.container, { width: size, height: size }]}
      testID={testID}
    >
      <ActivityIndicator 
        size="large" 
        color="#1565C0" 
        testID={`${testID}-indicator`}
      />
      <Text style={styles.text}>Carregando simulação...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
  },
  text: {
    marginTop: 12,
    fontSize: 14,
    color: '#757575',
    textAlign: 'center',
  },
});

export default LoadingFallback;
