import React, { useEffect, useState } from "react";
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    ActivityIndicator,
    Alert,
    Image
} from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUser, faCamera } from '@fortawesome/free-solid-svg-icons';
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { API_URL } from "./config";
import ImageResizer from 'react-native-image-resizer';

const SignUpCustomer3 = () => {
    const [username, setUsername] = useState("");
    const [profileImage, setProfileImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [userDetails, setUserDetails] = useState(null);
    const [user1, setUser1] = useState(null);

    const navigation = useNavigation();

    const handleImagePick = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setProfileImage(result.assets[0].uri);
            console.log(result);
        }
    };

    const validateInput = () => {
        if (!username) {
            Toast.show({
                text1: "Validation Error",
                text2: "Please enter a username.",
                type: 'error',
                position: 'center',
                visibilityTime: 3000,
                autoHide: true,
            });
            return false;
        }

        if (!profileImage) {
            Toast.show({
                text1: "Validation Error",
                text2: "Please select a profile image.",
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
    useEffect(() => {
        const fetchData = async () => {
            const custData = await AsyncStorage.getItem("customerDetailsC0");
            const custDetails = JSON.parse(custData);
            setUser1(custDetails);
            console.log(custDetails);
            try {
                const cData = await AsyncStorage.getItem("userDetailsC2");
                if (cData) {
                    const custDetails2 = JSON.parse(cData);
                    setUserDetails(custDetails2);
                    console.log("Retrieved user details:", custDetails2);
                } else {
                    console.log("No user details found.");
                }
            } catch (error) {
                console.error("Error retrieving user details:", error);
            }
        };
        fetchData();
    }, []);

    const handleSignUp = async () => {
        // Validate input before proceeding
        if (!validateInput()) return;
    
        setLoading(true);
    
        // Create FormData to handle file uploads
        const formData = new FormData();
        formData.append('ecnumber', "");
        formData.append('account_type', user1.accountType);
        formData.append('account_category', "");
        formData.append('signed_on', new Date().toISOString());
        formData.append('name', user1.name);
        formData.append('surname', user1.surname);
        formData.append('idnumber', user1.idnumber);
        formData.append('sex', "");
        formData.append('dob', "");
        formData.append('address', "");
        formData.append('house_number_and_street_name', "");
        formData.append('surbub', "");
        formData.append('city', "");
        formData.append('country', "");
        formData.append('lat_cordinates', "");
        formData.append('long_cordinates', "");
        formData.append('phone', user1.phone);
        formData.append('username', username);
        formData.append('email', userDetails.email);
        formData.append('password', userDetails.password);
    
        // Check if profile image exists before appending
        if (profileImage) {
            formData.append('profilePic', {
                uri: profileImage.uri, // Ensure this points to the image's URI
                type: profileImage.type || 'image/jpeg', // Type is important for uploading
                name: profileImage.fileName || 'profile.jpg', // Name for the uploaded file
            });
        } else {
            console.warn("Profile image is not set.");
        }
    
        // Log the FormData for debugging
        // console.log("FormData contents:", Array.from(formData.entries())); 
    
        try {
            // First request to post customer details
            const response = await fetch(`${APILINK}/customerdetails/`, {
                method: 'POST',
                body: formData, // Do not set Content-Type, the browser will handle it automatically
            });
    
            const result = await response.json();
            console.log("Response from customer details:", result);
    
            if (response.ok) {
                // Prepare user object for the second request
                const user = {
                    role: user1.accountType,
                    username: username,
                    email: userDetails.email,
                    password: userDetails.password,
                    last_logged_account: "customer",
                    customerid: result.result.insertId,
                    status: "Offline",
                    driver_id: 0,
                };
    
                // Post to users table
                const userResp = await fetch(`${APILINK}/users/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json', // JSON request for the users table
                    },
                    body: JSON.stringify(user),
                });
    
                const res = await userResp.json();
                console.log("Response from user creation:", res);
    
                if (userResp.ok) {
                    Alert.alert("Success", result.message);
                    navigation.navigate("CustomerLogin");
                } else {
                    Alert.alert("Error", res.message || 'Failed to create user.');
                }
    
            } else {
                Alert.alert("Error", result.message || 'Failed to sign up.');
            }
    
        } catch (error) {
            console.error("Error:", error);
            Alert.alert("Error", "Failed to sign up. Please try again.");
        } finally {
            setLoading(false);
        }
    };
    
    

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.topBar}>
                <FontAwesomeIcon icon={faCamera} size={40} color="red" />
                <Text style={styles.appName}>Kwaunoda</Text>
            </View>
            <ScrollView>
                <View style={styles.formContainer}>
                    <TouchableOpacity style={styles.imagePicker} onPress={handleImagePick}>
                        {profileImage ? (
                            <Image source={{ uri: profileImage }} style={styles.profileImage} />
                        ) : (
                            <FontAwesomeIcon icon={faCamera} size={50} color="#ccc" />
                        )}
                    </TouchableOpacity>

                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Username"
                            value={username}
                            onChangeText={setUsername}
                        />
                    </View>

                    <TouchableOpacity style={styles.btnSignUp} onPress={handleSignUp}>
                        {loading ? (
                            <ActivityIndicator size="small" color="black" />
                        ) : (
                            <Text style={styles.txtSignUp}>Sign Up</Text>
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
    imagePicker: {
        height: 150,
        width: 150,
        borderRadius: 75,
        backgroundColor: "#f0f0f0",
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "center",
        marginBottom: 20,
    },
    profileImage: {
        height: "100%",
        width: "100%",
        borderRadius: 75,
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

export default SignUpCustomer3;