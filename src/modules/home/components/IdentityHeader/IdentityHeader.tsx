import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface IdentityHeaderProps {
  userName?: string;
  userTitle?: string;
}

export const IdentityHeader: React.FC<IdentityHeaderProps> = ({
  userName = 'Usuário',
  userTitle = 'Cliente CAIXA',
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>Olá,</Text>
      <Text style={styles.userName}>{userName}</Text>
      <Text style={styles.userTitle}>{userTitle}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#F8F9FA',
  },
  greeting: {
    fontSize: 16,
    color: '#666666',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginTop: 4,
  },
  userTitle: {
    fontSize: 14,
    color: '#888888',
    marginTop: 2,
  },
});

export default IdentityHeader;