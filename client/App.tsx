import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';

import QuestMap from './components/Quests/QuestMap';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  }
});

const App = () => {
  return (
    <View style={styles.container}>
      <QuestMap />
      <StatusBar style="auto" />
    </View>
  );
};

export default App;
