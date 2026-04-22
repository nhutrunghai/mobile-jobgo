import { Redirect } from 'expo-router';
import { View } from 'react-native';

import { useAuth } from '@/src/lib/auth/auth-provider';

export default function IndexScreen() {
  const { hydrated, isAuthenticated } = useAuth();

  if (!hydrated) {
    return <View style={{ flex: 1, backgroundColor: '#FFFFFF' }} />;
  }

  return <Redirect href={isAuthenticated ? '/(tabs)' : '/(auth)/login'} />;
}
