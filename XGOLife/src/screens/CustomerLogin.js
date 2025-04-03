import React, { useState, useEffect } from 'react'
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  ActivityIndicator,
  Image
} from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import {
  faEnvelope,
  faLock,
  faCheckCircle
} from '@fortawesome/free-solid-svg-icons'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Toast from 'react-native-toast-message'
import { API_URL } from './config'
import MD5 from 'react-native-md5'
import VersionCheck from './VersionChecker'
import NetInfo from '@react-native-community/netinfo'

const CustomerLogin = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [customerID, setCustomerID] = useState(0)
  const [loading, setLoading] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const navigation = useNavigation()
  const [isConnected, setIsConnected] = useState(null)
  const [connectionType, setConnectionType] = useState(null)

  // useEffect(() => {
  //   const checkRememberMe = async () => {
  //     const storedEmail = await AsyncStorage.getItem("email");
  //     const storedPassword = await AsyncStorage.getItem("password");
  //     if (storedEmail && storedPassword) {
  //       setEmail(storedEmail);
  //       setPassword(storedPassword);
  //       await fetchUserDetails(storedEmail, storedPassword); // Auto-login
  //     }
  //   };
  //   checkRememberMe();
  // }, []);

  // useEffect(() => {
  //   const unsubscribe = NetInfo.addEventListener(state => {
  //     setIsConnected(state.isConnected)
  //     setConnectionType(state.type)

  //     if (!state.isConnected) {
  //       console.log("not connected")
  //       Toast.show({
  //         text1: 'No Connection',
  //         text2: 'You are currently offline.',
  //         type: 'error'
  //       })
  //     } else if (state.isConnected && state.isInternetReachable === false) {
  //       console.log("poor");
  //       Toast.show({
  //         text1: 'Poor Connection',
  //         text2: 'Your connection is unstable.',
  //         type: 'info'
  //       })
  //     }
  //   })

  //   // Check initial connectivity
  //   const fetchData = async () => {
  //     const state = await NetInfo.fetch()
  //     setIsConnected(state.isConnected)
  //     setConnectionType(state.type)
  //   }

  //   fetchData()

  //   const intervalId = setInterval(() => {
  //     unsubscribe();
  //     fetchData();
  //   }, 500)

  //   return () => clearInterval(intervalId)
  // }, [])

  const redirectHome = async (type, driverId, customerID) => {
    if (type === 'driver') {
      try {
        const response = await fetch(
          `${API_URL}/trip/byStatus/driver_id/status?driver_id=${driverId}&status=InTransit`
        )

        if (response.status === 404) {
          Toast.show({
            text1: 'No trips found.',
            text2: 'You can check your new orders instead.',
            type: 'info',
            position: 'center',
            visibilityTime: 3000,
            autoHide: true
          })
          navigation.navigate('DriverNewOrderList', { driverId })
          return
        }

        if (!response.ok) {
          const errorResponse = await response.json()
          console.error('Error Response:', errorResponse)
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const tripData = await response.json()

        if (tripData.length > 0) {
          navigation.navigate('InTransitTrip', { OntripData: tripData[0] })
        } else {
          Toast.show({
            text1: 'No trips in transit.',
            text2: 'Redirecting to your new orders.',
            type: 'info',
            position: 'center',
            visibilityTime: 3000,
            autoHide: true
          })
          navigation.navigate('DriverNewOrderList', { driverId })
        }
      } catch (error) {
        console.error('Error checking trip status:', error)
        Toast.show({
          text1: 'Error checking trip status. Please try again.',
          type: 'error',
          position: 'center',
          visibilityTime: 3000,
          autoHide: true
        })
      }
    } else if (type === 'customer') {
      navigation.navigate('Home')
    } else {
      Toast.show({
        text1: 'Please Input the Correct Data',
        type: 'error',
        position: 'center',
        visibilityTime: 3000,
        autoHide: true
      })
    }
  }

  const validateInput = () => {
    if (!email || !password) {
      Toast.show({
        text1: 'Validation Error',
        text2: 'Please fill in both email and password.',
        type: 'error',
        position: 'center',
        visibilityTime: 3000,
        autoHide: true
      })
      return false
    }
    return true
  }

  const updateLog = async id => {
    console.log('user last logged', id)
    try {
      const response = await fetch(
        `${API_URL}/users/update_last_logged_in/${id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )

      if (!response.ok) {
        const errorResponse = await response.json()
        console.error('Error Response:', errorResponse)
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      console.log('last loggy:', result)
    } catch (error) {
      console.log(error)
    }
  }

  const fetchUserDetails = async (
    userEmail = email,
    userPassword = password
  ) => {
    setLoading(true)
    try {
      console.log('Logging in with:', userEmail, userPassword)
      const md5Hash = MD5.hex_md5(userPassword)

      console.log('Hash:', md5Hash)

      const response = await fetch(
        `${API_URL}/users/login/${userEmail}/${md5Hash}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )

      if (!response.ok) {
        const errorResponse = await response.json()
        console.error('Error Response:', errorResponse)
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      console.log('Login result:', result)
      const customerId = result[0]?.customerid
      setCustomerID(customerId)

      if (result.length > 0) {
        const userStatus = result[0].status
        const userType = result[0].role

        console.log('User Status:', userStatus)
        console.log('User Type:', userType)

        const ids = {
          driver_id: result[0].driver_id,
          customerId: result[0]?.customerid,
          last_logged_account: result[0].last_logged_account,
          referral_code: result[0].referral_code
        }

        if (result[0].last_logged_account === 'customer') {
          await updateLog(result[0]?.customerid)
        } else if (result[0].last_logged_account === 'driver') {
          await updateLog(result[0]?.driver_id)
        }

        // Store user data in AsyncStorage
        await AsyncStorage.setItem(
          'driver',
          JSON.stringify(result[0].driver_id)
        )
        await AsyncStorage.setItem('theIds', JSON.stringify(ids))
        await AsyncStorage.setItem('theCustomerId', JSON.stringify(customerId))
        await AsyncStorage.setItem('userStatus', userStatus)

        // // Store email and password if "Remember Me" is checked
        // if (rememberMe) {
        //   await AsyncStorage.setItem("email", userEmail);
        //   await AsyncStorage.setItem("password", userPassword);
        // } else {
        //   await AsyncStorage.removeItem("email");
        //   await AsyncStorage.removeItem("password");
        // }

        // Navigation based on user status
        if (userStatus === 'Pending Verification') {
          navigation.navigate('Welcome', {
            email: userEmail,
            password: userPassword
          })
        } else if (['Suspended', 'Blacklisted'].includes(userStatus)) {
          navigation.navigate('AccountInError')
        } else if (userStatus === 'Pending OTP Verification') {
          console.log('Navigating to OTP page for user type:', userType)
          if (userType === 'driver') {
            navigation.navigate('OTPDriver', {
              userId: ids.driver_id.toString()
            })
          } else {
            navigation.navigate('OTPCustomer', {
              userId: ids.customerId.toString()
            })
          }
        } else {
          console.log('Redirecting to home or driver page')
          redirectHome(ids.last_logged_account, ids.driver_id, ids.customerId)
        }
      } else {
        Alert.alert('Error', 'No user found or wrong password/email.')
      }
    } catch (error) {
      console.log('Error fetching user details:', error)
      Toast.show({
        text1: 'Error',
        text2: 'An error occurred. Please try again.',
        type: 'error',
        position: 'center'
      })
    } finally {
      setLoading(false)
    }
  }

  const theLogin = async () => {
    if (!validateInput()) return
    await fetchUserDetails()
  }

  const handleSignIn = async () => {
    await theLogin()
  }

  const handleSignUp = async () => {
    navigation.navigate('SignUp')
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <Image
          source={require('../../assets/icon.png')}
          style={{ width: 200, height: 300, resizeMode: 'contain' }}
        />
      </View>
      <ScrollView>
        <View style={styles.roundGuard}>
          <View style={styles.formContainer}>
            <View>
              <Text
                style={{
                  alignSelf: 'center',
                  fontSize: 14,
                  marginBottom: 10,
                  fontWeight: 'bold'
                  // marginTop: 10,
                }}
              >
                Login
              </Text>
            </View>
            <VersionCheck />
            <View style={styles.inputContainer}>
              <FontAwesomeIcon
                icon={faEnvelope}
                size={12}
                style={styles.icon}
              />
              <TextInput
                style={styles.input}
                placeholder='Email'
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View style={styles.inputContainer}>
              <FontAwesomeIcon icon={faLock} size={12} style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder='Password'
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            <View style={styles.rememberContainer}>
              <TouchableOpacity
                style={styles.checkbox}
                onPress={() => setRememberMe(!rememberMe)}
              >
                {rememberMe && (
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    size={20}
                    color='#FFC000'
                  />
                )}
              </TouchableOpacity>
              <Text style={[styles.rememberText, { marginLeft: 5 }]}>
                Remember me
              </Text>

              <Text
                style={{
                  textAlign: 'right',
                  flex: 1,
                  textAlign: 'right',
                  fontSize: 12
                }}
              >
                Forgot Password
              </Text>
              {/* Line Separator */}
              {/* <View style={{ width: 1, height: 20, backgroundColor: '#ccc', marginHorizontal: 10 }} /> */}
            </View>

            <TouchableOpacity
              style={[styles.btnSignUp, { marginTop: 30 }]}
              onPress={handleSignIn}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size='small' color='#000' />
              ) : (
                <Text style={styles.txtSignUp}>Sign In</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <TouchableOpacity onPress={handleSignUp}>
        <Text
          style={{
            alignSelf: 'center',
            fontSize: 12,
            color: 'black',
            paddingTop: 20
          }}
        >
          Create Account
        </Text>
      </TouchableOpacity>
      <View
        style={{
          bottom: 0,
          backgroundColor: '#002966',
          paddingTop: 15,
          paddingBottom: 15,
          marginTop: 10
        }}
      >
        <Text style={{ alignSelf: 'center', fontSize: 10, color: 'white' }}>
          By Signing in you agree to our terms and conditions.
        </Text>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffc000',
    paddingTop: 50
  },
  topBar: {
    height: '25%',
    backgroundColor: '#FFC000',
    borderBottomLeftRadius: 45,
    borderBottomRightRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    top: 0
  },
  formContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center'
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    padding: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.8)'
  },

  roundGuard: {
    // flexDirection: "row",
    // alignItems: "center",
    width: '92%',
    paddingBottom: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginLeft: 15,

    backgroundColor: 'rgba(255, 255, 255, 0.98)'
  },
  icon: {
    marginRight: 15,
    marginLeft: 10
  },
  input: {
    flex: 1
  },
  rememberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between' // Align items in a row
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 1
  },
  rememberText: {
    fontSize: 12
  },
  btnSignUp: {
    backgroundColor: '#FFC000',
    borderRadius: 50,
    padding: 14,
    width: '100%',
    alignItems: 'center'
  },
  txtSignUp: {
    color: 'black',
    fontSize: 13,
    fontWeight: 'bold'
  }
})

export default CustomerLogin
