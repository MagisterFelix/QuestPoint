import { View } from 'react-native';
import { Divider, Text, TouchableRipple } from 'react-native-paper';

import { styles } from '@/common/styles';
import { ScreenProps } from '@/types/props';

const SettingsScreen = ({ navigation }: ScreenProps) => {
  return (
    <View>
      <TouchableRipple
        onPress={() => navigation.navigate('Account Settings')}
        style={styles.settingsTab}
      >
        <Text variant="titleMedium">Account</Text>
      </TouchableRipple>
      <Divider />
      <TouchableRipple
        onPress={() => navigation.navigate('Privacy Settings')}
        style={styles.settingsTab}
      >
        <Text variant="titleMedium">Privacy</Text>
      </TouchableRipple>
      <Divider />
      <TouchableRipple
        onPress={() => navigation.navigate('Payment')}
        style={styles.settingsTab}
      >
        <Text variant="titleMedium">Payment</Text>
      </TouchableRipple>
    </View>
  );
};

export default SettingsScreen;
