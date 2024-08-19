import { GluegunToolbox } from 'gluegun'
import { JWT } from 'google-auth-library'

import { Config } from '../types'

module.exports = {
  name: 'sendFirebaseNotification',
  alias: ['sfn'],
  description: 'Send firebase notification',
  run: async (toolbox: GluegunToolbox) => {
    const {
      parameters,
      print: { info },
    } = toolbox

    const config = toolbox.config.load() as unknown as Config
    config.data.lastMessageIndex = config.data.lastMessageIndex + 1

    if (!config.data.currentFcmConfigName) {
      throw new Error('No default Firebase configuration has been set')
    }

    const fcmPrivateKeyPath =
      config.data.fcmConfigs[config.data.currentFcmConfigName].privateKeyPath
    const fcmProjectName =
      config.data.fcmConfigs[config.data.currentFcmConfigName].projectName
    const fcmPackageName =
      config.data.fcmConfigs[config.data.currentFcmConfigName].packageName
    const devicePushTokens =
      config.data.fcmConfigs[config.data.currentFcmConfigName].devicePushTokens

    const messagePattern =
      parameters.first === undefined
        ? 'a{nd}'
        : (parameters.first as unknown as string)

    const baseMessageBody = sampleMessageBody(
      messagePattern,
      config,
      fcmPackageName
    )

    info(`Message body = ${JSON.stringify(baseMessageBody, null, 2)}`)

    info(
      `Sending direct Firebase message, index = ${config.data.lastMessageIndex}`
    )

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const key = require(fcmPrivateKeyPath)
    const firebaseAccessToken = await getAccessTokenAsync(key)

    info(`firebaseAccessToken = ${firebaseAccessToken}`)

    for (const deviceToken of devicePushTokens) {
      const messageBody = {
        message: {
          ...baseMessageBody,
          token: deviceToken,
        },
      }

      const response = await fetch(
        `https://fcm.googleapis.com/v1/projects/${fcmProjectName}/messages:send`,
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

function sampleMessageBody(
  messagePattern: string,
  config: Config,
  fcmPackageName: string
) {
  const sampleNotificationJson = {
    channel_id: config.data.defaultChannelId,
    vibrate_timings: ['0s', '2.0s', '1.0s', '1.0s', '1.0s', '1.0s'],
    sound: 'testSample',
    image:
      'https://avatars.githubusercontent.com/u/6577821?s=400&u=f1923761eaad2af0ecdd60386611229246a68917&v=4',
  }

  const sampleData = {
    message: 'Testing',
    title: `This is an FCM notification message ${config.data.lastMessageIndex}`,
    subtitle: 'FCM subtitle',
    body: 'bodyBody',
    url: '/(tabs)/settings',
    //scopeKey: '@brents/microfoam',
    //experienceId: '@brents/microfoam',
  }

  const sampleMessageBody = {}

  let i = 0
  let currentObject: any = sampleMessageBody
  let previousObject: any = sampleMessageBody

  while (i < messagePattern.length) {
    const current = messagePattern.charAt(i)
    switch (current) {
      case 'a':
        currentObject.android = {
          restricted_package_name: fcmPackageName,
        }
        break
      case '{':
        previousObject = currentObject
        currentObject = currentObject.android
        break
      case 'd':
        currentObject.data = sampleData
        break
      case 'n':
        currentObject.notification = sampleNotificationJson
        break
      case '}':
        currentObject = previousObject
        break
    }
    i++
  }

  return sampleMessageBody
}
