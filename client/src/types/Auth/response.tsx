import { ProfileResponseData } from '@/types/User/response';

export interface AuthorizationResponseData {
  access: string;
  user: ProfileResponseData;
}

export interface RegistrationResponseData {
  username: string;
  email: string;
}
