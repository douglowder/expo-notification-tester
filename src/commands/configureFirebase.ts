import { GluegunToolbox } from 'gluegun'

module.exports = {
  name: 'configureFirebase',
  alias: ['cf'],
  description: 'Set Firebase name and private key path',
  run: async (toolbox: GluegunToolbox) => {
    const {
      parameters,
      print: { info },
    } = toolbox

    const fcmPrivateKeyPath =
      parameters.first === undefined
        ? undefined
        : (parameters.first as unknown as string)

    const fcmProjectName =
      parameters.second === undefined
        ? undefined
        : (parameters.second as unknown as string)

    if (!fcmPrivateKeyPath) {
      throw new Error('fcmPrivateKeyPath must be defined')
    }
    if (!fcmProjectName) {
      throw new Error('fcmProjectName must be defined')
    }

    const config = toolbox.config.load()

    config.data.fcmPrivateKeyPath = fcmPrivateKeyPath
    config.data.fcmProjectName = fcmProjectName
    config.save()

    info(
      `Set fcmProjectName to ${fcmProjectName} and fcmPrivateKeyPath to ${fcmPrivateKeyPath} in config`
    )
  },
}
