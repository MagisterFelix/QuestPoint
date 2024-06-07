import { View } from 'react-native';

import { useAxios } from '@/api/axios';
import { ENDPOINTS } from '@/api/endpoints';
import { styles } from '@/common/styles';
import Loading from '@/components/Loading';
import Profile from '@/components/User/Profile';
import { UserResponseData } from '@/types/User/response';
import { ScreenProps } from '@/types/props';

const UserScreen = ({ route }: ScreenProps) => {
  const [{ loading: loadingUser, data: user }] = useAxios<UserResponseData>({
    url: `${ENDPOINTS.user}${route.params?.user}/`,
    method: 'GET'
  });

  if (loadingUser && !user) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      <Profile user={user!} />
    </View>
  );
};

export default UserScreen;
