import { View } from 'react-native';
import { Icon, Text } from 'react-native-paper';

import { styles } from '@/common/styles';
import { CoinsProps } from '@/types/props';

const Coins = ({ amount, size }: CoinsProps) => {
  return (
    <View style={styles.rowCenter}>
      <Text style={styles.headerTitle}>{amount.toLocaleString()}</Text>
      <Icon source={require('assets/coin.png')} size={size} />
    </View>
  );
};

export default Coins;
