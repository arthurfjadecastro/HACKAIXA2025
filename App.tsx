import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, ScrollView, Alert } from 'react-native';
import { Button, Card, Text, Skeleton } from '@/design-system/components';
import { colors, spacing, padding } from '@/design-system/tokens';

export default function App() {
  const [loading, setLoading] = useState(false);

  const handleButtonPress = (buttonType: string) => {
    Alert.alert('Design System', `Botão ${buttonType} pressionado!`);
  };

  const handleLoadingTest = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Card variant="elevated" padding="lg" style={styles.headerCard}>
          <Text variant="h1" color="primary">
            Design System Test
          </Text>
          <Text variant="body1" color="secondary" style={styles.subtitle}>
            Simulador de Empréstimos - C150713_CAIXA
          </Text>
        </Card>

        {/* Buttons Section */}
        <Card padding="md" style={styles.section}>
          <Text variant="h3" style={styles.sectionTitle}>
            Componentes Button
          </Text>
          
          <View style={styles.buttonGroup}>
            <Button
              title="Primary Button"
              variant="primary"
              onPress={() => handleButtonPress('Primary')}
              icon="home"
              style={styles.button}
            />
            
            <Button
              title="Secondary Button"
              variant="secondary"
              onPress={() => handleButtonPress('Secondary')}
              icon="calculator"
              style={styles.button}
            />
            
            <Button
              title="Outline Button"
              variant="outline"
              onPress={() => handleButtonPress('Outline')}
              icon="attach-money"
              style={styles.button}
            />
          </View>

          {/* Button Sizes */}
          <Text variant="h4" style={styles.subsectionTitle}>
            Tamanhos
          </Text>
          
          <View style={styles.buttonGroup}>
            <Button
              title="Small"
              size="sm"
              onPress={() => handleButtonPress('Small')}
              style={styles.button}
            />
            
            <Button
              title="Medium"
              size="md"
              onPress={() => handleButtonPress('Medium')}
              style={styles.button}
            />
            
            <Button
              title="Large"
              size="lg"
              onPress={() => handleButtonPress('Large')}
              style={styles.button}
            />
          </View>

          {/* Button States */}
          <Text variant="h4" style={styles.subsectionTitle}>
            Estados
          </Text>
          
          <View style={styles.buttonGroup}>
            <Button
              title="Loading Test"
              loading={loading}
              onPress={handleLoadingTest}
              style={styles.button}
            />
            
            <Button
              title="Disabled"
              disabled
              onPress={() => {}}
              style={styles.button}
            />
            
            <Button
              title="Full Width"
              fullWidth
              onPress={() => handleButtonPress('Full Width')}
              style={styles.button}
            />
          </View>
        </Card>

        {/* Cards Section */}
        <Card padding="md" style={styles.section}>
          <Text variant="h3" style={styles.sectionTitle}>
            Componentes Card
          </Text>
          
          <Card variant="default" padding="sm" style={styles.exampleCard}>
            <Text variant="body1">Card Default - Padding Small</Text>
          </Card>
          
          <Card variant="elevated" padding="md" style={styles.exampleCard}>
            <Text variant="body1">Card Elevated - Padding Medium</Text>
          </Card>
          
          <Card variant="outlined" padding="lg" style={styles.exampleCard}>
            <Text variant="body1">Card Outlined - Padding Large</Text>
          </Card>
        </Card>

        {/* Skeleton Section */}
        <Card padding="md" style={styles.section}>
          <Text variant="h3" style={styles.sectionTitle}>
            Componentes Skeleton
          </Text>
          
          <View style={styles.skeletonGroup}>
            <Skeleton width="100%" height={40} variant="rectangle" />
            <Skeleton width="80%" height={20} variant="line" />
            <Skeleton width={60} height={60} variant="circle" />
          </View>
        </Card>

        {/* Typography Section */}
        <Card padding="md" style={styles.section}>
          <Text variant="h3" style={styles.sectionTitle}>
            Tipografia
          </Text>
          
          <Text variant="h1" style={styles.textExample}>Heading 1</Text>
          <Text variant="h2" style={styles.textExample}>Heading 2</Text>
          <Text variant="h3" style={styles.textExample}>Heading 3</Text>
          <Text variant="h4" style={styles.textExample}>Heading 4</Text>
          <Text variant="body1" style={styles.textExample}>Body text</Text>
          <Text variant="caption" style={styles.textExample}>Caption text</Text>
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: padding.md,
    paddingBottom: padding.xl,
  },
  headerCard: {
    marginBottom: spacing[4],
    alignItems: 'center',
  },
  subtitle: {
    marginTop: spacing[1],
    textAlign: 'center',
  },
  section: {
    marginBottom: spacing[4],
  },
  sectionTitle: {
    marginBottom: spacing[4],
  },
  subsectionTitle: {
    marginTop: spacing[4],
    marginBottom: spacing[2],
  },
  buttonGroup: {
    gap: spacing[2],
  },
  button: {
    marginBottom: spacing[1],
  },
  exampleCard: {
    marginBottom: spacing[2],
  },
  skeletonGroup: {
    gap: spacing[2],
    alignItems: 'flex-start',
  },
  textExample: {
    marginBottom: spacing[1],
  },
});
