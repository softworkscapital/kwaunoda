// Dashboard.js
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons'; // Make sure you have @expo/vector-icons installed

const Dashboard = () => {
  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.headerText}>Dashboard</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Ionicons name="car-sport-outline" size={24} color="black" />
          <View style={styles.cardTextContainer}>
            <Text style={styles.cardTitle}>Total Drivers</Text>
            <Text style={styles.cardValue}>120</Text>
          </View>
        </View>

        <View style={styles.card}>
          <MaterialIcons name="local-shipping" size={24} color="black" />
          <View style={styles.cardTextContainer}>
            <Text style={styles.cardTitle}>Total Deliveries</Text>
            <Text style={styles.cardValue}>350</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Ionicons name="people-outline" size={24} color="black" />
          <View style={styles.cardTextContainer}>
            <Text style={styles.cardTitle}>Total Customers</Text>
            <Text style={styles.cardValue}>500</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  topBar: {
    width: '100%',
    backgroundColor: '#ffc000', // Yellow background for the top bar
    paddingVertical: 30,
    paddingHorizontal: 15,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1, // Ensure top bar is on top of other content
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333', // Darker text for contrast
    textAlign: 'center',
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingTop: 120, // Adjust this value based on the height of the top bar
    paddingHorizontal: 30, // Increased padding
    paddingBottom: 20,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    marginBottom: 15,
  },
  cardTextContainer: {
    marginLeft: 15,
    flex: 1,
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'left', // Align text to the left
  },
  cardValue: {
    fontSize: 16,
    color: '#666',
    textAlign: 'right', // Align text to the right
  },
});

export default Dashboard;
