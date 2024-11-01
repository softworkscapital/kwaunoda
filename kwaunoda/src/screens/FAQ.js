import React from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import BottomFooter from './BottomFooter';

const FAQ = () => {

    const navigation = useNavigation();

    const redirectHome = () => {
        navigation.navigate("HomeDriver");
    };



    return (

        <View style={styles.container}>
            <View style={[styles.topBar, styles.goldenYellow, { paddingTop: 30, marginBottom: 30}]}>
                <TouchableOpacity style={styles.backArrow} onPress={redirectHome}>
                    <MaterialIcons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>

                <View style={styles.topBarContent}>
                    <Text style={[styles.title, { color: '#000' }]}>Frequently Asked Questions</Text>
                </View>
                <TouchableOpacity style={styles.editButton} onPress={() => setIsEditModalVisible(true)}>
                    {/* <MaterialIcons name="edit" size={24} color="#000" /> */}
                </TouchableOpacity>
            </View>
            <ScrollView style={[styles.container, {paddingHorizontal: 15}]}>
                <View style={styles.faqItem}>
                    <Text style={styles.question}>What payment methods are accepted?</Text>
                    <Text style={styles.answer}>
                        Kwaunoda accepts various payment methods including credit/debit cards, mobile money, and cash on delivery. You can choose your preferred payment option at checkout.
                    </Text>
                </View>

                <View style={styles.faqItem}>
                    <Text style={styles.question}>How can I track my order?</Text>
                    <Text style={styles.answer}>
                        Once your order is placed, you can track it in real-time through the app. You'll receive updates on the status of your order, including when it's out for delivery and when it arrives.
                    </Text>
                </View>

                <View style={styles.faqItem}>
                    <Text style={styles.question}>What should I do if I have an issue with my order?</Text>
                    <Text style={styles.answer}>
                        If you encounter any issues with your order, you can contact our customer support through the app. We are here to assist you and ensure your experience with Kwaunoda is smooth and satisfactory.
                    </Text>
                </View>

                <View style={styles.faqItem}>
                    <Text style={styles.question}>Can I cancel or modify my order?</Text>
                    <Text style={styles.answer}>
                        Yes, you can cancel or modify your order within a certain time frame after placing it. Please check the app for specific details on how to manage your order, or contact customer support for assistance.
                    </Text>
                </View>
            </ScrollView>
            <BottomFooter/>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    topBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    goldenYellow: {
        backgroundColor: '#FFC000',
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
    faqItem: {
        marginBottom: 20,
    },
    question: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    answer: {
        fontSize: 16,
        marginTop: 5,
    },

    bottomBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingVertical: 12,
      },
      bottomBarItem: {
        alignItems: 'center',
      },
      bottomBarText: {
        fontSize: 14,
        marginTop: 4,
      },
});

export default FAQ;
