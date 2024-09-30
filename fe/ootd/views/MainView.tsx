import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image, // 이미지 컴포넌트 추가
  ImageBackground,
  TextInput,
  FlatList,
  ScrollView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Carousel from '../components/Carousel';
import WishFullIcon from '../assets/Icons/WishFull_Icon.svg';
import WishIcon from '../assets/Icons/Wish_Icon.svg';

// 메인페이지
function MainView(): React.JSX.Element {
  const navigation = useNavigation();
  const route = useRoute();

  const [searchType, setSearchType] = useState('');
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
    <>
      <View style={styles.container} >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Carousel />
          <View style={styles.searchBar}>
            <Image
                source={require('../assets/Images/searchIcon.png')}
                style={styles.searchIcon}
            />
            <TextInput
                style={styles.searchInput}
                maxLength={30}
                placeholder='패션 검색'
                placeholderTextColor='gray'
                value={searchType}
                onChangeText={(input) => {
                    if (input.length <= 15) {
                      setSearchType(input);
                    }
                }}
            />
          </View>
          <FlatList
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
                        <WishFullIcon width={30} height={40} /> // 북마크가 활성화된 경우
                      ) : (
                        <WishIcon width={30} height={40} fill='white'/> // 비활성화된 경우
                      )}
                      </TouchableOpacity>
                    </ImageBackground>
                  </View>
                )}
                numColumns={2}
                // nestedScrollEnabled={true}
            />
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    display: 'flex',
    flexDirection: 'column',
    resizeMode: 'cover',
  },
  scrollContainer: {
    flexGrow: 1,  // ScrollView의 내용이 화면을 넘어가도 스크롤 가능하도록 설정
    justifyContent: 'flex-start',
    backgroundColor: 'black',
  },
  searchBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: 350,
    height: 60,
    backgroundColor: '#262626',
    borderRadius: 20,
    padding: 10,
    alignSelf: 'center',
    marginBottom: 20,
  },
  searchIcon: {
      width: 20,
      height: 20,
      marginRight: 5,
  },
  searchInput: {
    width: 300,
    height: 60,
    color: 'white',
    fontSize: 20,
  },
  notificationItem: {
    width: '50%',
    height: 350,
  },
  notificationImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end', // 아이콘을 하단에 배치
    backgroundColor: 'black',
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
});

export default MainView;
