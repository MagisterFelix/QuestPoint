export interface AuthorizationRequestData {
  username: string;
  password: string;
}

export interface RegistrationRequestData {
  username: string;
  email: string;
  password: string;
}

export interface MarkerRequestData {
  lat: number;
  lon: number;
}

export interface QuestRequestData {
  title: String;
  description: String;
  category: String;
  reward: number;
  latitude: number;
  longitude: number;
  creator: String;
}
