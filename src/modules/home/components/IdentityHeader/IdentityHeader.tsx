import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '@/design-system/components/Text/Text';
import { colors, fontFamilies } from '@/design-system/tokens';

interface IdentityHeaderProps {
  name: string;
  registration: string;
  department: string;
  description: string;
}

const IdentityHeader: React.FC<IdentityHeaderProps> = ({
  name,
  registration,
  department,
  description,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.leftContent}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.department}>
          {department} <Text style={styles.description}>- {description}</Text>
        </Text>
      </View>
      
      <View style={styles.rightContent}>
        <Text style={styles.registration}>{registration}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginHorizontal: 16,
  },
  leftContent: {
    flex: 1,
  },
  rightContent: {
    alignItems: 'flex-end',
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    fontFamily: fontFamilies.caixaSemiBold,
    color: colors.text.inverse,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 2,
  },
  department: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: fontFamilies.caixaSemiBold,
    color: colors.text.inverse,
  },
  description: {
    fontSize: 14,
    fontWeight: '400',
    fontFamily: fontFamilies.caixa,
    color: colors.text.inverse,
    opacity: 0.85,
  },
  registration: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: fontFamilies.caixaSemiBold,
    color: colors.text.inverse,
    letterSpacing: 0.2,
  },
});

export default IdentityHeader;
