import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
  },
  mapContainer: {
    flex: 2
  },
  menuContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'lightgray'
  },
  menuItem: {
    flex: 1,
    backgroundColor: 'darkgray',
    alignItems: 'center',
    justifyContent: 'center'
  }
});

const Map = () => {
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

  return (
    <View style={styles.container}>
      <MapView
        style={styles.mapContainer}
        region={
          location
            ? {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005
              }
            : undefined
        }
      >
        {location && (
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude
            }}
            rotation={
              location.coords.heading ? location.coords.heading : undefined
            }
            anchor={{ x: 0.5, y: 0.5 }}
            title="It's you. Try start looking for QuestPoints"
          >
            <Image
              source={require('assets/player_marker.webp')}
              style={{ width: 50, height: 50 }}
            />
          </Marker>
        )}
      </MapView>
      <View style={styles.menuContainer}>
        <View style={styles.menuItem}>
          <Text>Q</Text>
        </View>
        <View style={styles.menuItem}>
          <Text>M</Text>
        </View>
        <View style={styles.menuItem}>
          <Text>P</Text>
        </View>
      </View>
    </View>
  );
};

export default Map;
