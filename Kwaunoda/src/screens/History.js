import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from '@expo/vector-icons';
import BottomFooter from './BottomFooter';
import { API_URL } from './config';
import AsyncStorage from '@react-native-async-storage/async-storage';


const History = () => {
  const [deliveryHistory, setDeliveryHistory] = useState([]);
  const APILINK = API_URL;

  const navigation = useNavigation();

  const redirectHome = () => {
    navigation.goBack(); 
  };


  // useEffect(() => {
  //   const fetchTrips = async () => {
  //     const User = await AsyncStorage.getItem("userDetails");
  //     const user = JSON.parse(User);
  //     const customer_id = user.customerid;
  //     const driver_id = user.driver_id;

      // try {
      //   const resp = await fetch(
      //     `${APILINK}/trip/MylastTwentyTripsById/${customer_id}/${driver_id}`,
      //     {
      //       method: "GET",
      //       headers: {
      //         "Content-Type": "application/json",
      //       },
      //     }
      //   );

      //   const result = await resp.json();

  //       if (result) {
  //         setTrips(result); // Store the trips
  //       } else {
  //         Alert.alert("Error", "Failed to fetch trips.");
  //       }
  //     } catch (error) {
  //       console.error("Error fetching trips:", error);
  //       Alert.alert("Error", "An error occurred while fetching trips.");
  //     }
  //   };

  //   fetchTrips();
  // }, []);

  useEffect(() => {
    // Fetch delivery history data from the app's backend or local storage
    const test = async ()=>{
      const User = await AsyncStorage.getItem('userDetails');
      const user = JSON.parse(User);
      const customer_id = user.customerid;
      const driver_id = user.driver_id;
      const resp = await fetch(
        `${APILINK}/trip/MylastTwentyTripsById/${customer_id}/${driver_id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const result = await resp.json();
      console.log("hie", result)
      setDeliveryHistory(result);
    }

    // fetchDeliveryHistory();
    test();
  }, []);

  // const fetchDeliveryHistory = () => {
  //   // Replace this with your actual delivery history data retrieval logic
  //   const sampleData = [
  //     {
  //       id: '1',
  //       orderNumber: 'ORDER-001',
  //       deliveredOn: '2023-08-12',
  //       status: 'Delivered',
  //     },
  //     {
  //       id: '2',
  //       orderNumber: 'ORDER-002',
  //       deliveredOn: '2023-07-30',
  //       status: 'Delivered',
  //     },
  //     {
  //       id: '3',
  //       orderNumber: 'ORDER-003',
  //       deliveredOn: '2023-06-22',
  //       status: 'Cancelled',
  //     },
  //   ];
  //   setDeliveryHistory(sampleData);
  // };

  const renderDeliveryItem = ({ item }) => (
    <TouchableOpacity style={styles.deliveryItem}>
      <View style={styles.deliveryItemHeader}>
        <Text style={styles.orderNumber}>Order #{item.trip_id}</Text>
        <Text
          style={[
            styles.status,
            item.status === 'Trip Ended' ? styles.statusDelivered : styles.statusCancelled,
          ]}
        >
          {item.status}
        </Text>
      </View>
      <Text style={styles.deliveredOn}>
        Delivered on {new Date(item.deliveredOn).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={[styles.topBar, styles.goldenYellow, { paddingTop: 30, alignItems: 'center', marginBottom: 20 }]}>
        <TouchableOpacity style={styles.backArrow} onPress={redirectHome}>
          <MaterialIcons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>

        <View style={styles.topBarContent}>
          <Text style={[styles.title, { color: '#000', fontWeight: 'bold' }]}>Delivery History</Text>
        </View>
      </View>

      <FlatList
        data={deliveryHistory}
        keyExtractor={(item) => item.id}
        renderItem={renderDeliveryItem}
        contentContainerStyle={styles.deliveryList}
        showsVerticalScrollIndicator={false}
      />
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
  deliveryList: {
    paddingHorizontal: 20,
    paddingBottom: 80, // Add padding to avoid content being hidden behind the bottom bar
  },
  deliveryItem: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  deliveryItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  status: {
    fontSize: 14,
    fontWeight: 'bold',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  statusDelivered: {
    color: '#4CAF50',
    backgroundColor: '#E8F5E9',
  },
  statusCancelled: {
    color: '#F44336',
    backgroundColor: '#FFEBEE',
  },
  deliveredOn: {
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

export default History;
