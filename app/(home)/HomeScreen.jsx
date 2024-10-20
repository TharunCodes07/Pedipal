import React, { useState, useEffect } from 'react';
import {router} from 'expo-router';
import { View, Text, TouchableOpacity, StyleSheet, Modal, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';

const HomeScreen = () => {
  const navigation = useNavigation();
  const [isProfileModalVisible, setProfileModalVisible] = useState(false);
  const [username, setUsername] = useState('John Doe');
  const [email, setEmail] = useState('john@example.com');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUsername = await AsyncStorage.getItem('username');
        const storedEmail = await AsyncStorage.getItem('email');
        if (storedUsername) setUsername(storedUsername);
        if (storedEmail) setEmail(storedEmail);
      } catch (error) {
        console.error('Failed to fetch user data from AsyncStorage', error);
      }
    };

    fetchUserData();
  }, []);

  const blocks = [
    { title: 'Chat Bot', icon: 'chatbubble-ellipses', screen: '/Chatbot' },
    { title: 'Food', icon: 'restaurant', screen: '/Food' },
    { title: 'Graph', icon: 'stats-chart', screen: '/graph' },
    { title: 'Camera', icon: 'camera', screen: '/Camera' },
  ];

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('username');
      await AsyncStorage.removeItem('email');
      await AsyncStorage.removeItem('isLoggedIn');
      console.log('Logging out...');
      setProfileModalVisible(false);
      router.replace('/Login'); 
    } catch (error) {
      console.error('Failed to logout', error);
    }
  };

  return (
    <>
      <StatusBar translucent backgroundColor="transparent" />
      <SafeAreaView style={styles.safeArea}>
        <LinearGradient
          colors={['#FF69B4', '#FFB6C1', '#FFC0CB']}
          style={styles.container}
        >
          <TouchableOpacity 
            style={styles.profileIcon} 
            onPress={() => setProfileModalVisible(true)}
          >
            <Ionicons name="person-circle" size={40} color="white" />
          </TouchableOpacity>
          <View style={styles.contentContainer}>
            <Text style={styles.welcomeText}>Welcome, {username}</Text>
            <View style={styles.blocksContainer}>
              {blocks.map((block, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.block}
                  onPress={() => router.push(block.screen)}
                >
                  <LinearGradient
                    colors={['rgba(255,255,255,0.8)', 'rgba(255,255,255,0.6)']}
                    style={styles.blockGradient}
                  >
                    <Ionicons name={block.icon} size={40} color="#FF69B4" />
                    <Text style={styles.blockText}>{block.title}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <Modal
            animationType="slide"
            transparent={true}
            visible={isProfileModalVisible}
            onRequestClose={() => setProfileModalVisible(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setProfileModalVisible(false)}
                >
                  <Ionicons name="close" size={24} color="#FF69B4" />
                </TouchableOpacity>
                <Text style={styles.modalTitle}>Profile</Text>
                <Text style={styles.modalText}>Username: {username}</Text>
                <Text style={styles.modalText}>Email: {email}</Text>
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                  <Text style={styles.logoutButtonText}>Logout</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </LinearGradient>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FF69B4', // Match the start color of your gradient
  },
  container: {
    flex: 1,
    padding: 20,
  },
  profileIcon: {
    position: 'absolute',
    top: 10, // Adjusted from 20 to 10
    right: 20,
    zIndex: 1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    marginBottom: 30,
    textAlign: 'center',
  },
  blocksContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '100%',
    maxWidth: 400,
  },
  block: {
    width: '45%',
    aspectRatio: 1,
    margin: '2.5%',
    borderRadius: 15,
    overflow: 'hidden',
  },
  blockGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  blockText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF1493',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    width: '100%',
    maxHeight: '50%',
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 10,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF69B4',
    marginBottom: 20,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 10,
    color: '#333',
  },
  logoutButton: {
    backgroundColor: '#FF69B4',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
