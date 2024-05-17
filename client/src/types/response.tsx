export interface AuthorizationResponseData {
  access: string;
  refresh: string;
  user: ProfileResponseData;
}

export interface RegistrationResponseData {
  username: string;
  email: string;
}

export interface UserResponseData {
  id: number;
  full_name: string;
  level: number;
  is_superuser: boolean;
  username: string;
  first_name: string;
  last_name: string;
  is_staff: boolean;
  is_active: boolean;
  image: string;
  xp: number;
}

export interface ProfileResponseData extends UserResponseData {
  email: string;
  balance: number;
}

export interface FeedbackResponseData {
  id: number;
  text: string;
  rating: number;
  created_at: string;
  author: UserResponseData;
  recipient: UserResponseData;
}

export interface TrophyResponseData {
  id: number;
  title: string;
  description: string;
  image: string;
}

export interface AchievementResponseData {
  id: number;
  created_at: string;
  user: UserResponseData;
  trophy: TrophyResponseData;
}

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
  status: 'Created' | 'Created [Waiting]' | keyof typeof RecordStatus;
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
