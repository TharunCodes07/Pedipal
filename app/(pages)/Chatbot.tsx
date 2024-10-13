import React, { useEffect } from 'react';
import { TouchableOpacity, StatusBar, ScrollView, SafeAreaView,Platform, Text, TextInput, View, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

enum Role {
    User,
    Bot
}

type Chat = {
    role: Role,
    text: string
}

const Chatbot = () => {
    const [chats, setChats] = React.useState<Chat[]>([{ role: Role.Bot, text: "Hello! How can I help you?" }]);
    const [text, setText] = React.useState('');
    const [waitingForBot, setWaitingForBot] = React.useState(false); // to prevent multiple bot responses

    const fetchData = async () => {
        const response = await fetch('http://127.0.0.1:8001/query', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ query: text })
        });
        const data = await response.json();
        return data.message;
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
        setText(''); // Clear input after sending
    };

    useEffect(() => {
        const handleBotResponse = async () => {
            if (waitingForBot) {
                const data = await fetchData();
                botResponse(data);
                setWaitingForBot(false); // reset the flag
            }
        };

        handleBotResponse();
    }, [waitingForBot]);

    return (
        <SafeAreaView style ={styles.container}>
        <View style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scrollView}
                scrollsToTop={false}
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

            <View style={styles.inputContainer}>
                <TextInput
                    value={text}
                    onChangeText={(text) => { setText(text) }}
                    style={styles.textInput}
                    placeholder="Type your message..."
                />
                <TouchableOpacity onPress={onSend} style={styles.sendButton}>
                    <Ionicons name="send" size={24} color="white" />
                </TouchableOpacity>
            </View>
        </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: StatusBar.currentHeight || 0,

    },
    scrollView: {
        paddingBottom: 10,
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
        backgroundColor: '#007BFF', // Change to your desired color
        padding: 10,
        borderRadius: 5,
        maxWidth: '80%',
    },
    chatText: {
        color: 'white',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
        paddingBottom: 10,
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderTopColor: '#ccc',
    },
    textInput: {
        backgroundColor: '#f0f0f0',
        height: 45,
        borderRadius: 20,
        paddingHorizontal: 15,
        flexGrow: 1,
        marginRight: 10,
    },
    sendButton: {
        backgroundColor: '#007BFF', // Change to your desired color
        borderRadius: 20,
        paddingVertical: 8,
        paddingHorizontal: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default Chatbot;