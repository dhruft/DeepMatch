import {StatusBar} from 'expo-status-bar'
import {useState} from 'react'
import {StyleSheet, Text, View, TouchableOpacity, Image, Dimensions,Platform} from 'react-native'

import Amplify, { API } from 'aws-amplify'
import awsconfig from './src/aws-exports';

import { Camera } from 'expo-camera'
import CamComp from './CamComp.js'

import { manipulateAsync, FlipType, SaveFormat } from 'expo-image-manipulator';

import * as FileSystem from 'expo-file-system';
import { saveAs } from 'file-saver'

Amplify.configure(awsconfig);
API.configure(awsconfig);

export default function App() {
  const [startCamera,setStartCamera] = useState(false)
  const [imagine, setImage] = useState(null)
  
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
      alert(status)
    }
  }

  const closeCamera = () => {
    setStartCamera(false)
  }

  const submitImage = async (snapshot, doFlip) => {

    setStartCamera(false)

    const formattedImage = await manipulateAsync(
      snapshot.localUri || snapshot.uri,
      [{ crop: {
        height: snapshot.height,
        width: snapshot.height*0.5,
        originX: snapshot.width*0.5 - snapshot.height*0.5*0.5,
        originY: 0
      } },
       {resize: {
        width: 240
      }},
      { crop: {
        height: 370,
        width: 240,
        originX: 0,
        originY: 0
      } },
      doFlip ? {
        flip:FlipType.Horizontal
      } : {
        resize : {
          width: 240
        }
      }
    ],
      { format: SaveFormat.PNG }
    );

    onSaveImageAsync(formattedImage)
    
    setImage(formattedImage.uri)
    console.log(formattedImage)
  }

  const onSaveImageAsync = async (imageRef) => {
    console.log(imageRef)
    if (Platform.OS == 'web') {
      saveAs(imageRef.uri, 'image.jpg')
    }
    
  };
  


  return (
    <View style={styles.container}>
      {startCamera ? (
          <CamComp closeCamera={closeCamera} submitImage={submitImage} />
      ) : (
        <View
          style={{
            flex: 1,
            backgroundColor: '#fff',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          {
            (imagine !== null) && <Image
            style={{height: '100%', aspectRatio:0.5}}
            source={imagine}
            />
          }
          

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