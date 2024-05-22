import {
  NavigationProp,
  useIsFocused,
  useNavigation
} from '@react-navigation/native';
import * as Location from 'expo-location';
import { createContext, useContext, useEffect, useState } from 'react';

import { LocationContextProps, LocationProps } from '@/types/Map/props';
import { ProviderProps } from '@/types/props';

const LocationContext = createContext<LocationContextProps>({
  location: null
});

export const useLocation = () => {
  return useContext(LocationContext);
};

const LocationProvider = ({ children }: ProviderProps) => {
  const isFocused = useIsFocused();

  const navigation: NavigationProp<any> = useNavigation();

  const [location, setLocation] = useState<LocationProps | null>(null);
  const [locationSubscription, setLocationSubscription] =
    useState<Location.LocationSubscription | null>(null);

  useEffect(() => {
    const reset = () => {
      if (!locationSubscription) {
        return;
      }
      locationSubscription.remove();
      setLocationSubscription(null);
    };
    const getLocation = async () => {
      if (locationSubscription) {
        return;
      }
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        try {
          const subscription = await Location.watchPositionAsync(
            {
              accuracy: Location.Accuracy.High,
              timeInterval: 5000,
              distanceInterval: 5
            },
            (location) => {
              setLocation({
                heading: location.coords.heading,
                latitude: location.coords.latitude,
                longitude: location.coords.longitude
              });
            }
          );
          setLocationSubscription(subscription);
        } catch {
          navigation.navigate('QuestListTab');
        }
      }
    };
    if (isFocused) {
      getLocation();
    } else {
      reset();
    }
  }, [isFocused, navigation, locationSubscription]);

  const [hasTracked, setHasTracked] = useState<boolean>(false);
  const track = () => setHasTracked(true);

  const value = {
    location,
    hasTracked,
    track
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};

export default LocationProvider;
