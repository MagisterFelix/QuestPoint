import { useAxios } from '@/api/axios';
import { ENDPOINTS } from '@/api/endpoints';
import Menu from '@/components/Map/Menu';
import { getDistance } from '@/components/Map/Utils';
import useLocationTracker from '@/components/Map/useLocationTracker';
import { MarkerData } from '@/types/Map/MarkerData';
import { MarkerRequestData } from '@/types/request';
import { MarkerResponseData } from '@/types/response';
import { AxiosError, AxiosResponse } from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Image, Modal, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
  },
  mapContainer: {
    flex: 2
  },
  modalContainer: {
    marginTop: 50,
    marginHorizontal: 20,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 20
  },
  playerMarker: {
    width: 50,
    height: 50
  },
  questMarker: {
    width: 45,
    height: 50
  }
});

const Map = () => {
  let mapView: MapView | null;
  const [markers, setMarkers] = useState<MarkerData[]>([]);

  const [{ loading }, request] = useAxios(
    {
      timeout: 10000
    },
    {
      manual: true
    }
  );

  const location = useLocationTracker();
  const [lastLocation, setLastLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [lastRequestTime, setLastRequestTime] = useState<number>(0);

  useEffect(() => {
    const currentTime = new Date().getTime();
    if (
      location &&
      currentTime - lastRequestTime > 60000 &&
      (!lastLocation ||
        getDistance(
          lastLocation.latitude,
          lastLocation.longitude,
          location.coords.latitude,
          location.coords.longitude
        ) > 1000)
    ) {
      const getQuests = async (data: MarkerRequestData) => {
        try {
          const response: AxiosResponse<MarkerResponseData> = await request({
            url: `${ENDPOINTS.quests + data.lat}/${data.lon}`,
            method: 'GET',
            data
          });

          setMarkers(response.data.data);
          setLastLocation({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude
          });
          setLastRequestTime(currentTime);
        } catch (err) {
          const axiosError = err as AxiosError;
          if (axiosError.code === AxiosError.ERR_NETWORK) {
            alert('Timeout!');
            return;
          }
        }
      };

      getQuests({
        lat: location.coords.latitude,
        lon: location.coords.longitude
      });
    }
  }, [location]);

  const [selectedMarker, setSelectedMarker] = useState<MarkerData | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [showDetailsButton, setShowDetailsButton] = useState<number | null>();

  const maxDistance = 1000;

  const onRegionChangeComplete = (region: Region) => {
    if (
      location &&
      getDistance(
        region.latitude,
        region.longitude,
        location.coords.latitude,
        location.coords.longitude
      ) > 3000
    ) {
      mapView?.animateToRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005
      });
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.mapContainer}
        initialRegion={
          location
            ? {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005
              }
            : undefined
        }
        minZoomLevel={14}
        maxZoomLevel={18}
        ref={(ref) => {
          mapView = ref;
        }}
        onRegionChangeComplete={onRegionChangeComplete}
        onPress={() => {
          setSelectedMarker(null);
          setShowDetailsButton(null);
        }}
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
            title="Це ти. Спробуй знайти квести поблизу."
            onPress={() => {
              setSelectedMarker(null);
              setShowDetailsButton(null);
            }}
          >
            <Image
              source={require('assets/player_marker.webp')}
              style={styles.playerMarker}
            />
          </Marker>
        )}
        {location &&
          markers
            .filter(
              (marker) =>
                getDistance(
                  location.coords.latitude,
                  location.coords.longitude,
                  marker.latitude,
                  marker.longitude
                ) <= maxDistance
            )
            .map((marker) => (
              <Marker
                key={marker.id}
                coordinate={{
                  latitude: marker.latitude,
                  longitude: marker.longitude
                }}
                title={marker.title}
                description={marker.description}
                onPress={() => {
                  setSelectedMarker(marker);
                  setShowDetailsButton(marker.id);
                }}
              >
                <Image
                  source={require('assets/quest_marker.png')}
                  style={styles.questMarker}
                />
              </Marker>
            ))}
      </MapView>
      <View>
        {selectedMarker && showDetailsButton === selectedMarker.id && (
          <Button
            title="Детальніше"
            onPress={() => {
              setModalVisible(true);
              setShowDetailsButton(null);
            }}
          />
        )}
      </View>
      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalContainer}>
          {selectedMarker && (
            <>
              <Text>{selectedMarker.title}</Text>
              <Text>Опис: {selectedMarker.description}</Text>
              <Text>Нагорода: {selectedMarker.reward} QP</Text>
              <Text>
                Відстань:
                {location
                  ? `${getDistance(location.coords.latitude, location.coords.longitude, selectedMarker.latitude, selectedMarker.longitude).toFixed(2)} кроків`
                  : 'Розраховую...'}
              </Text>
              <Text>Замовник: {selectedMarker.creator}</Text>
              <Text>{selectedMarker.created_at}</Text>
              <Button
                onPress={() => {
                  // TODO Accept quest
                  console.log('Прийняти квест!');
                  setModalVisible(false);
                }}
                title="Хочу виконати"
              />
            </>
          )}
        </View>
      </Modal>
      <Menu />
    </View>
  );
};

export default Map;
