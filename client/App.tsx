import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PaperProvider } from 'react-native-paper';

import { AxiosInterceptor } from '@/api/axios';
import { theme } from '@/common/styles';
import AuthProvider, { useAuth } from '@/providers/AuthProvider';
import Authorization from '@/screens/auth/Authorization';
import Registration from '@/screens/auth/Registration';
import Home from '@/screens/home/Home';

const Stack = createNativeStackNavigator();

const Main = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <AxiosInterceptor logout={logout!}>
      <NavigationContainer>
        <Stack.Navigator>
          {isAuthenticated ? (
            <Stack.Screen
              name="Home"
              component={Home}
              options={{
                animation: 'fade_from_bottom'
              }}
            />
          ) : (
            <Stack.Group>
              <Stack.Screen
                name="Sign In"
                component={Authorization}
                options={{
                  headerBackVisible: false,
                  animation: 'fade_from_bottom'
                }}
              />
              <Stack.Screen
                name="Sign Up"
                component={Registration}
                options={{
                  headerBackVisible: false,
                  animation: 'slide_from_right'
                }}
              />
            </Stack.Group>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </AxiosInterceptor>
  );
};

const App = () => {
  return (
    <PaperProvider theme={theme}>
      <AuthProvider>
        <Main />
      </AuthProvider>
    </PaperProvider>
  );
};

export default App;
