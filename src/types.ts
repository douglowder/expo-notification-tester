import { ExpoPushMessage } from 'expo-server-sdk'

export type TestMessage = ExpoPushMessage & {
  'content-available'?: number
  badge?: number
}

export type ConfigData = {
  pushTokens: string[]
  lastMessageIndex: number
  useFcmV1: boolean
}

export type Config = {
  data: ConfigData
  save: () => void
}
