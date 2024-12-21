import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';

const Invite = () => {
    const navigation = useNavigation();
    const [phoneNumber, setPhoneNumber] = useState('');
    const hardcodedUserId = "AAA-100001"; // Hardcoded user ID

    const generatePromoCode = (userId) => {
        const randomLetters = Math.random().toString(36).substring(2, 6).toUpperCase(); 
        return `${randomLetters}${userId}`;
    };

    const sendInviteMessage = async () => {
        if (!phoneNumber) {
            Alert.alert("Error", "Please enter a valid phone number.");
            return;
        }

        try {
            console.log("Hardcoded User ID:", hardcodedUserId);

            const promoCode = generatePromoCode(hardcodedUserId);
            const message = `I am super excited to share an amazing new app with you! Use my promo code ${promoCode} to join EasyGo and experience a better ride.`;

            const response = await fetch("https://srv547457.hstgr.cloud:3003/smsendpoint", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    clientid: "1001",
                    clientkey: "hdojFa502Uy6nG2",
                    message,
                    recipients: [`${phoneNumber}`],
                    senderid: "REMS",
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error("Error sending message:", response.status, errorText);
                Alert.alert("Error", "Failed to send the invite. Please try again.");
                return;
            }

            Alert.alert("Invitation Sent!", `An invite has been sent to ${phoneNumber}`);
        } catch (error) {
            console.error("Network Error:", error);
            Alert.alert("Error", "Could not send the invite. Please check your connection.");
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <FontAwesome name="arrow-left" size={16} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Invite Friends</Text>
            </View>
            <View style={styles.content}>
                <TextInput
                    style={styles.input}
                    placeholder="e.g. +263770000000"
                    placeholderTextColor="#ccc"
                    keyboardType="phone-pad"
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                />
                <TextInput
                    style={styles.messageInput}
                    value={`I am super excited to share with you an amazing new app that is making waves. Join me on DropX and experience a better ride.`}
                    editable={false}
                    placeholderTextColor="#ccc"
                    multiline={true}
                    numberOfLines={4}
                />
                <TouchableOpacity style={styles.inviteButton} onPress={sendInviteMessage}>
                    <Text style={styles.inviteButtonText}>Send Invite</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        backgroundColor: '#FFC000',
        padding: 15,
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 20,
    },
    backButton: {
        padding: 10,
    },
    headerTitle: {
        fontSize: 20,
        color: 'black',
        marginLeft: 50,
    },
    content: {
        flex: 1,
        backgroundColor: 'white',
        padding: 20,
        justifyContent: 'center',
    },
    messageInput: {
        height: 100,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        fontSize: 16,
        color: 'black',
        marginBottom: 20,
        backgroundColor: '#f0f0f0',
        textAlignVertical: 'top',
    },
    input: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        fontSize: 16,
        color: 'black',
        marginBottom: 20,
    },
    inviteButton: {
        backgroundColor: '#FFC000',
        paddingVertical: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    inviteButtonText: {
        color: 'black',
        fontSize: 18,
    },
});

export default Invite;
