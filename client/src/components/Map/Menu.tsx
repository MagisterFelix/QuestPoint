import { StyleSheet, Text, View } from 'react-native';

const styles = StyleSheet.create({
  menuContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'lightgray'
  },
  menuItem: {
    flex: 1,
    backgroundColor: 'darkgray',
    alignItems: 'center',
    justifyContent: 'center'
  }
});

const Menu = () => {
  return (
    <View style={styles.menuContainer}>
      <View style={styles.menuItem}>
        <Text>Q</Text>
      </View>
      <View style={styles.menuItem}>
        <Text>M</Text>
      </View>
      <View style={styles.menuItem}>
        <Text>P</Text>
      </View>
    </View>
  );
};

export default Menu;
