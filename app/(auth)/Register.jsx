import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import axios from "axios";
import { Link, router } from "expo-router";
import React, { useState } from "react";
import { Alert, Image, Modal, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Loader from "../../components/Loader";
import { icons } from "../../constants";

const Register = () => {
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false);
    const [form, setForm] = useState({
        email: "",
        password: "",
        UserName: "",
    })

    const [modalVisible, setModalVisible] = useState(false);
    const [isPregnant, setIsPregnant] = useState(null);
    const [pregnancyDate, setPregnancyDate] = useState(new Date());
    const [childBirthday, setChildBirthday] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);


    async function handleRegistration() {
        if (!form.email || !form.password || !form.UserName ) {
            Alert.alert('Error', 'Please fill in all fields')
            return
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(form.email)) {
            Alert.alert('Error', 'Please enter a valid email address');
            return;
        }

        try {
            setLoading(true)
            //Check for unique phone number
            const usersCollection = collection(db, 'users')
            const q = query(usersCollection, where("displayName", "==", form.phone))
            const querySnapshot = await getDocs(q)

            if (!querySnapshot.empty) {
                Alert.alert('Error', 'Email number already exist')
                return
            }
            
            const cred = await createUserWithEmailAndPassword(auth, form.email, form.password)

            
            await updateProfile(cred.user, {displayName: form.phone})
            
            const userDocRef = doc(usersCollection, cred.user.uid)
            const docData = {
                displayName: form.phone,
                email: form.email,
                firstName: form.firstName,
                lastName: form.lastName,
                pin: "1234",
                image: "",
                address: "27th street New York",
                accountNumber: accountNumber,
                country: "",
                state: "",
                dateOfBirth: form.dateOfBirth,
                accountBalance: 1000,
                transactions: [],
                beneficiary: []
            }
            await setDoc(userDocRef, docData)

        } catch (error) {
            if(error.code === 'auth/email-already-in-use'){
                Alert.alert('Error', 'Email already used')
            }

        } finally {
            setLoading(false)
        }
    }

    const handleRegisterClick = () => {
        if (!form.email || !form.password || !form.UserName) {
            Alert.alert('Error', 'Please fill in all fields')
            return
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(form.email)) {
            Alert.alert('Error', 'Please enter a valid email address');
            return;
        }

        setModalVisible(true);
    }

    const handleDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || (isPregnant ? pregnancyDate : childBirthday);
        setShowDatePicker(Platform.OS === 'ios');
        if (isPregnant) {
            setPregnancyDate(currentDate);
        } else {
            setChildBirthday(currentDate);
        }
    };

    const handleModalSubmit = async () => {
        setModalVisible(false);
        try {
            const response = await axios.post('http://your-ip:8000/auth/register', {
                content_type: 'application/json',
                email: form.email,
                username: form.UserName,
                password: form.password,
                ispregnant: isPregnant,
                pregnancydate: isPregnant ? pregnancyDate.toISOString() : null,
                childbirthdate: !isPregnant ? childBirthday.toISOString() : null,
            });
            
            const graphResponse = await axios.post('http://your-ip:3000/register', {
                gmail: form.email
            });
            await AsyncStorage.setItem('dob', isPregnant ? pregnancyDate.toDateString() : childBirthday.toISOString());
            await AsyncStorage.setItem('pregnancy', isPregnant ? "true":"false");
            await AsyncStorage.setItem('username',form.UserName)
            Alert.alert('Success', 'Registration successful and taste graph created');
            router.replace('/Login');
        } catch (err) {
            console.error('Registration error:', err);
            const errorMessage = typeof err.response?.data?.detail === 'string'
                ? err.response.data.detail
                : err.message || 'Registration failed';
            Alert.alert('Error', errorMessage);
        } 
    }

    return (
        <SafeAreaView className="bg-primary h-full w-full justify-center ">
            {loading &&
                <Loader/>
            }
            <ScrollView
                showsVerticalScrollIndicator={false}
                className="mx-2 mb-2"
                contentContainerStyle={{minHeight: "100%", justifyContent: "center"}}
            >
                <View className="w-full justify-center items-center mt-7">
                    <Text className="text-2xl font-pbold text-main">Welcome</Text>
                    <Text className="text-gray-200 text-lg">Register to get started</Text>
                </View>

                <View
                    className=" mt-6 rounded-3xl border-2 border-[#E7E7E7] flex-row items-center w-full h-[56px] px-4">
                    <Image
                        className="w-6 h-6 "
                        source={icons.mail}
                        resizeMode="contain"
                    />
                    <TextInput
                        onChangeText={(e) => setForm({...form, email: e})}
                        className="flex-1 font-pmedium ml-2"
                        placeholder="Email address"
                        keyboardType="email-address"
                    />
                </View>

                <View className="mt-6 rounded-3xl border-2 border-[#E7E7E7] flex-row items-center w-full h-[56px] px-4">
                    <Image className="w-6 h-6" source={icons.lock} resizeMode="contain"/>
                    <TextInput
                        onChangeText={(e) => setForm({...form, password: e})}
                        className="flex-1 font-pmedium ml-2"
                        placeholder="Password"
                        keyboardType="default"
                        secureTextEntry={!showPassword}
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                        <Image
                            source={!showPassword ? icons.eye : icons.eyeHide}
                            className="w-6 h-6"
                            resizeMode="contain"
                        />
                    </TouchableOpacity>
                </View>

                <View
                    className=" mt-6 rounded-3xl border-2 border-[#E7E7E7] flex-row items-center w-full h-[56px] px-4">
                    <Image
                        className="w-6 h-6 "
                        source={icons.user}
                        resizeMode="contain"
                    />
                    <TextInput
                        onChangeText={(e) => setForm({...form, UserName: e})}
                        className="flex-1 font-pmedium ml-2"
                        placeholder="User Name"
                    />
                </View>

                <TouchableOpacity
                    onPress={handleRegisterClick}
                    className="bg-main mt-5 flex-row p-3 rounded-full items-center justify-center"
                >
                    <Text className="ml-3 text-lg text-white items-center justify-center">Register</Text>
                </TouchableOpacity>

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
                        <View className="bg-white p-6 rounded-2xl w-11/12 max-w-md">
                            <Text className="text-2xl font-bold text-main mb-6 text-center">
                                {isPregnant === null ? "Pregnancy Information" : (isPregnant ? "Pregnancy Date" : "Child's Birthday")}
                            </Text>

                            {isPregnant === null ? (
                                <>
                                    <Text className="text-lg mb-4 text-center">Are you pregnant?</Text>
                                    <View className="flex-row justify-around">
                                        <TouchableOpacity 
                                            onPress={() => setIsPregnant(true)} 
                                            className="bg-main py-3 px-6 rounded-full"
                                        >
                                            <Text className="text-white text-lg font-semibold">Yes</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity 
                                            onPress={() => setIsPregnant(false)} 
                                            className="bg-gray-300 py-3 px-6 rounded-full"
                                        >
                                            <Text className="text-gray-700 text-lg font-semibold">No</Text>
                                        </TouchableOpacity>
                                    </View>
                                </>
                            ) : (
                                <>
                                    <Text className="text-lg mb-4 text-center">
                                        {isPregnant ? "Select your pregnancy date" : "Select your child's birthday"}
                                    </Text>
                                    <TouchableOpacity 
                                        onPress={() => setShowDatePicker(true)} 
                                        className="bg-gray-100 p-4 rounded-lg mb-4"
                                    >
                                        <Text className="text-lg text-center text-gray-700">
                                            {isPregnant
                                                ? pregnancyDate.toLocaleDateString()
                                                : childBirthday.toLocaleDateString()}
                                        </Text>
                                    </TouchableOpacity>
                                    {showDatePicker && (
                                        <DateTimePicker
                                            value={isPregnant ? pregnancyDate : childBirthday}
                                            mode="date"
                                            display="default"
                                            onChange={handleDateChange}
                                        />
                                    )}
                                    <TouchableOpacity 
                                        onPress={handleModalSubmit} 
                                        className="bg-main py-3 px-6 rounded-full"
                                    >
                                        <Text className="text-white text-lg font-semibold text-center">Submit</Text>
                                    </TouchableOpacity>
                                </>
                            )}

                            <TouchableOpacity 
                                onPress={() => setModalVisible(false)}
                                className="absolute top-2 right-2 p-2"
                            >
                                <Text className="text-gray-500 text-xl">&times;</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

                <View className="w-full justify-end items-center pt-3 flex-row">
                    <Text className="font-pregular text-gray-200">Already have an account? </Text>
                    <Link href="/Login" className="text-lg text-main mx-2">Login</Link>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

export default Register;
