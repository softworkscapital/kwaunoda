import React, { useState } from "react";
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    Alert,
} from "react-native";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEnvelope, faLock, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { API_URL } from "./config";
import MD5 from 'crypto-js/md5';

const CustomerLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    
    const navigation = useNavigation();

    const redirectSignUpCustomer = async () => {
        navigation.navigate("SignUpCustomer");
    };

    const redirectSignUpDriver = async () => {
        navigation.navigate("SignUpDriver");
    };
    
    const redirectHome = (type) => {
        if (type === "driver") {
            navigation.navigate("HomeDriver");
        } else if (type === "customer") {
            navigation.navigate("Home");
        } else {
            Toast.show({
                text1: "Please Input the Correct Data",
                type: 'error',
                position: 'center',
                visibilityTime: 3000,
                autoHide: true,
            });
        }
    };

    const validateInput = () => {
        if (!email || !password) {
            Toast.show({
                text1: "Validation Error",
                text2: "Please fill in both email and password.",
                type: 'error',
                position: 'center',
                visibilityTime: 3000,
                autoHide: true,
            });
            return false;
        }
        return true;
    };

    const APILINK = API_URL;
    // const theDriver = async() => {
    //     try {
    //         if (!validateInput()) return;
    //             const response = await fetch(`${APILINK}/driver/login/${email}`, {
    //                 method: 'GET', // Use GET for login
    //                 headers: {
    //                     'Content-Type': 'application/json',
    //                 },    
    //             });
            
    //             const result = await response.json();
    //             console.log('Full response:', result); 
    
    //             // Check if the response indicates success
    //             if (response.ok) {

    //             } else {
    //                 Alert.alert("Error", result.message || "No driver found or wrong password/email.");
    //             }
    //     } catch (error) {
    //         console.log("Mdara Honai", error);
    //     }
    // }

    const theLogin= async () => {
        try {
            if (!validateInput()) return;
    
            const response = await fetch(`${APILINK}/users/${email}/${password}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            const result = await response.json();
            console.log('response:', result);
    
            // Checking for success
            if (response.ok && result.length > 0) {

                const ids = {
                    driver_id: result[0].driver_id,
                    customerid: result[0].customerid,
                    last_logged_account: result[0].last_logged_account,
                }

                console.log("ma Id aya", ids);
                await AsyncStorage.setItem('theIds', JSON.stringify(ids));
                Alert.alert("Success", result.message);
                redirectHome(result[0].last_logged_account); 
                console.log(result[0].role);
            }else{
                Alert.alert("Error No user found or wrong password/email.");
            }
        } catch (error) {
            console.log("Error during customer login:", error);
            Toast.show({
                text1: "Error",
                text2: "An error occurred. Please try again.",
                type: 'error',
                position: 'center',
                visibilityTime: 3000,
                autoHide: true,
            });
        }
    };

    const handleSignIn = async () => {
        if (!validateInput()) return; // Validate input before proceeding
    
        try {
            // await theDriver();
            await theLogin(); // Attempt driver login first
        } catch (error) {
            console.error("Error in driver login:", error);
            await theCust(); // If driver login fails, try customer login
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
                    <View>
                        <Text style={{ alignSelf: 'center', fontSize: 16, marginBottom: 10, marginTop: 20 }}>Please Login</Text>
                    </View>

                    <View style={styles.inputContainer}>
                        <FontAwesomeIcon icon={faEnvelope} size={12} style={styles.icon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Email"
                            value={email}
                            onChangeText={setEmail}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <FontAwesomeIcon icon={faLock} size={12} style={styles.icon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Password"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />
                    </View>

                    <View>
                        <Text>Remember me</Text>
                    </View>

                    <TouchableOpacity style={[styles.btnSignUp, { marginTop: 50 }]} onPress={handleSignIn}>
                        <Text style={styles.txtSignUp}>Sign In</Text>
                    </TouchableOpacity>

                    <View style={{ alignItems: 'center', marginTop: 4 }}>
                        <Text>Forget Password</Text>
                    </View>
                </View>
            </ScrollView>
            <View style={{ bottom: 0, marginBottom: 10 }}>
                <Text style={{ alignSelf: 'center' }}>
                    Create account <Text style={{ color: '#FFC000' }} onPress={redirectSignUpCustomer}>As Customer</Text> | <Text style={{ color: '#FFC000' }} onPress={redirectSignUpDriver}>As Driver</Text>
                </Text>
            </View>
            <Toast />
        </SafeAreaView>
    );
}

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
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        padding: 5,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 10,
        marginBottom: 15,
        backgroundColor: "rgba(255, 255, 255, 0.8)",
    },
    icon: {
        marginRight: 15,
        marginLeft: 10
    },
    input: {
        flex: 1,
    },
    btnSignUp: {
        backgroundColor: "#FFC000",
        borderRadius: 50,
        padding: 14,
        width: "100%",
        alignItems: "center",
    },
    txtSignUp: {
        color: "black",
        fontSize: 13,
        fontWeight: "bold",
    },
});

export default CustomerLogin;