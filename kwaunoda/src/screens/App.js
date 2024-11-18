import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Home from "./src/screens/Home";
import Safety from "./src/screens/Safety";
import SignUpDriver from "./src/screens/SignUpDriver";
import Feedback from "./src/screens/Feedback";
import NewDelivery from "./src/screens/NewDelivery";
import HomeDriver from "./src/screens/HomeDriver";
import SignUpCustomer from "./src/screens/SignUpCustomer";
import CustomerLogin from "./src/screens/CustomerLogin";
import ProfileInformation from "./src/screens/ProfileInformation";
import AboutUs from "./src/screens/AboutUs";
import Complaint from "./src/screens/Complaint";
import History from "./src/screens/History";
import DeliveryNotice from "./src/screens/DeliveryNotice";
import CustomerEndTrip from "./src/screens/CustomerEndTrip";
import DriverEndTrip from "./src/screens/DriverEndTrip";
import DeliveryAccepted from "./src/screens/DeliveryAccepted";
import FAQ from "./src/screens/FAQ";
import CustomerProfile from "./src/screens/CustomerProfile";
import CustomerSafety from "./src/screens/CustomerSafety";
import CustomerAboutUs from "./src/screens/CustomerAboutUs";
import CustomerHistory from "./src/screens/CustomerHistory";
import CustomerFeedback from "./src/screens/CustomerFeedback";
import CustomerComplaint from "./src/screens/CustomerComplaint";
import SplashScreen from "./src/screens/SplashScreen";
import SplashScreen2 from "./src/screens/SplashScreen2";
import SplashScreen3 from "./src/screens/SplashScreen3";
import settings from "./src/screens/settings";
import EditProfile from "./src/screens/EditProfile";
import ChangePassword from "./src/screens/ChangePassword";
import Dashboard from "./src/screens/Dashboard";
import SignUpCustomer2 from "./src/screens/SignUpCustomer2";
import SignUpCustomer3 from "./src/screens/SignUpCustomer3";
import SignUpDriver1 from "./src/screens/SignUpDriver1";
import DriverDeliveryAccepted from "./src/screens/DriverDeliveryAccepted";
import Toast from "react-native-toast-message";
import MapViewComponent from "./src/screens/MapViewComponent"; // Import the MapViewComponent
import LocationTracker from "./src/screens/locationTracker"; //
import DriverNewOrderList from "./src/screens/DriverNewOrderList"; //
import InTransitTrip from "./src/screens/InTransitTrip";
import OTPDriver from "./src/screens/OTPDriver";
import OTPCustomer from "./src/screens/OTPCustomer";
import Welcome from "./src/screens/Welcome";
import AccountInError from "./src/screens/AccountInError.js";
import DriverChat from "./src/screens/DriverChat.js";
import CustomerChat from "./src/screens/CustomerChat.js";
import CustomerAdminChat from "./src/screens/CustomerAdminChat.js";
import Wallet from "./src/screens/Wallet.js";
import Invite from "./src/screens/Invite.js";
import PesePaymentScreen from "./src/screens/Pesepay.js";

const Stack = createStackNavigator();
const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="CustomerLogin" component={CustomerLogin} />
        <Stack.Screen
          name="DriverNewOrderList"
          component={DriverNewOrderList}
        />
        <Stack.Screen name="InTransitTrip" component={InTransitTrip} />
        <Stack.Screen name="CustomerEndTrip" component={CustomerEndTrip} />
        <Stack.Screen name="Invite" component={Invite} />
        <Stack.Screen name="DriverChat" component={DriverChat} />
        <Stack.Screen name="CustomerChat" component={CustomerChat} />
        <Stack.Screen name="Wallet" component={Wallet} />
        <Stack.Screen name="CustomerAdminChat" component={CustomerAdminChat} />
        <Stack.Screen name="SignUpCustomer3" component={SignUpCustomer3} />
        <Stack.Screen name="OTPCustomer" component={OTPCustomer} />
        <Stack.Screen name="Welcome" component={Welcome} />
        <Stack.Screen name="OTPDriver" component={OTPDriver} />
        <Stack.Screen name="SplashScreen" component={SplashScreen} />
        <Stack.Screen name="MapView" component={MapViewComponent} />
        <Stack.Screen name="HomeDriver" component={HomeDriver} />
        <Stack.Screen name="LocationTracker" component={LocationTracker} />
        <Stack.Screen name="SignUpCustomer" component={SignUpCustomer} />
        <Stack.Screen name="SignUpCustomer2" component={SignUpCustomer2} />
        <Stack.Screen name="ChangePassword" component={ChangePassword} />
        <Stack.Screen name="DeliveryNotice" component={DeliveryNotice} />
        <Stack.Screen
          name="ProfileInformation"
          component={ProfileInformation}
        />
        <Stack.Screen name="DriverEndTrip" component={DriverEndTrip} />
        <Stack.Screen name="Complaint" component={Complaint} />
        <Stack.Screen name="EditProfile" component={EditProfile} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="DeliveryAccepted" component={DeliveryAccepted} />
        <Stack.Screen
          name="DriverDeliveryAccepted"
          component={DriverDeliveryAccepted}
        />
        <Stack.Screen name="SignUpDriver" component={SignUpDriver} />
        <Stack.Screen name="SignUpDriver1" component={SignUpDriver1} />
        <Stack.Screen name="CustomerSafety" component={CustomerSafety} />
        <Stack.Screen name="CustomerHistory" component={CustomerHistory} />
        <Stack.Screen name="settings" component={settings} />
        <Stack.Screen name="CustomerAboutUs" component={CustomerAboutUs} />
        <Stack.Screen name="CustomerFeedback" component={CustomerFeedback} />
        <Stack.Screen name="CustomerProfile" component={CustomerProfile} />
        <Stack.Screen name="NewDelivery" component={NewDelivery} />
        <Stack.Screen name="Feedback" component={Feedback} />
        <Stack.Screen name="SplashScreen2" component={SplashScreen2} />
        <Stack.Screen name="Dashboard" component={Dashboard} />
        <Stack.Screen name="SplashScreen3" component={SplashScreen3} />
        <Stack.Screen name="CustomerComplaint" component={CustomerComplaint} />
        <Stack.Screen name="FAQ" component={FAQ} />
        <Stack.Screen name="AboutUs" component={AboutUs} />
        <Stack.Screen name="Safety" component={Safety} />
        <Stack.Screen name="History" component={History} />
        <Stack.Screen name="AccountInError" component={AccountInError} />
        <Stack.Screen name="MapViewComponent" component={MapViewComponent} />
        <Stack.Screen name="PesepayView" component={PesePaymentScreen} />
      </Stack.Navigator>
      <Toast />
    </NavigationContainer>
  );
};

export default App;
