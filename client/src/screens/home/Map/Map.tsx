import { useRef, useState } from 'react';
import { Animated, Image, ImageBackground, View } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import { Avatar } from 'react-native-paper';

import { windowSize } from '@/common/constants';
import { styles } from '@/common/styles';
import { getDistance } from '@/common/utils';
import DialogWindow from '@/components/DialogWindow';
import Loading from '@/components/Loading';
import QuestInfo from '@/components/Map/QuestInfo';
import { useAuth } from '@/providers/AuthProvider';
import { useLocation } from '@/providers/LocationProvider';
import { useQuestData } from '@/providers/QuestDataProvider';
import { QuestResponseData } from '@/types/Quests/response';
import { ScreenProps } from '@/types/props';

const MapScreen = ({ navigation }: ScreenProps) => {
  const mapViewRef = useRef<MapView>(null);

  const { user } = useAuth();

  const { location, hasTracked, track } = useLocation();

  const { quests } = useQuestData();

  const [selectedQuest, setSelectedQuest] = useState<QuestResponseData | null>(
    null
  );

  const [message, setMessage] = useState<string>('');
  const hideMessage = () => setMessage('');

  const animatedHeight = useRef(new Animated.Value(0));
  const [show, setShow] = useState<boolean>(false);
  const showInfo = () => {
    Animated.timing(animatedHeight.current, {
      toValue: windowSize.height * 0.7,
      duration: 300,
      useNativeDriver: false
    }).start();
    setShow(true);
  };
  const hideInfo = () => {
    Animated.timing(animatedHeight.current, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false
    }).start();
    setShow(false);
  };

  if (!location || !quests) {
    return <Loading />;
  }

  return (
    <View style={styles.containerInner}>
      <MapView
        toolbarEnabled={false}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005
        }}
        minZoomLevel={14}
        maxZoomLevel={18}
        ref={mapViewRef}
        style={styles.map}
        onMapReady={() => setTimeout(track!, 1000)}
        onRegionChangeComplete={(region: Region) => {
          const distance = getDistance(
            region.latitude,
            region.longitude,
            location.latitude,
            location.longitude
          );
          if (distance > 10000) {
            mapViewRef.current?.animateToRegion({
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005
            });
          }
        }}
        onPress={() => {
          hideInfo();
          setTimeout(() => setSelectedQuest(null), 300);
        }}
      >
        <Marker
          tracksViewChanges={!hasTracked}
          coordinate={{
            latitude: location.latitude,
            longitude: location.longitude
          }}
          rotation={location.heading ? location.heading : undefined}
          anchor={{ x: 0.5, y: 0.5 }}
          zIndex={0}
          onPress={() => {
            hideInfo();
            setTimeout(() => setSelectedQuest(null), 300);
          }}
        >
          <ImageBackground
            source={require('assets/player.png')}
            resizeMode="contain"
            style={styles.playerMarkerBackground}
          >
            <Avatar.Image
              source={{ uri: user?.image }}
              size={14}
              style={styles.playerMarkerForeground}
            />
          </ImageBackground>
        </Marker>
        {quests.map((quest: QuestResponseData) => (
          <Marker
            key={quest.id}
            tracksViewChanges={!hasTracked}
            coordinate={{
              latitude: quest.latitude,
              longitude: quest.longitude
            }}
            zIndex={1}
            style={{ opacity: quest.status === 'Pending' ? 0.5 : 1 }}
            onPress={() => {
              setSelectedQuest(quest);
              showInfo();
            }}
          >
            <Image
              source={{ uri: quest.category.image }}
              style={styles.questMarker}
            />
          </Marker>
        ))}
      </MapView>
      {selectedQuest && (
        <QuestInfo
          height={animatedHeight.current}
          show={show}
          quest={selectedQuest}
          toggle={() => (show ? hideInfo() : showInfo())}
          onSend={() => {
            setMessage('Offer has been sent successfully!');
            hideInfo();
            setTimeout(() => setSelectedQuest(null), 300);
          }}
        />
      )}
      <DialogWindow
        title="Congratulations!"
        type="success"
        message={message}
        button="OK"
        onDismiss={() => {
          hideMessage();
          navigation.navigate('QuestListTab', {
            screen: 'Quests',
            params: { updateQuests: true }
          });
        }}
        onAgreePress={() => {
          hideMessage();
          navigation.navigate('QuestListTab', {
            screen: 'Quests',
            params: { updateQuests: true }
          });
        }}
      />
    </View>
  );
};

export default MapScreen;
