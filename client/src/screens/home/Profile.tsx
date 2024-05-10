import UserProfile from '@/components/UserProfile';
import { useAuth } from '@/providers/AuthProvider';

const ProfileScreen = () => {
  const { user } = useAuth();

  return <UserProfile user={user!} />;
};

export default ProfileScreen;
