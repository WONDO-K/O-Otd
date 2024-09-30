import React, { useState, useRef } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Modal,
  TextInput,
  TouchableWithoutFeedback,
  Animated, // Import Animated for animations
  Easing, // Import Easing for animation easing functions
} from 'react-native';
import axios from 'axios'; // Import axios

// 로그인 페이지
function LoginScreen(): React.JSX.Element {
  const [modalVisible, setModalVisible] = useState(false); // 모달 표시 상태
  const [nickname, setNickname] = useState(''); // 닉네임 입력 상태
  const [errorMessage, setErrorMessage] = useState(''); // 에러 메시지 상태
  const [isSuccess, setIsSuccess] = useState(false); // 성공 메시지 표시 상태
  const shakeAnimation = useRef(new Animated.Value(0)).current; // 애니메이션 값 초기화

  // 닉네임 제출 핸들러
  const handleNicknameSubmit = async () => {
    try {
      // 서버에 닉네임 중복 확인 요청
      // Replace 'YOUR_BACKEND_ENDPOINT' with your actual backend URL
      const response = await axios.post('', {
        nickname: nickname.trim(),
      });

      if (response.data.exists) {
        // 닉네임이 이미 존재하는 경우
        setErrorMessage('* 이미 존재하는 닉네임입니다.');
        triggerShake(); // 모달 쉐이크 애니메이션
      } else {
        // 닉네임이 유일한 경우
        setIsSuccess(true);
        setErrorMessage('');
      }
    } catch (error) {
      console.error('닉네임 확인 중 오류 발생:', error);
      setErrorMessage('* 서버와의 통신에 문제가 있습니다.');
      triggerShake(); // 모달 쉐이크 애니메이션
    }
  };

  // 쉐이크 애니메이션 트리거
  const triggerShake = () => {
    shakeAnimation.setValue(0);
    Animated.sequence([
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
        easing: Easing.linear,
      }),
      Animated.timing(shakeAnimation, {
        toValue: -10,
        duration: 50,
        useNativeDriver: true,
        easing: Easing.linear,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
        easing: Easing.linear,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true,
        easing: Easing.linear,
      }),
    ]).start();
  };

  // 모달 닫기 및 상태 초기화
  const closeModal = () => {
    setModalVisible(false);
    setNickname('');
    setErrorMessage('');
    setIsSuccess(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image source={require('../assets/Images/ootd_logo.png')} style={styles.ootdLogo} />
        <Text style={styles.loginText}>로그인</Text>
      </View>
      <View style={styles.body}>
        {/* Kakao 로그인 버튼 */}
        <TouchableOpacity
          style={styles.kakaoButton}
          onPress={() => setModalVisible(true)} // 버튼 눌렀을 때 모달 열기
        >
          <Image source={require('../assets/Images/kakao.png')} style={styles.btnLogo} />
          <Text style={styles.kakaoButtonText}>카카오로 로그인</Text>
        </TouchableOpacity>

        {/* Google 로그인 버튼 */}
        <TouchableOpacity style={styles.googleButton}>
          <Image source={require('../assets/Images/google.png')} style={styles.btnLogo} />
          <Text style={styles.googleButtonText}>Google로 로그인</Text>
        </TouchableOpacity>

        {/* Naver 로그인 버튼 */}
        <TouchableOpacity style={styles.naverButton}>
          <Image source={require('../assets/Images/naver.png')} style={styles.btnLogo} />
          <Text style={styles.naverButtonText}>Naver로 로그인</Text>
        </TouchableOpacity>
      </View>

      {/* 닉네임 입력 모달 */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              {/* Animated.View for shake animation */}
              <Animated.View
                style={[
                  styles.modalContainer,
                  {
                    transform: [{ translateX: shakeAnimation }],
                  },
                ]}
              >
                {!isSuccess ? (
                  <>
                    <Text style={styles.modalTitle}>닉네임 입력</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder="닉네임을 입력하세요"
                      value={nickname}
                      onChangeText={(text) => {
                        setNickname(text);
                        if (errorMessage) setErrorMessage(''); // 입력 시 에러 메시지 초기화
                      }}
                    />
                    {errorMessage ? (
                      <Text style={styles.errorText}>{errorMessage}</Text>
                    ) : null}
                    <View style={styles.modalButtons}>
                      {/* 커스텀 '확인' 버튼 */}
                      <TouchableOpacity style={styles.confirmButton} onPress={handleNicknameSubmit}>
                        <Text style={styles.confirmButtonText}>확인</Text>
                      </TouchableOpacity>
                    </View>
                  </>
                ) : (
                  // 성공 메시지 표시
                  <View style={styles.successContainer}>
                    <Text style={styles.successText}>
                      정상적으로 회원가입에 성공하셨습니다.{'\n'}
                      <Text style={styles.nicknameText}>{nickname}님</Text>, 반갑습니다.
                    </Text>
                    <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                      <Text style={styles.closeButtonText}>닫기</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </Animated.View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black', // 배경 검정색
    justifyContent: 'center', // 화면 중앙 정렬
  },
  header: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 100, // 중앙 상단 배치
  },
  loginText: {
    fontSize: 30, // 글자 크기
    color: 'white', // 글자 색상 흰색
  },
  body: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center', // 중앙 배치
  },
  kakaoButton: {
    backgroundColor: '#FEE500', // 카카오 노란색
    width: 250, // 버튼 고정 크기
    height: 50, // 버튼 고정 크기
    flexDirection: 'row', // 로고와 텍스트를 나란히
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 20, // 아래 요소와 간격
  },
  googleButton: {
    backgroundColor: 'white', // 구글 흰색 배경
    width: 250, // 버튼 고정 크기
    height: 50, // 버튼 고정 크기
    flexDirection: 'row', // 로고와 텍스트를 나란히
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1, // 구글 버튼의 테두리 추가
    borderColor: '#4285F4', // 구글 파란색 테두리
  },
  naverButton: {
    backgroundColor: '#03C75A', // 네이버 녹색
    width: 250, // 버튼 고정 크기
    height: 50, // 버튼 고정 크기
    flexDirection: 'row', // 로고와 텍스트를 나란히
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 20,
  },
  kakaoButtonText: {
    color: '#3C1E1E',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10, // 로고와 텍스트 사이 간격
  },
  googleButtonText: {
    color: '#4285F4',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10, // 로고와 텍스트 사이 간격
  },
  naverButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10, // 로고와 텍스트 사이 간격
  },
  btnLogo: {
    width: 20, // 로고 크기
    height: 20,
    resizeMode: 'contain', // 로고 비율 유지
  },
  ootdLogo: {
    width: 200, // OOTD 로고 크기
    height: 200,
    resizeMode: 'contain',
  },
  // 모달 관련 스타일
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)', // 반투명 배경
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 23,
    marginBottom: 15,
  },
  textInput: {
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10, // 에러 메시지와 간격
    fontSize: 18,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    alignSelf: 'flex-start',
    marginLeft: 10,
    marginBottom: 10,
  },
  modalButtons: {
    width: '100%',
    alignItems: 'center', // 버튼을 중앙에 배치
  },
  // 새로운 스타일 추가
  confirmButton: {
    backgroundColor: '#4285F4', // 원하는 버튼 배경색 (예: Google 파란색)
    paddingVertical: 12, // 세로 패딩 (버튼 높이 조절)
    paddingHorizontal: 30, // 가로 패딩 (버튼 너비 조절)
    borderRadius: 10, // borderRadius 10
    alignItems: 'center',
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  // 성공 메시지 관련 스타일
  successContainer: {
    alignItems: 'center',
  },
  successText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  nicknameText: {
    color: 'limegreen', // 밝은 초록색
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: '#4285F4',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 10,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
