import { GluegunToolbox } from 'gluegun'

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

    const [name, privateKeyPath, projectName, packageName] = parameters.array
    if (!name || !privateKeyPath || !projectName || !packageName) {
      throw new Error(
        'Missing parameters in command. Usage: cf <name> <private key path> <project name> <package name>'
      )
    }
    const config = toolbox.config.load()

    if (!config.data.fcmConfigs) {
      config.data.fcmConfigs = {}
    }

    config.data.fcmConfigs[name] = {
      privateKeyPath,
      projectName,
      packageName,
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
