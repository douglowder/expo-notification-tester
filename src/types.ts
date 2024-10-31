import { ExpoPushMessage } from 'expo-server-sdk'

export type TestMessage = ExpoPushMessage & {
  'content-available'?: number
  _contentAvailable?: true
  badge?: number
  data: { [key: string]: any }
}

export type FCMConfig = {
  privateKeyPath: string // Path to the JSON file containing your FCM private key
  projectName: string // The name of the Firebase project for your app
  packageName: string // The Android package name of your app
  devicePushTokens: string[]
}

export type ConfigData = {
  pushTokens: string[]
  fcmConfigs: { [key: string]: FCMConfig }
  currentFcmConfigName?: string
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
