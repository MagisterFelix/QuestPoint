import axios, {
  AxiosError,
  AxiosResponse,
  HttpStatusCode,
  InternalAxiosRequestConfig
} from 'axios';
import { makeUseAxios } from 'axios-hooks';
import * as SecureStore from 'expo-secure-store';

import { AxiosProps } from '@/types/props';

const instance = axios.create({
  baseURL: process.env.SERVER_API_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'multipart/form-data'
  },
  withCredentials: true,
  timeout: 10000
});

export const AxiosInterceptor = ({ children, logout }: AxiosProps) => {
  instance.interceptors.request.use(
    async (request: InternalAxiosRequestConfig) => {
      const token = await SecureStore.getItemAsync('access');
      if (token) {
        request.headers.Authorization = `Bearer ${token}`;
      }
      return request;
    },
    async (error: any) => Promise.reject(error)
  );
  instance.interceptors.response.use(
    async (response: AxiosResponse) => response,
    async (error: AxiosError) => {
      if (error.code === AxiosError.ERR_NETWORK) {
        alert('Timeout!');
      }
      if (
        error.response?.status === HttpStatusCode.Unauthorized ||
        error.response?.status === HttpStatusCode.Forbidden
      ) {
        await logout();
      }
      return Promise.reject(error);
    }
  );
  return children;
};

export const useAxios = makeUseAxios({
  axios: instance
});
