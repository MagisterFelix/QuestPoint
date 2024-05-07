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
