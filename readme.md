# expo-notification-tester CLI

A CLI for testing Expo push notifications with `expo-server-sdk`.

```
$ expo-notification-tester help
expo-notification-tester version 0.0.1

  expo-notification-tester    -                                                                                                             
  version (v)                 Output the version number                                                                                     
  send (s)                    (default command) Sends <burstSize> notifications to each push token in the list of push tokens in the config 
  reset (r)                   Reset the config to the defaults and clear all push tokens                                                    
  getConfig (gc)              Read and display the config                                                                                   
  clearPushTokens (cpt)       Clear all push tokens in the configuration                                                                    
  channelId (cid)             Set the channel ID for notifications                                                                          
  burstSize (b)               Set the number of notifications in the burst to be sent                                                       
  badgeNumber (ba)            Set the badge number. If argument is not passed in, removes the badge number from the config                  
  addPushToken (apt)          Add an Expo push token to the list of tokens to receive notifications                                         
  help (h)                    -                                                                                                             
```

# Made with Gluegun

Check out the documentation at https://github.com/infinitered/gluegun/tree/master/docs.

# License

MIT - see LICENSE

