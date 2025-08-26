import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Text } from '../Text/Text';
import ArthurAvatar from '../ArthurAvatar';
import { colors } from '@/design-system/tokens';

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
    height: 160, // Aumentando para 200dp para melhor proporção (era 184)
    borderBottomLeftRadius: 48,
    borderBottomRightRadius: 16,
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
    left: 16,
    right: 16,
    paddingBottom: 44, // Aumentado de 22 para 28 para melhor respiro
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start', // Alinhamento horizontal do conteúdo
    gap: 16, // Aumentado de 12 para 16dp para melhor espaçamento
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
    fontSize: 22, // Aumentado de 20 para 22 para melhor hierarquia
    fontWeight: '600', // semibold (corrigido)
    lineHeight: 26, // Ajustado proporcionalmente
    color: '#FFFFFF', // cor branca pura
    marginBottom: 2, // Reduzido de 4 para 2 para melhor compactação
    flexWrap: 'wrap', // Nome longo quebra em duas linhas
  },
  
  // Subtítulo → Body small / regular, branco com 80% de opacidade
  userRole: {
    fontSize: 15, // Aumentado de 14 para 15 para melhor legibilidade
    fontWeight: '400', // regular
    lineHeight: 18,
    color: 'rgba(255, 255, 255, 0.8)', // branco com 80% de opacidade
  },
  
  // Floating Card
  floatingCard: {
    alignSelf: 'center', // Centralizar horizontalmente
    width: 'auto', // Usar auto para as margens funcionarem
    marginTop: -26, // Aumentado overlap para -26 (era -22)
    marginHorizontal: 18, // Reduzido de 16 para 18dp para melhor centralização
    backgroundColor: '#FFFFFF',
    borderRadius: 24, // borderRadius: 24 conforme especificação
    paddingVertical: 20, // Aumentado de 18 para 20 para mais respiro interno
    paddingHorizontal: 22, // Aumentado de 20 para 22 para mais respiro lateral
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3, // Aumentado de 2 para 3 para mais profundidade
    },
    shadowOpacity: 0.12, // Aumentado de 0.1 para 0.12 para mais contraste
    shadowRadius: 6, // Aumentado de 4 para 6 para sombra mais suave
    elevation: 4, // Aumentado de 3 para 4 para melhor elevação no Android
  },
});

export default HeroHeader;
