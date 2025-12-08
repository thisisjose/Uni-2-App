import { Tabs } from 'expo-router';
import React from 'react';
import { Image } from 'react-native';
import { useAuth } from '../../hooks/useAuth';

export default function TabsLayout() {
  const { user } = useAuth();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 0.5,
          borderTopColor: '#DDE5F0',
          paddingBottom: 8,
          paddingTop: 8,
          height: 70,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
        },
        tabBarActiveTintColor: '#0B63D6',
        tabBarInactiveTintColor: '#9BB7DB',
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 4,
        },
      }}
    >
      {/* HOME - Campañas disponibles */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Campañas',
          tabBarIcon: ({ color }) => (
            <Image
              source={require('../../assets/icons/home.png')}
              style={{ width: 24, height: 24, tintColor: color }}
            />
          ),
        }}
      />

      {/* SOCIAL - Mis campañas */}
      <Tabs.Screen
        name="social"
        options={{
          title: 'Mis Campañas',
          tabBarIcon: ({ color }) => (
            <Image
              source={require('../../assets/icons/social.png')}
              style={{ width: 24, height: 24, tintColor: color }}
            />
          ),
        }}
      />

      {/* ADMIN - Solo para admins */}
      {user?.role === 'admin' && (
        <Tabs.Screen
          name="admin"
          options={{
            title: 'Crear',
            tabBarIcon: ({ color }) => (
              <Image
                source={require('../../assets/icons/plus.png')}
                style={{ width: 24, height: 24, tintColor: color }}
              />
            ),
          }}
        />
      )}

      {/* PROFILE - Mi perfil */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color }) => (
            <Image
              source={require('../../assets/icons/user.png')}
              style={{ width: 24, height: 24, tintColor: color }}
            />
          ),
        }}
      />

      {/* EVENT DETAIL - No visible en tab bar */}
      <Tabs.Screen
        name="event/detail"
        options={{
          title: 'Detalle del Evento',
          href: null,
        }}
      />
    </Tabs>
  );
}
