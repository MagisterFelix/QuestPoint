import { View } from 'react-native';
import { Icon, Text } from 'react-native-paper';

import { styles } from '@/common/styles';
import { useAuth } from '@/providers/AuthProvider';

const Balance = () => {
  const { user } = useAuth();

  return (
    <View style={styles.rowCenter}>
      <Text style={styles.headerTitle}>{user?.balance.toLocaleString()}</Text>
      <Icon source={require('assets/coin.png')} size={32} />
    </View>
  );
};

export default Balance;
