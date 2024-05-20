import { MessageContentType } from '@/types/Quests/response';

export interface CreateQuestRequestData {
  title: string;
  description: string;
  reward: number;
  latitude: number;
  longitude: number;
  category: number;
}

export interface UpdateQuestRequestData {
  title?: string;
  description?: string;
  reward?: number;
  category?: number;
}

export interface MessageRequestData {
  content: string;
  content_type: MessageContentType;
}

export interface FeedbackRequestData {
  recipient: number;
  text?: string;
  rating: number;
}
