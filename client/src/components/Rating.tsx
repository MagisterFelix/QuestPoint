import React from 'react';
import { Image, TouchableOpacity, View } from 'react-native';

import { styles } from '@/common/styles';
import { RatingProps } from '@/types/props';

const Rating = ({ rating, onStarPress }: RatingProps) => {
  const renderStar = (index: number) => {
    const isFilled = index < rating;
    const starImage = isFilled
      ? require('assets/star-filled.png')
      : require('assets/star-empty.png');

    return (
      <TouchableOpacity
        key={index}
        onPress={() => onStarPress(index + 1)}
        style={styles.formField}
      >
        <Image source={starImage} style={{ width: 32, height: 32 }} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.rowCenter}>
      {Array.from({ length: 5 }, (_, index) => renderStar(index))}
    </View>
  );
};

export default Rating;
