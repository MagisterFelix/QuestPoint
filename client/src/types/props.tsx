import { NavigationProp, RouteProp } from '@react-navigation/native';
import { ReactNode } from 'react';

export interface AxiosProps {
  children: ReactNode;
  logout: () => Promise<void>;
}

export interface ProviderProps {
  children: ReactNode;
}

export interface ScreenProps {
  route: RouteProp<any>;
  navigation: NavigationProp<any>;
}

export interface DialogWindowProps {
  title: string;
  type: 'success' | 'error' | 'info';
  message: string;
  button: string;
  onDismiss: (...args: any[]) => any;
  onAgreePress: (...args: any[]) => any;
}

export interface CoinsProps {
  amount: number;
  size: number;
}
