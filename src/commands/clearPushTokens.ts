import { GluegunToolbox } from 'gluegun'

module.exports = {
  name: 'clearPushTokens',
  alias: ['cpt'],
  description:
    'Clear all push tokens and device push tokens in the configuration',
  run: async (toolbox: GluegunToolbox) => {
    const {
      print: { info },
    } = toolbox

    const config = toolbox.config.load()

    config.data.pushTokens = []
    config.data.devicePushTokens = []

    config.save()

    info(`Cleared push tokens in config`)
  },
}
