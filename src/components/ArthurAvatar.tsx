import React from 'react';
import { View, Image } from 'react-native';

interface ArthurAvatarProps {
  size?: number;
  style?: any;
  testID?: string;
}

const ArthurAvatar: React.FC<ArthurAvatarProps> = ({ 
  size = 64, 
  style,
  testID 
}) => {
  return (
    <View 
      testID={testID}
      style={[{ 
        width: size, 
        height: size, 
        borderRadius: size / 2,
        overflow: 'hidden',
        // Removendo borderWidth e borderColor para evitar borda dupla
      }, style]}
    >
      <Image 
        source={require('../../assets/arthur.png')}
        style={{ 
          width: size, 
          height: size,
        }}
        resizeMode="cover"
      />
    </View>
  );
};

export default ArthurAvatar;
