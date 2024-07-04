import { GluegunToolbox } from 'gluegun'

module.exports = {
  name: 'addDevicePushToken',
  alias: ['adt'],
  description:
    'Add a device push token to the list of tokens to receive notifications',
  run: async (toolbox: GluegunToolbox) => {
    const {
      parameters,
      print: { info },
    } = toolbox

    const token = parameters.first

    const config = toolbox.config.load()

    config.data.devicePushTokens.push(token)

    config.save()

    info(`Added ${token} to device push tokens in config`)
  },
}
