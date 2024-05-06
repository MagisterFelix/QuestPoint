import { AxiosError, AxiosResponse } from 'axios';
import * as SecureStore from 'expo-secure-store';
import { createContext, useContext, useState } from 'react';

import { useAxios } from '@/api/axios';
import { ENDPOINTS } from '@/api/endpoints';
import { handleErrors } from '@/api/errors';
import {
  AuthContextProps,
  AuthProps,
  LoginRequestData,
  LoginResponseData,
  RegisterRequestData,
  RegisterResponseData
} from '@/types/auth';
import { ErrorHandler } from '@/types/errors';
import { ResponseErrorData } from '@/types/response';

const AuthContext = createContext<AuthContextProps>({});

export const useAuth = () => {
  return useContext(AuthContext);
};

const AuthProvider = ({ children }: AuthProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const [{ loading }, request] = useAxios(
    {
      timeout: 10000
    },
    {
      manual: true
    }
  );

  const login = async (data: LoginRequestData, handler: ErrorHandler) => {
    try {
      const response: AxiosResponse<LoginResponseData> = await request({
        url: ENDPOINTS.authorization,
        method: 'POST',
        data
      });
      await SecureStore.setItemAsync('access', response.data.tokens.access);
      setIsAuthenticated(true);
    } catch (err) {
      const axiosError = err as AxiosError;
      if (axiosError.code === AxiosError.ERR_NETWORK) {
        alert('Timeout!');
        return;
      }
      const error = axiosError.response?.data as ResponseErrorData;
      handleErrors(error.details, handler);
    }
  };

  const register = async (data: RegisterRequestData, handler: ErrorHandler) => {
    try {
      const response: AxiosResponse<RegisterResponseData> = await request({
        url: ENDPOINTS.registration,
        method: 'POST',
        data
      });
      const loginData = {
        username: response.data.user.username,
        password: data.password
      };
      await login(loginData, handler);
    } catch (err) {
      const axiosError = err as AxiosError;
      if (axiosError.code === AxiosError.ERR_NETWORK) {
        alert('Timeout!');
        return;
      }
      const error = axiosError.response?.data as ResponseErrorData;
      handleErrors(error.details, handler);
    }
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync('access');
    setIsAuthenticated(false);
  };

  const value = {
    isAuthenticated,
    loading,
    login,
    register,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
