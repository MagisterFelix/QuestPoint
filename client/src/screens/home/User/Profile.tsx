import { View } from 'react-native';

import { styles } from '@/common/styles';
import Profile from '@/components/User/Profile';
import { useAuth } from '@/providers/AuthProvider';

const ProfileScreen = () => {
  const { user } = useAuth();

  return (
    <View style={styles.container}>
      <Profile user={user!} />
    </View>
  );
};

export default ProfileScreen;
