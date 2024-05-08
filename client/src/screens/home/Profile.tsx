import UserProfile from '@/components/UserProfile';
import { useAuth } from '@/providers/AuthProvider';

const ProfileScreen = () => {
  const { user } = useAuth();

  return <UserProfile loading={false} data={user!} />;
};

export default ProfileScreen;
