import { View } from 'react-native';

import { useAxios } from '@/api/axios';
import { ENDPOINTS } from '@/api/endpoints';
import { styles } from '@/common/styles';
import UserProfile from '@/components/UserProfile';
import { ScreenProps } from '@/types/props';
import { UserResponseData } from '@/types/response';

const UserScreen = ({ route }: ScreenProps) => {
  const [{ loading: loadingUser, data: user }] = useAxios<UserResponseData>({
    url: `${ENDPOINTS.user}${route.params?.user}`,
    method: 'GET'
  });

  return (
    <View style={styles.container}>
      <UserProfile loadingUser={loadingUser} user={user!} />
    </View>
  );
};

export default UserScreen;
