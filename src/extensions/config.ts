import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { GluegunToolbox } from 'gluegun'
import { Expo } from 'expo-server-sdk'

import type { Config, ConfigData } from '../types'

const CONFIG_FILE_NAME = '.expoNotificationTester'
const HOME_DIR =
  process.platform == 'win32' ? process.env.USERPROFILE : process.env.HOME
const CONFIG_FILE_PATH = join(HOME_DIR, CONFIG_FILE_NAME)
const MIN_BURST_SIZE = 1
const MAX_BURST_SIZE = 20
const DEFAULT_CONFIG_DATA: ConfigData = {
  pushTokens: [],
  useFcmV1: true,
  lastMessageIndex: 0,
  burstSize: 1,
  defaultChannelId: 'Miscellaneous',
}

const validate = (data: ConfigData) => {
  if (typeof data.burstSize !== 'number') {
    throw new Error('burstSize must be a number')
  }
  if (data.burstSize < MIN_BURST_SIZE || data.burstSize > MAX_BURST_SIZE) {
    throw new Error(
      `burstSize must be at least ${MIN_BURST_SIZE} and at most ${MAX_BURST_SIZE}`
    )
  }
  for (const token of data.pushTokens) {
    if (!Expo.isExpoPushToken(token)) {
      throw new Error(`Token ${token} is not a valid Expo push token`)
    }
  }
}
const save = (data: ConfigData) => {
  validate(data)
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
