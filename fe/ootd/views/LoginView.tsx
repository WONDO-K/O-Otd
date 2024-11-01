// LoginView.tsx
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
  Animated,
  Easing,
} from 'react-native';
import axios from 'axios';
import { WebView } from 'react-native-webview';
import { useNavigation } from '@react-navigation/native';
import { useLoginStore } from '../stores/LoginStore';

function LoginView(): React.JSX.Element {
  const [modalVisible, setModalVisible] = useState(false);
  const [nickname, setNickname] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [serviceMessage, setServiceMessage] = useState('');
  const shakeAnimation = useRef(new Animated.Value(0)).current;
  const [kakaoCode, setKakaoCode] = useState('');
  const [webViewVisible, setWebViewVisible] = useState(false);
  const navigation = useNavigation();

  // LoginStore에서 상태와 함수를 가져옴
  const {
    accessToken,
    setAccessToken,
    setRefreshToken,
    userId,
    setUserId,
    API_URL,
  } = useLoginStore();


  const KAKAO_AUTH_URL =
    `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=fb7d24f77e374b62fe33b066aac83003&redirect_uri=${API_URL}/login/oauth2/code/kakao`;

  // Kakao 로그인 처리 함수
  const handleKakaoLogin = async (code: string) => {
    try {
      const response = await axios.get(`${API_URL}/user/auth/kakao-login?code=${code}`);

      if (response.data.existed = true) {
        // 토큰 저장
        await setAccessToken(response.data.accessToken); // accessToken 설정
        await setRefreshToken(response.data.refreshToken); // refreshToken 설정

        console.log('!!!!!!!!!왜 또 True인데?????????')

        // 헤더에서 userId 추출하여 저장
        setUserId(parseInt(response.headers['x-user-id'], 10)); // Ensure userId is a number

        navigateToMainView();
      } else {
        // 신규 회원인 경우 닉네임 입력 모달 표시
        await setAccessToken(response.data.accessToken); // accessToken 설정
        await setRefreshToken(response.data.refreshToken); // refreshToken 설정
        // 헤더에서 userId 추출하여 저장
        setUserId(parseInt(response.headers['x-user-id'], 10));

        setModalVisible(true);
      }
    } catch (error) {
      console.error('Kakao 로그인 중 오류 발생:', error);
      setServiceMessage('로그인 중 오류가 발생했습니다.');
      setModalVisible(true);
    }
  };

  // MainView로 이동하는 함수
  const navigateToMainView = () => {
    navigation.navigate('MainView');
  };

  // 닉네임 초기설정 핸들러
  const handleNicknameSetting = async (text: string) => {
    try {
      await axios.post(
        `${API_URL}/user/setmyinfo`,
        {
          nickname: text,
        },
        {
          headers: {
            Authorization: accessToken,
            'Content-Type': 'application/json',
            'X-User-ID': userId,
          },
        }
      );
      setIsSuccess(true);
    } catch (error) {
      console.error('닉네임 설정 중 오류 발생:', error);
      setErrorMessage('* 닉네임 설정에 실패했습니다.');
      triggerShake();
    }
  };

  // 닉네임 중복확인 핸들러
  const handleNicknameSubmit = async () => {
    if (!nickname.trim()) {
      setErrorMessage('* 닉네임을 입력해주세요.');
      triggerShake();
      return;
    }

    try {
      const response = await axios.get(
        `${API_URL}/user/check/nickname`, // Updated URL using API_URL from store
        {
          params: {
            nickname: nickname.trim(), // nickname을 params로 전송
          },
          headers: {
            Authorization: accessToken,
            'Content-Type': 'application/json',
            'X-User-ID': userId,
          },
        }
      );

      if (response.data) {
        setErrorMessage('* 이미 존재하는 닉네임입니다.');
        triggerShake();
      } else {
        setErrorMessage('');
        await handleNicknameSetting(nickname);

        navigateToMainView();
      }
    } catch (error) {
      console.error('닉네임 확인 중 오류 발생:', error);
      setErrorMessage('* 서버와의 통신에 문제가 있습니다.');
      triggerShake();
    }
  };

  // 서비스 준비 중 모달 트리거
  const handleServiceNotAvailable = () => {
    setServiceMessage('서비스 준비중입니다.');
    setModalVisible(true);
    triggerShake();
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
    setServiceMessage('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image source={require('../assets/Images/ootd_logo.png')} style={styles.ootdLogo} />
        <Text style={styles.loginText}>로그인</Text>
      </View>
      <View style={styles.body}>
        {/* Kakao 로그인 버튼 */}
        <TouchableOpacity style={styles.kakaoButton} onPress={() => setWebViewVisible(true)}>
          <Image source={require('../assets/Images/kakao.png')} style={styles.btnLogo} />
          <Text style={styles.kakaoButtonText}>카카오로 로그인</Text>
        </TouchableOpacity>

        {/* Google 로그인 버튼 */}
        <TouchableOpacity style={styles.googleButton} onPress={handleServiceNotAvailable}>
          <Image source={require('../assets/Images/google.png')} style={styles.btnLogo} />
          <Text style={styles.googleButtonText}>Google로 로그인</Text>
        </TouchableOpacity>

        {/* Naver 로그인 버튼 */}
        <TouchableOpacity style={styles.naverButton} onPress={handleServiceNotAvailable}>
          <Image source={require('../assets/Images/naver.png')} style={styles.btnLogo} />
          <Text style={styles.naverButtonText}>Naver로 로그인</Text>
        </TouchableOpacity>
      </View>

      {/* WebView 모달 */}
      <Modal
        visible={webViewVisible}
        onRequestClose={() => setWebViewVisible(false)}
        animationType="slide"
      >
        <WebView
          source={{ uri: KAKAO_AUTH_URL }}
          onNavigationStateChange={(navState) => {
            const { url } = navState;
            if (url.startsWith(`${API_URL}/login/oauth2/code/kakao`)) {
              const codeMatch = url.match(/code=([^&]+)/);
              if (codeMatch && codeMatch[1]) {
                const code = codeMatch[1];
                setKakaoCode(code);
                setWebViewVisible(false);
                handleKakaoLogin(code);
              }
            }
          }}
          startInLoadingState
        />
      </Modal>

      {/* 닉네임 입력 또는 서비스 준비 중 모달 */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <Animated.View
                style={[
                  styles.modalContainer,
                  {
                    transform: [{ translateX: shakeAnimation }],
                  },
                ]}
              >
                {serviceMessage ? (
                  <Text style={styles.serviceMessage}>{serviceMessage}</Text>
                ) : !isSuccess ? (
                  <>
                    <Text style={styles.modalTitle}>닉네임 입력</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder="닉네임을 입력하세요"
                      value={nickname}
                      onChangeText={(text: string) => {
                        setNickname(text);
                        if (errorMessage) setErrorMessage('');
                      }}
                    />
                    {errorMessage ? (
                      <Text style={styles.errorText}>{errorMessage}</Text>
                    ) : null}
                    <View style={styles.modalButtons}>
                      <TouchableOpacity style={styles.confirmButton} onPress={handleNicknameSubmit}>
                        <Text style={styles.confirmButtonText}>확인</Text>
                      </TouchableOpacity>
                    </View>
                  </>
                ) : (
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
    backgroundColor: '#121212',
    justifyContent: 'center',
  },
  header: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 100,
  },
  loginText: {
    fontSize: 30,
    color: 'white',
  },
  body: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  kakaoButton: {
    backgroundColor: '#FEE500',
    width: 250,
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 20,
  },
  kakaoButtonText: {
    color: '#3C1E1E',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  btnLogo: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  ootdLogo: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  googleButton: {
    backgroundColor: 'white',
    width: 250,
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#4285F4',
  },
  naverButton: {
    backgroundColor: '#03C75A',
    width: 250,
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 20,
  },
  googleButtonText: {
    color: '#4285F4',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  naverButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  // 모달 관련 스타일
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
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
    marginBottom: 10,
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
    alignItems: 'center',
  },
  confirmButton: {
    backgroundColor: '#4285F4',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  successContainer: {
    alignItems: 'center',
  },
  successText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  nicknameText: {
    color: 'limegreen',
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
  serviceMessage: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default LoginView;
