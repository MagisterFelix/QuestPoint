import {
  AuthorizationRequestData,
  RegistrationRequestData
} from '@/types/Auth/request';
import { ProfileResponseData } from '@/types/User/response';
import { ErrorHandler } from '@/types/errors';

export interface AuthContextProps {
  loading?: boolean;
  user: ProfileResponseData | null;
  stripeAccount: string | null;
  updateUser?: (
    user: ProfileResponseData,
    stripeAccount?: string
  ) => Promise<void>;
  getProfile?: () => Promise<void>;
  login?: (
    data: AuthorizationRequestData,
    errorHandler: ErrorHandler
  ) => Promise<void>;
  register?: (
    data: RegistrationRequestData,
    errorHandler: ErrorHandler
  ) => Promise<void>;
  logout?: () => Promise<void>;
}
