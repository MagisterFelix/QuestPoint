import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Avatar, Button, Card, Text } from 'react-native-paper';

import { useAxios } from '@/api/axios';
import { ENDPOINTS } from '@/api/endpoints';
import { styles, theme } from '@/common/styles';
import Feedback from '@/components/Quests/Feedback';
import { useAuth } from '@/providers/AuthProvider';
import { useQuestData } from '@/providers/QuestDataProvider';
import { InfoProps } from '@/types/Quests/props';
import { RecordStatus } from '@/types/Quests/response';

const Info = ({
  record,
  updateRecord,
  isWorker,
  showFeedback,
  toggleFeedback
}: InfoProps) => {
  const navigation: NavigationProp<any> = useNavigation();

  const { updateQuests } = useQuestData();

  const { getProfile } = useAuth();

  const [{ loading }, request] = useAxios(
    {},
    {
      manual: true
    }
  );

  const [choose, setChoose] = useState<'accept' | 'decline' | null>(null);

  const requestToDeclineQuest = async () => {
    setChoose('decline');
    await request({
      url: `${ENDPOINTS.record}${record.quest.id}/`,
      method: 'PATCH',
      data: {
        status: RecordStatus["Waiting for the worker's response"]
      }
    });
    await updateRecord();
    await updateQuests!();
    setChoose(null);
  };

  const responseToDeclineQuest = async () => {
    setChoose('decline');
    await request({
      url: `${ENDPOINTS.record}${record.quest.id}/`,
      method: 'PATCH',
      data: {
        status: RecordStatus['Cancelled']
      }
    });
    await updateQuests!();
    navigation.goBack();
    setChoose(null);
  };

  const requestToApproveQuest = async () => {
    toggleFeedback();
    setChoose('accept');
    await request({
      url: `${ENDPOINTS.record}${record.quest.id}/`,
      method: 'PATCH',
      data: {
        status: RecordStatus["Waiting for the creator's response"]
      }
    });
    await updateRecord();
    await updateQuests!();
    setChoose(null);
  };

  const responseToApproveQuest = async () => {
    toggleFeedback();
    setChoose('accept');
    await request({
      url: `${ENDPOINTS.record}${record.quest.id}/`,
      method: 'PATCH',
      data: {
        status: RecordStatus['Completed']
      }
    });
    await updateQuests!();
    navigation.goBack();
    await getProfile!();
    setChoose(null);
  };

  return (
    <View>
      <Card style={styles.info}>
        <Card.Title
          title={isWorker ? 'Creator' : 'Worker'}
          titleVariant="titleLarge"
        />
        <Card.Content style={styles.col}>
          <View style={[styles.row, styles.alignItemsCenter]}>
            <View style={styles.flexForWrap}>
              <TouchableOpacity
                style={[styles.row, styles.alignItemsCenter]}
                onPress={() =>
                  navigation.navigate('User', {
                    user: isWorker
                      ? record.quest.creator.username
                      : record.worker.username
                  })
                }
              >
                <Avatar.Image
                  source={{
                    uri: isWorker
                      ? record.quest.creator.image
                      : record.worker.image
                  }}
                  size={32}
                  style={styles.image}
                />
                <Text variant="bodyLarge">
                  {isWorker
                    ? record.quest.creator.username
                    : record.worker.username}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={[styles.row, styles.alignItemsCenter]}>
            <View style={styles.flexForWrap}>
              <Text variant="bodyLarge">Status:</Text>
              <Text variant="bodyLarge" style={styles.wrap}>
                {record.status}
              </Text>
            </View>
          </View>
        </Card.Content>
        <Card.Actions>
          <Button
            mode="text"
            disabled={
              choose !== null ||
              loading ||
              (isWorker
                ? record.status !== "Waiting for the worker's response"
                : record.status !== 'In progress')
            }
            textColor={theme.colors.error}
            onPress={isWorker ? responseToDeclineQuest : requestToDeclineQuest}
          >
            Decline
          </Button>
          <Button
            mode="text"
            disabled={
              choose !== null ||
              loading ||
              (isWorker
                ? record.status !== 'In progress'
                : record.status !== "Waiting for the creator's response")
            }
            onPress={toggleFeedback}
          >
            Approve
          </Button>
        </Card.Actions>
      </Card>
      <Feedback
        show={showFeedback}
        user={isWorker ? record.quest.creator.username : record.worker.username}
        onCancelPress={
          isWorker ? requestToApproveQuest : responseToApproveQuest
        }
        onAgreePress={isWorker ? requestToApproveQuest : responseToApproveQuest}
      />
    </View>
  );
};

export default Info;
