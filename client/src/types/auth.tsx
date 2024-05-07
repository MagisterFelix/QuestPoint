import { ReactNode } from 'react';

import { ErrorHandler } from '@/types/errors';
import {
  AuthorizationRequestData,
  RegistrationRequestData
} from '@/types/request';

export interface AuthContextProps {
  isAuthenticated?: boolean;
  loading?: boolean;
  login?: (
    data: AuthorizationRequestData,
    errorHandler: ErrorHandler
  ) => Promise<any>;
  register?: (
    data: RegistrationRequestData,
    errorHandler: ErrorHandler
  ) => Promise<any>;
  logout?: () => Promise<void>;
}

export interface AuthProps {
  children: ReactNode;
}
