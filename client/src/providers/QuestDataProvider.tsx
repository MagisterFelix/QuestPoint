import { createContext, useContext, useEffect, useState } from 'react';

import { useAxios } from '@/api/axios';
import { ENDPOINTS } from '@/api/endpoints';
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
  const [quests, setQuests] = useState<QuestResponseData[] | undefined>(
    undefined
  );

  const [{ loading: loadingQuests, data: questList }, refetch] = useAxios<
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
    if (
      !filters ||
      (!filters.Created && !filters.Offer && !filters.InProgress)
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
    if (combinedFilters.length > 0) {
      setQuests(
        questList.filter((quest: QuestResponseData) =>
          combinedFilters.includes(quest.status)
        )
      );
    }
  }, [questList, filters]);

  const updateQuests = async () => {
    await refetch();
  };

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
