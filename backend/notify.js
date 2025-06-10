// notify.js
const { Expo } = require("expo-server-sdk");

// Create a single Expo SDK client instance
let expo = new Expo();

/**
 * Send a push notification to a given Expo push token
 * @param {string} pushToken - Expo push token (ExponentPushToken[...])
 * @param {string} title - Notification title
 * @param {string} body - Notification body
 */
async function sendNotification(pushToken, title, body) {
  if (!Expo.isExpoPushToken(pushToken)) {
    console.error("Invalid Expo push token:", pushToken);
    return;
  }

  const messages = [
    {
      to: pushToken,
      sound: "livechat.wav",
      title,
      body,
    },
  ];

  const chunks = expo.chunkPushNotifications(messages);

  for (let chunk of chunks) {
    try {
      const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
      console.log("Notification sent:", ticketChunk);
    } catch (error) {
      console.error("Failed to send notification:", error);
    }
  }
}

module.exports = sendNotification;
