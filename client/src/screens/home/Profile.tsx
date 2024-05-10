import { useAxios } from '@/api/axios';
import { ENDPOINTS } from '@/api/endpoints';
import UserProfile from '@/components/UserProfile';
import { useAuth } from '@/providers/AuthProvider';
import { FeedbackResponseData } from '@/types/response';

const ProfileScreen = () => {
  const { user } = useAuth();

  const [{ loading: loadingFeedback, data: feedback }] = useAxios<
    FeedbackResponseData[]
  >({
    url: `${ENDPOINTS.feedback}${user?.username}`,
    method: 'GET'
  });

  return (
    <UserProfile loading={loadingFeedback} user={user!} feedback={feedback!} />
  );
};

export default ProfileScreen;
