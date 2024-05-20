import { Image, View } from 'react-native';
import { Text } from 'react-native-paper';

import { styles } from '@/common/styles';
import { TrophyProps } from '@/types/User/props';

const Trophy = ({ trophy, owned }: TrophyProps) => {
  return (
    <View
      style={[
        styles.rowCenter,
        owned ? styles.trophy : [styles.trophy, styles.disabled]
      ]}
    >
      <Image
        source={{ uri: trophy.image }}
        width={64}
        height={64}
        style={styles.image}
      />
      <View style={styles.flexForWrap}>
        <Text variant="labelLarge">{trophy.title}</Text>
        <Text variant="bodyMedium" style={styles.wrap}>
          {trophy.description}
        </Text>
      </View>
    </View>
  );
};

export default Trophy;
