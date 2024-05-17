import { useState } from 'react';
import { Keyboard, View } from 'react-native';
import { ActivityIndicator, Button } from 'react-native-paper';

import { useAxios } from '@/api/axios';
import { ENDPOINTS } from '@/api/endpoints';
import { styles, theme } from '@/common/styles';
import Chat from '@/components/Chat';
import DetailsInfo from '@/components/DetailsInfo';
import UserProfile from '@/components/UserProfile';
import { ScreenProps } from '@/types/props';
import {
  QuestResponseData,
  RecordResponseData,
  RecordStatus
} from '@/types/response';

const DetailsScreen = ({ route, navigation }: ScreenProps) => {
  const [isKeyboardVisible, setIsKeyboardVisible] = useState<boolean>(
    Keyboard.isVisible()
  );
  Keyboard.addListener('keyboardDidShow', () => {
    setIsKeyboardVisible(true);
  });
  Keyboard.addListener('keyboardDidHide', () => {
    setIsKeyboardVisible(false);
  });

  const quest: QuestResponseData = route.params?.quest;

  const [{ loading: loadingRecord, data: record }, refetch] =
    useAxios<RecordResponseData>({
      url: `${ENDPOINTS.record}${quest.id}`,
      method: 'GET'
    });

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
    setChoose(null);
    navigation.goBack();
  };

  if (loadingRecord) {
    return <ActivityIndicator size="large" style={styles.container} />;
  }

  return (
    <View style={styles.container}>
      {quest.status === 'Created' ? (
        record?.status === 'Has an offer' ? (
          <>
            <UserProfile user={record?.worker!} />
            <View style={styles.row}>
              <Button
                mode="contained"
                loading={choose === 'decline' && loading}
                disabled={choose !== null && loading}
                buttonColor={theme.colors.error}
                style={styles.detailsButton}
                onPress={declineUser}
              >
                Decline
              </Button>
              <Button
                mode="contained"
                loading={choose === 'accept' && loading}
                disabled={choose !== null && loading}
                style={styles.detailsButton}
                onPress={acceptUser}
              >
                Accept
              </Button>
            </View>
          </>
        ) : (
          <View>
            {!isKeyboardVisible && (
              <DetailsInfo record={record!} isWorker={false} />
            )}
            <Chat record={record!} isKeyboardVisible={isKeyboardVisible} />
          </View>
        )
      ) : (
        <View>
          {!isKeyboardVisible && <DetailsInfo record={record!} isWorker />}
          <Chat record={record!} isKeyboardVisible={isKeyboardVisible} />
        </View>
      )}
    </View>
  );
};

export default DetailsScreen;
