import { GluegunToolbox } from 'gluegun'

module.exports = {
  name: 'Select Firebase configuration',
  alias: ['sfc'],
  description: 'Select a Firebase configuration',
  run: async (toolbox: GluegunToolbox) => {
    const {
      print: { info },
    } = toolbox

    const config = toolbox.config.load()

    if (!config.data.fcmConfigs) {
      throw new Error('No Firebase configuration has been added yet.')
    }

    const configKeys = Object.keys(config.data.fcmConfigs)

    const askConfigKey = {
      type: 'select',
      name: 'currentFcmConfigName',
      message: 'Please select an existing Firebase configuration to use',
      choices: [...configKeys],
    }

    const response = await toolbox.prompt.ask(askConfigKey)
    config.data.currentFcmConfigName = response.currentFcmConfigName

    config.save()

    info(
      `Set current Firebase configuration to ${config.data.currentFcmConfigName}`
    )
  },
}
