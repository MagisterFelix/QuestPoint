import { AxiosError, AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';
import { Button, Image, StyleSheet, View } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import { Card, Icon, Paragraph, Title } from 'react-native-paper';

import { useAxios } from '@/api/axios';
import { ENDPOINTS } from '@/api/endpoints';
import QuestCreate from '@/components/Map/QuestCreate';
import BottomDrawer from '@/components/Map/QuestInfo';
import { getDistance } from '@/components/Map/Utils';
import useLocationTracker from '@/components/Map/useLocationTracker';
import { MarkerData } from '@/types/Map/MarkerData';
import { MarkerRequestData } from '@/types/request';
import { MarkerResponseData } from '@/types/response';

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  mapContainer: {
    flex: 3
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
  },
  modalButton: {
    position: 'absolute',
    top: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  center: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 10
  },
  fullWidth: {
    flex: 1
  },
  fullWidthCard: {
    flex: 1,
    margin: 10,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 8
  },
  card: {
    margin: 10,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 8
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  doubleCardContainer: {
    flexDirection: 'row'
  },
  smallCard: {
    flex: 1,
    justifyContent: 'space-between'
  },
  smallText: {
    fontSize: 12
  },
  boldTitle: {
    fontWeight: 'bold',
    marginLeft: 8
  },
  iconWithText: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4
  },
  spaceBetween: {
    justifyContent: 'space-between',
    flex: 1
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

  const getQuests = async (data: MarkerRequestData) => {
    try {
      const response: AxiosResponse<MarkerResponseData> = await request({
        url: `${ENDPOINTS.quests + data.lat}/${data.lon}`,
        method: 'GET',
        data
      });

      setMarkers(response.data.data);
      setLastLocation({
        latitude: location!.coords.latitude,
        longitude: location!.coords.longitude
      });
      setLastRequestTime(new Date().getTime());
    } catch (err) {
      const axiosError = err as AxiosError;
      if (axiosError.code === AxiosError.ERR_NETWORK) {
        alert('Timeout!');
        return;
      }
    }
  };

  useEffect(() => {
    if (location) {
      const currentTime = new Date().getTime();
      if (currentTime - lastRequestTime > 10000) {
        getQuests({
          lat: location.coords.latitude,
          lon: location.coords.longitude
        });
      }
    }
  }, [location]);
  const [clickCount, setClickCount] = useState(0);

  const handleMarkerClick = () => {
    setClickCount((prev) => prev + 1);
  };
  const [selectedMarker, setSelectedMarker] = useState<MarkerData | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  useEffect(() => {
    if (location) {
      getQuests({
        lat: location.coords.latitude,
        lon: location.coords.longitude
      });
    }
  }, [modalVisible]);

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
            onPress={() => {
              setSelectedMarker(null);
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
                onPress={() => {
                  setSelectedMarker(marker);
                  handleMarkerClick();
                }}
              >
                <Image
                  source={require('assets/quest_marker.png')}
                  style={styles.questMarker}
                />
              </Marker>
            ))}
      </MapView>
      {selectedMarker && (
        <BottomDrawer isVisible={!!selectedMarker} clickCount={clickCount}>
          <View styles={styles.fullWidth}>
            <Card style={styles.fullWidthCard}>
              <Card.Content style={styles.cardContent}>
                <Icon source="map-marker" size={20} />
                <Title style={styles.boldTitle}>{selectedMarker.title}</Title>
              </Card.Content>
              <Card.Content style={styles.cardContent}>
                <Icon source="book-outline" size={20} />
                <Paragraph style={{ width: '100%' }}>
                  {selectedMarker.description}
                </Paragraph>
              </Card.Content>
            </Card>

            <View style={styles.doubleCardContainer}>
              <Card style={[styles.card, styles.smallCard]}>
                <Card.Content>
                  <View style={styles.iconWithText}>
                    <Icon source="account" size={16} />
                    <Paragraph style={styles.smallText}>Creator</Paragraph>
                  </View>
                  <Paragraph style={styles.smallText}>
                    {selectedMarker.creator}
                  </Paragraph>
                </Card.Content>
                <Card.Content>
                  <View style={styles.iconWithText}>
                    <Icon source="treasure-chest" size={16} />
                    <Paragraph style={styles.smallText}>Reward</Paragraph>
                  </View>
                  <Paragraph style={styles.smallText}>
                    {selectedMarker.reward} QP
                  </Paragraph>
                </Card.Content>
              </Card>

              <Card style={[styles.card, styles.smallCard]}>
                <Card.Content>
                  <View style={styles.iconWithText}>
                    <Icon source="calendar" size={16} />
                    <Paragraph style={styles.smallText}>Date</Paragraph>
                  </View>
                  <Paragraph style={styles.smallText}>
                    {selectedMarker.created_at}
                  </Paragraph>
                </Card.Content>
                <Card.Content>
                  <View style={styles.iconWithText}>
                    <Icon source="walk" size={16} />
                    <Paragraph style={styles.smallText}>Distance</Paragraph>
                  </View>
                  <Paragraph style={styles.smallText}>
                    {location
                      ? `${getDistance(location.coords.latitude, location.coords.longitude, selectedMarker.latitude, selectedMarker.longitude).toFixed(2)} steps`
                      : 'Calculating...'}
                  </Paragraph>
                </Card.Content>
              </Card>
            </View>

            <Card.Actions>
              <Button
                onPress={() => console.log('Accept quest!')}
                title="Accept Quest"
                color="#6200ee"
              />
            </Card.Actions>
          </View>
        </BottomDrawer>
      )}

      <View style={styles.modalButton}>
        <QuestCreate
          latitude={lastLocation?.latitude}
          longitude={lastLocation?.longitude}
        />
      </View>
    </View>
  );
};

export default Map;
