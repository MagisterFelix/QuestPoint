import { View } from 'react-native';

import { styles } from '@/common/styles';
import UserProfile from '@/components/UserProfile';
import { useAuth } from '@/providers/AuthProvider';

const ProfileScreen = () => {
  const { user } = useAuth();

  return (
    <View style={styles.container}>
      <UserProfile user={user!} />
    </View>
  );
};

export default ProfileScreen;
