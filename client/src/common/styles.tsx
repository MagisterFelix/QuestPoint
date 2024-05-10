import { StyleSheet } from 'react-native';
import { DefaultTheme } from 'react-native-paper';

export const theme = {
  ...DefaultTheme,
  roundness: 1,
  colors: {
    ...DefaultTheme.colors,
    primary: '#6574ff',
    onPrimary: '#ffffff',
    primaryContainer: '#dfe0ff',
    onPrimaryContainer: '#000866',
    secondary: '#5c5d72',
    onSecondary: '#ffffff',
    secondaryContainer: '#e1e0f9',
    onSecondaryContainer: '#181a2c',
    tertiary: '#006492',
    onTertiary: '#ffffff',
    tertiaryContainer: '#cae6ff',
    onTertiaryContainer: '#001e2f',
    elevation: {
      level0: 'transparent',
      level1: '#ececec',
      level2: '#eaeaea',
      level3: '#f5f5f5',
      level4: '#e8e8e8',
      level5: '#e4e4e4'
    },
    success: '#19d13a',
    info: '#4ab9ee'
  }
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    width: '100%',
    padding: 30
  },
  centerVertical: {
    justifyContent: 'center'
  },
  centerHorizontal: {
    alignItems: 'center'
  },
  col: {
    flexDirection: 'column',
    gap: 10
  },
  row: {
    flexDirection: 'row',
    gap: 5
  },
  rowCenter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5
  },
  rowSpaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 5
  },
  textCenter: {
    textAlign: 'center'
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.primary
  },
  formField: {
    marginVertical: 5
  },
  formHelperText: {
    marginTop: -5,
    marginBottom: -5
  },
  formButton: {
    marginVertical: 10
  },
  user: {
    gap: 20
  },
  avatar: {
    backgroundColor: theme.colors.background
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.primary
  },
  level_xp: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  settingsTab: {
    backgroundColor: theme.colors.onPrimary,
    padding: 20
  },
  imageRipple: {
    borderRadius: 64
  }
});
