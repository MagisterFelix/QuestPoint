import { View } from 'react-native';
import { Button } from 'react-native-paper';

import { styles } from '@/common/styles';
import { useAuth } from '@/providers/AuthProvider';

const HomeScreen = () => {
  const { logout } = useAuth();

  return (
    <View style={styles.container}>
      <Button mode="outlined" onPress={logout}>
        Logout
      </Button>
    </View>
  );
};

export default HomeScreen;
