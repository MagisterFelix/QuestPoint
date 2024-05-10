import React, { useEffect, useState } from 'react';
import { Animated, Text } from 'react-native';

function ErrorPop({ error }: any) {
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    if (error) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true
      }).start();

      setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true
        }).start();
      }, 5000);
    }
  }, [error]);

  if (!error) return null;

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        position: 'absolute',
        top: 50,
        left: 0,
        right: 0,
        backgroundColor: 'red',
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Text style={{ color: 'black' }}>{error}</Text>
    </Animated.View>
  );
}

export default ErrorPop;
