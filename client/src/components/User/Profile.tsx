import * as Clipboard from 'expo-clipboard';
import { useState } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { Avatar, Icon, Modal, Portal, Text } from 'react-native-paper';

import { useAxios } from '@/api/axios';
import { ENDPOINTS } from '@/api/endpoints';
import { windowSize } from '@/common/constants';
import { styles } from '@/common/styles';
import Loading from '@/components/Loading';
import NoData from '@/components/NoData';
import Review from '@/components/User/Review';
import Trophy from '@/components/User/Trophy';
import { ProfileProps } from '@/types/User/props';
import {
  AchievementResponseData,
  FeedbackResponseData,
  TrophyResponseData
} from '@/types/User/response';

const Profile = ({ user }: ProfileProps) => {
  const [{ loading: loadingFeedback, data: feedback }] = useAxios<
    FeedbackResponseData[]
  >({
    url: `${ENDPOINTS.feedback}${user?.username}/`,
    method: 'GET'
  });

  const [{ loading: loadingTrophies, data: trophies }] = useAxios<
    TrophyResponseData[]
  >({
    url: ENDPOINTS.trophies,
    method: 'GET'
  });

  const [{ loading: loadingAchievements, data: achievements }] = useAxios<
    AchievementResponseData[]
  >({
    url: `${ENDPOINTS.achievements}${user?.username}/`,
    method: 'GET'
  });

  const [showAchievements, setShowAchievements] = useState<boolean>(false);
  const toggleAchievements = () => setShowAchievements(!showAchievements);

  return (
    <View style={styles.containerInner}>
      <View style={[styles.rowCenter, styles.user]}>
        <TouchableOpacity onPress={toggleAchievements}>
          <Avatar.Image
            source={{ uri: user.image }}
            size={128}
            style={styles.image}
          />
        </TouchableOpacity>
        <View style={styles.alignItemsCenter}>
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
      {loadingFeedback && !feedback ? (
        <Loading />
      ) : feedback?.length! > 0 ? (
        <ScrollView style={styles.feedback}>
          {feedback?.map((review: FeedbackResponseData) => (
            <Review key={review.id} review={review} />
          ))}
        </ScrollView>
      ) : (
        <NoData />
      )}
      <Portal>
        <Modal
          visible={showAchievements}
          onDismiss={toggleAchievements}
          contentContainerStyle={[
            styles.modal,
            { maxHeight: windowSize.height * 0.5 }
          ]}
          style={styles.container}
        >
          {(loadingTrophies && !trophies) ||
          (loadingAchievements && !achievements) ? (
            <ScrollView>
              <Text style={styles.title}>Achievements</Text>
              <Loading />
            </ScrollView>
          ) : (
            <ScrollView>
              <Text style={styles.title}>Achievements</Text>
              {trophies?.map((trophy: TrophyResponseData) => (
                <Trophy
                  key={trophy.id}
                  trophy={trophy}
                  owned={
                    achievements?.some(
                      (achievement: AchievementResponseData) =>
                        achievement.trophy.id === trophy.id
                    )!
                  }
                />
              ))}
            </ScrollView>
          )}
        </Modal>
      </Portal>
    </View>
  );
};

export default Profile;
