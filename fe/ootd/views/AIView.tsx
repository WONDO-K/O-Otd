import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Modal, 
  PermissionsAndroid,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

import UploadIcon from '../assets/Icons/Upload_Icon.svg';
import CameraIcon from '../assets/Icons/Camera_Icon.svg';
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
    <View style={styles.container}>
      <Text style={styles.title}>AI 분석</Text>

      {/* 모달창 */}
      <Modal
        transparent={true}
        visible={isModalVisible}
        animationType="slide"
        onRequestClose={toggleModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.modalButton} onPress={handleCamera}>
              <Text style={styles.modalButtonText}>촬영하기</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={handleUpload}>
              <Text style={styles.modalButtonText}>갤러리에서 가져오기</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={toggleModal}>
              <Text style={styles.modalButtonText}>취소</Text>
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

      <Text style={styles.textContents}>
        AI가 당신의 패션을 진단합니다.{"\n"}
        가장 유사한 룩을 찾고,{"\n"}
        해당 룩에 대한 설명과 함께{"\n"}
        비슷한 스타일의 옷을 추천합니다.{"\n"}
      </Text>

      <View style={styles.btnContainer}>
        <TouchableOpacity
          style={[
            styles.btn,
            { backgroundColor: photo ? 'rgba(180, 180, 180, 0.8)' : 'rgba(128, 128, 128, 0.7)', borderColor: photo ? 'white' : 'black' }
          ]}
          onPress={() => {
            if (photo) {
              navigation.navigate('AIReport'); // photo가 있을 때만 실행
            }
          }}
          disabled={!photo}
        >
          <Text style={[styles.btnText, { color: photo ? 'white' : '#949494' }]}>Analysis</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#121212',
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 40,
    textAlign: 'center',
    color: '#ffffff',
  },
  uploadBox: {
    width: "90%",
    height: "45%",
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
    marginTop: 20,
    marginBottom: 20,
  },
  uploadedImage: {
    width: '100%', // 부모 크기에 맞게 설정
    height: '100%', // 부모 크기에 맞게 설정
    borderRadius: 10, // 업로드 박스와 동일한 경계선 반경 적용
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalButton: {
    width: '100%',
    padding: 15,
    backgroundColor: '#1e90ff',
    borderRadius: 10,
    marginVertical: 10,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#ffffff',
    fontSize: 18,
  },
  textContents: {
    borderColor: '#ffffff',
    borderWidth: 1,
    width: '90%',
    borderRadius: 10,
    marginTop: 10,
    fontSize: 20,
    color: '#ffffff',
    textAlign: 'center',
    paddingTop: 20,
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
    fontWeight: 'bold',
  },
});

export default AIView;
