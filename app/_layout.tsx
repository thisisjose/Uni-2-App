import { Stack } from "expo-router";
import React from 'react';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="event/list" />
      <Stack.Screen name="event/detail" />
      <Stack.Screen name="admin/create-event" />
    </Stack>
  );
}
