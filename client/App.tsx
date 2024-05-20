import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  NavigationContainer,
  NavigationProp,
  useNavigation
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Clipboard from 'expo-clipboard';
import { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import {
  Icon,
  IconButton,
  Menu,
  Modal,
  PaperProvider,
  Portal,
  Text
} from 'react-native-paper';

import { styles, theme } from '@/common/styles';
import AuthProvider, { useAuth } from '@/providers/AuthProvider';
import PaymentProvider from '@/providers/PaymentProvider';
import QuestDataProvider from '@/providers/QuestDataProvider';
import AuthorizationScreen from '@/screens/auth/Authorization';
import RegistrationScreen from '@/screens/auth/Registration';
import MapScreen from '@/screens/home/Map/Map';
import DetailsScreen from '@/screens/home/Quests/Details';
import QuestFormScreen from '@/screens/home/Quests/QuestForm';
import QuestListScreen from '@/screens/home/Quests/QuestList';
import AccountSettingsScreen from '@/screens/home/User/AccountSettings';
import PaymentScreen from '@/screens/home/User/Payment';
import PrivacySettingsScreen from '@/screens/home/User/PrivacySettings';
import ProfileScreen from '@/screens/home/User/Profile';
import SettingsScreen from '@/screens/home/User/Settings';
import UserScreen from '@/screens/home/User/User';
import { FiltersProps } from '@/types/Quests/props';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const QuestListTab = () => {
  const [filters, setFilters] = useState<FiltersProps>({
    Created: false,
    Offer: false,
    InProgress: false
  });
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const toggleMenu = () => setShowMenu(!showMenu);

  return (
    <QuestDataProvider filters={filters}>
      <Stack.Navigator>
        <Stack.Screen
          name="Quests"
          component={QuestListScreen}
          options={{
            headerTitle: () => (
              <View style={styles.rowCenter}>
                <Icon source="clipboard-list" size={30} />
                <Text style={styles.headerTitle}>Quests</Text>
              </View>
            ),
            headerRight: () => (
              <View style={styles.rowCenter}>
                <Menu
                  visible={showMenu}
                  onDismiss={toggleMenu}
                  anchor={
                    <IconButton
                      icon="filter-outline"
                      style={styles.screenIconButton}
                      onPress={toggleMenu}
                    />
                  }
                  contentStyle={styles.menuContent}
                >
                  <Menu.Item
                    title="Created"
                    leadingIcon={
                      filters.Created
                        ? 'checkbox-marked-outline'
                        : 'checkbox-blank-outline'
                    }
                    onPress={() =>
                      setFilters((prev) => ({
                        ...prev,
                        Created: !filters.Created
                      }))
                    }
                  />
                  <Menu.Item
                    title="Offer"
                    leadingIcon={
                      filters.Offer
                        ? 'checkbox-marked-outline'
                        : 'checkbox-blank-outline'
                    }
                    onPress={() =>
                      setFilters((prev) => ({
                        ...prev,
                        Offer: !filters.Offer
                      }))
                    }
                  />
                  <Menu.Item
                    title="In Progress"
                    leadingIcon={
                      filters.InProgress
                        ? 'checkbox-marked-outline'
                        : 'checkbox-blank-outline'
                    }
                    onPress={() =>
                      setFilters((prev) => ({
                        ...prev,
                        InProgress: !filters.InProgress
                      }))
                    }
                  />
                </Menu>
              </View>
            )
          }}
        />
        <Stack.Screen
          name="Edit Quest"
          component={QuestFormScreen}
          options={{
            headerTitleAlign: 'center',
            animation: 'ios'
          }}
        />
        <Stack.Screen
          name="Details"
          component={DetailsScreen}
          options={{
            headerTitleAlign: 'center',
            animation: 'ios'
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
      </Stack.Navigator>
    </QuestDataProvider>
  );
};

const MapTab = () => {
  const navigation: NavigationProp<any> = useNavigation();

  return (
    <QuestDataProvider>
      <Stack.Navigator>
        <Stack.Screen
          name="Map"
          component={MapScreen}
          options={{
            headerTitle: ({ children }) => (
              <View style={styles.rowCenter}>
                <Icon source="map" size={30} />
                <Text style={styles.headerTitle}>{children}</Text>
              </View>
            ),
            headerRight: () => (
              <IconButton
                icon="plus-circle-outline"
                style={styles.screenIconButton}
                onPress={() => navigation.navigate('New Quest')}
              />
            )
          }}
        />
        <Stack.Screen
          name="New Quest"
          component={QuestFormScreen}
          options={{
            headerTitleAlign: 'center',
            animation: 'ios'
          }}
        />
      </Stack.Navigator>
    </QuestDataProvider>
  );
};

const ProfileTab = () => {
  const navigation: NavigationProp<any> = useNavigation();

  const { logout } = useAuth();

  const [showHelp, setShowHelp] = useState<boolean>(false);
  const toggleShowHelp = () => setShowHelp(!showHelp);

  return (
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
                  style={styles.screenIconButton}
                  onPress={() => navigation.navigate('Settings')}
                />
                <IconButton
                  icon="logout"
                  style={styles.screenIconButton}
                  onPress={() => logout!()}
                />
              </View>
            )
          }}
        />
        <Stack.Group>
          <Stack.Screen
            name="Settings"
            component={SettingsScreen}
            options={{
              headerTitleAlign: 'center',
              animation: 'ios',
              headerRight: () => (
                <View>
                  <IconButton
                    icon="help-circle-outline"
                    style={styles.screenIconButton}
                    onPress={toggleShowHelp}
                  />
                  <Portal>
                    <Modal
                      visible={showHelp}
                      onDismiss={toggleShowHelp}
                      contentContainerStyle={styles.modal}
                      style={styles.container}
                    >
                      <Text style={styles.title}>Help</Text>
                      <Text variant="bodyMedium" style={styles.textCenter}>
                        If you have any suggestions, questions or problems, you
                        can always write to our email.
                      </Text>
                      <TouchableOpacity
                        onPress={() =>
                          Clipboard.setStringAsync(
                            'quest.point.official@gmail.com'
                          )
                        }
                      >
                        <Text
                          variant="bodyMedium"
                          style={[styles.textCenter, styles.link, styles.email]}
                        >
                          quest.point.official@gmail.com
                        </Text>
                      </TouchableOpacity>
                    </Modal>
                  </Portal>
                </View>
              )
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
        <Stack.Screen
          name="User"
          component={UserScreen}
          options={{
            headerTitleAlign: 'center',
            animation: 'ios'
          }}
        />
      </Stack.Navigator>
    </PaymentProvider>
  );
};

const HomeScreen = () => {
  return (
    <Tab.Navigator
      initialRouteName="MapTab"
      screenOptions={{
        headerShown: false,
        tabBarItemStyle: { paddingVertical: 5 },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.secondary,
        tabBarHideOnKeyboard: true
      }}
    >
      <Tab.Screen
        name="QuestListTab"
        component={QuestListTab}
        options={{
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
        component={MapTab}
        options={{
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
        component={ProfileTab}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ focused, color, size }) => (
            <Icon
              source={focused ? 'badge-account' : 'badge-account-outline'}
              color={color}
              size={size}
            />
          )
        }}
      />
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
  const { user } = useAuth();

  return (
    <NavigationContainer>
      {user ? <HomeScreen /> : <AuthScreen />}
    </NavigationContainer>
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
