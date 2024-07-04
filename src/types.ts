import { ExpoPushMessage } from 'expo-server-sdk'

export type TestMessage = ExpoPushMessage & {
  'content-available'?: number
  badge?: number
  data: { [key: string]: any }
}

export type ConfigData = {
  pushTokens: string[]
  devicePushTokens: string[]
  fcmPrivateKeyPath: string
  fcmProjectName: string
  lastMessageIndex: number
  defaultChannelId: string
  useFcmV1: boolean
  burstSize: number
  badge?: number
}

export type Config = {
  data: ConfigData
  save: () => void
}
