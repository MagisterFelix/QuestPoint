import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, StyleSheet, View } from 'react-native';
import { IconButton } from 'react-native-paper';

const screenHeight = Dimensions.get('window').height;
const drawerHeight = screenHeight * 0.7;

const BottomDrawer = ({ children, isVisible, clickCount }) => {
  const [isOpen, setIsOpen] = useState(false);
  const animatedHeight = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isVisible) {
      Animated.timing(animatedHeight, {
        toValue: drawerHeight,
        duration: 300,
        useNativeDriver: false
      }).start();
      setIsOpen(true);
    } else {
      Animated.timing(animatedHeight, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false
      }).start();
      setIsOpen(false);
    }
  }, [isVisible, clickCount]);

  const toggleDrawer = () => {
    Animated.timing(animatedHeight, {
      toValue: isOpen ? 0 : drawerHeight,
      duration: 300,
      useNativeDriver: false
    }).start();
    setIsOpen(!isOpen);
  };

  return (
    <View style={styles.container}>
      <IconButton
        style={styles.iconButton}
        icon={isOpen ? 'chevron-double-down' : 'chevron-double-up'}
        size={24}
        onPress={toggleDrawer}
      />
      <Animated.View style={[styles.drawer, { height: animatedHeight }]}>
        {children}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  drawer: {
    backgroundColor: 'white',
    width: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7
  },
  iconButton: {
    position: 'absolute',
    zIndex: 1
  }
});

export default BottomDrawer;
