import * as Location from 'expo-location';
import { useEffect, useState } from 'react';

const useLocationTracker = () => {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 300,
            distanceInterval: 2
          },
          (loc: Location.LocationObject) => {
            setLocation(loc);
          }
        );
      }
    })();
  }, []);

  return location;
};

export default useLocationTracker;
