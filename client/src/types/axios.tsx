import { ReactNode } from 'react';

export interface AxiosProps {
  children: ReactNode;
  logout: () => Promise<void>;
}
