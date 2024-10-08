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
        if (!validateInput()) return;

        setLoading(true);
            // Compress the image if it's specified
    // let compressedImageUri = profileImage;
    // if (profileImage) {
    //     const response = await ImageResizer.createResizedImage(profileImage, 800, 600, 'JPEG', 80);
    //     compressedImageUri = await response.uri; // Use the compressed image URI
    // }


        const customer = {
            ecnumber: "",	
            account_type: user1.accountType,	
            account_category: "",		
            signed_on: new Date().toISOString(),
            name: user1.name,	
            surname: user1.surname,			
            idnumber: user1.idnumber,		
            sex: "",		
            dob: "",		
            address: "",		
            house_number_and_street_name: "",		
            surbub: "",		
            city: "",			
            country: "",		
            lat_cordinates: "",		
            long_cordinates: "",		
            phone: user1.phone,			
            username: username,		
            email: userDetails.email,			
            password: userDetails.password,		
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
            creditstanding: "",			
            credit_bar_rule_exception: "",		
            membershipstatus: "",			
            defaultsubs: "",			
            sendmail: "",		
            sendsms: "",		 
            product_code: "",		
            cost_price: "",		
            selling_price: "",		
            payment_style: "",			
            bp_number: "",			
            vat_number: "",		
            // profilePic: compressedImageUri, // Include the profile image URI
        };

        try {
            const response = await fetch(`${APILINK}/customerdetails/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(customer),
            });

            const result = await response.json();
            console.log(result);

            if (response.ok) {
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