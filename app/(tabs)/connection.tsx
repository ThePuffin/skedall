import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { translateWord } from '@/utils/utils';
import { Icon } from '@rneui/themed';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

// Firebase Auth tools import
import { deleteUser, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';

// Firestore database tools import
import { deleteDoc, doc, serverTimestamp, setDoc } from 'firebase/firestore';

// Import both auth AND db from your config file
import { auth, db } from '../../utils/firebaseConfig';

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

      // Store or update user profile in Firestore
      const userRef = doc(db, 'users', user.uid);

      await setDoc(
        userRef,
        {
          uid: user.uid,
          name: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          lastLogin: serverTimestamp(),
        },
        { merge: true },
      );

      console.log('User data successfully synced with Firestore');
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

  // Function to permanently delete the user account and data
  const handleDeleteAccount = async () => {
    const user = auth.currentUser;

    if (!user) {
      alert('No user currently logged in.');
      return;
    }

    const confirmDeletion = window.confirm(
      'Are you sure you want to permanently delete your account and all associated data? This action cannot be undone.',
    );

    if (!confirmDeletion) return;

    try {
      console.log('Starting account deletion process...');

      // 1. Delete user document from Firestore
      const userRef = doc(db, 'users', user.uid);
      await deleteDoc(userRef);
      console.log('User document successfully deleted from Firestore');

      // 2. Delete user from Firebase Authentication
      await deleteUser(user);
      console.log('User authentication account permanently deleted');

      alert('Your account has been successfully deleted.');
    } catch (error) {
      console.error('Error during account deletion:', error);

      if (error.code === 'auth/requires-recent-login') {
        alert('For security reasons, please log out and log back in before deleting your account.');
      } else {
        alert('Deletion error: ' + error.message);
      }
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <TouchableOpacity style={styles.googleButton} onPress={handleGoogleLogin}>
          <Icon name="google" type="font-awesome" size={20} color="#fff" style={styles.googleIcon} />
          <ThemedText style={styles.buttonText}>{translateWord('signInWithGoogle')}</ThemedText>
        </TouchableOpacity>

        <br />

        <TouchableOpacity style={[styles.googleButton, styles.googleButtonDisconnect]} onPress={handleGoogleLogout}>
          <Icon name="google" type="font-awesome" size={20} color="#fff" style={styles.googleIcon} />
          <ThemedText style={styles.buttonText}>{translateWord('signOut')}</ThemedText>
        </TouchableOpacity>

        <br />

        <TouchableOpacity style={[styles.googleButton, styles.googleButtonDelete]} onPress={handleDeleteAccount}>
          <Icon name="trash" type="font-awesome" size={20} color="#fff" style={styles.googleIcon} />
          <ThemedText style={styles.buttonText}>Delete Account</ThemedText>
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

    justifyContent: 'center',
    backgroundColor: '#4285F4',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    elevation: 3,

    width: 280,
  },
  googleButtonDisconnect: {
    backgroundColor: '#DB4437',
  },
  googleButtonDelete: {
    backgroundColor: '#222222',
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
