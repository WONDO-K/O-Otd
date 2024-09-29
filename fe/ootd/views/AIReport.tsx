import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import useAIStore from '../stores/AIStore'; // Zustand 스토어 가져오기

import WishFullIcon from '../assets/Icons/WishFull_Icon.svg';
import WishIcon from '../assets/Icons/Wish_Icon.svg';

// 메인 페이지
function AIReport(): React.JSX.Element {
  const navigation = useNavigation();
  const route = useRoute();

  const { image } = useAIStore(); // Zustand에서 이미지 가져오기

  const [myFashion, setMyFashion] = useState([]);
  const [bookmarked, setBookmarked] = useState({});

  const getMyFashion = async () => {
      // 실제 API 호출 부분
      // try {
      //     const response = await axios.get('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX');
      //     setMyFashion(response.data);
      // } catch (error) {
      //     console.error('Error fetching my fashion:', error);
      // }

      // 테스트용 데이터
      const data = [
          {
              id: 1,
              src: require('../assets/Son.jpg')
          },
          {
              id: 2,
              src: require('../assets/SpecialAgent_J.jpg')
          },
          {
              id: 3,
              src: require('../assets/RealMan.jpg')
          },
          {
              id: 4,
              src: require('../assets/IronMan_Japan.jpg')
          },  
          {
              id: 5,
              src: require('../assets/Whale_student.jpg')
          },
          {
              id: 6,
              src: require('../assets/Whale.jpg')
          },
      ];
      setMyFashion(data);  // 상태 업데이트
  };

  const toggleBookmark = (id) => {
    setBookmarked((prevState) => ({
      ...prevState,
      [id]: !prevState[id],  // 북마크 상태를 토글
    }));
  };

  useEffect(() => {
    getMyFashion();  // 컴포넌트가 마운트될 때 데이터 가져오기
  }, []);

  return (
    // <ImageBackground
    //   source={require('../assets/Images/BackgroundImg.png')} // 배경 이미지 경로
    //   style={styles.backgroundImage} // 배경 이미지 스타일 적용
    //   resizeMode="cover" // 이미지 크기를 화면에 맞게 조정
    // >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>AI 분석</Text>

        <View style={styles.reportBox}>
        {image ? (
          <Image
            source={{ uri: `data:image/jpeg;base64,${image}` }} // base64로 이미지 표시
            style={styles.photo}
          />
        ) : (
          <Text style={styles.noPhotoText}>저장된 이미지가 없습니다.</Text> // 이미지가 없을 때 표시
        )}
          <View style={styles.reportContents}>
            <Text style={styles.reportName}>
              시티보이 룩
            </Text>
            <Text style={styles.reportText}>
              시티보이룩은 시티보이 룩입니다.
              그것이 시티보이 룩이니까.
            </Text>
          </View>
        </View>

        {/* <View style={styles.line} /> */}
        
        <Text style={styles.title}>유사한 스타일</Text>
        <FlatList
          style={{marginTop: 20}}
          data={myFashion}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.notificationItem}>
              <ImageBackground
                source={item.src}
                style={styles.notificationImage}
                resizeMode="cover"
              >
                <TouchableOpacity
                  style={styles.bookmarkIcon}
                  onPress={() => toggleBookmark(item.id)}
                >
                {bookmarked[item.id] ? (
                  <WishFullIcon width={30} height={40} fill={'white'} /> // 북마크가 활성화된 경우
                ) : (
                  <WishIcon width={30} height={40} fill={'white'} /> // 비활성화된 경우
                )}
                </TouchableOpacity>
              </ImageBackground>
            </View>
          )}
          numColumns={2}
        />
      </View>
      </ScrollView>
    // </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    display: 'flex',
    flexDirection: 'column',
    resizeMode: 'cover',
    alignItems: 'center',
  },
  backgroundImage: {
    flex: 1, // 화면 전체를 덮도록 설정
  },
  scrollContainer: {
    flexGrow: 1,  // ScrollView의 내용이 화면을 넘어가도 스크롤 가능하도록 설정
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 40,
    textAlign: 'center',
    color: '#ffffff',
    marginTop: 20,
  },
  reportBox: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent:'space-between',
    width: "90%",
    height: 300,
    // backgroundColor: 'rgba(180, 180, 180, 0.8)',
    // borderColor: '#ffffff',
    // borderWidth: 2,
    // borderRadius: 10,
    padding: 5,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  photo: {
    width: "50%",
    height: "95%",
    borderRadius: 10,
  },
  noPhotoText: {
    fontSize: 20,
    color: 'white',
    marginTop: 20,
  },
  reportContents: {
    display: 'flex',
    flexDirection: 'column',
    width: "50%",
    height: "90%",
    padding: 5,
    paddingLeft: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reportName: {
    fontSize: 30,
    color: 'white',
    width: "100%",
    height: "30%",
    textAlign: 'center',
    justifyContent: 'center',
  },
  reportText: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    width: "100%",
    height: "70%",
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  notificationItem: {
    width: '50%',
    height: 300,
  },
  notificationImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end', // 아이콘을 하단에 배치
  },
  bookmarkIcon: {
    position: 'absolute',
    right: 10,
    bottom: 10,
  },
  icon: {
    width: 30,
    height: 30,
  },
  line: {
    borderBottomColor: 'white', // 선 색상
    borderBottomWidth: 2, // 선 두께
    width: '100%', // 선의 길이를 부모의 너비로 설정
    marginTop: 10,
  },
});

export default AIReport;
