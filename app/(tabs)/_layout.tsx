import { Tabs } from 'expo-router';
import React from 'react';

import { useAuth } from '@/src/lib/auth/auth-provider';

export default function TabLayout() {
  const { hydrated } = useAuth();

  if (!hydrated) {
    return null;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: 'none' },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Trang chu',
        }}
      />
      <Tabs.Screen
        name="applications"
        options={{
          title: 'Da ung tuyen',
        }}
      />
      <Tabs.Screen
        name="assistant"
        options={{
          title: 'JobBot AI',
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Thông báo',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Tài khoản',
        }}
      />
    </Tabs>
  );
}
