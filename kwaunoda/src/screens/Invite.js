import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons'; // Ensure you have this package installed

const Invite = () => {
    const navigation = useNavigation();
    const [phoneNumber, setPhoneNumber] = useState('');

    const handleInvite = () => {
        if (phoneNumber) {
            Alert.alert("Invitation Sent!", `An invite has been sent to ${phoneNumber}`);
            // Logic to send the invitation (e.g., SMS, API call) can go here
        } else {
            Alert.alert("Error", "Please enter a valid phone number.");
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
                    value={`I am super excited to share with you an amazing new app that is making waves. Join me on EasyGo and experience a better ride.`}
                    editable={false} // Make the message box uneditable
                    placeholderTextColor="#ccc"
                    multiline={true} // Allow multiple lines
                    numberOfLines={4} // Set the number of lines to show initially
                />
                
                <TouchableOpacity style={styles.inviteButton} onPress={handleInvite}>
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
        backgroundColor: '#4CAF50', // Green background for header
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
        color: 'black', // Black color for header title
        marginLeft: 50,
    },
    content: {
        flex: 1,
        backgroundColor: 'white', // White background for content
        padding: 20,
        justifyContent: 'center',
    },
    messageInput: {
        height: 100, // Height for the message box
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        fontSize: 16,
        color: 'black',
        marginBottom: 20,
        backgroundColor: '#f0f0f0', // Grey background for the message box
        textAlignVertical: 'top', // Align text to the top
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
        backgroundColor: '#388E3C', // Darker green for button
        paddingVertical: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    inviteButtonText: {
        color: 'black', // Black color for button text
        fontSize: 18,
    },
});

export default Invite;