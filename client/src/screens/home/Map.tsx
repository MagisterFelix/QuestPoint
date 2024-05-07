import { View } from 'react-native';
import { Text } from 'react-native-paper';

import { styles } from '@/common/styles';

const MapScreen = () => {
  return (
    <View
      style={[styles.container, styles.centerVertical, styles.centerHorizontal]}
    >
      <Text>Map</Text>
    </View>
  );
};

export default MapScreen;
