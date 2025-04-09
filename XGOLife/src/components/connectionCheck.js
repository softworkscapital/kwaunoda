// ConnectivityChecker.js
import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import Toast from 'react-native-toast-message';

const ConnectivityChecker = () => {
    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
          const connectionType = state.type;
          const isConnected = state.isConnected;
    
          if (isConnected) {
            let strengthMessage = '';
            
            switch (connectionType) {
              case 'wifi':
                strengthMessage = 'Connected to Wi-Fi (Strong connection)';
                break;
              case 'cellular':
                strengthMessage = 'Connected to Cellular (Moderate connection)';
                break;
              case 'unknown':
                strengthMessage = 'Connection type unknown';
                break;
              default:
                strengthMessage = 'No internet connection';
            }
    
            // Toast for strong connections
            if (connectionType === 'wifi' || connectionType === 'cellular') {
              console.log("running")
              Toast.show({
                text1: 'Connectivity Status',
                text2: strengthMessage,
                type: 'success',
              });
            }
          } else {
            Toast.show({
              text1: 'Connectivity Status',
              text2: 'No internet connection',
              type: 'error',
            });
          }
        });
    
        // Check initial connectivity
        // const fetchData = async () => {
        //   const state = await NetInfo.fetch()
        //   setIsConnected(state.isConnected)
        //   setConnectionType(state.type)
        //   unsubscribe(state);
        // }
    
        // fetchData()
        unsubscribe();
    
        const intervalId = setInterval(() => {
          unsubscribe();
          // fetchData();
        }, 500)
    
        return () => clearInterval(intervalId)
      }, [])
};

export default ConnectivityChecker;