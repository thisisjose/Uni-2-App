// app/login.tsx
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../hooks/useAuth';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, user } = useAuth();
  const router = useRouter();

  // Verificar si ya hay sesión al cargar
  useEffect(() => {
    if (user) {
      router.replace('/(tabs)');
    }
  }, [user]);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Por favor ingresa un email válido (ej: usuario@ejemplo.com)');
      return;
    }

    const result = await login(email, password);
    
    if (result.success) {
      router.replace('/(tabs)');
    } else {
      Alert.alert('Error', result.message || 'Credenciales incorrectas');
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../assets/images/unidoslogin.jpg')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>
        
        <View style={styles.formContainer}>
          <Text style={styles.title}>Inicia Sesión</Text>
          
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
          
          <TouchableOpacity 
            style={styles.button} 
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Cargando...' : 'Iniciar Sesión'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={() => router.push('/register')}>
            <Text style={styles.link}>¿No tienes cuenta? <Text style={styles.linkBold}>Regístrate aquí</Text></Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  scrollContent: { flexGrow: 1, paddingVertical: 20 },
  logoContainer: { alignItems: 'center', paddingTop: 200, paddingBottom: 30 },
  logoImage: { width: 140, height: 140 },
  formContainer: { paddingHorizontal: 24, paddingVertical: 16 },
  title: { fontSize: 24, fontWeight: '700', color: '#1A2B3D', marginBottom: 24, textAlign: 'center' },
  input: { backgroundColor: '#FFFFFF', borderWidth: 1.5, borderColor: '#DDE5F0', padding: 14, borderRadius: 12, marginBottom: 14, fontSize: 16, color: '#1A2B3D', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 1 },
  button: { backgroundColor: '#0B63D6', padding: 14, borderRadius: 12, alignItems: 'center', marginTop: 6, shadowColor: '#0B63D6', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 5 },
  buttonText: { color: 'white', fontWeight: '700', fontSize: 16, letterSpacing: 0.3 },
  link: { color: '#4A5F7F', textAlign: 'center', marginTop: 16, fontSize: 13, fontWeight: '500' },
  linkBold: { color: '#0B63D6', fontWeight: '700' }
});