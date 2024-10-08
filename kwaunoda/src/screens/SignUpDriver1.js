import React, { useState } from "react";
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    ActivityIndicator,
    Alert
} from "react-native";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { API_URL } from "./config";
import { useTransition } from "react";

const SignUpDriver1 = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [passwordMatch, setPasswordMatch] = useState(true);
    const [username, setUsername] = useState("");

    const navigation = useNavigation();

    const validateInput = () => {
        if (!email || !password || !confirmPassword || !username) {
            Toast.show({
                text1: "Validation Error",
                text2: "Please fill all fields.",
                type: 'error',
                position: 'center',
                visibilityTime: 3000,
                autoHide: true,
            });
            return false;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            Toast.show({
                text1: "Validation Error",
                text2: "Please enter a valid email address.",
                type: 'error',
                position: 'center',
                visibilityTime: 3000,
                autoHide: true,
            });
            return false;
        }

        // Password strength check
        if (password.length < 8) {
            Toast.show({
                text1: "Validation Error",
                text2: "Password must be at least 8 characters long.",
                type: 'error',
                position: 'center',
                visibilityTime: 3000,
                autoHide: true,
            });
            return false;
        }

        if (password !== confirmPassword) {
            Toast.show({
                text1: "Validation Error",
                text2: "Passwords do not match.",
                type: 'error',
                position: 'center',
                visibilityTime: 3000,
                autoHide: true,
            });
            return false;
        }

        return true;
    };

    const checkPasswordStrength = (password) => {
        let strength = 0;
        const regexWeak = /[a-z]/;
        const regexMedium = /[A-Z]/;
        const regexStrong = /\d/;

        if (regexWeak.test(password)) strength++;
        if (regexMedium.test(password)) strength++;
        if (regexStrong.test(password)) strength++;
        if (password.length >= 12) strength++; // Extra point for length

        setPasswordStrength(strength);
        setPasswordMatch(password === confirmPassword);
    };

    const handleNext = async () => {
        if (!validateInput()) return;

        const APILINK = API_URL;
        setLoading(true);

        try {

            const driveData = await AsyncStorage.getItem('driverDetailsD0');
            const driverDetails = JSON.parse(driveData);
            const utype = "driver";


            const driver = {
                ecnumber: "",
                account_type: utype,
                signed_on: new Date().toISOString(),
                username: username,
                name: driverDetails.name,
                surname: driverDetails.surname,
                idnumber: driverDetails.idnumber,
                sex: "",
                dob: "",
                address: "",
                house_number_and_street_name: "",
                surbub: "",
                city: "",
                country: "",
                lat_cordinates: "",
                long_cordinates: "",
                phone: driverDetails.phone,
                plate: driverDetails.plate,
                email: email,
                password: password,
                employer: "",
                workindustry: "",
                workaddress: "",
                workphone: "",
                workphone2: "",
                nok1name: "",
                nok1surname: "",
                nok1relationship: "",
                nok1phone: "",
                nok2name: "",
                nok2surname: "",
                nok2relationship: "",
                nok2phone: "",
                rating: "",
                credit_bar_rule_exception: "",
                membershipstatus: "",
                defaultsubs: "",
                sendmail: "",
                sendsms: "",
                product_code: "",
                cost_price: "",
                selling_price: "",
                payment_style: "",
                profilePic: ""
            };


            //posting to the drivers table 
            const resp = await fetch(`${APILINK}/driver/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(driver),
            });

            const result = await resp.json();
            console.log(result);
            console.log(result.result.insertId);


            
            if (resp.ok) {
                console.log(password)
                const user = {
                    role: utype,
                    username: username,
                    email: email,
                    password: password,
                    last_logged_account: "driver",
                    customerid: 0,
                    status: "Offline",
                    driver_id: result.result.insertId
                };

                console.log(user.password);
                console.log(user);
                
                //posting to the users table
                const userResp = await fetch(`${APILINK}/users/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(user),
                });

                const res = await userResp.json();
                console.log(res);

                if(userResp.ok){
                    console.log("meowwwww")
                    Alert.alert("Success", result.message);
                    navigation.navigate("CustomerLogin");
                }else{
                    Alert.alert("Error", result.message);
                }

            } else {
                Alert.alert("Error", result.message);
            }

        } catch (error) {
            console.error("Error:", error);
            Alert.alert("Error", "Failed to save details. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.topBar}>
                <FontAwesomeIcon icon={faMapMarkerAlt} size={40} color="red" />
                <Text style={styles.appName}>Kwaunoda</Text>
            </View>
            <ScrollView>
                <View style={styles.formContainer}>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Username"
                            value={username}
                            onChangeText={setUsername}
                            keyboardType="default"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Email"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Password"
                            value={password}
                            onChangeText={(text) => {
                                setPassword(text);
                                checkPasswordStrength(text);
                            }}
                            secureTextEntry
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChangeText={(text) => {
                                setConfirmPassword(text);
                                setPasswordMatch(text === password);
                            }}
                            secureTextEntry
                        />
                    </View>

                    <View style={styles.strengthContainer}>
                        <View style={[styles.strengthBar, passwordStrength >= 1 && styles.weak]} />
                        <View style={[styles.strengthBar, passwordStrength >= 2 && styles.medium]} />
                        <View style={[styles.strengthBar, passwordStrength >= 3 && styles.strong]} />
                    </View>
                    <Text style={styles.strengthText}>
                        {passwordStrength === 0 ? "" : passwordStrength === 1 ? "Weak" : passwordStrength === 2 ? "Medium" : "Strong"}
                    </Text>
                    {!passwordMatch && <Text style={styles.errorText}>Passwords do not match.</Text>}

                    <TouchableOpacity style={styles.btnNext} onPress={handleNext}>
                        {loading ? (
                            <ActivityIndicator size="small" color="black" />
                        ) : (
                            <Text style={styles.txtNext}>Next</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </ScrollView>
            <Toast/>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    topBar: {
        height: "25%",
        backgroundColor: "#FFC000",
        borderBottomLeftRadius: 45,
        borderBottomRightRadius: 45,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 20,
    },
    appName: {
        fontSize: 20,
        fontWeight: "bold",
        color: "black",
        marginLeft: 10,
    },
    formContainer: {
        flex: 1,
        padding: 20,
        justifyContent: "center",
    },
    inputContainer: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 10,
        marginBottom: 15,
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        paddingHorizontal: 10,
    },
    input: {
        height: 40,
        padding: 10,
    },
    strengthContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    strengthBar: {
        flex: 1,
        height: 10,
        marginHorizontal: 2,
        backgroundColor: "#e0e0e0",
        borderRadius: 5,
    },
    weak: {
        backgroundColor: "red",
    },
    medium: {
        backgroundColor: "orange",
    },
    strong: {
        backgroundColor: "green",
    },
    strengthText: {
        alignSelf: 'center',
        fontWeight: 'bold',
        marginBottom: 5,
    },
    errorText: {
        color: 'red',
        alignSelf: 'center',
        marginBottom: 10,
    },
    btnNext: {
        backgroundColor: "#FFC000",
        borderRadius: 50,
        padding: 14,
        width: "100%",
        alignItems: "center",
    },
    txtNext: {
        color: "black",
        fontSize: 13,
        fontWeight: "bold",
    },
});

export default SignUpDriver1;