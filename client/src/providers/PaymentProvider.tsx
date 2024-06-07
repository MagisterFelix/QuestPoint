import { StripeProvider, useStripe } from '@stripe/stripe-react-native';
import { AxiosResponse } from 'axios';
import useAxios from 'axios-hooks';
import * as SecureStore from 'expo-secure-store';
import { createContext, useContext, useState } from 'react';

import { ENDPOINTS } from '@/api/endpoints';
import { useAuth } from '@/providers/AuthProvider';
import { PaymentContextProps } from '@/types/User/props';
import {
  TransactionRequestData,
  UpdateAccountRequestData
} from '@/types/User/request';
import { ProfileResponseData } from '@/types/User/response';
import { ProviderProps } from '@/types/props';

const PaymentContext = createContext<PaymentContextProps>({});

export const usePayment = () => {
  return useContext(PaymentContext);
};

const PaymentProvider = ({ children }: ProviderProps) => {
  const [error, setError] = useState<boolean>(false);
  const hideError = () => setError(false);

  const { user, updateUser } = useAuth();

  const [{ loading }, request] = useAxios(
    {
      headers: {
        Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    },
    {
      manual: true
    }
  );

  const getCustomer = async () => {
    try {
      const response = await request({
        url: `${process.env.STRIPE_API_CUSTOMERS_URL}?email=${user?.email}`,
        method: 'GET'
      });
      return response.data.data.length === 0 ? null : response.data.data[0].id;
    } catch {
      setError(true);
    }
  };

  const getOrCreateCustomer = async () => {
    const customer = await getCustomer();
    if (customer) {
      return customer;
    } else {
      try {
        const response = await request({
          url: process.env.STRIPE_API_CUSTOMERS_URL,
          method: 'POST',
          data: {
            name: user?.username,
            email: user?.email
          }
        });
        return response.data.id;
      } catch {
        setError(true);
      }
    }
  };

  const updateCustomer = async (data: UpdateAccountRequestData) => {
    const customer = await getCustomer();
    try {
      await request({
        url: `${process.env.STRIPE_API_CUSTOMERS_URL}/${customer}`,
        method: 'POST',
        data: {
          name: data.username ? data.username : user?.username,
          email: data.email ? data.email : user?.email
        }
      });
    } catch {
      setError(true);
    }
  };

  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const pay = async (data: TransactionRequestData) => {
    const customer = await getOrCreateCustomer();
    try {
      const paymentResponse = await request({
        url: process.env.STRIPE_API_PAYMENT_INTENTS_URL,
        method: 'POST',
        data: {
          currency: 'usd',
          amount: data.amount * 100,
          customer
        }
      });
      await initPaymentSheet({
        merchantDisplayName: 'QuestPoint',
        paymentIntentClientSecret: paymentResponse.data.client_secret
      });
      const { error } = await presentPaymentSheet();
      if (!error) {
        const token = await SecureStore.getItemAsync('access');
        const response: AxiosResponse<ProfileResponseData> = await request({
          baseURL: process.env.SERVER_API_URL,
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          },
          url: ENDPOINTS.profile,
          method: 'PATCH',
          data: {
            transfer: data.amount * 2
          },
          withCredentials: true
        });
        updateUser!(response.data);
      }
    } catch {
      setError(true);
    }
  };

  const payout = async (data: TransactionRequestData) => {
    try {
      // ! Just a simulation of payout !
      const token = await SecureStore.getItemAsync('access');
      const response: AxiosResponse<ProfileResponseData> = await request({
        baseURL: process.env.SERVER_API_URL,
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        },
        url: ENDPOINTS.profile,
        method: 'PATCH',
        data: {
          transfer: -data.amount
        },
        withCredentials: true
      });
      updateUser!(response.data, data.account);
    } catch {
      setError(true);
    }
  };

  const value = {
    loading,
    error,
    hideError,
    updateCustomer,
    pay,
    payout
  };

  return (
    <StripeProvider publishableKey={process.env.STRIPE_PUBLISHABLE_KEY!}>
      <PaymentContext.Provider value={value}>
        {children}
      </PaymentContext.Provider>
    </StripeProvider>
  );
};

export default PaymentProvider;
