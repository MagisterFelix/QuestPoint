import { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native-paper';

import { styles } from '@/common/styles';

const Loading = () => {
  const [animating, setAnimating] = useState<boolean>(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimating(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <ActivityIndicator
      animating={animating}
      style={styles.container}
      size="large"
    />
  );
};

export default Loading;
