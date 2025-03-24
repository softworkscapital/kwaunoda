import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ChatMenu = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Chat Menu</Text>
      </View>
      
      <View style={styles.content}>
        <TouchableOpacity style={styles.link} onPress={() => navigation.navigate('CustomerAdminChat')}>
          <Text style={styles.linkText}>Do you want to chat with us?</Text>
          <Ionicons name="chevron-forward" size={24} color="black" />
        </TouchableOpacity>
        <View style={styles.hr} />

        <TouchableOpacity style={styles.link} onPress={() => navigation.navigate('Complaint')}>
          <Text style={styles.linkText}>Do you want to complain?</Text>
          <Ionicons name="chevron-forward" size={24} color="black" />
        </TouchableOpacity>
        <View style={styles.hr} />

        <TouchableOpacity style={styles.link} onPress={() => navigation.navigate('Feedback')}>
          <Text style={styles.linkText}>Do you want to add feedback?</Text>
          <Ionicons name="chevron-forward" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'gold',
    padding: 10,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    padding: 20,
  },
  link: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 16,
  },
  hr: {
    height: 1,
    backgroundColor: 'lightgray',
    marginVertical: 10,
  },
});

export default ChatMenu;