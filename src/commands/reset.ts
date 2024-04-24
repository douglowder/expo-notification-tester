import { GluegunToolbox } from 'gluegun'

module.exports = {
  name: 'reset',
  alias: ['r'],
  description: 'Reset the config to the defaults and clear all push tokens',
  run: async (toolbox: GluegunToolbox) => {
    const {
      print: { info },
    } = toolbox

    toolbox.config.clear()

    info(`Cleared and reset config`)
  },
}
