import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ImageBackground,
  PermissionsAndroid,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

import UploadIcon from '../assets/Icons/Upload_Icon.svg';
import CameraIcon from '../assets/Icons/Camera_Icon.svg';
import useAIStore from '../stores/AIStore';

// 카메라 권한
async function requestCameraPermission() {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: "카메라 접근 권한",
        message: "앱에서 사진을 찍으려면 카메라 권한이 필요합니다.",
        buttonNeutral: "나중에",
        buttonNegative: "취소",
        buttonPositive: "확인"
      }
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log("카메라 권한 허용됨");
      return true;
    } else {
      console.log("카메라 권한 거부됨");
      return false;
    }
  } catch (err) {
    console.warn(err);
    return false;
  }
}

// 메인페이지
function AIView(): React.JSX.Element {
  const navigation = useNavigation();
  const route = useRoute();

  const { setImage } = useAIStore();
  const [photo, setPhoto] = useState(null);

  const handleUpload = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: true,
    };

    // 갤러리에서 이미지 선택
    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('사용자가 취소함');
      } else if (response.errorCode) {
        console.log('에러: ', response.errorMessage);
      } else {
        const source = { uri: response.assets[0].uri };
        setPhoto(response); // 선택된 이미지를 미리보기 위해 Base64로 설정
        setImage(response.assets[0].base64); // Base64 이미지 데이터를 Zustand 스토어에 추가
      }
    });
  };

  const handleCamera = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      Alert.alert("카메라 권한이 필요합니다.");
      return;
    }

    const options = {
      mediaType: 'photo',
      saveToPhotos: true,
      includeBase64: true, // Base64로 변환
    };

    // 카메라로 사진 촬영
    launchCamera(options, (response) => {
      if (response.didCancel) {
        console.log('사용자가 취소함');
      } else if (response.errorCode) {
        console.log('에러: ', response.errorMessage);
      } else {
        const source = { uri: response.assets[0].uri };
        setPhoto(response); // 선택된 이미지를 미리보기 위해 Base64로 설정
        setImage(response.assets[0].base64); // Base64 이미지 데이터를 Zustand 스토어에 추가
      }
    });
  };

  return (
    <>
      <ImageBackground
        source={require('../assets/Images/BackgroundImg.png')} // 배경 이미지 경로
        style={styles.backgroundImage} // 배경 이미지 스타일 적용
        resizeMode="cover" // 이미지 크기를 화면에 맞게 조정
      >
        <View style={styles.container} >
          <Text style={styles.title}>AI 분석</Text>
          {photo != null ? (
          <Image source={{ uri: photo.assets[0].uri }} style={styles.uploadBox} /> // 선택된 이미지 렌더링
          ) : (
            <View style={styles.uploadBox}>
              <TouchableOpacity style={styles.uploadCam} onPress={handleCamera}>
                <CameraIcon width={60} height={60} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.uploadPic} onPress={handleUpload}>
                <UploadIcon width={60} height={60} />
              </TouchableOpacity>
            </View>
          )}
            <Text style={styles.textContents} >
            AI가 당신의 패션을 진단합니다.{"\n"}
            가장 유사한 룩을 찾고,{"\n"}
            해당 룩에 대한 설명과 함께{"\n"}
            비슷한 스타일의 옷을 추천합니다.{"\n"}
            </Text>
          <View style={styles.btnContainer} >
          <TouchableOpacity
            style={[
              styles.btn,
              { backgroundColor: photo ? 'rgba(180, 180, 180, 0.8)' : 'rgba(128, 128, 128, 0.7)',
                borderColor: photo ? 'white' : 'black'
              }
            ]}
            onPress={() => {
              if (photo) {
                // photo가 있을 때만 실행
                navigation.navigate('AIReport');
              }
            }}
            disabled={!photo} // photo가 null이면 비활성화
          >
            <Text style={[
              styles.btnText,
              {color: photo ? 'white' : '#949494'}
            ]} >Analysis</Text>
          </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    resizeMode: 'cover',
    alignItems: 'center',
  },
  backgroundImage: {
    flex: 1, // 화면 전체를 덮도록 설정
  },
  title: {
    fontSize: 40,
    textAlign: 'center',
    color: '#ffffff',
  },
  uploadBox: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent:'space-between',
    marginTop: 20,
    marginBottom: 20,
    // backgroundColor: 'rgba(180, 180, 180, 0.8)',
    // borderColor: '#ffffff',
    // borderWidth: 2,
    width: "90%",
    height: "45%",
    borderRadius: 10,
    alignItems: 'center',
  },
  uploadCam: {
    backgroundColor: 'rgba(180, 180, 180, 0.8)',
    borderColor: '#ffffff',
    borderWidth: 2,
    width: "47%",
    height: "100%",
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    // shadowColor: 'white',
    // shadowOffset: { width: 20, height: 20 },
    // shadowOpacity: 0.2,
    // shadowRadius: 10,
    // elevation: 20,
    // marginTop: 20,
    // marginBottom: 20,
  },
  uploadPic: {
    backgroundColor: 'rgba(180, 180, 180, 0.8)',
    borderColor: '#ffffff',
    borderWidth: 2,
    width: "47%",
    height: "100%",
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    // shadowColor: 'white',
    // shadowOffset: { width: 20, height: 20 },
    // shadowOpacity: 0.2,
    // shadowRadius: 10,
    // elevation: 20,
    // marginTop: 20,
    // marginBottom: 20,
  },
  textContents: {
    backgroundColor: 'rgba(180, 180, 180, 0.8)',
    borderColor: '#ffffff',
    borderWidth: 1,
    width: '90%',
    borderRadius: 10,
    // shadowColor: 'white',
    // shadowOffset: { width: 20, height: 20 },
    // shadowOpacity: 0.2,
    // shadowRadius: 10,
    // elevation: 10,
    marginTop: 10,
    fontSize: 20,
    color: '#ffffff',
    textAlign: 'center',
    paddingTop: 20,
  },
  btnContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent:'space-around',
    width: '100%',
    marginTop: 20,
  },
  btn: {
    // backgroundColor: 'rgba(256, 256, 256, 0.6)',
    // backgroundColor: 'rgba(180, 180, 180, 0.8)',
    borderColor: '#ffffff',
    borderWidth: 1,
    padding: 10,
    width: 150,
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    // shadowColor: 'white',
    // shadowOffset: { width: 20, height: 20 },
    // shadowOpacity: 0.2,
    // shadowRadius: 10,
    // elevation: 10,
    // marginBottom: 10,
    // marginLeft: 10,
    // marginRight: 10,
  },
  btnText: {
    // color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default AIView;
