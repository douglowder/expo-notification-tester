import { GluegunToolbox } from 'gluegun'
import { PromptOptions } from 'gluegun/build/types/toolbox/prompt-enquirer-types'

module.exports = {
  name: 'configureFirebase',
  alias: ['cf'],
  description:
    'Set Firebase configuration (cf <name> <private key path> <project name> <package name>)',
  run: async (toolbox: GluegunToolbox) => {
    const {
      parameters,
      print: { info },
    } = toolbox

    let [name, privateKeyPath, projectName, packageName] = parameters.array
    if (name === undefined) {
      name = (
        await toolbox.prompt.ask({
          type: 'input',
          name: 'selection',
          message: 'FCM configuration name?',
          default: 'doug',
        } as PromptOptions)
      ).selection
    }
    if (privateKeyPath === undefined) {
      privateKeyPath = (
        await toolbox.prompt.ask({
          type: 'input',
          name: 'selection',
          message: 'Private key path?',
        } as PromptOptions)
      ).selection
    }
    if (projectName === undefined) {
      projectName = (
        await toolbox.prompt.ask({
          type: 'input',
          name: 'selection',
          message: 'Firebase project name?',
        } as PromptOptions)
      ).selection
    }
    if (packageName === undefined) {
      packageName = (
        await toolbox.prompt.ask({
          type: 'input',
          name: 'selection',
          message: 'Package name?',
        } as PromptOptions)
      ).selection
    }

    const config = toolbox.config.load()

    if (!config.data.fcmConfigs) {
      config.data.fcmConfigs = {}
    }

    config.data.fcmConfigs[name] = {
      privateKeyPath,
      projectName,
      packageName,
      devicePushTokens: [],
    }

    // Set the default config name if it has not already been set
    if (!config.data.currentFcmConfigName) {
      config.data.currentFcmConfigName = name
    }

    config.save()

    info(
      `Added Firebase configuration ${name} with parameters ${JSON.stringify(
        config.data.fcmConfigs[name],
        null,
        2
      )}`
    )
  },
}
