import { View } from 'react-native';
import { Text } from 'react-native-paper';

import { styles } from '@/common/styles';

const PurchaseScreen = () => {
  return (
    <View
      style={[styles.container, styles.centerVertical, styles.centerHorizontal]}
    >
      <Text>Purchase</Text>
    </View>
  );
};

export default PurchaseScreen;
