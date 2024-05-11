import { View } from 'react-native';
import { Avatar, Text } from 'react-native-paper';

import { styles } from '@/common/styles';
import { TrophyProps } from '@/types/props';

const Trophy = ({ trophy, owned }: TrophyProps) => {
  return (
    <View
      style={[
        styles.rowCenter,
        owned ? styles.trophy : [styles.trophy, styles.disabled]
      ]}
    >
      <Avatar.Image source={{ uri: trophy.image }} style={styles.avatar} />
      <View style={styles.trophyText}>
        <Text variant="labelLarge">{trophy.title}</Text>
        <Text variant="bodyMedium" style={styles.wrap}>
          {trophy.description}
        </Text>
      </View>
    </View>
  );
};

export default Trophy;
