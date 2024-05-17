import { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';

import { useAxios } from '@/api/axios';
import { ENDPOINTS } from '@/api/endpoints';
import { styles } from '@/common/styles';
import NoData from '@/components/NoData';
import Quest from '@/components/Quest';
import { QuestListProps } from '@/types/props';
import { QuestResponseData } from '@/types/response';

const QuestListScreen = ({ filters }: QuestListProps) => {
  const [quests, setQuests] = useState<QuestResponseData[] | undefined>(
    undefined
  );

  const [{ loading: loadingQuests, data: questList }] = useAxios<
    QuestResponseData[]
  >({
    url: ENDPOINTS.quests,
    method: 'GET'
  });

  useEffect(() => {
    if (!questList) {
      return;
    }
    setQuests(questList);
    if (!filters.Created && !filters.Offer && !filters.InProgress) {
      return;
    }
    const combinedFilters: string[] = [];
    if (filters.Created) {
      combinedFilters.push('Created');
      combinedFilters.push('Created [Waiting]');
    }
    if (filters.Offer) {
      combinedFilters.push('Has an offer');
    }
    if (filters.InProgress) {
      combinedFilters.push(
        'In progress',
        "Waiting for the creator's response",
        "Waiting for the worker's response"
      );
    }
    setQuests(
      questList.filter((quest: QuestResponseData) =>
        combinedFilters.includes(quest.status)
      )
    );
  }, [filters, questList]);

  if (loadingQuests) {
    return <ActivityIndicator size="large" style={styles.container} />;
  }

  if (!questList) {
    return <NoData />;
  }

  return (
    <View style={[styles.container]}>
      <ScrollView>
        {quests?.map((quest: QuestResponseData) => (
          <Quest key={quest.id} quest={quest} />
        ))}
      </ScrollView>
    </View>
  );
};

export default QuestListScreen;
