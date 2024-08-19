import { GluegunToolbox } from 'gluegun'
import { Config, FCMConfig } from '../types'

const currentFirebaseConfiguration: (config: Config) => FCMConfig = (
  config
) => {
  const currentFirebaseConfigName = config.data.currentFcmConfigName
  if (!currentFirebaseConfigName) {
    throw new Error('No existing Firebase configuration found')
  }
  return config.data.fcmConfigs[currentFirebaseConfigName]
}

module.exports = {
  name: 'addDevicePushToken',
  alias: ['adt'],
  description:
    'Add a device push token to the list of device tokens for the current Firebase configuration',
  run: async (toolbox: GluegunToolbox) => {
    const {
      parameters,
      print: { info },
    } = toolbox

    const token = parameters.first

    const config = toolbox.config.load()

    const firebaseConfig = currentFirebaseConfiguration(config)

    firebaseConfig.devicePushTokens.push(token)

    config.save()

    info(`Added ${token} to device push tokens in config`)
  },
}
