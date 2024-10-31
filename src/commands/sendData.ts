import { GluegunCommand, GluegunPrint } from 'gluegun'

import { Config } from '../types'

async function sendPushNotification(print: GluegunPrint, config: Config) {
  const useFCMv1 = config.data.useFcmV1

  const lastMessageIndex = config.data.lastMessageIndex + 1
  config.data.lastMessageIndex = lastMessageIndex
  config.save()

  const request = useFCMv1 ? 'true' : 'false'

  for (const expoPushToken of config.data.pushTokens) {
    const message = {
      to: expoPushToken,
      _contentAvailable: true,
      data: { someLocalData: 'goes here', messageIndex: lastMessageIndex },
    }
    print.debug(`Sending message ${JSON.stringify(message, null, 2)}`)

    const response = await fetch(
      `https://exp.host/--/api/v2/push/send?useFcmV1=${request}`,
      {
        method: 'POST',
        headers: {
          // Authorization: 'Bearer 80261fd9-9e7d-45c7-b8aa-9ddcb0ca782d',
          Accept: 'application/json',
          'Accept-encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      }
    )
    const readResponse = (response: Response) => response.json()
    const json = await readResponse(response)
    print.debug(`Response JSON: ${JSON.stringify(json, null, 2)}`)
  }
}

const command: GluegunCommand = {
  name: 'sendData',
  alias: ['sd'],
  description: 'Send a data-only/content-available notification',
  run: async (toolbox) => {
    const { print } = toolbox
    const config = toolbox.config.load() as unknown as Config
    await sendPushNotification(print, config)
  },
}

module.exports = command
