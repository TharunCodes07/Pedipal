import React, {useState} from 'react'
import {View, Text, Image, TextInput, TouchableOpacity, Alert} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {icons} from "../../constants";
import {Link, router} from "expo-router";
// import {signInWithEmailAndPassword} from "firebase/auth"
// import {collection, query, where, getDocs} from "firebase/firestore"
// import {auth, db} from "../../utility/firebaseConfig"
import Loader from "../../components/Loader";

const Login = () => {
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false);
    const [form, setForm]= useState({email: "", password: ""})


    

    return (
        <SafeAreaView className="bg-primary h-full w-full justify-center px-3">
            {loading &&
                <Loader/>
            }

            <View className="w-full justify-center items-center mt-7">
                <Text className="text-2xl font-pbold text-secondary">Welcome</Text>
                <Text className="text-gray-200 text-lg">Login to get started</Text>
            </View>

            <View
                className=" mt-6 rounded-3xl border-2 border-[#E7E7E7] flex-row items-center w-full h-[56px] px-4">
                <Image
                    className="w-6 h-6 "
                    source={icons.phone}
                    resizeMode="contain"
                />
                <TextInput
                    onChangeText={(e)=>setForm({...form, phone: e})}
                    className="flex-1 font-pmedium ml-2"
                    placeholder="Phone number"
                    keyboardType="numeric"
                />
            </View>

            <View className="mt-6 rounded-3xl border-2 border-[#E7E7E7] flex-row items-center w-full h-[56px] px-4">
                <Image className="w-6 h-6" source={icons.lock} resizeMode="contain"/>
                <TextInput
                    onChangeText={(e)=>setForm({...form, password: e})}
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

            <TouchableOpacity
                onPress={handleLogin}
                className="bg-main mt-5 flex-row p-3 rounded-full items-center justify-center"
            >
                <Text className="ml-3 text-lg text-white items-center justify-center">Login</Text>
            </TouchableOpacity>

            <View className="w-full justify-end items-center pt-3 flex-row">
                <Text className="font-pregular text-gray-200">Don't have an account? </Text>
                <Link href="/Register" className="text-lg text-secondary mx-2">Register</Link>
            </View>
        </SafeAreaView>
    )
}
export default Login
