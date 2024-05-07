import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';

import Map from '@/screens/map/Map';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  }
});

const App = () => {
  return (
    <View style={styles.container}>
      <Map />
      <StatusBar style="auto" />
    </View>
  );
};

export default App;
