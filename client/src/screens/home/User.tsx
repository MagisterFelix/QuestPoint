import { useAxios } from '@/api/axios';
import { ENDPOINTS } from '@/api/endpoints';
import UserProfile from '@/components/UserProfile';
import { ScreenProps } from '@/types/props';
import { UserResponseData } from '@/types/response';

const UserScreen = ({ navigation }: ScreenProps) => {
  const [{ loading, data }] = useAxios<UserResponseData>({
    url: `${ENDPOINTS.user}/${navigation.data.user}`,
    method: 'GET'
  });

  return <UserProfile loading={loading} data={data!} />;
};

export default UserScreen;
