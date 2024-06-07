import { Image } from 'react-native';

import { styles } from '@/common/styles';
import { CategoryProps } from '@/types/Quests/props';

const Category = ({ category }: CategoryProps) => {
  return (
    <Image
      source={{ uri: category.image }}
      width={24}
      height={24}
      style={styles.image}
    />
  );
};

export default Category;
