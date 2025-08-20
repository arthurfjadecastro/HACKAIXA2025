import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Button, Text, Card } from '@/design-system/components';
import { colors, spacing, padding } from '@/design-system/tokens';
import { AppStackParamList } from '@/navigation/AppStack';

type NavigationProps = NativeStackNavigationProp<AppStackParamList, 'Home'>;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProps>();

  const handleRegisterProducts = () => {
    navigation.navigate('RegisterProducts');
  };

  const handleListarProdutos = () => {
    navigation.navigate('ProductList');
  };

  const handleSimular = () => {
    navigation.navigate('ProductSimulator', {});
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Card variant="elevated" padding="xl" style={styles.headerCard}>
          <Text variant="h1" color="primary" style={styles.title}>
            C150713 CAIXA
          </Text>
          <Text variant="h3" color="secondary" style={styles.subtitle}>
            Sistema de Empréstimos
          </Text>
        </Card>

        <Card variant="default" padding="lg" style={styles.menuCard}>
          <Text variant="h2" style={styles.menuTitle}>
            Menu Principal
          </Text>

          <View style={styles.buttonContainer}>
            <Button
              title="Register Products"
              variant="primary"
              size="lg"
              fullWidth
              icon="add"
              onPress={handleRegisterProducts}
              style={styles.menuButton}
            />

            <Button
              title="Listar Produtos"
              variant="secondary"
              size="lg"
              fullWidth
              icon="account-balance"
              onPress={handleListarProdutos}
              style={styles.menuButton}
            />

            <Button
              title="Simular"
              variant="outline"
              size="lg"
              fullWidth
              icon="calculator"
              onPress={handleSimular}
              style={styles.menuButton}
            />
          </View>
        </Card>

        <Card variant="outlined" padding="md" style={styles.infoCard}>
          <Text variant="body2" color="secondary" style={styles.infoText}>
            Gerencie produtos de empréstimo e realize simulações com facilidade.
          </Text>
        </Card>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: padding.lg,
    paddingBottom: spacing[8],
  },
  headerCard: {
    marginBottom: spacing[6],
    alignItems: 'center',
  },
  title: {
    marginBottom: spacing[2],
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
  },
  menuCard: {
    marginBottom: spacing[4],
  },
  menuTitle: {
    marginBottom: spacing[6],
    textAlign: 'center',
  },
  buttonContainer: {
    gap: spacing[4],
  },
  menuButton: {
    marginBottom: spacing[2],
  },
  infoCard: {
    backgroundColor: colors.background.secondary,
  },
  infoText: {
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default HomeScreen;
