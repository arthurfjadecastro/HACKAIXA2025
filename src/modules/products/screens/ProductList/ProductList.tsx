import React from 'react';
import { View, ScrollView, SafeAreaView, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Button, Skeleton } from '@/design-system/components';
import HeroHeader from '@/design-system/components/HeroHeader/HeroHeader';
import { Text } from '@/design-system/components/Text/Text';
import { Icon } from '@/design-system/icons';
import { spacing } from '@/design-system/tokens';
import { AppStackParamList } from '@/navigation/AppStack';
import { useProducts } from '@/hooks/useProducts';
import { ProductsList } from './components/ProductsList';

type NavigationProps = NativeStackNavigationProp<AppStackParamList, 'ProductList'>;

const ProductList: React.FC = () => {
  const navigation = useNavigation<NavigationProps>();
  const { products, loading } = useProducts();

  const handleCadastrarProduto = () => {
    navigation.navigate('RegisterProducts');
  };

  // Filtrar apenas produtos ativos para exibição na lista
  const activeProducts = products.filter(product => product.active);
  const hasProducts = activeProducts.length > 0;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LinearGradient
        colors={['#005ca9', '#005fab', '#005fab', '#00a1d8', '#00b5e5']}
        locations={[0, 0.05, 0.45, 0.82, 1]}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 0 }}
        style={{ flex: 1 }}
      >
        <ScrollView 
          style={{ flex: 1 }}
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Hero Header com gradiente e card sobreposto */}
          <HeroHeader
            name="Arthur de Castro"
            role="Cliente Singular"
          >
            <Text style={styles.instructionText}>
              Escolha um produto e simule seu empréstimo de forma rápida e clara.
            </Text>
          </HeroHeader>

        {/* Zona de conteúdo - Lista de produtos ou Empty state */}
        <View style={{ flex: 1, justifyContent: hasProducts ? 'flex-start' : 'center', marginTop: spacing[8] }}>
          {loading ? (
            <View style={{ paddingHorizontal: spacing[4] }}>
              <Skeleton width="100%" height={120} style={{ marginBottom: spacing[4] }} />
              <Skeleton width="100%" height={120} style={{ marginBottom: spacing[4] }} />
              <Skeleton width="100%" height={120} />
            </View>
          ) : hasProducts ? (
            <ProductsList products={activeProducts} />
          ) : (
            // Empty State customizado seguindo Figma
            <View style={styles.emptyContainer}>
              {/* Ícone central */}
              <View style={styles.iconContainer}>
                <Icon name="add" size={32} color="rgba(255, 255, 255, 0.9)" />
              </View>

              {/* Texto principal */}
              <Text style={styles.primaryText}>
                Você ainda não tem produtos cadastrados. Cadastre o primeiro e comece a simular agora.
              </Text>

              {/* Texto secundário */}
              <Text style={styles.secondaryText}>
                É rápido e leva menos de 1 minuto.
              </Text>
            </View>
          )}
        </View>

        {/* CTA principal - Cadastrar produto */}
        <View style={styles.ctaContainer}>
          <Button
            title="Cadastrar produto"
            variant="primary"
            size="lg"
            fullWidth
            onPress={handleCadastrarProduto}
            style={styles.ctaButton}
          />
        </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  instructionText: {
    fontSize: 16, // fonte maior conforme especificação
    fontWeight: '400',
    color: '#333333', // neutral-800 (cor mais escura para melhor contraste)
    textAlign: 'center', // centralizado
    lineHeight: 18,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 48,
  },
  iconContainer: {
    width: 64,
    height: 64,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  primaryText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 8,
    maxWidth: '90%',
  },
  secondaryText: {
    fontSize: 14,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 32,
  },
  ctaContainer: {
    paddingHorizontal: spacing[4], // 16dp margens laterais
    paddingBottom: spacing[6], // 24dp espaçamento inferior  
    marginTop: spacing[6],
  },
  ctaButton: {
    backgroundColor: '#F39200', // Laranja primário
    borderRadius: 8,
    minHeight: 48, // Altura mínima 48dp
  },
});

export default ProductList;
