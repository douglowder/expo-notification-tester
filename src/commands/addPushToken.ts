import { GluegunToolbox } from 'gluegun'

module.exports = {
  name: 'addPushToken',
  alias: ['apt'],
  run: async (toolbox: GluegunToolbox) => {
    const {
      parameters,
      print: { info },
    } = toolbox

    const token = parameters.first

    const config = toolbox.config.load()

    config.data.pushTokens.push(token)

    config.save()

    info(`Added ${token} to push tokens in config`)
  },
}
