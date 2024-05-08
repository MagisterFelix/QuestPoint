export interface AuthorizationRequestData {
  username: string;
  password: string;
}

export interface RegistrationRequestData {
  username: string;
  email: string;
  password: string;
}

export interface UpdateAccountRequestData {
  username?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  image?: {
    uri: string;
    type: string;
    name: string;
  };
}

export interface ChangePasswordRequestData {
  password?: string;
  new_password?: string;
}
