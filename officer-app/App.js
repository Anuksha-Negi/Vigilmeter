import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, ActivityIndicator
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// IMPORTANT: apna laptop ka local IP yahan daalna hai (localhost nahi chalega phone se)
   const API_URL = 'http://192.168.0.249:5000';

export default function App() {
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [officer, setOfficer] = useState(null);

  const handleLogin = async () => {
    if (!employeeId || !password) {
      Alert.alert('Error', 'Please enter both Employee ID and Password');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/api/officer/login`, {
        employee_id: employeeId,
        password: password,
      });
      const { token, officer } = response.data;
      await AsyncStorage.setItem('officerToken', token);
      setOfficer(officer);
      Alert.alert('Success', `Welcome, ${officer.name}!`);
    } catch (err) {
      Alert.alert('Login Failed', err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (officer) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Welcome, {officer.name}</Text>
        <Text style={styles.subtitle}>Employee ID: {officer.employee_id}</Text>
        <Text style={styles.subtitle}>Area: {officer.assigned_area}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>VigilMeter</Text>
      <Text style={styles.subtitle}>Officer Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Employee ID (e.g. OFF001)"
        value={employeeId}
        onChangeText={setEmployeeId}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Login</Text>}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#F5F8FC' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#0B1F3A', marginBottom: 4, textAlign: 'center' },
  subtitle: { fontSize: 14, color: '#5B6B7C', marginBottom: 24, textAlign: 'center' },
  input: {
    borderWidth: 1, borderColor: '#E3EAF2', borderRadius: 8,
    padding: 14, marginBottom: 14, fontSize: 16, backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#0B1F3A', padding: 15, borderRadius: 8,
    alignItems: 'center', marginTop: 10,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});