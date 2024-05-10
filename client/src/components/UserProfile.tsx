import * as Clipboard from 'expo-clipboard';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { ActivityIndicator, Avatar, Icon, Text } from 'react-native-paper';

import { styles } from '@/common/styles';
import Review from '@/components/Review';
import { UserProfileProps } from '@/types/props';
import { FeedbackResponseData } from '@/types/response';

const UserProfile = ({ loading, user, feedback }: UserProfileProps) => {
  if (loading) {
    return <ActivityIndicator size="large" style={styles.container} />;
  }

  return (
    <View style={styles.container}>
      <View style={[styles.rowCenter, styles.user]}>
        <Avatar.Image
          source={{ uri: user.image }}
          size={128}
          style={styles.avatar}
        />
        <View style={styles.centerHorizontal}>
          <View style={styles.row}>
            <Icon source={require('assets/level.png')} size={32} />
            <Text style={styles.level_xp}>
              {user.level} lvl ({user.xp} XP)
            </Text>
          </View>
          <Text style={styles.name}>
            {user.full_name
              ? user.full_name
              : `${user.username.charAt(0).toUpperCase()}${user.username.slice(1).toLowerCase()}`}
          </Text>
          <TouchableOpacity
            onPress={() => Clipboard.setStringAsync(user.username)}
          >
            <Text style={styles.username}>@{user.username}</Text>
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView style={styles.feedback}>
        {feedback.map((review: FeedbackResponseData) => (
          <Review key={review.id} review={review} />
        ))}
      </ScrollView>
    </View>
  );
};

export default UserProfile;
