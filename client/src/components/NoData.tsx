import { Image, View } from 'react-native';

import { styles } from '@/common/styles';

const NoData = () => {
  return (
    <View style={styles.container}>
      <Image source={require('assets/no-data.png')} style={styles.fullImage} />
    </View>
  );
};

export default NoData;
