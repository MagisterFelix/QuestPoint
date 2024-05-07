import axios, {
  AxiosError,
  AxiosResponse,
  HttpStatusCode,
  InternalAxiosRequestConfig
} from 'axios';
import { makeUseAxios } from 'axios-hooks';
import * as SecureStore from 'expo-secure-store';
import { useEffect } from 'react';

import { AxiosProps } from '@/types/axios';

const instance = axios.create({
  baseURL: process.env.API_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'multipart/form-data'
  },
  withCredentials: true
});

export const AxiosInterceptor = ({ children, logout }: AxiosProps) => {
  useEffect(() => {
    const requestInterceptor = instance.interceptors.request.use(
      async (request: InternalAxiosRequestConfig) => {
        const token = await SecureStore.getItemAsync('access');
        if (token) {
          request.headers.Authorization = `Bearer ${token}`;
        }
        return request;
      },
      async (error: any) => Promise.reject(error)
    );
    const responseInterceptor = instance.interceptors.response.use(
      async (response: AxiosResponse) => response,
      async (error: AxiosError) => {
        if (error.response?.status === HttpStatusCode.Unauthorized) {
          await logout();
          alert('Session has expired!');
        }
        return Promise.reject(error);
      }
    );
    return () => {
      instance.interceptors.request.eject(requestInterceptor);
      instance.interceptors.response.eject(responseInterceptor);
    };
  }, [logout]);

  return children;
};

export const useAxios = makeUseAxios({
  axios: instance
});
