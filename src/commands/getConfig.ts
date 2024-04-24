import { GluegunToolbox } from 'gluegun'

module.exports = {
  name: 'getConfig',
  alias: ['gc'],
  description: 'Read and display the config',
  run: async (toolbox: GluegunToolbox) => {
    const {
      print: { info },
    } = toolbox

    const config = toolbox.config.load()

    info(`${JSON.stringify(config, null, 2)}`)
  },
}
