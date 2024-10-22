import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LoadingDots from './LoadingDots';

enum Role {
    User,
    Bot
}

type Chat = {
    role: Role,
    text: string
}

const Chatbot = () => {
    const [chats, setChats] = useState<Chat[]>([{ role: Role.Bot, text: "Hello! How can I help you?" }]);
    const [text, setText] = useState('');
    const [waitingForBot, setWaitingForBot] = useState(false);
    const [username, setUsername] = useState('User');
    const scrollViewRef = useRef<ScrollView>(null);

    useEffect(() => {
        const fetchUsername = async () => {
            try {
                const storedUsername = await AsyncStorage.getItem('username');
                if (storedUsername) {
                    setUsername(storedUsername);
                }
            } catch (error) {
                console.error('Failed to fetch username from AsyncStorage', error);
            }
        };

        fetchUsername();
    }, []);

    const fetchData = async () => {
        const calculateAge = (birthday) => {
            const today = new Date();
            const birthDate = new Date(birthday);
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDifference = today.getMonth() - birthDate.getMonth();
            if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            return age;
        };
        const query_text = chats[chats.length - 1].text;
        const response = await fetch('http://192.168.222.222:8004/query', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ query: query_text })
        });
        const data = await response.json();
        return data.response;
    };

    const userResponse = (text: string) => {
        setChats(prevChats => [...prevChats, { role: Role.User, text: text }]);
    };

    const botResponse = (text: string) => {
        setChats(prevChats => [...prevChats, { role: Role.Bot, text: text }]);
    };

    const onSend = async () => {
        if (!text) return;
        userResponse(text);
        setWaitingForBot(true);
        setText('');
    };

    useEffect(() => {
        const handleBotResponse = async () => {
            if (waitingForBot) {
                const data = await fetchData();
                botResponse(data);
                setWaitingForBot(false);
            }
        };

        handleBotResponse();
    }, [waitingForBot]);

    useEffect(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
    }, [chats]);

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar translucent backgroundColor="transparent" />
            <LinearGradient
                colors={['#FF69B4', '#FFB6C1', '#FFC0CB']}
                style={styles.container}
            >
                <View style={styles.header}>
                    <Text style={styles.headerText}>Hello, {username}</Text>
                </View>
                <ScrollView
                    ref={scrollViewRef}
                    contentContainerStyle={styles.scrollView}
                    keyboardShouldPersistTaps="handled"
                >
                    {chats.map((chat, index) => (
                        <View key={index} style={[styles.chatRow, chat.role === Role.User ? styles.userChat : styles.botChat]}>
                            <View style={styles.chatBubble}>
                                <Text style={styles.chatText}>{chat.text}</Text>
                            </View>
                        </View>
                    ))}
                </ScrollView>

                {waitingForBot && <LoadingDots />}

                <View style={styles.inputContainer}>
                    <TextInput
                        value={text}
                        onChangeText={(text) => { setText(text) }}
                        style={styles.textInput}
                        placeholder="Type your message..."
                        placeholderTextColor="#999"
                    />
                    <TouchableOpacity onPress={onSend} style={styles.sendButton}>
                        <Ionicons name="send" size={24} color="white" />
                    </TouchableOpacity>
                </View>
            </LinearGradient>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FF69B4',
    },
    container: {
        flex: 1,
    },
    header: {
        paddingTop: 40,
        paddingBottom: 20,
        paddingHorizontal: 20,
        alignItems: 'flex-start',
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        textShadowColor: 'rgba(0, 0, 0, 0.2)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    scrollView: {
        paddingVertical: 20,
        paddingHorizontal: 10,
    },
    chatRow: {
        flexDirection: 'row',
        marginVertical: 5,
    },
    userChat: {
        justifyContent: 'flex-end',
    },
    botChat: {
        justifyContent: 'flex-start',
    },
    chatBubble: {
        padding: 10,
        borderRadius: 15,
        maxWidth: '80%',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
    },
    chatText: {
        fontSize: 16,
        color: '#333',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
        paddingBottom: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderTopWidth: 1,
        borderTopColor: '#ccc',
    },
    textInput: {
        backgroundColor: '#fff',
        height: 45,
        borderRadius: 20,
        paddingHorizontal: 15,
        flexGrow: 1,
        marginRight: 10,
        color: '#333',
    },
    sendButton: {
        backgroundColor: '#FF69B4',
        borderRadius: 20,
        paddingVertical: 8,
        paddingHorizontal: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default Chatbot;
