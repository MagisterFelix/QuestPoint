import { StyleSheet } from 'react-native';
import { DefaultTheme } from 'react-native-paper';

export const theme = {
  ...DefaultTheme,
  roundness: 1
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    width: '100%',
    padding: 20
  },
  centerVertical: {
    justifyContent: 'center'
  },
  centerHorizontal: {
    alignItems: 'center'
  },
  rowCenter: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 5
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
  }
});
