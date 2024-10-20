import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { Camera as ExpoCamera } from 'expo-camera';
import Loader from '../../components/Loader';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImageManipulator from 'expo-image-manipulator';

let API_KEY = "AIzaSyA-vL2SijziXK8aaXJanpPKddtKMChL7aQ";

const Camera = () => {
  const [image, setImage] = useState(null);
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const resizeImage = async (uri, targetSizeInBits) => {
    let width = 1080;
    let compressionQuality = 0.5;
    let resizedImage;
    
    while (true) {
      resizedImage = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: width } }],
        { compress: compressionQuality, format: ImageManipulator.SaveFormat.JPEG }
      );
      
      const fileInfo = await FileSystem.getInfoAsync(resizedImage.uri, { size: true });
      const fileSizeInBits = fileInfo.size * 8;
      
      if (fileSizeInBits <= targetSizeInBits) {
        break;
      }
      
      if (compressionQuality > 0.1) {
        compressionQuality -= 0.1;
      } else if (width > 300) {
        width -= 100;
        compressionQuality = 0.7;
      } else {
        console.warn("Couldn't reduce image to target size");
        break;
      }
    }
    
    return resizedImage.uri;
  };

  const openCamera = async () => {
    const { status } = await ExpoCamera.requestCameraPermissionsAsync();
    if (status === 'granted') {
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImage(result.assets[0].uri);
      }
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  const uploadAndGenerateContent = async () => {
    if (!image) {
      alert('Please select or take an image first!');
      return;
    }
    setLoading(true);
    try {
      // Resize the image to 4.9 megabits
      const targetSizeInBits = 4.9 * 1024 * 1024; // 4.9 megabits
      const resizedImageUri = await resizeImage(image, targetSizeInBits);

      let base64Image = await FileSystem.readAsStringAsync(resizedImageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Log the final image size
      const finalFileInfo = await FileSystem.getInfoAsync(resizedImageUri, { size: true });
      console.log(`Final image size: ${finalFileInfo.size / 1024 / 1024} MB`);

      const backendUrl = 'http://192.168.40.222:3000/upload-and-generate';
      const response = await fetch(backendUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: base64Image, apiKey: API_KEY }),
      });

      const result = await response.json();
      setResponse(result.aiResponse);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload the image or generate content.');
    } finally {
      setLoading(false);
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
          {loading && (
            <View style={styles.loaderContainer}>
              <Loader />
            </View>
          )}
          <TouchableOpacity style={styles.cameraButton} onPress={openCamera}>
            <Ionicons name="camera" size={24} color="white" />
          </TouchableOpacity>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <Text style={styles.title}>Image Analysis</Text>
            <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage}>
              <Ionicons name="image" size={24} color="white" />
              <Text style={styles.buttonText}>Pick an image</Text>
            </TouchableOpacity>
            {image && (
              <View style={styles.imageContainer}>
                <Image source={{ uri: image }} style={styles.image} />
              </View>
            )}
            <TouchableOpacity 
              style={[styles.uploadButton, !image && styles.disabledButton]} 
              onPress={uploadAndGenerateContent}
              disabled={!image || loading}
            >
              <Ionicons name="cloud-upload" size={24} color="white" />
              <Text style={styles.buttonText}>Analyze Image</Text>
            </TouchableOpacity>
            {response && (
              <View style={styles.responseContainer}>
                <Text style={styles.responseTitle}>AI Analysis:</Text>
                <Text style={styles.responseText}>{response}</Text>
              </View>
            )}
          </ScrollView>
        </LinearGradient>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FF69B4',
  },
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight || 0,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  cameraButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 20,
    padding: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 30,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  imagePickerButton: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginBottom: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  imageContainer: {
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 20,
  },
  image: {
    width: 250,
    height: 250,
    borderRadius: 10,
  },
  uploadButton: {
    flexDirection: 'row',
    backgroundColor: '#FF1493',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginBottom: 20,
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
  responseContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 20,
    borderRadius: 10,
    width: '100%',
  },
  responseTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF1493',
    marginBottom: 10,
  },
  responseText: {
    fontSize: 16,
    color: '#333',
  },
});

export default Camera;
