import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Avatar, Button, Card, Portal, Text } from 'react-native-paper';

import { useAxios } from '@/api/axios';
import { ENDPOINTS } from '@/api/endpoints';
import { styles, theme } from '@/common/styles';
import DialogFeedback from '@/components/DialogFeedback';
import { DetailsInfoProps } from '@/types/props';
import { RecordStatus } from '@/types/response';

const DetailsInfo = ({ record, isWorker }: DetailsInfoProps) => {
  const navigation: NavigationProp<any> = useNavigation();

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
    setChoose(null);
    navigation.goBack();
  };

  const requestToApproveQuest = async () => {
    setChoose('accept');
    await request({
      url: `${ENDPOINTS.record}${record.quest.id}/`,
      method: 'PATCH',
      data: {
        status: RecordStatus["Waiting for the creator's response"]
      }
    });
    setChoose(null);
  };

  const responseToApproveQuest = async () => {
    setChoose('accept');
    await request({
      url: `${ENDPOINTS.record}${record.quest.id}/`,
      method: 'PATCH',
      data: {
        status: RecordStatus['Completed']
      }
    });
    setChoose(null);
    navigation.goBack();
  };

  const [showDialogFeedback, setShowDialogFeedback] = useState<boolean>(false);
  const toggleDialogFeedback = () => setShowDialogFeedback(!showDialogFeedback);

  return (
    <Card style={styles.quest}>
      <Card.Title
        title={isWorker ? 'Creator' : 'Worker'}
        titleVariant="titleLarge"
      />
      <Card.Content style={styles.col}>
        <View style={[styles.row, styles.centerHorizontal]}>
          <View style={styles.flexForWrap}>
            <TouchableOpacity
              style={[styles.row, styles.centerHorizontal]}
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
        <View style={[styles.row, styles.centerHorizontal]}>
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
            (choose !== null && loading) ||
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
            (choose !== null && loading) ||
            (isWorker
              ? record.status !== 'In progress'
              : record.status !== "Waiting for the creator's response")
          }
          onPress={toggleDialogFeedback}
        >
          Approve
        </Button>
      </Card.Actions>
      <Portal>
        <DialogFeedback
          title="Leave a review for user"
          show={showDialogFeedback}
          user={
            isWorker ? record.quest.creator.username : record.worker.username
          }
          button="Send"
          onDismiss={isWorker ? requestToApproveQuest : responseToApproveQuest}
          onAgreePress={
            isWorker ? requestToApproveQuest : responseToApproveQuest
          }
        />
      </Portal>
    </Card>
  );
};

export default DetailsInfo;
