import { Animated } from 'react-native';

import { QuestResponseData } from '@/types/Quests/response';

export interface LocationProps {
  heading?: number | null;
  latitude: number;
  longitude: number;
}

export interface LocationContextProps {
  hasTracked?: boolean;
  track?: () => void;
  location: LocationProps | null;
}

export interface QuestInfoProps {
  height: Animated.Value;
  show: boolean;
  quest: QuestResponseData;
  toggle: () => void;
  onSend: () => void;
}
