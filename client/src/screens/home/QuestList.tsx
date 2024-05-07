import { View } from 'react-native';
import { Text } from 'react-native-paper';

import { styles } from '@/common/styles';

const QuestListScreen = () => {
  return (
    <View
      style={[styles.container, styles.centerVertical, styles.centerHorizontal]}
    >
      <Text>Quests</Text>
    </View>
  );
};

export default QuestListScreen;
