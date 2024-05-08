import { GluegunToolbox } from 'gluegun'

module.exports = {
  name: 'badgeNumber',
  alias: ['ba'],
  description:
    'Set the badge number. If argument is not passed in, removes the badge number from the config',
  run: async (toolbox: GluegunToolbox) => {
    const {
      parameters,
      print: { info },
    } = toolbox

    const badge =
      parameters.first === undefined
        ? undefined
        : (parameters.first as unknown as number)

    const config = toolbox.config.load()

    config.data.badge = badge

    config.save()

    info(`Set badgeNumber to ${badge} in config`)
  },
}
