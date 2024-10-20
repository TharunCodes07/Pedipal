import Constants from 'expo-constants';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import { Button, Image, Text, View } from 'react-native';
import * as FileSystem from 'expo-file-system';

let API_KEY = "AIzaSyA-vL2SijziXK8aaXJanpPKddtKMChL7aQ";

export default function App() {
  const [image, setImage] = useState(null);
  const [response, setResponse] = useState(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
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
      alert('Please select an image first!');
      return;
    }
    let base64Image = await FileSystem.readAsStringAsync(image, {
    encoding: FileSystem.EncodingType.Base64,
  });

    const backendUrl = 'http://192.168.74.143:3000/upload-and-generate'; // Replace with your backend URL
    console.log("API_KEY", API_KEY);
    try {
      const response = await fetch(backendUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: base64Image, apiKey: API_KEY }),
      });

      const result = await response.json();
      console.log("result", result);
      setResponse(result.aiResponse);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload the image or generate content.');
    }
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button title="Pick an image from camera roll" onPress={pickImage} />
      {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
      <Button title="Upload Image to Gemini" onPress={uploadAndGenerateContent} />
      {response && <Text>AI Response: {response}</Text>}
    </View>
  );
}
