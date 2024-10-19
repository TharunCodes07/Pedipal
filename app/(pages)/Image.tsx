import React, { useState } from 'react';
import { Button, Image, View, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { GoogleAIFileManager } from '@google/generative-ai/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { API_KEY } from 'react-native-dotenv'; // Import the API key from the .env file

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

        const fileManager = new GoogleAIFileManager(API_KEY);

        // Upload the file to Google Gemini
        const uploadResult = await fileManager.uploadFile(image, {
            mimeType: "image/jpeg",
            displayName: "Uploaded Image",
        });

        console.log(
            `Uploaded file ${uploadResult.file.displayName} as: ${uploadResult.file.uri}`
        );

        // Generate content based on the image
        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent([
            "Tell me about this image.",
            {
                fileData: {
                    fileUri: uploadResult.file.uri,
                    mimeType: uploadResult.file.mimeType,
                },
            },
        ]);

        console.log(result.response.text());
        setResponse(result.response.text()); // Display the AI response
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
