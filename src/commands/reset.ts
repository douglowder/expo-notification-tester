import { GluegunToolbox } from 'gluegun'

module.exports = {
  name: 'reset',
  alias: ['r'],
  run: async (toolbox: GluegunToolbox) => {
    const {
      print: { info },
    } = toolbox

    toolbox.config.clear()

    info(`Cleared and reset config`)
  },
}
