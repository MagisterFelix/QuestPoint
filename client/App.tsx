import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  NavigationContainer,
  NavigationProp,
  useNavigation
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View } from 'react-native';
import { Icon, IconButton, PaperProvider, Text } from 'react-native-paper';

import { AxiosInterceptor } from '@/api/axios';
import { styles, theme } from '@/common/styles';
import Coins from '@/components/Coins';
import AuthProvider, { useAuth } from '@/providers/AuthProvider';
import PaymentProvider from '@/providers/PaymentProvider';
import AuthorizationScreen from '@/screens/auth/Authorization';
import RegistrationScreen from '@/screens/auth/Registration';
import AccountSettingsScreen from '@/screens/home/AccountSettings';
import MapScreen from '@/screens/home/Map';
import PaymentScreen from '@/screens/home/Payment';
import PrivacySettingsScreen from '@/screens/home/PrivacySettings';
import ProfileScreen from '@/screens/home/Profile';
import QuestListScreen from '@/screens/home/QuestList';
import SettingsScreen from '@/screens/home/Settings';
import UserScreen from '@/screens/home/User';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const HomeScreen = () => {
  const navigation: NavigationProp<any> = useNavigation();
  const { user, logout } = useAuth();

  return (
    <Tab.Navigator
      initialRouteName="MapTab"
      screenOptions={{
        tabBarItemStyle: { paddingVertical: 5 },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.secondary
      }}
    >
      <Tab.Screen
        name="QuestListTab"
        component={QuestListScreen}
        options={{
          headerTitle: () => (
            <View style={styles.rowCenter}>
              <Icon source="clipboard-list" size={30} />
              <Text style={styles.headerTitle}>Quests</Text>
            </View>
          ),
          headerRight: () => (
            <View style={{ marginRight: 10 }}>
              <Coins amount={user?.balance!} size={32} />
            </View>
          ),
          tabBarLabel: 'Quests',
          tabBarIcon: ({ focused, color, size }) => (
            <Icon
              source={focused ? 'clipboard-list' : 'clipboard-list-outline'}
              color={color}
              size={size}
            />
          )
        }}
      />
      <Tab.Screen
        name="MapTab"
        component={MapScreen}
        options={{
          headerTitle: () => (
            <View style={styles.rowCenter}>
              <Icon source="map" size={30} />
              <Text style={styles.headerTitle}>Map</Text>
            </View>
          ),
          tabBarLabel: 'Map',
          tabBarIcon: ({ focused, color, size }) => (
            <Icon
              source={focused ? 'map' : 'map-outline'}
              color={color}
              size={size}
            />
          )
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        options={{
          headerShown: false,
          tabBarLabel: 'Profile',
          tabBarIcon: ({ focused, color, size }) => (
            <Icon
              source={focused ? 'badge-account' : 'badge-account-outline'}
              color={color}
              size={size}
            />
          )
        }}
      >
        {() => (
          <PaymentProvider>
            <Stack.Navigator>
              <Stack.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                  headerTitle: ({ children }) => (
                    <View style={styles.rowCenter}>
                      <Icon source="badge-account" size={30} />
                      <Text style={styles.headerTitle}>{children}</Text>
                    </View>
                  ),
                  headerRight: () => (
                    <View style={styles.row}>
                      <IconButton
                        icon="account-settings-outline"
                        style={{ marginRight: -10 }}
                        onPress={() => navigation.navigate('Settings')}
                      />
                      <IconButton
                        icon="logout"
                        style={{ marginRight: -10 }}
                        onPress={() => logout!()}
                      />
                    </View>
                  )
                }}
              />
              <Stack.Screen
                name="User"
                component={UserScreen}
                options={{
                  headerTitleAlign: 'center',
                  animation: 'ios'
                }}
              />
              <Stack.Group>
                <Stack.Screen
                  name="Settings"
                  component={SettingsScreen}
                  options={{
                    headerTitleAlign: 'center',
                    animation: 'ios'
                  }}
                />
                <Stack.Screen
                  name="Account Settings"
                  component={AccountSettingsScreen}
                  options={{
                    headerTitleAlign: 'center',
                    animation: 'ios'
                  }}
                />
                <Stack.Screen
                  name="Privacy Settings"
                  component={PrivacySettingsScreen}
                  options={{
                    headerTitleAlign: 'center',
                    animation: 'ios'
                  }}
                />
                <Stack.Screen
                  name="Payment"
                  component={PaymentScreen}
                  options={{
                    headerTitleAlign: 'center',
                    animation: 'ios'
                  }}
                />
              </Stack.Group>
            </Stack.Navigator>
          </PaymentProvider>
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

const AuthScreen = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Sign In"
        component={AuthorizationScreen}
        options={{
          headerBackVisible: false,
          animation: 'fade_from_bottom'
        }}
      />
      <Stack.Screen
        name="Sign Up"
        component={RegistrationScreen}
        options={{
          headerBackVisible: false,
          animation: 'ios'
        }}
      />
    </Stack.Navigator>
  );
};

const Main = () => {
  const { user, logout } = useAuth();

  return (
    <AxiosInterceptor logout={logout!}>
      <NavigationContainer>
        {user ? <HomeScreen /> : <AuthScreen />}
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
