import { useAxios } from '@/api/axios';
import { ENDPOINTS } from '@/api/endpoints';
import UserProfile from '@/components/UserProfile';
import { ScreenProps } from '@/types/props';
import { FeedbackResponseData, UserResponseData } from '@/types/response';

const UserScreen = ({ route }: ScreenProps) => {
  const [{ loading: loadingUser, data: user }] = useAxios<UserResponseData>({
    url: `${ENDPOINTS.user}${route.params?.user}`,
    method: 'GET'
  });

  const [{ loading: loadingFeedback, data: feedback }] = useAxios<
    FeedbackResponseData[]
  >({
    url: `${ENDPOINTS.feedback}${route.params?.user}`,
    method: 'GET'
  });

  return (
    <UserProfile
      loading={loadingUser || loadingFeedback}
      user={user!}
      feedback={feedback!}
    />
  );
};

export default UserScreen;
