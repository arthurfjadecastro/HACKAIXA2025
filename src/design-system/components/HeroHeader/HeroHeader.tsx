import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Text } from '../Text/Text';
import ArthurAvatar from '../ArthurAvatar';
import { colors, spacing, radius, typography, elevation } from '@/design-system/tokens';

export type HeroHeaderProps = {
  name: string;
  role?: string;         // exemplo: "Cliente caixa"
  avatarUri?: string;
  children?: React.ReactNode; // conteúdo do card branco
};

const HeroHeader: React.FC<HeroHeaderProps> = ({
  name,
  role = 'Cliente caixa', // minúsculo conforme Figma
  children
}) => {
  return (
    <View style={styles.container}>
      {/* Hero Background com duas camadas de gradiente */}
      <View style={styles.heroWrapper}>
        {/* Camada 1 (fundo): colors.brand.blue900 → colors.brand.blue700 */}
        <LinearGradient
          colors={[colors.brand.blue.blue900, colors.brand.blue.blue700]}
          style={styles.backgroundGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        
        {/* Camada 2 (overlay, opacity: 0.3): colors.brand.blue800 → colors.brand.blue400 */}
        <LinearGradient
          colors={[colors.brand.blue.blue800, colors.brand.blue.blue400]}
          style={[styles.overlayGradient, { opacity: 0.3 }]}
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 1 }}
        />
        
        {/* Conteúdo sobre o hero */}
        <View style={styles.heroContent} accessibilityRole="header">
          {/* Avatar circular */}
          <View style={styles.avatarContainer}>
            <ArthurAvatar size={64} />
          </View>
          
          {/* Textos do usuário */}
          <View style={styles.userInfo}>
            <Text style={styles.userName} numberOfLines={2}>
              Olá, {name}
            </Text>
            <Text style={styles.userRole}>
              {role}
            </Text>
          </View>
        </View>
      </View>
      
      {/* Card branco com instrução sobreposto */}
      {children && (
        <View style={styles.floatingCard}>
          {children}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  
  // Hero Background
  heroWrapper: {
    position: 'relative',
    height: 160, // 160px - mantendo valor específico do design
    borderBottomLeftRadius: radius.container, // 20px equivale ao container
    borderBottomRightRadius: radius.card,
    overflow: 'hidden',
  },
  
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  
  overlayGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  
  // Conteúdo do Hero
  heroContent: {
    position: 'absolute',
    bottom: 0, // Ancorar no bottom
    left: spacing[4],
    right: spacing[4],
    paddingBottom: spacing[12], // 48px próximo aos 44px originais
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start', // Alinhamento horizontal do conteúdo
    gap: spacing[4], // 16px
  },
  
  // Avatar
  avatarContainer: {
    flexShrink: 0,
    borderRadius: 34, // (64 + 4) / 2 para compensar a borda
    borderWidth: 2, // borda branca sutil de 2dp
    borderColor: 'rgba(255, 255, 255, 0.9)', // cor branca com leve transparência para sutileza
    padding: 1, // Reduzido de 2 para 1 para borda mais sutil
  },
  
  // User Info
  userInfo: {
    flex: 1,
  },
  
  // Nome do usuário → Heading / semibold, cor branca
  userName: {
    ...typography.h3, // Usando token de tipografia
    color: colors.text.inverse, // cor branca pura
    marginBottom: spacing[1], // 4px
    flexWrap: 'wrap', // Nome longo quebra em duas linhas
  },
  
  // Subtítulo → Body small / regular, branco com 80% de opacidade
  userRole: {
    ...typography.body2, // Usando token de tipografia
    color: 'rgba(255, 255, 255, 0.8)', // branco com 80% de opacidade
  },
  
  // Floating Card
  floatingCard: {
    alignSelf: 'center', // Centralizar horizontalmente
    width: 'auto', // Usar auto para as margens funcionarem
    marginTop: -26, // Mantendo valor específico do design
    marginHorizontal: spacing[5], // 20px
    backgroundColor: colors.background.secondary,
    borderRadius: radius.container, // 20px
    paddingVertical: spacing[5], // 20px
    paddingHorizontal: spacing[6], // 24px próximo aos 22px originais
    ...elevation.medium,
  },
});

export default HeroHeader;
