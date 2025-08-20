import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import AppStackNavigator from '@/navigation/AppStack';

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <AppStackNavigator />
    </NavigationContainer>
  );
}
