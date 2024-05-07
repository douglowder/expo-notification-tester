import { GluegunToolbox } from 'gluegun'

module.exports = {
  name: 'channelId',
  alias: ['cid'],
  description: 'Set the channel ID for notifications',
  run: async (toolbox: GluegunToolbox) => {
    const {
      parameters,
      print: { info },
    } = toolbox

    const channelId = parameters.first

    const config = toolbox.config.load()

    config.data.defaultChannelId = channelId

    config.save()

    info(`Set default channel ID to ${channelId} in config`)
  },
}
