import { NavigationProp, RouteProp } from '@react-navigation/native';
import { ReactNode } from 'react';

import { ErrorHandler } from '@/types/errors';
import {
  AuthorizationRequestData,
  RegistrationRequestData,
  TransactionRequestData,
  UpdateAccountRequestData
} from '@/types/request';
import {
  CategoryResponseData,
  FeedbackResponseData,
  MessageResponseData,
  ProfileResponseData,
  QuestResponseData,
  RecordResponseData,
  TrophyResponseData,
  UserResponseData
} from '@/types/response';

export interface AuthContextProps {
  user: ProfileResponseData | null;
  stripeAccount: string | null;
  updateUser?: (
    user: ProfileResponseData,
    stripeAccount?: string
  ) => Promise<void>;
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

export interface DialogFeedbackProps extends DialogProps {
  show: boolean;
  user: string;
}

export interface ScreenProps {
  route: RouteProp<any>;
  navigation: NavigationProp<any>;
}

export interface CoinsProps {
  amount: number;
  size: number;
}

export interface UserProfileProps {
  loadingUser?: boolean;
  user: UserResponseData;
}

export interface ReviewProps {
  review: FeedbackResponseData;
}

export interface TrophyProps {
  trophy: TrophyResponseData;
  owned: boolean;
}

export interface CategoryProps {
  category: CategoryResponseData;
}

export interface QuestProps {
  quest: QuestResponseData;
}

export interface FiltersProps {
  Created: boolean;
  Offer: boolean;
  InProgress: boolean;
}

export interface QuestListProps {
  filters: FiltersProps;
}

export interface DetailsInfoProps {
  record: RecordResponseData;
  isWorker: boolean;
}

export interface ChatProps {
  record: RecordResponseData;
  isKeyboardVisible: boolean;
}

export interface MessageProps {
  message: MessageResponseData;
  isOwner: boolean;
}

export interface RatingProps {
  rating: number;
  onStarPress: (rating: number) => void;
}
