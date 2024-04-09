import { GluegunCommand, GluegunPrint } from 'gluegun'

import { Expo, ExpoPushMessage, ExpoPushTicket } from 'expo-server-sdk'

const testNotificationsAsync = async (
  print: GluegunPrint,
  pushTokens: string[],
  testMessages: (ExpoPushMessage & { 'content-available'?: number })[]
) => {
  // Create a new Expo SDK client
  // optionally providing an access token if you have enabled push security
  const expo = new Expo({
    useFcmV1: true, // this can be set to true in order to use the FCM v1 API
  })

  const messages = []

  for (const pushToken of pushTokens) {
    // Each push token looks like ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]

    // Check that all your push tokens appear to be valid Expo push tokens
    if (!Expo.isExpoPushToken(pushToken)) {
      print.error(`Push token ${pushToken} is not a valid Expo push token`)
      continue
    }

    // Construct a message (see https://docs.expo.io/push-notifications/sending-notifications/)
    testMessages.forEach((message) => {
      messages.push({
        ...message,
        to: pushToken,
      })
    })
  }

  // The Expo push notification service accepts batches of notifications so
  // that you don't need to send 1000 requests to send 1000 notifications. We
  // recommend you batch your notifications to reduce the number of requests
  // and to compress them (notifications with similar content will get
  // compressed).
  const chunks = expo.chunkPushNotifications(messages)
  const tickets: ExpoPushTicket[] = []
  // Send the chunks to the Expo push notification service. There are
  // different strategies you could use. A simple one is to send one chunk at a
  // time, which nicely spreads the load out over time:
  for (const chunk of chunks) {
    try {
      const ticketChunk = await expo.sendPushNotificationsAsync(chunk)
      print.debug(ticketChunk)
      tickets.push(...ticketChunk)
      // NOTE: If a ticket contains an error code in ticket.details.error, you
      // must handle it appropriately. The error codes are listed in the Expo
      // documentation:
      // https://docs.expo.io/push-notifications/sending-notifications/#individual-errors
    } catch (error) {
      print.error(error)
    }
  }
}

const command: GluegunCommand = {
  name: 'expo-notification-tester',
  run: async (toolbox) => {
    const { print } = toolbox
    const config = toolbox.config.load()
    await testNotificationsAsync(
      print,
      config.data.pushTokens,
      config.data.messages
    )
  },
}

module.exports = command
