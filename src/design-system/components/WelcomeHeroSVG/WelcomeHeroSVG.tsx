import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const WelcomeHeroSVG: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* Forma principal decorativa */}
      <LinearGradient
        colors={['rgba(227, 242, 253, 0.6)', 'rgba(187, 222, 251, 0.4)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.shape1}
      />
      
      {/* Forma secundária */}
      <LinearGradient
        colors={['rgba(227, 242, 253, 0.3)', 'rgba(187, 222, 251, 0.2)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.shape2}
      />
      
      {/* Detalhe laranja */}
      <View style={styles.accent} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 300,
    zIndex: 1,
  },
  shape1: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 120,
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 40,
    transform: [{ scaleX: 1.2 }],
  },
  shape2: {
    position: 'absolute',
    top: 0,
    right: -20,
    width: 150,
    height: 80,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 20,
  },
  accent: {
    position: 'absolute',
    top: 45,
    right: 55,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(243, 146, 0, 0.75)',
  },
});

export default WelcomeHeroSVG;
