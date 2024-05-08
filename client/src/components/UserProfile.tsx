import * as Clipboard from 'expo-clipboard';
import { TouchableOpacity, View } from 'react-native';
import { ActivityIndicator, Avatar, Icon, Text } from 'react-native-paper';

import { styles } from '@/common/styles';
import { UserProfileProps } from '@/types/props';

const UserProfile = ({ loading, data }: UserProfileProps) => {
  if (loading) {
    return <ActivityIndicator size="large" style={styles.container} />;
  }

  return (
    <View style={styles.container}>
      <View style={[styles.rowCenter, styles.user]}>
        <Avatar.Image
          source={{ uri: data.image }}
          size={128}
          style={styles.avatar}
        />
        <View style={styles.centerHorizontal}>
          <View style={styles.row}>
            <Icon source={require('assets/level.png')} size={32} />
            <Text style={styles.level_xp}>
              {data.level} lvl ({data.xp} XP)
            </Text>
          </View>
          <Text style={styles.name}>
            {data.full_name
              ? data.full_name
              : `${data.username.charAt(0).toUpperCase()}${data.username.slice(1).toLowerCase()}`}
          </Text>
          <TouchableOpacity
            onPress={() => Clipboard.setStringAsync(data.username)}
          >
            <Text style={styles.username}>@{data.username}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default UserProfile;
