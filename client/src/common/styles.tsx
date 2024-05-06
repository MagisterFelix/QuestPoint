import { StyleSheet } from 'react-native';
import { DefaultTheme } from 'react-native-paper';

export const theme = {
  ...DefaultTheme
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    gap: 10,
    marginHorizontal: 20
  },
  noGap: {
    marginTop: -10,
    marginBottom: -10
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10
  },
  col: {
    flex: 1,
    flexDirection: 'column',
    gap: 10
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.primary
  },
  button: {
    borderRadius: 5
  },
  formButton: {
    borderRadius: 5,
    marginTop: 10
  },
  required: {
    color: 'red'
  }
});
