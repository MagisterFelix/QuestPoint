import { useAxios } from '@/api/axios';
import { ENDPOINTS } from '@/api/endpoints';
import UserProfile from '@/components/UserProfile';
import { ScreenProps } from '@/types/props';
import { UserResponseData } from '@/types/response';

const UserScreen = ({ route }: ScreenProps) => {
  const [{ loading: loadingUser, data: user }] = useAxios<UserResponseData>({
    url: `${ENDPOINTS.user}${route.params?.user}`,
    method: 'GET'
  });

  return <UserProfile loadingUser={loadingUser} user={user!} />;
};

export default UserScreen;
