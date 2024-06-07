import { NavigationProp, useNavigation } from '@react-navigation/native';
import { View } from 'react-native';
import { Button, Card, Icon, Text } from 'react-native-paper';

import { styles } from '@/common/styles';
import Coins from '@/components/Coins';
import Category from '@/components/Quests/Category';
import { QuestProps } from '@/types/Quests/props';

const Quest = ({ quest }: QuestProps) => {
  const navigation: NavigationProp<any> = useNavigation();

  const type: { [key: string]: string } = {
    Created: 'progress-star',
    'Created [Waiting]': 'progress-star',
    'Has an offer': 'progress-clock',
    'In progress': 'progress-check',
    "Waiting for the creator's response": 'progress-upload',
    "Waiting for the worker's response": 'progress-download',
    Cancelled: 'progress-close',
    Completed: 'progress-close'
  };

  return (
    <View>
      <Card
        style={styles.quest}
        delayLongPress={300}
        onLongPress={() => {
          if (quest.status === 'Created [Waiting]') {
            navigation.navigate('Edit Quest', { quest });
          }
        }}
      >
        <Card.Title
          title={quest.title}
          titleNumberOfLines={2}
          titleVariant="titleMedium"
          right={() => (
            <View style={styles.alignItemsEnd}>
              <View style={styles.row}>
                <Icon source={type[quest.status]} size={24} />
                <Category category={quest.category} />
              </View>
              <Coins amount={quest.reward} size={24} />
            </View>
          )}
          rightStyle={styles.cardRightElement}
        />
        <Card.Content>
          <Text variant="bodyMedium">{quest.description}</Text>
        </Card.Content>
        <Card.Actions>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('Details', { quest })}
            disabled={
              quest.status === 'Created [Waiting]' ||
              quest.status === 'Has an offer'
            }
            icon={quest.has_notification ? 'bell-ring' : 'arrow-right-top-bold'}
            style={[styles.formButton, styles.cardButton]}
          >
            Details
          </Button>
        </Card.Actions>
      </Card>
    </View>
  );
};

export default Quest;
