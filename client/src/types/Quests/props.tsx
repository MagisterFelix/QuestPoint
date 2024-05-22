import { ReactNode } from 'react';

import {
  CategoryResponseData,
  MessageResponseData,
  QuestResponseData,
  RecordResponseData
} from '@/types/Quests/response';

export interface QuestDataContextProps {
  quests: QuestResponseData[] | undefined;
  updateQuests?: () => Promise<void>;
}

export interface FiltersProps {
  Created: boolean;
  Offer: boolean;
  InProgress: boolean;
}

export interface QuestDataProviderProps {
  children: ReactNode;
  filters?: FiltersProps;
}

export interface CategoryProps {
  category: CategoryResponseData;
}

export interface QuestProps {
  quest: QuestResponseData;
}

export interface InfoProps {
  record: RecordResponseData;
  updateRecord: () => Promise<void>;
  isWorker: boolean;
  showFeedback: boolean;
  toggleFeedback: () => void;
}

export interface ChatProps {
  record: RecordResponseData;
}

export interface MessageProps {
  message: MessageResponseData;
  isOwner: boolean;
}

export interface FeedbackProps {
  show: boolean;
  user: string;
  onCancelPress: (...args: any[]) => any;
  onAgreePress: (...args: any[]) => any;
}

export interface RatingProps {
  rating: number;
  onStarPress: (rating: number) => void;
}
