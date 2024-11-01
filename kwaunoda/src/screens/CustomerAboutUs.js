import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import BottomFooter2 from './BottomFooter2';

const CustomerAboutUs = () => {
  const navigation = useNavigation();

  const redirectHome = () => {
    navigation.navigate("Home");
  };

  return (
    <View style={styles.container}>
      <View style={[styles.topBar, { backgroundColor: '#FFC000', paddingTop: 30 }]}>
        <TouchableOpacity style={styles.backArrow} onPress={redirectHome}>
          <MaterialIcons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>

        <View style={styles.topBarContent}>
          <Text style={[styles.title, { color: '#000' }]}>About Us</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Our Mission</Text>
          <Text style={styles.sectionText}>
            Our mission is to provide fast, reliable, and secure delivery services to our customers. We are committed to delivering your orders on time and ensuring your satisfaction with every interaction.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Our Values</Text>
          <View style={styles.valueContainer}>
            <Text style={styles.valueTitle}>Integrity</Text>
            <Text style={styles.valueDescription}>
              We operate with the highest ethical standards, always putting the well-being of our customers and delivery personnel first.
            </Text>
          </View>
          <View style={styles.valueContainer}>
            <Text style={styles.valueTitle}>Innovation</Text>
            <Text style={styles.valueDescription}>
              We constantly explore new technologies and strategies to improve our delivery process and provide a seamless experience.
            </Text>
          </View>
          <View style={styles.valueContainer}>
            <Text style={styles.valueTitle}>Customer Obsession</Text>
            <Text style={styles.valueDescription}>
              We are dedicated to understanding and addressing the unique needs of our customers, ensuring their satisfaction is our top priority.
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Our Team</Text>
          <Text style={styles.sectionText}>
            Our team of dedicated professionals is the backbone of our delivery service. We are passionate about what we do and strive to provide the best experience for our customers.
          </Text>
        </View>
      </ScrollView>
      <BottomFooter2/>
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
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  sectionText: {
    fontSize: 16,
    color: '#666',
  },
  valueContainer: {
    marginVertical: 10,
  },
  valueTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  valueDescription: {
    fontSize: 14,
    color: '#666',
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
    backgroundColor: '#FFC000',
  },
  bottomBarItem: {
    alignItems: 'center',
  },
  bottomBarText: {
    fontSize: 14,
    marginTop: 4,
  },
});

export default CustomerAboutUs;
