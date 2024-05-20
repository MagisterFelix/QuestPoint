import {
  TransactionRequestData,
  UpdateAccountRequestData
} from '@/types/User/request';
import {
  FeedbackResponseData,
  TrophyResponseData,
  UserResponseData
} from '@/types/User/response';

export interface PaymentContextProps {
  loading?: boolean;
  error?: boolean;
  hideError?: () => void;
  updateCustomer?: (data: UpdateAccountRequestData) => Promise<void>;
  pay?: (data: TransactionRequestData) => Promise<void>;
  payout?: (data: TransactionRequestData) => Promise<void>;
}

export interface ProfileProps {
  user: UserResponseData;
}

export interface ReviewProps {
  review: FeedbackResponseData;
}

export interface TrophyProps {
  trophy: TrophyResponseData;
  owned: boolean;
}
