import { UserResponseData } from '@/types/User/response';

export interface CategoryResponseData {
  id: number;
  title: string;
  image: string;
}

export enum RecordStatus {
  'Has an offer' = 0,
  'In progress' = 1,
  "Waiting for the creator's response" = 2,
  "Waiting for the worker's response" = 3,
  'Cancelled' = 4,
  'Completed' = 5
}

export interface QuestResponseData {
  id: number;
  status:
    | 'Created'
    | 'Created [Waiting]'
    | 'Available'
    | 'Pending'
    | keyof typeof RecordStatus;
  has_notification: boolean;
  title: string;
  description: string;
  reward: number;
  latitude: number;
  longitude: number;
  created_at: string;
  category: CategoryResponseData;
  creator: UserResponseData;
}

export interface RecordResponseData {
  id: number;
  status: keyof typeof RecordStatus;
  created_at: string;
  quest: QuestResponseData;
  worker: UserResponseData;
}

export enum MessageContentType {
  'Text' = 0,
  'Image' = 1
}

export interface MessageResponseData {
  id: number;
  content: string;
  content_type: keyof typeof MessageContentType;
  created_at: string;
  quest: QuestResponseData;
  author: UserResponseData;
}
