import { useEffect } from 'react';
import { RefreshControl, ScrollView, View } from 'react-native';

import { styles } from '@/common/styles';
import Loading from '@/components/Loading';
import NoData from '@/components/NoData';
import Quest from '@/components/Quests/Quest';
import { useQuestData } from '@/providers/QuestDataProvider';
import { QuestResponseData } from '@/types/Quests/response';
import { ScreenProps } from '@/types/props';

const QuestListScreen = ({ route, navigation }: ScreenProps) => {
  const { loadingQuests, quests, updateQuests } = useQuestData();

  useEffect(() => {
    if (route.params?.updateQuests) {
      navigation.setParams({ updateQuests: false });
      updateQuests!();
    }
  }, [route.params?.updateQuests, navigation, updateQuests]);

  if (!quests) {
    return <Loading />;
  }

  if (quests.length === 0) {
    return <NoData />;
  }

  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={loadingQuests!}
            onRefresh={updateQuests!}
          />
        }
      >
        {quests.map((quest: QuestResponseData) => (
          <Quest key={quest.id} quest={quest} />
        ))}
      </ScrollView>
    </View>
  );
};

export default QuestListScreen;
