import { ExpoPushMessage } from 'expo-server-sdk'

export type TestMessage = ExpoPushMessage & {
  'content-available'?: number
  badge?: number
}

export type ConfigData = {
  pushTokens: string[]
  messages: TestMessage[]
}

export type Config = {
  data: ConfigData
  save: (data: ConfigData) => void
}
