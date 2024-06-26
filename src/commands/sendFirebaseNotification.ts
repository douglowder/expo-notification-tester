import { GluegunToolbox } from 'gluegun'
import { JWT } from 'google-auth-library'

import { Config } from '../types'

module.exports = {
  name: 'sendFirebaseNotification',
  alias: ['sfn'],
  description: 'Send firebase notification',
  run: async (toolbox: GluegunToolbox) => {
    const {
      print: { info },
    } = toolbox
    const config = toolbox.config.load() as unknown as Config
    config.data.lastMessageIndex = config.data.lastMessageIndex + 1

    info(
      `Sending direct Firebase message, index = ${config.data.lastMessageIndex}`
    )

    if (!process.env.EXPO_NOTIFICATION_DEVICE_TOKEN) {
      throw new Error(
        'Environment variable EXPO_NOTIFICATION_DEVICE_TOKEN not defined'
      )
    }

    if (!process.env.EXPO_NOTIFICATION_PRIVATE_KEY) {
      throw new Error(
        'Environment variable EXPO_NOTIFICATION_PRIVATE_KEY not defined'
      )
    }

    if (!process.env.EXPO_NOTIFICATION_PROJECT_NAME) {
      throw new Error(
        'Environment variable EXPO_NOTIFICATION_PROJECT_NAME not defined'
      )
    }

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const key = require(process.env.EXPO_NOTIFICATION_PRIVATE_KEY)
    const firebaseAccessToken = await getAccessTokenAsync(key)

    const deviceToken = process.env.EXPO_NOTIFICATION_DEVICE_TOKEN

    const messageBody = {
      message: {
        token: deviceToken,
        data: {
          channelId: 'default',
          message: 'Testing',
          title: `This is an FCM notification message ${config.data.lastMessageIndex}`,
          body: JSON.stringify({ title: 'bodyTitle', body: 'bodyBody' }),
          scopeKey: '@brents/microfoam',
          experienceId: '@brents/microfoam',
        },
      },
    }

    const response = await fetch(
      `https://fcm.googleapis.com/v1/projects/${process.env.EXPO_NOTIFICATION_PROJECT_NAME}/messages:send`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${firebaseAccessToken}`,
          Accept: 'application/json',
          'Accept-encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messageBody),
      }
    )
    const readResponse = (response: Response) => response.json()
    const json = await readResponse(response)
    info(`Response JSON: ${JSON.stringify(json, null, 2)}`)

    config.save()
  },
}

function getAccessTokenAsync(key: any) {
  return new Promise(function (resolve, reject) {
    const jwtClient = new JWT(
      key.client_email,
      null,
      key.private_key,
      ['https://www.googleapis.com/auth/cloud-platform'],
      null
    )
    jwtClient.authorize(function (err, tokens) {
      if (err) {
        reject(err)
        return
      }
      resolve(tokens.access_token)
    })
  })
}
