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

export interface TransactionRequestData {
  account?: string;
  amount: number;
}
