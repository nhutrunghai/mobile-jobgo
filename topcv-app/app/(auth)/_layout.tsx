import { Redirect, Stack } from 'expo-router';

import { useAuth } from '@/src/lib/auth/auth-provider';

export default function AuthLayout() {
  const { hydrated, isAuthenticated } = useAuth();

  if (!hydrated) {
    return null;
  }

  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="forgot-password" />
      <Stack.Screen name="reset-password" />
    </Stack>
  );
}
