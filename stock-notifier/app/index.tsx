import React, { useEffect, useState } from "react";
import { Text, View, Button, Platform } from "react-native";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});
Notifications.setNotificationChannelAsync("new_stock", {
  name: "New Stock Channel",
  importance: Notifications.AndroidImportance.HIGH,
  sound: "livechat.wav",
});
export default function App() {
  const [expoPushToken, setExpoPushToken] = useState("");

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => {
      if (token) {
        setExpoPushToken(token);
        // TODO: send token to your Node.js server
        console.log("Expo Push Token:", token);
      }
    });
    getToken();
  }, []);

  async function getToken() {
    console.log("getToken");
    try {
      const token = (
        await Notifications.getExpoPushTokenAsync({
          projectId: "48a967ff-e36f-4060-8285-b40d7da78678", // replace with your real projectId
        })
      ).data;
      console.log(token);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Your push token:</Text>
      <Text selectable>{expoPushToken}</Text>
    </View>
  );
}

async function registerForPushNotificationsAsync() {
  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return null;
    }

    const token = (await Notifications.getExpoPushTokenAsync()).data;
    return token;
  } else {
    alert("Must use physical device for Push Notifications");
    return null;
  }
}
