import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function ConnectionScreen() {
  const handleGoogleLogin = () => {
    // TODO: Implémenter la logique de connexion Google
    console.log('Google Login requested');
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <ThemedText>
          <h3>Work in progress ...</h3>
        </ThemedText>
        {/* <TouchableOpacity style={styles.googleButton} onPress={handleGoogleLogin}>
          <Icon name="google" size={20} color="#fff" style={styles.googleIcon} />
          <ThemedText style={styles.buttonText}>{translateWord('signInWithGoogle')}</ThemedText>
        </TouchableOpacity>

        <br />

        <TouchableOpacity
          style={[styles.googleButton, styles.googleButtonDisconnect]}
          onPress={() => console.log('signout requested')}
        >
          <Icon name="google" size={20} color="#fff" style={styles.googleIcon} />
          <ThemedText style={styles.buttonText}>{translateWord('signOut')}</ThemedText>
        </TouchableOpacity> */}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    marginBottom: 40,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4285F4',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
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
