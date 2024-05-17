import { NavigationProp, useNavigation } from '@react-navigation/native';
import { View } from 'react-native';
import { Button, Card, Icon, Text } from 'react-native-paper';

import { styles } from '@/common/styles';
import Category from '@/components/Category';
import Coins from '@/components/Coins';
import { QuestProps } from '@/types/props';

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
    <Card style={styles.quest}>
      <Card.Title
        title={quest.title}
        titleNumberOfLines={2}
        titleVariant="titleMedium"
        right={() => (
          <View style={styles.endHorizontal}>
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
          style={[styles.formButton, styles.cardButton]}
        >
          Details
        </Button>
      </Card.Actions>
    </Card>
  );
};

export default Quest;
