import { useEffect } from 'react';
import { View } from 'react-native';

import { styles } from '@/common/styles';
import Profile from '@/components/User/Profile';
import { useAuth } from '@/providers/AuthProvider';
import { useUpdater } from '@/providers/UpdaterProvider';

const ProfileScreen = () => {
  const { user, getProfile } = useAuth();

  const { updating, toUpdate, update } = useUpdater();

  useEffect(() => {
    if (!updating && toUpdate.has('Profile')) {
      update!('Profile', getProfile!);
    }
  }, [updating, toUpdate, update, getProfile]);

  return (
    <View style={styles.container}>
      <Profile user={user!} />
    </View>
  );
};

export default ProfileScreen;
