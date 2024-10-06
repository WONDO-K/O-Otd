import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Modal, 
  PermissionsAndroid,
  Alert,
  ImageBackground,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { TitleText, TitleBoldText, ContentText, ContentBoldText } from '../components/CustomTexts';

import UploadIcon from '../assets/Icons/Upload_Icon.svg';
import useAIStore from '../stores/AIStore';

// 카메라 권한 요청 함수
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
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } catch (err) {
    console.warn(err);
    return false;
  }
}

// 메인페이지
function AIView(): React.JSX.Element {
  const navigation = useNavigation();
  const { setImage } = useAIStore();
  const [photo, setPhoto] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('Loading');

  const fetchAIResult = async () => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      navigation.navigate('AIReport');
    }, 2000); // 임시 딜레이
  };

  useEffect(() => {
      const textList = ['Loading', 'Loading.', 'Loading..', 'Loading...'];
      let index = 0;

      const interval = setInterval(() => {
          setLoadingText(textList[index % 4]);
          index += 1;
      }, 300);

      // 컴포넌트가 언마운트되면 interval을 정리
      return () => clearInterval(interval);
  }, []);

  const toggleModal = () => {
    setModalVisible(!isModalVisible); // 모달 상태를 토글
  };

  const handleUpload = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: true,
    };
    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('사용자가 취소함');
      } else if (response.errorCode) {
        console.log('에러: ', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        setPhoto(response); // 선택된 이미지를 미리보기 위해 Base64로 설정
        setImage(response.assets[0].base64); // Base64 이미지 데이터를 Zustand 스토어에 추가
        toggleModal(); // 모달 닫기
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
      includeBase64: true,
    };

    launchCamera(options, (response) => {
      if (response.didCancel) {
        console.log('사용자가 취소함');
      } else if (response.errorCode) {
        console.log('에러: ', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        setPhoto(response);
        setImage(response.assets[0].base64);
        toggleModal(); // 모달 닫기
      }
    });
  };

  return (
    <ImageBackground 
      source={require('../assets/Images/bg_img.jpg')}  // 배경 이미지 경로 설정
      style={styles.background}  // 스타일 설정
    >
      <View style={styles.container}>
        <TitleText style={styles.title}><TitleBoldText>AI</TitleBoldText> Lens</TitleText>

        {/* 모달창 */}  
        <Modal
          transparent={true}
          visible={isModalVisible}
          animationType="slide"
          onRequestClose={toggleModal}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <ContentBoldText style={styles.modalTitle}>연결 프로그램</ContentBoldText>
              <View style={styles.appOptions}>
                <TouchableOpacity style={styles.appOption} onPress={handleCamera}>
                  <Image source={require('../assets/Icons/Camera_Icon.png')} style={styles.appIcon} />
                  <ContentText style={styles.appName}>카메라</ContentText>
                </TouchableOpacity>
                <TouchableOpacity style={styles.appOption} onPress={handleUpload}>
                  <Image source={require('../assets/Icons/Gallery_Icon.png')} style={styles.appIcon} />
                  <ContentText style={styles.appName}>갤러리</ContentText>
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={styles.modalCloseButton} onPress={toggleModal}>
                <ContentBoldText style={styles.modalCloseButtonText}>취소</ContentBoldText>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <TouchableOpacity style={styles.uploadBox} onPress={toggleModal}>
          {photo && photo.assets ? (
            <Image 
              source={{ uri: photo.assets[0].uri }} 
              style={styles.uploadedImage} 
              resizeMode="contain" // 이미지를 비율에 맞게 조정합니다.
            />
          ) : (
            <UploadIcon width={60} height={60} />
          )}
        </TouchableOpacity>

        <ContentText style={styles.textContents}>
          AI가 당신의 패션을 분석하고,{"\n"}
          유사한 스타일을 추천합니다.{"\n"}
        </ContentText>

        <View style={styles.btnContainer}>
          <TouchableOpacity
            style={[
              styles.btn,
              { backgroundColor: photo ? 'rgba(255, 255, 255, 0.3)' : 'rgba(128, 128, 128, 0.7)'}
            ]}
            onPress={() => {
              if (photo) {
                fetchAIResult();
              }
            }}
            disabled={!photo}
          >
            <ContentBoldText style={[styles.btnText, { color: photo ? 'white' : '#949494' }]}>{ loading ? loadingText : 'Analyze !'}</ContentBoldText>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover', // 배경 이미지가 뷰의 크기에 맞게 조정됨
  },
  container: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 40,
    textAlign: 'center',
    color: '#ffffff',
    marginTop: 20,
  },
  uploadBox: {
    width: "60%",
    height: "45%",
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderColor: '#ffffff',
    borderWidth: 5,
  },
  uploadedImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  textContents: {
    width: '80%',
    borderRadius: 10,
    marginTop: 10,
    fontSize: 20,
    color: '#ffffff',
    textAlign: 'center',
    paddingTop: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    elevation: 3,  // elevation 값을 조절하여 그림자의 크기와 강도를 변경
    shadowColor: 'black', // 그림자 색상
  },
  btnContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
  btn: {
    borderColor: '#ffffff',
    borderWidth: 1,
    padding: 10,
    width: 150,
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  btnText: {
    fontSize: 20,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // 반투명 어두운 배경
  },
  modalContainer: {
    backgroundColor: '#2C2C2E', // 어두운 색상 모달
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    color: 'white',
    marginBottom: 20,
  },
  appOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  appOption: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 10,
  },
  modalCloseButton: {
    width: '100%',
    alignItems: 'center',
  },
  modalCloseButtonText: {
    color: 'white',
    fontSize: 18,
  },
  appIcon: {
    width: 70,
    height: 70,
    marginBottom: 10,
  },
  appName: {
    color: 'white',
    fontSize: 16,
  },
});

export default AIView;
