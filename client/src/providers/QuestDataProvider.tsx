import { RouteProp, useRoute } from '@react-navigation/native';
import { createContext, useContext, useEffect, useState } from 'react';

import { useAxios } from '@/api/axios';
import { ENDPOINTS } from '@/api/endpoints';
import { useLocation } from '@/providers/LocationProvider';
import {
  QuestDataContextProps,
  QuestDataProviderProps
} from '@/types/Quests/props';
import { QuestResponseData } from '@/types/Quests/response';

const QuestDataContext = createContext<QuestDataContextProps>({
  quests: []
});

export const useQuestData = () => {
  return useContext(QuestDataContext);
};

const QuestDataProvider = ({ children, filters }: QuestDataProviderProps) => {
  const route: RouteProp<any> = useRoute();

  const [quests, setQuests] = useState<QuestResponseData[] | undefined>(
    undefined
  );

  const { location } = useLocation();

  const [{ loading: loadingQuests, data: questList }, refetch] = useAxios<
    QuestResponseData[]
  >(
    {
      url: location
        ? `${ENDPOINTS.quests}?latitude=${location.latitude}&longitude=${location.longitude}`
        : ENDPOINTS.quests,
      method: 'GET'
    },
    { manual: route.name === 'MapTab' && !location }
  );

  const updateQuests = async () => {
    await refetch();
  };

  useEffect(() => {
    if (!questList) {
      return;
    }
    setQuests(questList);
    if (
      !filters ||
      (!filters.Created &&
        !filters.Offer &&
        !filters.InProgress &&
        !filters.HasNotification)
    ) {
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
    if (combinedFilters.length === 0 && !filters.HasNotification) {
      return;
    }
    setQuests(
      questList.filter(
        (quest: QuestResponseData) =>
          (combinedFilters.length > 0 &&
            combinedFilters.includes(quest.status)) ||
          (filters.HasNotification && quest.has_notification)
      )
    );
  }, [questList, filters]);

  const value = {
    loadingQuests,
    quests,
    updateQuests
  };

  return (
    <QuestDataContext.Provider value={value}>
      {children}
    </QuestDataContext.Provider>
  );
};

export default QuestDataProvider;
