import React, { useEffect, useState } from "react";
import { StyleSheet, View, ActivityIndicator, Alert } from "react-native";
import { WebView } from "react-native-webview";
import { useRoute } from '@react-navigation/native';

const TripTrack = () => {
    const route = useRoute();
    const { trip } = route.params;
    const [loading, setLoading] = useState(true);
    const [webViewUrl, setWebViewUrl] = useState(null);

    useEffect(() => {
        const fetchTripData = async () => {
            if (trip && trip.trip_id) {
                setWebViewUrl(`https://xgolifedash.softworkscapital.com/Track/${trip.trip_id}`);
            } else {
                Alert.alert("Error", "No in-transit trips found.");
            }
            setLoading(false); // Stop loading after checking the trip data
        };

        fetchTripData();
    }, [trip]);

    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                webViewUrl && (
                    <WebView
                        source={{ uri: webViewUrl }}
                        style={styles.webview}
                        cacheEnabled={false}
                    />
                )
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFCC00",
    },
    webview: {
        flex: 1,
    },
});

export default TripTrack;