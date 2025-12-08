import { useRouter } from 'expo-router';
import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useAuth } from '../../hooks/useAuth';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Mi Perfil</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatar}>👤</Text>
          </View>

          <View style={styles.userInfo}>
            <Text style={styles.nameLabel}>Nombre</Text>
            <Text style={styles.nameValue}>{user?.name || 'Usuario'}</Text>

            <Text style={[styles.nameLabel, { marginTop: 20 }]}>Email</Text>
            <Text style={styles.emailValue}>{user?.email || 'email@example.com'}</Text>

            <Text style={[styles.nameLabel, { marginTop: 20 }]}>Rol</Text>
            <View style={styles.roleContainer}>
              <Text style={[styles.roleValue, user?.role === 'admin' && styles.adminRole]}>
                {user?.role === 'admin' ? 'Administrador' : '👥 Voluntario'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Estadísticas</Text>
          
          <View style={styles.statItem}>
            <View style={styles.statIcon}>
              <Text style={styles.statIconText}>📊</Text>
            </View>
            <View style={styles.statContent}>
              <Text style={styles.statLabel}>Campañas Activas</Text>
              <Text style={styles.statValue}>Próximamente</Text>
            </View>
          </View>

          <View style={styles.statItem}>
            <View style={styles.statIcon}>
              <Text style={styles.statIconText}>✅</Text>
            </View>
            <View style={styles.statContent}>
              <Text style={styles.statLabel}>Campañas Completadas</Text>
              <Text style={styles.statValue}>Próximamente</Text>
            </View>
          </View>

          <View style={styles.statItem}>
            <View style={styles.statIcon}>
              <Text style={styles.statIconText}>🤝</Text>
            </View>
            <View style={styles.statContent}>
              <Text style={styles.statLabel}>Total de Contribuciones</Text>
              <Text style={styles.statValue}>Próximamente</Text>
            </View>
          </View>
        </View>

        <View style={styles.divider} />

        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Uni-2 App v1.0</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F8FAFC' 
  },
  header: { 
    backgroundColor: '#FFFFFF',
    paddingTop: 52,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: '#DDE5F0'
  },
  title: { 
    fontSize: 28, 
    fontWeight: '800', 
    color: '#1A2B3D', 
    letterSpacing: -0.5 
  },
  card: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 0.5,
    borderColor: '#F0F3F9',
    overflow: 'hidden'
  },
  profileSection: {
    padding: 20,
    alignItems: 'center'
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E6F0FB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20
  },
  avatar: {
    fontSize: 40
  },
  userInfo: {
    width: '100%'
  },
  nameLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4A5F7F',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6
  },
  nameValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A2B3D',
    letterSpacing: 0.2
  },
  emailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4A5F7F'
  },
  roleContainer: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#E6F0FB',
    borderRadius: 8,
    alignSelf: 'flex-start'
  },
  roleValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0B63D6',
    letterSpacing: 0.2
  },
  adminRole: {
    color: '#FF9500'
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F3F9'
  },
  statsSection: {
    padding: 20
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A2B3D',
    marginBottom: 16,
    letterSpacing: 0.2
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F3F9'
  },
  statIcon: {
    width: 50,
    height: 50,
    borderRadius: 10,
    backgroundColor: '#F0F3F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16
  },
  statIconText: {
    fontSize: 24
  },
  statContent: {
    flex: 1
  },
  statLabel: {
    fontSize: 13,
    color: '#4A5F7F',
    fontWeight: '500',
    marginBottom: 4
  },
  statValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0B63D6'
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    margin: 20,
    shadowColor: '#FF3B30',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5
  },
  logoutButtonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 0.3
  },
  footer: {
    paddingVertical: 20,
    alignItems: 'center'
  },
  footerText: {
    color: '#9BB7DB',
    fontSize: 12,
    fontWeight: '500'
  }
});
