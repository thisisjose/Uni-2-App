// app/register.tsx
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../hooks/useAuth';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { register, loading } = useAuth();
  const router = useRouter();

  const handleRegister = async () => {
    // Validaciones
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
      return;
    }

    const result = await register(name, email, password);

      if (result.success) {
        // Redirige automáticamente sin alert
        router.replace('/event/list');
      } else {
        Alert.alert('Error', result.message || 'Error en el registro');
      }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={styles.container}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.iconContainer}>
          <Image 
            source={require('../assets/images/community.png')} 
            style={styles.communityIcon}
          />
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.title}>Crear Cuenta</Text>
          <Text style={styles.subtitle}>Únete a nuestra comunidad</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Nombre completo"
          value={name}
          onChangeText={setName}
          placeholderTextColor="#9BB7DB"
        />
        
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholderTextColor="#9BB7DB"
        />
        
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor="#9BB7DB"
        />
        
        <TextInput
          style={styles.input}
          placeholder="Confirmar contraseña"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          placeholderTextColor="#9BB7DB"
        />
        
        <TouchableOpacity 
          style={styles.button} 
          onPress={handleRegister}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Creando cuenta...' : 'Registrarse'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.link}>¿Ya tienes cuenta? <Text style={styles.linkBold}>Inicia sesión</Text></Text>
        </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  scrollContent: { flexGrow: 1, paddingVertical: 20 },
  iconContainer: { paddingTop: 120, paddingBottom: 20, alignItems: 'center' },
  communityIcon: { width: 100, height: 100, resizeMode: 'contain' },
  title: { fontSize: 24, fontWeight: '700', color: '#1A2B3D', textAlign: 'center', marginBottom: 8 },
  formContainer: { paddingHorizontal: 24, paddingVertical: 16 },
  subtitle: { fontSize: 14, color: '#4A5F7F', marginBottom: 28, textAlign: 'center', fontWeight: '500', letterSpacing: 0.2 },
  input: { backgroundColor: '#FFFFFF', borderWidth: 1.5, borderColor: '#DDE5F0', padding: 16, borderRadius: 12, marginBottom: 14, fontSize: 16, color: '#1A2B3D', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 1 },
  button: { backgroundColor: '#0B63D6', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 12, shadowColor: '#0B63D6', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 5 },
  buttonText: { color: 'white', fontWeight: '700', fontSize: 16, letterSpacing: 0.3 },
  link: { color: '#4A5F7F', textAlign: 'center', marginTop: 20, fontSize: 14, fontWeight: '500' },
  linkBold: { color: '#0B63D6', fontWeight: '700' },
});