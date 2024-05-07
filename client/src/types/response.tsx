import { MarkerData } from '@/types/Map/MarkerData';

export interface ResponseData {
  details: string;
}

export interface ResponseErrorData {
  details: string | object[];
}

export interface AuthorizationResponseData extends ResponseData {
  tokens: { access: string; refresh: string };
}

export interface RegistrationResponseData extends ResponseData {
  user: {
    username: string;
    email: string;
  };
}

export interface MarkerResponseData extends ResponseData {
  data: MarkerData[];
}
