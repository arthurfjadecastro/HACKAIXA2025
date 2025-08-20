import React from 'react';
import { View, Image } from 'react-native';

interface ArthurAvatarProps {
  size?: number;
  style?: any;
  testID?: string;
}

const ArthurAvatar: React.FC<ArthurAvatarProps> = ({ 
  size = 56, 
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
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.3)',
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
