import {StatusBar} from 'expo-status-bar'
import {useState} from 'react'
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native'

import Amplify, { API } from 'aws-amplify'
import awsconfig from './src/aws-exports';

import { Camera } from 'expo-camera'
import CamComp from './CamComp.js'

Amplify.configure(awsconfig);
API.configure(awsconfig);

export default function App() {
  const [startCamera,setStartCamera] = useState(false)
  
  function testAPI(event) {
    API.get('expoAPI', '/api')
       .then(response => {
         console.log(response)

       })
       .catch(error => {
         console.log(error)
       })
  }

  const __startCamera = async () => {
    const {status} = await Camera.requestCameraPermissionsAsync().catch((error)=>console.log(error))
    if (status === 'granted') {
      // start the camera
      setStartCamera(true)
    } else {
      alert('Access denied')
    }
  }

  const closeCamera = (snapshot) => {
    setStartCamera(false)

    console.log(snapshot)
  }

  return (
    <View style={styles.container}>
      {startCamera ? (
          <CamComp closeCamera={closeCamera}/>
      ) : (
        <View
          style={{
            flex: 1,
            backgroundColor: '#fff',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <TouchableOpacity
            onPress={__startCamera}
            style={{...styles.button, ...{
              width: 100, 
              height: 40}}}
          >
            <Text
              style={styles.text}
            >
              Take picture
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={testAPI}
            style={{...styles.button, ...{
              width: 100, 
              height: 40}}}
          >
            <Text
              style={styles.text}
            >
              API Call
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <StatusBar style="auto" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  button: {
    borderRadius: 4,
    backgroundColor: '#14274e',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  text: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center'
  }
})