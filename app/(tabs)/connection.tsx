import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { translateWord } from '@/utils/utils';
import { Icon } from '@rneui/themed';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

// 1. Firebase Auth tools import
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
// 2. Config file import (adjust path if necessary)
import { auth } from '../../utils/firebaseConfig';

export default function ConnectionScreen() {
  // Function to log in with Google
  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      console.log('Attempting Google login...');
      const result = await signInWithPopup(auth, provider);

      // Retrieve user information
      const user = result.user;
      console.log('User logged in successfully:', user.displayName, user.email);

      alert(`Welcome ${user.displayName}!`);
    } catch (error) {
      console.error('Error during Google login:', error);
      alert('Connection error: ' + error.message);
    }
  };

  // Function to log out
  const handleGoogleLogout = async () => {
    try {
      await signOut(auth);
      console.log('User logged out');
      alert('You have been logged out.');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <ThemedText>
          <h3>Authentification</h3>
        </ThemedText>
        <TouchableOpacity style={styles.googleButton} onPress={handleGoogleLogin}>
          <Icon name="google" type="font-awesome" size={20} color="#fff" style={styles.googleIcon} />
          <ThemedText style={styles.buttonText}>{translateWord('signInWithGoogle')}</ThemedText>
        </TouchableOpacity>

        <br />

        <TouchableOpacity style={[styles.googleButton, styles.googleButtonDisconnect]} onPress={handleGoogleLogout}>
          <Icon name="google" type="font-awesome" size={20} color="#fff" style={styles.googleIcon} />
          <ThemedText style={styles.buttonText}>{translateWord('signOut')}</ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4285F4',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    elevation: 3,
  },
  googleButtonDisconnect: {
    backgroundColor: '#DB4437',
  },
  googleIcon: {
    marginRight: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
