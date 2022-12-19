import {StatusBar} from 'expo-status-bar'
import {useState,useEffect} from 'react'
import {StyleSheet, Text, View, TouchableOpacity, Image, Dimensions,Platform} from 'react-native'

// import Amplify, { API } from 'aws-amplify'
// import awsconfig from './src/aws-exports';

import { Camera } from 'expo-camera'
import CamComp from './CamComp.js'

import { manipulateAsync, FlipType, SaveFormat } from 'expo-image-manipulator';

import * as FileSystem from 'expo-file-system';
import { saveAs } from 'file-saver'

// import * as tf from '@tensorflow/tfjs';

// Amplify.configure(awsconfig);
// API.configure(awsconfig);

//if hook call error, run rm -rf node_modules/expo-camera/node_modules/react

export default function App() {
  const [startCamera,setStartCamera] = useState(false)
  const [imagine, setImage] = useState(null)
  const [model, setModel] = useState(null);

//   useEffect(() => {
    
//     tf.loadLayersModel('https://tfhub.dev/tensorflow/efficientnet/lite0/feature-vector/2', {
//       mode: 'no-cors',
//       method: "post",
//       headers: {
//            "Content-Type": "application/json"
//       },
//       body: JSON.stringify(ob)
// }).then((model) => {
//       console.log(model)
//       setModel(model);
//     })

//   }, [])
  
  // function testAPI(event) {
  //   API.get('expoAPI', '/api')
  //      .then(response => {
  //        console.log(response)

  //      })
  //      .catch(error => {
  //        console.log(error)
  //      })
  // }

  const __startCamera = async () => {
    const {status} = await Camera.requestCameraPermissionsAsync().catch((error)=>console.log("requestsed???", error))
    if (status === 'granted') {
      // start the camera
      setStartCamera(true)
    } else {
      console.log(status)
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

    if (model != null) {
      const image = await FileSystem.readAsStringAsync(imageRef.uri, { encoding: FileSystem.EncodingType.Base64 });
      console.log(model)
    }

    // module = hub.Module("https://tfhub.dev/tensorflow/efficientnet/lite0/feature-vector/2")
    // height, width = hub.get_expected_image_size(module)
    // images = 
    // features = module(images)

    console.log(imageRef)
    // if (Platform.OS == 'web') {
    //   saveAs(imageRef.uri, 'image.jpg')
    // }
    
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
{/* 
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
          </TouchableOpacity> */}
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