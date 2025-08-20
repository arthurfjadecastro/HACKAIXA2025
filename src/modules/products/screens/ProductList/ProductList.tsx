import React from 'react';
import { View, ScrollView, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Button, WelcomeBanner, EmptyState } from '@/design-system/components';
import { colors, spacing } from '@/design-system/tokens';
import { AppStackParamList } from '@/navigation/AppStack';

type NavigationProps = NativeStackNavigationProp<AppStackParamList, 'ProductList'>;

const ProductList: React.FC = () => {
  const navigation = useNavigation<NavigationProps>();

  const handleCadastrarProduto = () => {
    navigation.navigate('RegisterProducts');
  };

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
          {/* Zona de topo - Banner de boas-vindas */}
          <View style={{ marginTop: spacing[4], marginBottom: spacing[6] }}>
            <WelcomeBanner
              userName="Arthur de Castro"
              userTier="Singular"
            />
          </View>

          {/* Zona de conteúdo - Empty state */}
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <EmptyState
              icon="add" // Ícone de adicionar/plus, representando "cadastrar"
              title="Você ainda não tem produtos cadastrados. Cadastre o primeiro e comece a simular agora."
              subtitle="É rápido e leva menos de 1 minuto."
            />
          </View>

          {/* CTA principal - Cadastrar produto */}
          <View style={{
            paddingHorizontal: spacing[6],
            paddingBottom: spacing[6],
            marginTop: spacing[8],
          }}>
            <Button
              title="Cadastrar produto"
              variant="primary"
              size="lg"
              fullWidth
              onPress={handleCadastrarProduto}
              style={{
                backgroundColor: colors.brand.orange.primary, // #F39200
                borderRadius: 12,
              }}
            />
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default ProductList;
