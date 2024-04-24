import { GluegunToolbox } from 'gluegun'

module.exports = {
  name: 'burstSize',
  alias: ['b'],
  description: 'Set the number of notifications in the burst to be sent',
  run: async (toolbox: GluegunToolbox) => {
    const {
      parameters,
      print: { info },
    } = toolbox

    const burstSize = parameters.first

    const config = toolbox.config.load()

    config.data.burstSize = burstSize

    config.save()

    info(`Set burstSize to ${burstSize} in config`)
  },
}
