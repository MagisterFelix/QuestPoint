import { ReactNode } from 'react';

import { ErrorHandler } from '@/types/errors';
import { Navigation } from '@/types/navigation';
import {
  AuthorizationRequestData,
  RegistrationRequestData,
  TransactionRequestData,
  UpdateAccountRequestData
} from '@/types/request';
import { ProfileResponseData, UserResponseData } from '@/types/response';

export interface AuthContextProps {
  user: ProfileResponseData | null;
  stripeAccount: string | null;
  updateUser?: (
    user: ProfileResponseData,
    stripeAccount?: string
  ) => Promise<void>;
  checking: boolean;
  loading?: boolean;
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

export interface PaymentContextProps {
  loading?: boolean;
  error?: boolean;
  hideError?: () => void;
  updateCustomer?: (data: UpdateAccountRequestData) => Promise<void>;
  pay?: (data: TransactionRequestData) => Promise<void>;
  payout?: (data: TransactionRequestData) => Promise<void>;
}

export interface ProviderProps {
  children: ReactNode;
}

export interface AxiosProps {
  children: ReactNode;
  logout: () => Promise<void>;
}

export interface DialogProps {
  title: string;
  button: string;
  onDismiss: (...args: any[]) => any;
  onAgreePress: (...args: any[]) => any;
}

export interface DialogSuccessProps extends DialogProps {
  message: string;
}

export interface DialogInfoProps extends DialogProps {
  info: string;
}

export interface DialogErrorProps extends DialogProps {
  error: string;
}

export interface ScreenProps {
  navigation: Navigation;
}

export interface UserProfileProps {
  loading: boolean;
  data: UserResponseData;
}
