import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { User } from '../../core/models/User';
import { UserRepository } from '../../core/repositories/UserRepository';
import { useAuth } from '../../hooks/useAuth';

const userRepo = new UserRepository();

export default function AdminUsersScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [organizers, setOrganizers] = useState<string[]>([]);
  const ORGANIZERS_KEY = 'organizersList';

  useEffect(() => {
    if (!user) return;
    if (user.role !== 'admin') return;
    loadUsers();
    loadOrganizers();
  }, [user]);

  const loadOrganizers = async () => {
    try {
      const raw = await AsyncStorage.getItem(ORGANIZERS_KEY);
      const list: string[] = raw ? JSON.parse(raw) : [];
      setOrganizers(list);
    } catch (e) {
      console.warn('Could not load organizers list', e);
      setOrganizers([]);
    }
  };

  const loadUsers = async () => {
    setLoading(true);
    const list = await userRepo.getAllUsers();
    setUsers(list);
    setLoading(false);
  };

  const handleToggleActive = async (u: User) => {
    Alert.alert('Confirmar', `${u.active ? 'Desactivar' : 'Activar'} usuario ${u.email}?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'OK', onPress: async () => {
          try {
            // @ts-ignore - some backends return `active` boolean
            const updated = await userRepo.updateUserActive(u._id, !u['active']);
            if (updated) await loadUsers();
          } catch (err) {
            console.error(err);
            Alert.alert('Error', 'No se pudo actualizar el estado del usuario');
          }
        }
      }
    ]);
  };

  const handleToggleRole = async (u: User) => {
    // Toggle between organizer and user (local override)
    const isCurrentlyOrg = organizers.includes(u.id || u._id);
    const newRole = isCurrentlyOrg ? ('user' as any) : ('organizer' as any);
    Alert.alert('Confirmar', `Cambiar rol de ${u.email} a ${newRole}?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'OK', onPress: async () => {
          try {
            console.log('🔄 Updating user role (API):', u.email, 'to', newRole);
            // Keep API call for audit/admin purposes
            const updated = await userRepo.updateUserRole(u._id, newRole as any);
            // Manage local organizer override list
            const userId = u.id || u._id;
            let newList = [...organizers];
            if (newRole === 'organizer') {
              if (!newList.includes(userId)) newList.push(userId);
            } else {
              newList = newList.filter((id) => id !== userId);
            }
            await AsyncStorage.setItem(ORGANIZERS_KEY, JSON.stringify(newList));
            setOrganizers(newList);
            if (updated) {
              console.log('✅ User role update API returned:', updated);
            }
            await loadUsers();
          } catch (err) {
            console.error(err);
            Alert.alert('Error', 'No se pudo actualizar el rol');
          }
        }
      }
    ]);
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.centerText}>Cargando...</Text>
      </View>
    );
  }

  if (user.role !== 'admin') {
    return (
      <View style={styles.container}>
        <View style={styles.centerContainer}>
          <Text style={styles.errorIcon}>🚫</Text>
          <Text style={styles.errorTitle}>Acceso Denegado</Text>
          <Text style={styles.errorText}>Solo administradores pueden ver esta pantalla.</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Usuarios</Text>
      </View>

      <View style={styles.content}>
        <FlatList
          data={users}
          keyExtractor={(item) => item.id || item._id}
          onRefresh={loadUsers}
          refreshing={loading}
          renderItem={({ item }) => (
            <View style={styles.userCard}>
              <View style={{ flex: 1 }}>
                <Text style={styles.userName}>{item.name}</Text>
                <Text style={styles.userEmail}>{item.email}</Text>
                <Text style={styles.userMeta}>Rol: {organizers.includes(item.id || item._id) ? 'organizer' : item.role}</Text>
              </View>
              <View style={styles.actions}>
                <TouchableOpacity style={styles.actionBtn} onPress={() => handleToggleRole(item)}>
                  <Text style={styles.actionText}>{organizers.includes(item.id || item._id) ? 'Quitar Org' : 'Hacer Org'}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionBtn, { marginTop: 8 }]} onPress={() => handleToggleActive(item)}>
                  {/* @ts-ignore */}
                  <Text style={styles.actionText}>{item['active'] ? 'Desactivar' : 'Activar'}</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          ListEmptyComponent={() => (
            <View style={styles.empty}> 
              <Text style={styles.emptyText}>No hay usuarios.</Text>
            </View>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { backgroundColor: '#FFFFFF', paddingTop: 52, paddingHorizontal: 20, paddingBottom: 20, borderBottomWidth: 0.5, borderBottomColor: '#DDE5F0' },
  title: { fontSize: 28, fontWeight: '800', color: '#FF9500', letterSpacing: -0.5 },
  content: { padding: 16, flex: 1 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 },
  centerText: { textAlign: 'center', marginTop: 20 },
  errorIcon: { fontSize: 60, marginBottom: 16 },
  errorTitle: { fontSize: 24, fontWeight: '700', color: '#FF3B30', marginBottom: 12, textAlign: 'center' },
  errorText: { fontSize: 14, color: '#4A5F7F', textAlign: 'center', lineHeight: 22 },
  userCard: { flexDirection: 'row', backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, marginBottom: 12, alignItems: 'center', borderWidth: 0.5, borderColor: '#F0F3F9' },
  userName: { fontSize: 16, fontWeight: '700', color: '#1A2B3D' },
  userEmail: { fontSize: 13, color: '#4A5F7F', marginTop: 4 },
  userMeta: { fontSize: 12, color: '#7B8BA3', marginTop: 6 },
  actions: { marginLeft: 12, alignItems: 'flex-end' },
  actionBtn: { backgroundColor: '#FF9500', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8 },
  actionText: { color: 'white', fontWeight: '700', fontSize: 13 },
  empty: { padding: 24, alignItems: 'center' },
  emptyText: { color: '#7B8BA3' }
});
