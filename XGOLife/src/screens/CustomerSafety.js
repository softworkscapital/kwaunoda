import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    Alert,
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
    faClock,
    faHeart,
    faPhoneAlt,
    faRunning,
    faLocationArrow,
} from '@fortawesome/free-solid-svg-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import BottomFooter2 from './BottomFooter2';

const CustomerSafety = () => {

    const navigation = useNavigation();

    const redirectHome = () => {
        navigation.navigate("Home");
    };



    const handleSafetyFeature = (feature) => {
        switch (feature) {
            case 'timer':
                Alert.alert('Safety Timer', 'Your safety timer has been started.');
                break;
            case 'firstaid':
                Alert.alert('First Aid', 'Showing first aid instructions.');
                break;
            case 'emergency':
                Alert.alert('Emergency', 'Calling emergency services.');
                break;
            case 'tracking':
                Alert.alert('Location Tracking', 'Your location is being tracked.');
                break;
            case 'escape':
                Alert.alert('Escape', 'Initiating emergency escape plan.');
                break;
            default:
                break;
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={[styles.topBar, styles.goldenYellow, { paddingTop: 35 }]}>
                    <TouchableOpacity style={styles.backArrow} onPress={redirectHome}>
                        <MaterialIcons name="arrow-back" size={24} color="#000" />
                    </TouchableOpacity>

                    <View style={styles.topBarContent}>
                        <Text style={[styles.title, { color: '#000' }]}>Safety</Text>
                    </View>
                    <TouchableOpacity style={styles.editButton} onPress={() => setIsEditModalVisible(true)}>

                    </TouchableOpacity>
                </View>

                <View style={styles.contentContainer}>

                    <TouchableOpacity
                        style={[styles.featureButton, { flex: 1 }]}
                        onPress={() => handleSafetyFeature('firstaid')}
                    >
                        <View style={styles.featureContent}>
                            <FontAwesomeIcon icon={faHeart} size={25} color="#FFC000" />
                            <Text style={styles.featureText}>Support</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.featureButton, { flex: 1 }]}
                        onPress={() => handleSafetyFeature('emergency')}
                    >
                        <View style={styles.featureContent}>
                            <FontAwesomeIcon icon={faPhoneAlt} size={25} color="#FFC000" />
                            <Text style={styles.featureText}>Emergency Contacts</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.featureButton, { flex: 1 }]}
                        onPress={() => handleSafetyFeature('tracking')}
                    >
                        <View style={styles.featureContent}>
                            <FontAwesomeIcon icon={faLocationArrow} size={25} color="#FFC000" />
                            <Text style={styles.featureText}>Tracking</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.featureButton, { flex: 1 }]}
                        onPress={() => handleSafetyFeature('escape')}
                    >
                        <View style={styles.featureContent}>
                            <FontAwesomeIcon icon={faRunning} size={25} color="#FFC000" />
                            <Text style={styles.featureText}>Safety Features</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            <BottomFooter2/>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    scrollContent: {
        paddingBottom: 80, // Add padding to avoid content being hidden behind the fixed bottom bar
    },
    topBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    goldenYellow: {
        backgroundColor: '#FFD700',
    },
    backArrow: {
        padding: 8,
    },
    topBarContent: {
        flex: 1,
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    editButton: {
        padding: 8,
    },
    contentContainer: {
        flex: 1,
        paddingHorizontal: 16,
        paddingVertical: 20,
    },
    featureButton: {
        backgroundColor: '#f2f2f2',
        height: 120,
        borderRadius: 10,
        padding: 40,
        marginVertical: 10,
        width: '100%',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        justifyContent: 'center'
    },
    featureContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    featureText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginLeft: 20,
    },
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingVertical: 12,
        backgroundColor: '#FFD700',
    },
    bottomBarItem: {
        alignItems: 'center',
    },
    bottomBarText: {
        fontSize: 14,
        marginTop: 4,
    },
});

export default CustomerSafety;
