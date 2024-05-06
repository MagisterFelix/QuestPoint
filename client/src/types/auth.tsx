import { ReactNode } from 'react';

import { ErrorHandler } from '@/types/errors';
import { ResponseData } from '@/types/response';

export interface LoginRequestData {
  username: string;
  password: string;
}

export interface LoginResponseData extends ResponseData {
  tokens: { access: string; refresh: string };
}

export interface RegisterRequestData {
  username: string;
  email: string;
  password: string;
}

export interface RegisterResponseData extends ResponseData {
  user: {
    username: string;
    email: string;
  };
}

export interface AuthContextProps {
  isAuthenticated?: boolean;
  loading?: boolean;
  login?: (data: LoginRequestData, handler: ErrorHandler) => Promise<any>;
  register?: (data: RegisterRequestData, handler: ErrorHandler) => Promise<any>;
  logout?: () => Promise<void>;
}

export interface AuthProps {
  children: ReactNode;
}
