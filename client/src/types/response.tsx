import { DeprecatedCategoryData } from '@/types/Map/DeprecatedCategoryData';
import { DeprecatedMarkerData } from '@/types/Map/DeprecatedMarkerData';

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

export interface DeprecatedMarkerResponseData extends ResponseData {
  data: DeprecatedMarkerData[];
}

export interface DeprecatedCategoriesResponseData extends ResponseData {
  data: DeprecatedCategoryData[];
}
