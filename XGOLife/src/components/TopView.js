import React, { useEffect, useState, useRef } from 'react'
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Modal,
  FlatList,
  Alert,
  Dimensions,
  Vibration,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { FontAwesome } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { API_URL, API_URL_UPLOADS } from '../screens/config'
import LocationTracker from '../screens/LocationTracker'

const { height } = Dimensions.get('window')

const TopView = () => {
  const navigation = useNavigation()
  const [isCounterOfferModalVisible, setCounterOfferModalVisible] =
    useState(false)
  const [isMenuModalVisible, setMenuModalVisible] = useState(false)
  const [counterOffers, setCounterOffers] = useState([])
  const [profileImage, setPic] = useState()
  const [customerType, setType] = useState('')
  const [name, setName] = useState('')
  const [id, setid] = useState('')
  const [notificationCount, setNotificationCount] = useState(0)
  const APILINK = API_URL

  // Hard-coded notifications
  const hardCodedNotifications = [
    // { id: 1, message: 'Driver A has offered you a trip for $15' },
    // { id: 2, message: 'Driver B wants to take you to the airport' },
    // { id: 3, message: 'Driver C is available for your requested ride' },
    // { id: 4, message: 'Driver D has sent a special offer!' },
    // { id: 5, message: 'Driver E is ready to pick you up!' }
  ]

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedIds = await AsyncStorage.getItem('theIds')
        if (storedIds) {
          const parsedIds = JSON.parse(storedIds)
          let acc =
            parsedIds.last_logged_account === 'driver'
              ? parsedIds.driver_id
              : parsedIds.customerId
          setid(acc)
          await fetchUserDetails(acc, parsedIds.last_logged_account)
        } else {
          Alert.alert('Driver ID not found', 'Please log in again.')
        }
      } catch (error) {
        console.error('Error fetching data:', error)
        Alert.alert('Error', 'An error occurred while fetching data.')
      }
    }

    const fetchUserDetails = async (id, type) => {
      try {
        const endpoint =
          type === 'driver' ? `driver/${id}` : `customerdetails/${id}`
        const response = await fetch(`${APILINK}/${endpoint}`)
        const result = await response.json()

        if (result && result.length > 0) {
          await AsyncStorage.setItem('userDetails', JSON.stringify(result[0]))

          if (result[0].profilePic === null || result[0].profilePic === '') {
            setPic(null)
            setType(result[0].account_type)
            setName(result[0].username)
          } else {
            setPic(
              `${API_URL_UPLOADS}/${result[0].profilePic.replace(/\\/g, '/')}`
            )
            setType(result[0].account_type)
            setName(result[0].username)
          }
        } else {
          Alert.alert(
            `${type === 'driver' ? 'Driver' : 'Customer'} details not found.`
          )
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch details. Please try again.')
      }
    }

    const fetchCounterOffers = async (userId) => {
      try {
        const response = await fetch(
          `${API_URL}/counter_offer/customerid/status/${userId}/Unseen`
        );
        const offers = await response.json();
        console.log('counter offers from TopView', offers);
    
        if (offers.length > 0) {
          const updatedOffers = await Promise.all(
            offers.map(async offer => {
              const driverResponse = await fetch(
                `${API_URL}/driver/${offer.driver_id}`
              );
              const driverResult = await driverResponse.json();
              console.log('driverdatafor Offer', driverResult);
              const driverData = Array.isArray(driverResult)
                ? driverResult[0]
                : driverResult;
    
              return {
                ...offer,
                profileImage: `${API_URL_UPLOADS}/${driverData.profilePic.replace(
                  /\\/g,
                  '/'
                )}`,
                name: driverData.username,
                stars: driverData.rating,
                make: driverData.make,
                model: driverData.model
              };
            })
          );
    
          // Combine previous and new offers, filtering duplicates
          const combinedOffers = [
            ...counterOffers,
            ...updatedOffers.filter(
              offer => !counterOffers.some(o => o.counter_offer_id === offer.counter_offer_id)
            )
          ];
    
          // Only update the notification count if new offers were added
          if (combinedOffers.length > counterOffers.length) {
            const newOffersCount = combinedOffers.length - counterOffers.length;

            
            if(notificationCount > 0){
              setNotificationCount(notificationCount + newOffersCount);
                    // Vibrate when the notification count increments
                    Vibration.vibrate();
            }else{
              setNotificationCount(newOffersCount);
                    Vibration.vibrate();
            }
            
        
          }
    
          setCounterOffers(combinedOffers);
        }
      } catch (error) {
        console.error('Error fetching counter offers:', error);
      }
    };

    fetchData()
    fetchCounterOffers(id)
    const intervalId = setInterval(() => fetchCounterOffers(id), 30000)
    return () => clearInterval(intervalId)
  }, [id])

  const iconMap = {
    'Profile Info': 'user',
    Wallet: 'money',
    History: 'history',
    Settings: 'cog',
    FAQ: 'question-circle',
    Safety: 'shield',
    Chat: 'comments',
    Feedback: 'comment',
    'About Us': 'info-circle',
    Complaint: 'exclamation-triangle',
    'Tell A Friend': 'share-alt',
    'Log Out': 'sign-out'
  }

  const menuOptions = [
    {
      id: '1',
      title: 'Profile Info',
      onPress: () => handleMenuPress('ProfileInfo')
    },
    { id: '9', title: 'Wallet', onPress: () => handleMenuPress('Wallet') },
    { id: '7', title: 'History', onPress: () => handleMenuPress('History') },
    { id: '8', title: 'Settings', onPress: () => handleMenuPress('settings') },
    { id: '2', title: 'FAQ', onPress: () => handleMenuPress('FAQ') },
    { id: '3', title: 'Safety', onPress: () => handleMenuPress('Safety') },
    { id: '10', title: 'Chat', onPress: () => handleMenuPress('StartChart') },
    { id: '5', title: 'About Us', onPress: () => handleMenuPress('AboutUs') },
    {
      id: '11',
      title: 'Tell A Friend',
      onPress: () => handleMenuPress('Invite')
    },
    { id: '12', title: 'Log Out', onPress: () => handleLogout() }
  ]

  const handleMenuPress = (screen) => {
    setMenuModalVisible(false)
    if (screen === 'ProfileInfo') {
      navigation.navigate(
        customerType === 'customer' ? 'ProfileInformation' : 'DriverProfile',
        { userId: id }
      )
    } else {
      navigation.navigate(screen, { userId: id })
    }
  }

  const handleLogout = async () => {
    try {
      await AsyncStorage.clear()
      navigation.navigate('CustomerLogin')
    } catch (error) {
      Alert.alert('Error', 'Failed to log out. Please try again.')
    }
  }

  const markOfferAsSeen = async offerId => {
    try {
      const response = await fetch(
        `${API_URL}/counter_offer/${offerId}/status`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ status: 'seen' })
        }
      )

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`)
      }

      await response.json()
    } catch (error) {
      console.error('Error marking offer as seen:', error)
    }
  }

  const markOffersAsSeen = async driver_id => {
    try {
      const response = await fetch(
        `${API_URL}/counter_offer/${driver_id}/Unseen/status`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ status: 'seen' })
        }
      )

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`)
      }

      await response.json()
    } catch (error) {
      console.error('Error marking offer as seen:', error)
    }
  }

  const renderCounterOffer = offer => {
    return (
      <View key={offer.counter_offer_id} style={styles.offerCard}>
        <View style={styles.tripMetaContainer}>
          <View style={styles.tripIdContainer}>
            <FontAwesome name='hashtag' size={20} color='#666' />
            <Text style={styles.tripIdText}>{offer.trip_id}</Text>
          </View>

          <View style={styles.timeContainer}>
            <FontAwesome name='dollar' size={20} color='#666' />
            <Text style={styles.timeText}>
              {offer.counter_offer_value} {offer.currency}
            </Text>
          </View>
        </View>

        <View style={styles.profileContainer}>
          {offer.profileImage && offer.profileImage.trim() ? (
            <Image
              source={{ uri: offer.profileImage }}
              style={[styles.profileImage, { marginTop: 5 }]}
            />
          ) : (
            <View
              style={[
                styles.profileImage,
                {
                  marginTop: 5,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#f0f0f0'
                }
              ]}
            >
              <FontAwesome name='user' size={50} color='red' />
            </View>
          )}

          <View style={styles.Details}>
            {renderStars(offer.stars)}
            <Text style={styles.offerText}>{offer.name}</Text>

            <Text style={styles.offerText}>
              {offer.make}
              <Text> </Text>
              <Text style={styles.offerText}>{offer.model}</Text>
            </Text>
          </View>
        </View>

        {/* <Text style={styles.offerText}>
          Counter Offer: {offer.counter_offer_value} {offer.currency}
        </Text> */}
        {/* <Text style={styles.offerText}>For Trip: {offer.trip_id}</Text> */}
        <View style={styles.offerButtonContainer}>
          <TouchableOpacity
            style={styles.rejectButton}
            onPress={() => rejectCounterOffer(offer.counter_offer_id)}
          >
            <Text style={styles.buttonText}>Pass</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.acceptButton}
            onPress={() => acceptCounterOffer(offer.counter_offer_id, offer)}
          >
            <Text style={styles.acceptButtonText}>Accept</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  const renderStars = rating => {
    const stars = []
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Text key={i} style={styles.star}>
          {i < rating ? '★' : '☆'}
        </Text>
      )
    }
    return <View style={styles.starContainer}>{stars}</View>
  }

  const acceptCounterOffer = async (offerId, offer) => {
    console.log('ACCEPTING NOW', offer)
    const settler = await settleCommission(offer)

    if (!settler) {
      Alert.alert('Error', 'Failed to Accept Trip Try a new Offer')
    } else {
      try {
        const acceptResponse = await fetch(
          `${API_URL}/counter_offer/${offerId}/status`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: 'accepted' })
          }
        )

        if (!acceptResponse.ok) {
          throw new Error(
            `Error accepting counter offer: ${acceptResponse.statusText}`
          )
        }

        const statusResponse = await fetch(
          `${APILINK}/trip/updateStatusAndDriver/${offer.trip_id}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              driver_id: offer.driver_id,
              status: 'InTransit'
            })
          }
        )

        if (!statusResponse.ok) {
          throw new Error(
            `Error updating trip status: ${statusResponse.statusText}`
          )
        }

        setCounterOffers(prevOffers =>
          prevOffers.filter(
            existingOffer => existingOffer.counter_offer_id !== offerId
          )
        )

        setCounterOfferModalVisible(false) // Close modal on accept
      } catch (error) {
        console.error('Error accepting counter offer:', error)
      }
    }
  }

  const rejectCounterOffer = async offerId => {
    setCounterOffers(prevOffers =>
      prevOffers.filter(offer => offer.counter_offer_id !== offerId)
    )
    await markOfferAsSeen(offerId)
  }

  //new here
  const fetchTopUpHistory = async driverID => {
    // console.log("Honai driver id yeduuuuuu:", driverID);

    try {
      const resp = await fetch(`${API_URL}/topUp/userBalance/${driverID}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      // console.log("maziBalance eduuuu:", resp);
      const result = await resp.json()
      // console.log("Top Up History:", result);

      // Check if the response was successful and contains the balance
      if (result && result.success && result.data && result.data.length > 0) {
        const userWalletBalance = result.data[0].user_wallet_balance
        // console.log("User Wallet Balance:", userWalletBalance);

        // Assuming you have a function or state to set the balance
        return userWalletBalance // Call setBalance with the fetched balance
      } else {
        Alert.alert('Error', 'Failed to fetch Top Up History.')
        return 0
      }
    } catch (error) {
      console.log('Error fetching History:', error)
      Alert.alert('Error', 'An error occurred while fetching History.')
    }
  }

  const getTrip = async tripId => {
    try {
      const resp = await fetch(`${API_URL}/trip/${tripId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const result = await resp.json()

      return result[0]
    } catch (error) {
      console.log('Error fetching History:', error)
      Alert.alert('Error', 'An error occurred while fetching History.')
    }
  }

  ///new here
  const settleCommission = async offer => {
    const balance = await fetchTopUpHistory(offer.driver_id)
    console.log('BALANCE YEDU', balance)

    // Calculate fee based on accepted cost
    const fee = 0.09 * offer.counter_offer_value
    // console.log("ziBalance iri", balance);

    // Check if balance is sufficient
    if (balance < fee || balance <= 0) {
      Alert.alert('Error', `Driver's floating balance is too low.`)
      return
    }

    // Update balance after fee deduction
    // const newBalance = balance - fee;
    const trip = await getTrip(offer.trip_id)
    console.log('TRIP REDU', trip)
    // Prepare data for the API request
    const data = {
      commission: fee,
      description: `Trip ID: ${offer.trip_id} Commission\n${trip.deliveray_details}\nFrom: ${trip.origin_location}\nTo: ${trip.dest_location}`
    }

    console.log('Zvikuenda izvo', data)

    try {
      // Make the API call to process the trip commission
      const resp = await fetch(
        `${APILINK}/topUp/trip_commission_settlement/${1}/${offer.driver_id}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        }
      )

      // Check if the response is OK
      if (!resp.ok) {
        const errorText = await resp.text() // Get the text response for debugging
        Alert.alert('Error', 'Failed to process top-up')
        return false
      }

      // Parse the JSON response
      const result = await resp.json()
      if (result) {
        await markOffersAsSeen(offer.driver_id)
        console.log('done')
        return true
      } else {
        Alert.alert('Error', 'Failed to process top-up.')
        return false
      }
    } catch (error) {
      console.error('Error processing top-up:', error)
      Alert.alert('Error', 'An error occurred while processing top-up.')
    }
  }

  return (
    <View style={styles.container}>
      <LocationTracker userId={id} userType={customerType} />
      <View style={styles.notificationContainer}>
        <TouchableOpacity
          onPress={() => setMenuModalVisible(true)}
          style={styles.menuButton}
        >
          <FontAwesome name='bars' size={24} color='black' />
        </TouchableOpacity>

        {customerType === 'customer' ? (
          <TouchableOpacity
            onPress={() => {
              setNotificationCount(0) 
              setCounterOfferModalVisible(true)
            }}
            style={styles.menuButton}
          >
            <FontAwesome name='bell' size={24} color='black' />
            {notificationCount > 0 && (
              <View style={styles.notificationCount}>
                <Text style={styles.countText}>{notificationCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        ) : null}

  

        <TouchableOpacity
          onPress={() => navigation.navigate('StartChart')}
          style={styles.menuButton}
        >
          <FontAwesome name='comments' size={24} color='black' />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("StoreCategories")}
          style={styles.menuButton}
        >
          <FontAwesome name="shopping-cart" size={24} color="black" />
        </TouchableOpacity>
     
      </View>

      <View style={styles.profileContainer}>
        <View>
          <Text style={styles.profileName}>{name || 'No Name'}</Text>
          <Text style={{ marginBottom: 3, fontSize: 11 }}>
            {customerType === 'customer' ? 'Customer' : 'Driver'}
          </Text>
        </View>
        {profileImage && profileImage.trim() ? (
          <Image source={{ uri: profileImage }} style={[styles.profileImage]} />
        ) : (
          <View
            style={[
              styles.profileImage,
              {
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#f0f0f0'
              }
            ]}
          >
            <FontAwesome name='user' size={40} color='gray' />
          </View>
        )}
      </View>

      {/* Counter Offer Modal */}
      <Modal
        transparent={true}
        animationType='slide'
        visible={isCounterOfferModalVisible}
        onRequestClose={() => setCounterOfferModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={[styles.modalContainer2, { height: height * 0.9 }]}>
            <FlatList
              data={
                counterOffers.length > 0
                  ? counterOffers
                  : hardCodedNotifications
              }
              keyExtractor={item =>
                item.id ? item.id.toString() : item.counter_offer_id.toString()
              }
              renderItem={({ item }) => renderCounterOffer(item)} // Call renderCounterOffer with the item
              ListEmptyComponent={
                <Text style={styles.emptyText}>
                  No counter offers available.
                </Text>
              }
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setCounterOfferModalVisible(false)}
            >
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Menu Options Modal */}
      <Modal
        transparent={true}
        animationType='slide'
        visible={isMenuModalVisible}
        onRequestClose={() => setMenuModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={[styles.modalContainer, { height: height * 0.9 }]}>
            <View style={styles.profileContainerModal}>
              {profileImage && profileImage.trim() ? (
                <Image
                  source={{ uri: profileImage }}
                  style={[styles.profileImage]}
                />
              ) : (
                <View
                  style={[
                    styles.profileImage,
                    {
                      marginTop: 5,
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: '#f0f0f0'
                    }
                  ]}
                >
                  <FontAwesome name='user' size={50} color='gray' />
                </View>
              )}

              <View style={styles.nameContainer}>
                <Text style={styles.profileName}>{name || 'No Name'}</Text>
              </View>
            </View>

            <FlatList
              data={menuOptions}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={item.onPress}
                >
                  <FontAwesome
                    name={iconMap[item.title] || 'question'}
                    size={35}
                    style={styles.icon}
                  />
                  <Text style={styles.menuText}>{item.title}</Text>
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <Text style={styles.emptyText}>No menu options available.</Text>
              }
            />

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setMenuModalVisible(false)}
            >
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  tripMetaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5
  },
  tripIdContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  tripIdText: {
    marginLeft: 5,
    fontSize: 20,
    color: '#666',
    fontWeight: '500'
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  timeText: {
    marginLeft: 5,
    marginRight: 2,
    fontSize: 20,
    color: '#666',
    fontWeight: '500'
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 3,
    backgroundColor: '#FFC000',
    paddingRight: 9,
    width: '100%',
    paddingVertical: 15
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginLeft: 10,
    marginBottom: 8
  },
  profileName: {
    fontSize: 12,
    fontWeight: 'bold'
  },
  profileContainerModal: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  nameContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    marginLeft: 10
  },
  starContainer: {
    flexDirection: 'row',
    marginTop: 5
  },
  star: {
    fontSize: 18,
    color: 'gold'
  },
  notificationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginRight: 10
  },
  menuButton: {
    marginHorizontal: 10
  },

  notificationCount: {
    position: 'absolute',
    right: -8,
    top: -8,
    backgroundColor: 'red',
    borderRadius: 10,
    padding: 3,
    minWidth: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  countText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  modalContainer: {
    width: '90%',
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    elevation: 5
  },
  modalContainer2: {
    width: '95%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0)',
    borderRadius: 10,
    
  },
  closeButton: {
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#FFC000',
    borderRadius: 25,
    marginTop: 10
  },
  closeText: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#777'
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc'
  },
  icon: {
    marginRight: 10
  },
  menuText: {
    fontSize: 11,
    flex: 1
  },
  offerCard: {
    padding: 10,
    backgroundColor: '#FFf',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10
  },
  Details: {
    paddingLeft: 10,
    marginBottom: 10
  },
  offerText: {
    fontSize: 12,
    color: 'black'
  },
  offerButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10
  },
  acceptButton: {
    backgroundColor: '#FFC000',
    borderRadius: 25,
    padding: 8,
    // borderRadius: 5,
    flex: 1,
    marginLeft: 5
  },
  rejectButton: {
    backgroundColor: '#FF5733',

    padding: 8,
    borderRadius: 25,
    flex: 1,
    marginRight: 5
  },
  buttonText: {
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center'
  },
  acceptButtonText: {
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center'
  }
})

export default TopView
