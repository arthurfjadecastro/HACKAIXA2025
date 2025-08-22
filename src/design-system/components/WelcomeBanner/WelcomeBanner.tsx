import React from 'react';
import { View, StyleSheet } from 'react-native';

import { Text } from '@/design-system/components/Text/Text';
import ArthurAvatar from '@/components/ArthurAvatar';
import { spacing } from '@/design-system/tokens';

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
      {/* Conteúdo do banner */}
      <View style={styles.content}>
        {/* Avatar circular com borda */}
        <View style={styles.avatarContainer}>
          <ArthurAvatar size={48} />
        </View>

        {/* Textos */}
        <View style={styles.textStack}>
          <Text style={styles.title}>
            Olá, {userName}
          </Text>
          <Text style={styles.subtitle}>
            Cliente {userTier}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginHorizontal: 16,
    overflow: 'hidden',
    paddingVertical: 32,
    paddingHorizontal: 16,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    marginRight: spacing[3],
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 28,
    padding: 4,
  },
  textStack: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.8)',
  },
});

export default WelcomeBanner;
