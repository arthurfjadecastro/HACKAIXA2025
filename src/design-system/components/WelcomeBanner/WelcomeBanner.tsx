// import React from 'react';
// import { View, StyleSheet } from 'react-native';

// import { Text } from '@/design-system/components/Text/Text';
// import ArthurAvatar from '@/components/ArthurAvatar';
// import { spacing, colors } from '@/design-system/tokens';

// interface WelcomeBannerProps {
//   userName: string;
//   userTier: string;
// }

// const WelcomeBanner: React.FC<WelcomeBannerProps> = ({
//   userName,
//   userTier,
// }) => {
//   return (
//     <View style={styles.container}>
//       {/* Header com avatar e saudação */}
//       <View style={styles.headerContent}>
//         {/* Avatar circular com borda */}
//         <View style={styles.avatarContainer}>
//           <ArthurAvatar size={64} />
//         </View>

//         {/* Textos */}
//         <View style={styles.textStack}>
//           <Text style={styles.title}>
//             Olá, {userName}
//           </Text>
//           <Text style={styles.subtitle}>
//             Cliente {userTier}
//           </Text>
//         </View>
//       </View>

//       {/* Card informativo */}
//       <View style={styles.infoCard}>
//         <Text style={styles.infoText}>
//           Escolha um produto e simule seu empréstimo de forma rápida e clara.
//         </Text>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     paddingHorizontal: spacing[4],
//     paddingTop: spacing[4],
//     paddingBottom: spacing[6],
//   },
//   headerContent: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: spacing[5],
//   },
//   avatarContainer: {
//     marginRight: spacing[4],
//     backgroundColor: 'rgba(255, 255, 255, 0.15)',
//     borderRadius: 36, // 64/2 + 4 padding + 2 border
//     padding: 6,
//     borderWidth: 2,
//     borderColor: 'rgba(255, 255, 255, 0.3)',
//   },
//   textStack: {
//     flex: 1,
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: '600', // semibold
//     color: '#FFFFFF',
//     marginBottom: 2,
//   },
//   subtitle: {
//     fontSize: 14,
//     fontWeight: '400',
//     color: '#E0E0E0',
//   },
//   infoCard: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 12,
//     padding: spacing[4],
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   infoText: {
//     fontSize: 16,
//     fontWeight: '400',
//     color: colors.text.primary,
//     textAlign: 'center',
//     lineHeight: 22,
//   },
// });

// export default WelcomeBanner;
