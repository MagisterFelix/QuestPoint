import { AxiosError, AxiosResponse } from 'axios';
import * as SecureStore from 'expo-secure-store';
import { createContext, useContext, useEffect, useState } from 'react';

import { useAxios } from '@/api/axios';
import { ENDPOINTS } from '@/api/endpoints';
import { handleErrors } from '@/api/errors';
import { AuthContextProps, AuthProps } from '@/types/auth';
import { ErrorData, ErrorHandler } from '@/types/errors';
import {
  AuthorizationRequestData,
  RegistrationRequestData
} from '@/types/request';
import {
  AuthorizationResponseData,
  RegistrationResponseData
} from '@/types/response';

const AuthContext = createContext<AuthContextProps>({});

export const useAuth = () => {
  return useContext(AuthContext);
};

const AuthProvider = ({ children }: AuthProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const checkAuthentication = async () => {
      const token = await SecureStore.getItemAsync('access');
      if (token) {
        setIsAuthenticated(true);
      }
    };
    checkAuthentication();
  }, []);

  const [{ loading }, request] = useAxios(
    {
      timeout: 10000
    },
    {
      manual: true
    }
  );

  const login = async (
    data: AuthorizationRequestData,
    errorHandler: ErrorHandler
  ) => {
    try {
      const response: AxiosResponse<AuthorizationResponseData> = await request({
        url: ENDPOINTS.authorization,
        method: 'POST',
        data
      });
      await SecureStore.setItemAsync('access', response.data.access);
      setIsAuthenticated(true);
    } catch (err) {
      const axiosError = err as AxiosError;
      if (axiosError.code === AxiosError.ERR_NETWORK) {
        alert('Timeout!');
        return;
      }
      const error = axiosError.response?.data as ErrorData;
      handleErrors(error.details, errorHandler);
    }
  };

  const register = async (
    data: RegistrationRequestData,
    errorHandler: ErrorHandler
  ) => {
    try {
      const response: AxiosResponse<RegistrationResponseData> = await request({
        url: ENDPOINTS.registration,
        method: 'POST',
        data
      });
      const loginData = {
        username: response.data.username,
        password: data.password
      };
      await login(loginData, errorHandler);
    } catch (err) {
      const axiosError = err as AxiosError;
      if (axiosError.code === AxiosError.ERR_NETWORK) {
        alert('Timeout!');
        return;
      }
      const error = axiosError.response?.data as ErrorData;
      handleErrors(error.details, errorHandler);
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
