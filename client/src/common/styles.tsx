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
  containerInner: {
    flex: 1,
    flexDirection: 'column',
    width: '100%'
  },
  justifyContentCenter: {
    justifyContent: 'center'
  },
  alignItemsCenter: {
    alignItems: 'center'
  },
  alignItemsEnd: {
    alignItems: 'flex-end'
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
  textJustify: {
    textAlign: 'justify'
  },
  textEnd: {
    textAlign: 'right'
  },
  flexForWrap: {
    flex: 1
  },
  date: {
    marginTop: 10
  },
  wrap: {
    flexWrap: 'wrap'
  },
  disabled: {
    opacity: 0.5
  },
  screenIconButton: {
    marginRight: -10
  },
  menuContent: {
    backgroundColor: theme.colors.background
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 25
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.primary
  },
  formField: {
    marginVertical: 5
  },
  dropdownFormField: {
    marginTop: 5,
    marginBottom: -5
  },
  formHelperText: {
    marginTop: -5,
    marginBottom: -5
  },
  formButton: {
    marginVertical: 10
  },
  formGroupButton: {
    width: '50%',
    marginVertical: 10
  },
  user: {
    gap: 20
  },
  feedback: {
    marginTop: 20
  },
  review: {
    backgroundColor: theme.colors.background,
    margin: 10
  },
  reviewAuthor: {
    gap: 10
  },
  reviewText: {
    paddingTop: 10,
    textAlign: 'justify'
  },
  image: {
    backgroundColor: theme.colors.background
  },
  fullImage: {
    width: '100%',
    height: '100%'
  },
  logo: {
    width: 64,
    height: 64
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
    backgroundColor: theme.colors.background,
    padding: 20
  },
  imageRipple: {
    borderRadius: 64
  },
  modal: {
    backgroundColor: theme.colors.background,
    padding: 20,
    borderRadius: 10
  },
  modalImage: {
    alignItems: 'center'
  },
  trophy: {
    marginBottom: 20
  },
  quest: {
    backgroundColor: theme.colors.background,
    margin: 10
  },
  cardRightElement: {
    marginRight: 15
  },
  cardButton: {
    marginRight: 5
  },
  info: {
    backgroundColor: theme.colors.background,
    margin: 10
  },
  chat: {
    backgroundColor: theme.colors.background,
    margin: 10
  },
  chatScrollView: {
    height: '100%'
  },
  messageImage: {
    width: 150,
    height: 125
  },
  messagePreview: {
    width: 300,
    height: 250
  },
  messageCurrentUser: {
    margin: 10,
    borderRadius: 10,
    borderBottomEndRadius: 0,
    alignSelf: 'flex-end'
  },
  messageOtherUser: {
    margin: 10,
    borderRadius: 10,
    borderBottomStartRadius: 0,
    alignSelf: 'flex-start'
  },
  ratingImage: {
    width: 32,
    height: 32
  },
  email: {
    marginTop: 25,
    marginBottom: 10
  },
  map: {
    flex: 3
  },
  playerMarkerBackground: {
    width: 28,
    height: 28
  },
  playerMarkerForeground: {
    width: 28,
    height: 28,
    backgroundColor: theme.colors.elevation.level0,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 3
  },
  questMarker: {
    width: 28,
    height: 28
  },
  questInfo: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  chevron: {
    position: 'absolute',
    zIndex: 1
  },
  questInfoContent: {
    backgroundColor: theme.colors.background,
    width: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7
  },
  fullWidthCard: {
    flex: 1,
    margin: 10,
    padding: 10,
    backgroundColor: theme.colors.background,
    borderRadius: 8
  },
  card: {
    margin: 10,
    padding: 10,
    backgroundColor: theme.colors.background,
    borderRadius: 8,
    justifyContent: 'center'
  },
  cardContentMain: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  cardContentAdditional: {
    marginBottom: 20
  },
  smallCard: {
    flex: 1,
    justifyContent: 'center'
  },
  boldTitle: {
    fontWeight: 'bold'
  },
  iconWithText: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8
  }
});
