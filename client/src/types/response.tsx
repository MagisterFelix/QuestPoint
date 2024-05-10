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
