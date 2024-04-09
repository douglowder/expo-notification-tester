import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { GluegunToolbox } from 'gluegun'

import type { Config, ConfigData } from '../types'

const CONFIG_FILE_NAME = '.expoNotificationTester'
const HOME_DIR =
  process.platform == 'win32' ? process.env.USERPROFILE : process.env.HOME
const CONFIG_FILE_PATH = join(HOME_DIR, CONFIG_FILE_NAME)
const DEFAULT_CONFIG_DATA: ConfigData = {
  pushTokens: [],
  messages: [
    {
      to: '', // Will be replaced by the real push tokens
      'content-available': 1,
      badge: 0,
      body: 'This is a test notification',
      // sound: 'default',
      data: { withSome: 'data' },
    },
  ],
}

const save = (data: ConfigData) => {
  const dataString = JSON.stringify(data, null, 2)
  writeFileSync(CONFIG_FILE_PATH, dataString, { encoding: 'utf-8' })
}

const load = (): Config => {
  let data: ConfigData

  try {
    const dataString = readFileSync(CONFIG_FILE_PATH, { encoding: 'utf-8' })
    data = JSON.parse(dataString)
  } catch (_error) {
    data = { ...DEFAULT_CONFIG_DATA }
  }
  return {
    data,
    save: () => save(data),
  }
}

const clear = () => {
  save(DEFAULT_CONFIG_DATA)
}

module.exports = (toolbox: GluegunToolbox) => {
  toolbox.config = {
    load,
    clear,
  }
}
