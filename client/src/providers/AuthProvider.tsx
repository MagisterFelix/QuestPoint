import { AxiosError, AxiosResponse } from 'axios';
import * as SecureStore from 'expo-secure-store';
import { createContext, useContext, useEffect, useState } from 'react';

import { useAxios } from '@/api/axios';
import { ENDPOINTS } from '@/api/endpoints';
import { handleErrors } from '@/api/errors';
import { ErrorData, ErrorHandler } from '@/types/errors';
import { AuthContextProps, AuthProps } from '@/types/props';
import {
  AuthorizationRequestData,
  RegistrationRequestData
} from '@/types/request';
import {
  AuthorizationResponseData,
  ProfileResponseData,
  RegistrationResponseData
} from '@/types/response';

const AuthContext = createContext<AuthContextProps>({
  user: null,
  checking: false
});

export const useAuth = () => {
  return useContext(AuthContext);
};

const AuthProvider = ({ children }: AuthProps) => {
  const [user, setUser] = useState<ProfileResponseData | null>(null);
  const [checking, setChecking] = useState<boolean>(false);

  useEffect(() => {
    const checkAuthentication = async () => {
      setChecking(true);
      const token = await SecureStore.getItemAsync('access');
      const user = await SecureStore.getItemAsync('user');
      if (token && user) {
        setUser(JSON.parse(user));
      }
      setChecking(false);
    };
    checkAuthentication();
  }, []);

  const [{ loading }, request] = useAxios(
    {},
    {
      manual: true
    }
  );

  const updateUser = async (user: ProfileResponseData) => {
    await SecureStore.setItemAsync('user', JSON.stringify(user));
    setUser(user);
  };

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
      updateUser(response.data.user);
    } catch (err) {
      const error = (err as AxiosError).response?.data as ErrorData;
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
      const error = (err as AxiosError).response?.data as ErrorData;
      handleErrors(error.details, errorHandler);
    }
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync('access');
    await SecureStore.deleteItemAsync('user');
    setUser(null);
  };

  const value = {
    user,
    updateUser,
    checking,
    loading,
    login,
    register,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
