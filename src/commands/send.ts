import { GluegunCommand, GluegunPrint } from 'gluegun'

import { Expo, ExpoPushTicket } from 'expo-server-sdk'
import { Config, TestMessage } from '../types'

const messageTemplate: TestMessage = {
  to: '', // Will be replaced by the real push tokens
  'content-available': 1,
  title: 'This is a test notification',
  body: 'This is a test notification',
  // sound: 'default',
  data: {
    title: 'This is the data in a test notification',
    body: 'This is the data in a test notification',
  },
}

const testNotificationsAsync = async (print: GluegunPrint, config: Config) => {
  // Create a new Expo SDK client
  // optionally providing an access token if you have enabled push security
  const expo = new Expo({
    useFcmV1: config.data.useFcmV1, // this can be set to true in order to use the FCM v1 API
  })

  let lastMessageIndex = config.data.lastMessageIndex

  const testMessages = []
  const messagesToSend: TestMessage[] = []

  const messageCount = config.data.burstSize

  for (let i = 0; i < messageCount; i++) {
    lastMessageIndex = lastMessageIndex + 1
    const message = {
      ...messageTemplate,
      title: `${messageTemplate.title} ${lastMessageIndex}`,
      data: {
        ...messageTemplate.data,
        title: `${messageTemplate.data.title} ${lastMessageIndex}`,
      },
      badge: config.data.badge,
      channelId: config.data.defaultChannelId,
    }
    print.debug(
      `Sending message with index ${lastMessageIndex} and channel ID ${config.data.defaultChannelId}`
    )
    testMessages.push(message)
  }

  config.data.lastMessageIndex = lastMessageIndex
  config.save()

  for (const pushToken of config.data.pushTokens) {
    // Each push token looks like ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]

    // Check that all your push tokens appear to be valid Expo push tokens
    if (!Expo.isExpoPushToken(pushToken)) {
      print.error(`Push token ${pushToken} is not a valid Expo push token`)
      continue
    }

    // Construct a message (see https://docs.expo.io/push-notifications/sending-notifications/)
    testMessages.forEach((message) => {
      messagesToSend.push({
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
  const chunks = expo.chunkPushNotifications(messagesToSend)
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
  name: 'send',
  alias: ['s'],
  description:
    '(default command) Sends <burstSize> notifications to each push token in the list of push tokens in the config',
  run: async (toolbox) => {
    const { print } = toolbox
    const config = toolbox.config.load() as unknown as Config
    await testNotificationsAsync(print, config)
  },
}

module.exports = command
