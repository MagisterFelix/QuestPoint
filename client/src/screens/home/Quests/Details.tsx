import { useEffect, useState } from 'react';
import { Keyboard, View } from 'react-native';
import { Button } from 'react-native-paper';

import { useAxios } from '@/api/axios';
import { ENDPOINTS } from '@/api/endpoints';
import { styles, theme } from '@/common/styles';
import Loading from '@/components/Loading';
import Chat from '@/components/Quests/Chat';
import Info from '@/components/Quests/Info';
import Profile from '@/components/User/Profile';
import { useQuestData } from '@/providers/QuestDataProvider';
import { useUpdater } from '@/providers/UpdaterProvider';
import {
  QuestResponseData,
  RecordResponseData,
  RecordStatus
} from '@/types/Quests/response';
import { ScreenProps } from '@/types/props';

const DetailsScreen = ({ route, navigation }: ScreenProps) => {
  const { updateQuests } = useQuestData();

  const quest: QuestResponseData = route.params?.quest;

  const [{ loading: loadingRecord, data: record }, refetch] =
    useAxios<RecordResponseData>(
      {
        url: `${ENDPOINTS.record}${quest.id}/`,
        method: 'GET'
      },
      { useCache: false }
    );

  const updateRecord = async () => {
    await refetch();
  };

  const [{ loading }, request] = useAxios(
    {},
    {
      manual: true
    }
  );

  const [choose, setChoose] = useState<'accept' | 'decline' | null>(null);

  const acceptUser = async () => {
    setChoose('accept');
    await request({
      url: `${ENDPOINTS.record}${quest.id}/`,
      method: 'PATCH',
      data: {
        status: RecordStatus['In progress']
      }
    });
    await updateQuests!();
    await refetch();
    setChoose(null);
  };

  const declineUser = async () => {
    setChoose('decline');
    await request({
      url: `${ENDPOINTS.record}${quest.id}/`,
      method: 'PATCH',
      data: {
        status: RecordStatus['Cancelled']
      }
    });
    await updateQuests!();
    navigation.goBack();
    setChoose(null);
  };

  const [showFeedback, setShowFeedback] = useState<boolean>(false);
  const toggleFeedback = () => setShowFeedback(!showFeedback);

  const [isKeyboardVisible, setIsKeyboardVisible] = useState<boolean>(
    Keyboard.isVisible()
  );
  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setIsKeyboardVisible(true);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setIsKeyboardVisible(false);
    });

    if (showFeedback) {
      showSubscription.remove();
      hideSubscription.remove();
    }

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, [showFeedback]);

  useEffect(() => {
    if (quest.has_notification && record) {
      updateQuests!();
      quest.has_notification = false;
    }
  }, [quest, record, updateQuests]);

  const { updating, toUpdate, update } = useUpdater();

  useEffect(() => {
    const updateComponent = async () => {
      await refetch();
    };
    if (!updating && toUpdate.has(`Record-${quest.id}`) && record) {
      if (
        record?.status !== "Waiting for the creator's response" &&
        record?.status !== "Waiting for the worker's response"
      ) {
        update!(`Record-${quest.id}`, updateComponent);
      } else {
        navigation.goBack();
      }
    }
  }, [updating, toUpdate, update, quest, record, refetch, navigation]);

  if (loadingRecord && !record) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      {quest.status === 'Created' ? (
        record?.status === 'Has an offer' ? (
          <View style={styles.containerInner}>
            <Profile user={record?.worker!} />
            <View style={styles.rowCenter}>
              <Button
                mode="contained"
                loading={choose === 'decline' && loading}
                disabled={choose !== null || loading}
                buttonColor={theme.colors.error}
                style={styles.formGroupButton}
                onPress={declineUser}
              >
                Decline
              </Button>
              <Button
                mode="contained"
                loading={choose === 'accept' && loading}
                disabled={choose !== null || loading}
                style={styles.formGroupButton}
                onPress={acceptUser}
              >
                Accept
              </Button>
            </View>
          </View>
        ) : (
          <View>
            {!isKeyboardVisible && (
              <Info
                record={record!}
                updateRecord={updateRecord}
                isWorker={false}
                showFeedback={showFeedback}
                toggleFeedback={toggleFeedback}
              />
            )}
            <Chat record={record!} />
          </View>
        )
      ) : (
        <View>
          {!isKeyboardVisible && (
            <Info
              record={record!}
              updateRecord={updateRecord}
              isWorker
              showFeedback={showFeedback}
              toggleFeedback={toggleFeedback}
            />
          )}
          <Chat record={record!} />
        </View>
      )}
    </View>
  );
};

export default DetailsScreen;
