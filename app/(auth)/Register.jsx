import React, {useState} from "react";
import {Image, ScrollView, Text, TextInput, TouchableOpacity, View, Platform, Alert} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {icons} from "../../constants";
import DateTimePicker from "@react-native-community/datetimepicker";
import Checkbox from "expo-checkbox"
import {Link, router} from "expo-router";
// import {createUserWithEmailAndPassword, sendEmailVerification, updateProfile} from "firebase/auth"
// import {collection, query, where, getDocs, doc, setDoc} from "firebase/firestore"
// import {auth, db} from "../../utility/firebaseConfig"
import Loader from "../../components/Loader";


const Register = () => {
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false);
    const [form, setForm] = useState({
        email: "",
        password: "",
        UserName: "",
    })

    //Date picker
    // const onchange = (event, selectedDate) => {
    //     const currentDate = selectedDate || date
    //     setShowDateOfBirth(Platform.OS === "ios")
    //     setDate(currentDate)
    //     setForm({...form, dateOfBirth: currentDate.toLocaleDateString()})
    // }

    async function handleSubmit() {

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
            console.log(error.message)
            if(error.code === 'auth/email-already-in-use'){
                Alert.alert('Error', 'Email already used')
            }

        } finally {
            setLoading(false)
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

                {/* <View
                    className=" mt-6 rounded-3xl border-2 border-[#E7E7E7] flex-row items-center w-full h-[56px] px-4">
                    <Image
                        className="w-6 h-6 "
                        source={icons.phone}
                        resizeMode="contain"
                    />
                    <TextInput
                        onChangeText={(e) => setForm({...form, phone: e})}
                        className="flex-1 font-pmedium ml-2"
                        placeholder="Phone number"
                        keyboardType="numeric"
                    />
                </View> */}

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

                {/* <View
                    className=" mt-6 rounded-3xl border-2 border-[#E7E7E7] flex-row items-center w-full h-[56px] px-4">
                    <Image
                        className="w-6 h-6 "
                        source={icons.user}
                        resizeMode="contain"
                    />
                    <TextInput
                        onChangeText={(e) => setForm({...form, lastName: e})}
                        className="flex-1 font-pmedium ml-2"
                        placeholder="Last Name"
                    />
                </View> */}

                {/*Date picker field start*/}
                {/* <TouchableOpacity
                    onPress={() => setShowDateOfBirth(true)}
                    className=" mt-6 rounded-3xl border-2 border-[#E7E7E7] flex-row items-center w-full h-[56px] px-4">

                    <Image
                        resizeMode="contain"
                        className="w-6 h-6"
                        source={icons.calendar}/>

                    <Text className="flex-1 text-gray-300 ml-2">
                        {date.toLocaleDateString()} Date Of Birth
                    </Text>
                </TouchableOpacity>
                {showDateOfBirth && (
                    <DateTimePicker
                        mode="date"
                        value={date}
                        display="default"
                        onChange={onchange}
                    />
                )} */}

                {/* <View className="flex-row items-center w-full h-[56px] px-4">
                    <Checkbox value={checked} onValueChange={ToggleTerms}/>
                    <Text className="ml-3">I agree to the terms and conditions</Text>
                </View> */}

                <TouchableOpacity
                    onPress={handleSubmit}
                    className="bg-main mt-5 flex-row p-3 rounded-full items-center justify-center"
                >
                    <Text className="ml-3 text-lg text-white items-center justify-center">Submit</Text>
                </TouchableOpacity>

                <View className="w-full justify-end items-center pt-3 flex-row">
                    <Text className="font-pregular text-gray-200">Already have an account? </Text>
                    <Link href="/Login" className="text-lg text-main mx-2">Login</Link>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

export default Register;
