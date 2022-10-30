import {StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native'
import { Camera,CameraType, FlashMode } from 'expo-camera'
import {useState} from 'react'

import flip from './src/flip.png'
import flashIcon from './src/flash.png'
import noFlashIcon from './src/noFlash.png'
import submitIcon from './src/submit.png'
import retakeIcon from './src/retake.png'

import { manipulateAsync, FlipType, SaveFormat } from 'expo-image-manipulator';
import {useEffect} from 'react'

export default function CamComp({ closeCamera }) {
    const [type, setType] = useState(CameraType.back);
    const [flash, setFlash] = useState(Camera.Constants.FlashMode.off);
    const [snapshot, setSnap] = useState(null)
    let camera = Camera

    const [availableCameras, setAvailableCameras] = useState([])

    const __takePicture = async () => {
        if (!camera) return
        var photo = await camera.takePictureAsync().catch((error)=>console.log(error))

        console.log(CameraType.front, type)

        console.log(availableCameras)

        // if (type === CameraType.front || availableCameras.length < 2) {
        //   photo = manipulateAsync(
        //       photo.localUri || photo.uri,
        //       [
        //           { rotate: 180 },
        //           { flip: FlipType.Vertical },
        //       ],
        //       { compress: 1, format: SaveFormat.PNG }
        //   )
        // }

        setSnap(photo)
  
    }
    
    function toggleCameraType() {
      setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
    }

    function toggleFlash() {
      setFlash(current => (current === Camera.Constants.FlashMode.off ? Camera.Constants.FlashMode.on : Camera.Constants.FlashMode.off));
    }

    const retake = () => {
      setSnap(null)
    }

    // useEffect(() => {
    //   Camera.getAvailableCameraTypesAsync().then((cameras)=>{
    //     console.log(cameras)
    //     setAvailableCameras(cameras)
    //   })
    // }, [])

    return (
        <View style={{width:"100%",height:"100%",}}>
        {snapshot === null ? 
          <View style={{width:"100%",height:"100%",}}>
          
            <Camera
              style={{
                flex: 1,
                width:"100%",}}
              ref={(r) => {
                camera = r
              }}
              type={type}
              flashMode={flash}>

            </Camera>

          <View style={styles.cameraMenu}>

            <View style={styles.cameraButtons}>

              <TouchableOpacity
                onPress={toggleFlash}>
                <Image
                  style={styles.tinyButton}
                  source={flash===Camera.Constants.FlashMode.on ? flashIcon : noFlashIcon}
                />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={__takePicture}
                style={styles.takePicture}
              />

              <TouchableOpacity
                onPress={toggleCameraType}>
                <Image
                  style={styles.tinyButton}
                  source={flip}
                  disabled={availableCameras.length < 2}
                />
              </TouchableOpacity>

            </View>
          </View> 

        </View>
        : 
        <View style={{width:"100%",height:"100%",}}>
          <Image
            style={{width:'100%', height:'100%'}}
            source={snapshot}
          />

          <View style={styles.cameraMenu}>

            <View style={styles.submission}>

              <TouchableOpacity
              onPress={() => {closeCamera(snapshot)}}
              >
                <Image
                  style={styles.largeButton}
                  source={submitIcon}
                />
              </TouchableOpacity>

              <TouchableOpacity
              onPress={retake}>
                <Image
                  style={styles.largeButton}
                  source={retakeIcon}
                />
              </TouchableOpacity>

            </View>

          </View>

        </View>
        }
      </View>
    )
}

const styles = StyleSheet.create({
    text: {
      color: '#fff',
      fontWeight: 'bold',
      textAlign: 'center'
    },
    cameraMenu: {
      opacity: 0.75,
  
      position: 'absolute',
      bottom: 0,
      height: 215,
      width: '100%',
      backgroundColor: '#000',
  
      alignItems: 'center',
      justifyContent: 'center',
    },
    cameraButtons: {
      width: 225,

      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: 'center',
    },
    takePicture: {
      width: 80,
      height: 80,
      bottom: 0,
      borderRadius: 50,
      backgroundColor: '#fff',
    },
    tinyButton: {
      width: 50,
      height: 50,
    },
    submission: {
      width: '100%',

      display: "flex",
      flexDirection: "row",
      justifyContent: "space-evenly",
      alignItems: 'center',
    },
    largeButton: {
      width: 150,
      height: 102.564102564
    }
  })