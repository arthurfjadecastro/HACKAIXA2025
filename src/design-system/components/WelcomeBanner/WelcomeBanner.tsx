import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { Text } from '@/design-system/components/Text/Text';
import ArthurAvatar from '@/components/ArthurAvatar';
import { spacing, radius } from '@/design-system/tokens';

interface WelcomeBannerProps {
  userName: string;
  userTier: string;
}

const WelcomeBanner: React.FC<WelcomeBannerProps> = ({
  userName,
  userTier,
}) => {
  return (
    <View style={styles.container}>
      {/* Gradiente principal inspirado no tophome.svg */}
      <LinearGradient
        colors={['#005CA9', '#005fab', '#00a1d8', '#00B5E5']}
        locations={[0, 0.3, 0.7, 1]}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradientBackground}
      />

      {/* Overlay com transparência para suavizar */}
      <LinearGradient
        colors={['rgba(255, 255, 255, 0.15)', 'rgba(255, 255, 255, 0.05)', 'transparent']}
        locations={[0, 0.5, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientBackground}
      />

      {/* Fundo com formas geométricas estilizadas */}
      <View style={styles.backgroundShapes}>
        <View style={styles.shape1} />
        <View style={styles.shape2} />
        <View style={styles.shape3} />
      </View>

      {/* Conteúdo do banner */}
      <View style={styles.content}>
        {/* Avatar */}
        <View style={styles.avatarContainer}>
          <ArthurAvatar size={56} />
        </View>

        {/* Stack de textos */}
        <View style={styles.textStack}>
          <Text variant="h2" color="inverse" style={styles.title}>
            Olá, {userName}
          </Text>
          <Text variant="body1" color="inverse" style={styles.subtitle}>
            Cliente {userTier}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    height: 160, // Altura baseada no design do Figma (tophome.svg)
    marginHorizontal: spacing[6],
    borderRadius: radius.card,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    // Sombra sutil para profundidade
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  gradientBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  backgroundShapes: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  // Inspirado no padrão do tophome.svg
  shape1: {
    position: 'absolute',
    top: -40,
    right: -70,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    transform: [{ rotate: '30deg' }],
  },
  shape2: {
    position: 'absolute',
    bottom: -50,
    left: -80,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    transform: [{ rotate: '-15deg' }],
  },
  shape3: {
    position: 'absolute',
    top: 20,
    right: 10,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    transform: [{ rotate: '45deg' }],
  },
  content: {
    position: 'relative',
    zIndex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[5],
    height: '100%',
  },
  avatarContainer: {
    marginRight: spacing[4],
  },
  textStack: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontWeight: 'bold',
    marginBottom: spacing[1],
    color: '#FFFFFF',
    fontSize: 24,
    lineHeight: 28,
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 16,
    fontWeight: '400',
  },
});

export default WelcomeBanner;
