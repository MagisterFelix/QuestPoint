import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Icon, PaperProvider } from 'react-native-paper';

import { AxiosInterceptor } from '@/api/axios';
import { theme } from '@/common/styles';
import AuthProvider, { useAuth } from '@/providers/AuthProvider';
import AuthorizationScreen from '@/screens/auth/Authorization';
import RegistrationScreen from '@/screens/auth/Registration';
import MapScreen from '@/screens/home/Map';
import ProfileScreen from '@/screens/home/Profile';
import QuestListScreen from '@/screens/home/QuestList';

const HomeStack = createBottomTabNavigator();

const HomeStackScreen = () => {
  return (
    <HomeStack.Navigator
      initialRouteName="Map"
      screenOptions={{
        tabBarItemStyle: { paddingVertical: 5 },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.secondary
      }}
    >
      <HomeStack.Screen
        name="Quests"
        component={QuestListScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Icon
              source={focused ? 'clipboard-list' : 'clipboard-list-outline'}
              color={color}
              size={size}
            />
          )
        }}
      />
      <HomeStack.Screen
        name="Map"
        component={MapScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Icon
              source={focused ? 'map' : 'map-outline'}
              color={color}
              size={size}
            />
          )
        }}
      />
      <HomeStack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Icon
              source={focused ? 'badge-account' : 'badge-account-outline'}
              color={color}
              size={size}
            />
          )
        }}
      />
    </HomeStack.Navigator>
  );
};

const AuthorizationStack = createNativeStackNavigator();

const AuthorizationStackScreen = () => {
  return (
    <AuthorizationStack.Navigator>
      <AuthorizationStack.Screen
        name="Sign In"
        component={AuthorizationScreen}
        options={{
          headerBackVisible: false,
          animation: 'fade_from_bottom'
        }}
      />
      <AuthorizationStack.Screen
        name="Sign Up"
        component={RegistrationScreen}
        options={{
          headerBackVisible: false,
          animation: 'slide_from_right'
        }}
      />
    </AuthorizationStack.Navigator>
  );
};

const Main = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <AxiosInterceptor logout={logout!}>
      <NavigationContainer>
        {isAuthenticated ? <HomeStackScreen /> : <AuthorizationStackScreen />}
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
