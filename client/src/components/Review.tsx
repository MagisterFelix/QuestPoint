import { NavigationProp, useNavigation } from '@react-navigation/native';
import { Image, TouchableOpacity, View } from 'react-native';
import { Card, Icon, Text } from 'react-native-paper';

import { styles } from '@/common/styles';
import { ReviewProps } from '@/types/props';

const Review = ({ review }: ReviewProps) => {
  const navigation: NavigationProp<any> = useNavigation();

  return (
    <Card style={styles.review}>
      <Card.Content>
        <View style={styles.rowSpaceBetween}>
          <View style={[styles.rowCenter, styles.reviewAuthor]}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('User', { user: review.author.username })
              }
            >
              <Image
                source={{ uri: review.author.image }}
                width={32}
                height={32}
                style={styles.image}
              />
            </TouchableOpacity>
            <Text variant="titleSmall">{review.author.username}</Text>
          </View>
          <View style={[styles.rowCenter]}>
            {Array.from({ length: 5 }, (_, index) =>
              index + 1 <= review.rating ? (
                <Icon
                  key={index}
                  source={require('assets/star-filled.png')}
                  size={16}
                />
              ) : (
                <Icon
                  key={index}
                  source={require('assets/star-empty.png')}
                  size={16}
                />
              )
            )}
          </View>
        </View>
        {review.text && (
          <Text variant="bodyMedium" style={styles.reviewText}>
            {review.text}
          </Text>
        )}
      </Card.Content>
    </Card>
  );
};

export default Review;
