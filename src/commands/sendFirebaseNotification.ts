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

    if (!config.data.fcmPrivateKeyPath?.length) {
      throw new Error('No FCM private key path defined')
    }
    if (!config.data.fcmProjectName?.length) {
      throw new Error('No FCM project name defined')
    }
    info(
      `Sending direct Firebase message, index = ${config.data.lastMessageIndex}`
    )

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const key = require(config.data.fcmPrivateKeyPath)
    const firebaseAccessToken = await getAccessTokenAsync(key)

    for (const deviceToken of config.data.devicePushTokens) {
      const messageBody = {
        message: {
          token: deviceToken,
          android: {
            notification: {
              channel_id: 'testApp',
              vibrate_timings: ['0s', '0.2s', '0.2s', '0.5s'],
            },
          },
          data: {
            message: 'Testing',
            title: `This is an FCM notification message ${config.data.lastMessageIndex}`,
            body: JSON.stringify({ title: 'bodyTitle', body: 'bodyBody' }),
            //scopeKey: '@brents/microfoam',
            //experienceId: '@brents/microfoam',
          },
        },
      }

      const response = await fetch(
        `https://fcm.googleapis.com/v1/projects/${config.data.fcmProjectName}/messages:send`,
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
    }
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
