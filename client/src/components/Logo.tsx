import { Image, View } from 'react-native';

import { styles } from '@/common/styles';

const Logo = () => {
  return (
    <View
      style={[
        styles.container,
        styles.justifyContentCenter,
        styles.alignItemsCenter
      ]}
    >
      <Image
        source={require('assets/icon.png')}
        resizeMode="contain"
        style={styles.logo}
      />
    </View>
  );
};

export default Logo;
