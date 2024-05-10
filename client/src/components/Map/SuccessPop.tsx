import React, { useEffect, useState } from 'react';
import { Animated, Text } from 'react-native';

function SuccessPopup({ isVisible }: any) {
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    if (isVisible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true
      }).start();

      const timer = setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true
        }).start();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: 'green',
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Text style={{ color: 'white' }}>Successfully created</Text>
    </Animated.View>
  );
}

export default SuccessPopup;
