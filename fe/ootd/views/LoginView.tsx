import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image, // 이미지 컴포넌트 추가
} from 'react-native';

// 로그인 페이지
function LoginScreen(): React.JSX.Element {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image source={require('../assets/Images/ootd_logo.png')} style={styles.ootdLogo} />
        <Text style={styles.loginText}>로그인</Text>
      </View>
      <View style={styles.body}>
        {/* Kakao 로그인 버튼 */}
        <TouchableOpacity style={styles.kakaoButton}>
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
    marginTop: 150, // 중앙 상단 배치
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
});

export default LoginScreen;
