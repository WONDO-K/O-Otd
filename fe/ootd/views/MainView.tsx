import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ImageBackground,
  TextInput,
  FlatList,
  ScrollView,
  Modal,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Carousel from '../components/Carousel';
import WishFullIcon from '../assets/Icons/WishFull_Icon.svg';
import WishIcon from '../assets/Icons/Wish_Icon.svg';
import { TouchableWithoutFeedback } from 'react-native';

// 메인페이지
function MainView(): React.JSX.Element {
  const navigation = useNavigation();

  const [searchType, setSearchType] = useState('');
  const [myFashion, setMyFashion] = useState([]);
  const [bookmarked, setBookmarked] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const getMyFashion = async () => {
    // 실제 API 호출 부분
    // try {
    //     const response = axios.get(`https://j11e104.p.ssafy.io/gallery/list`, {
    //         headers: {
    //             "Authorization": accessToken,
    //             "Content-Type": "application/json",
    //             "X-User-ID": userId,
    //         }
    //     });
    //     console.log(response.data);
    //     setBattleList(response.data); // 상태 업데이트
    // } catch (error) {
    //     console.error('Error fetching my fashion:', error);
    // }

    // 테스트용 데이터
    const data = [
      {
        id: 1,
        src: require('../assets/Son.jpg'),
      },
      {
        id: 2,
        src: require('../assets/SpecialAgent_J.jpg'),
      },
      {
        id: 3,
        src: require('../assets/RealMan.jpg'),
      },
      {
        id: 4,
        src: require('../assets/IronMan_Japan.jpg'),
      },
      {
        id: 5,
        src: require('../assets/Whale_student.jpg'),
      },
      {
        id: 6,
        src: require('../assets/Whale.jpg'),
      },
    ];
    setMyFashion(data); // 상태 업데이트
  };

  const toggleBookmark = (id) => {
    setBookmarked((prevState) => ({
      ...prevState,
      [id]: !prevState[id], // 북마크 상태를 토글
    }));
  };

  const openModal = (item) => {
    setSelectedImage(item); // 선택된 이미지 설정
    setIsModalVisible(true); // 모달 열기
  };

  const closeModal = () => {
    setIsModalVisible(false); // 모달 닫기
    setSelectedImage(null); // 이미지 초기화
  };

  useEffect(() => {
    getMyFashion(); // 컴포넌트가 마운트될 때 데이터 가져오기
  }, []);

  return (
    <ImageBackground
      source={require('../assets/Images/bg_img.jpg')} // 배경 이미지 경로
      style={styles.background} // 배경 스타일 설정
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Carousel openModal={openModal} />
        <View style={styles.searchBar}>
          <Image source={require('../assets/Images/searchIcon.png')} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            maxLength={30}
            placeholder="패션 검색"
            placeholderTextColor="gray"
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
            <TouchableOpacity onPress={() => openModal(item)} style={styles.notificationItem}>
              <ImageBackground source={item.src} style={styles.notificationImage} resizeMode="cover">
                <TouchableOpacity style={styles.bookmarkIcon} onPress={() => toggleBookmark(item.id)}>
                  {bookmarked[item.id] ? (
                    <WishFullIcon width={30} height={40} /> // 북마크가 활성화된 경우
                  ) : (
                    <WishIcon width={30} height={40} fill="white" /> // 비활성화된 경우
                  )}
                </TouchableOpacity>
              </ImageBackground>
            </TouchableOpacity>
          )}
          numColumns={2}
        />

        {/* 이미지 모달 */}
        <Modal
          visible={isModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={closeModal}
        >
          <TouchableWithoutFeedback onPress={closeModal}>
            <View style={styles.modalContainer}>
              {selectedImage && (
                <View style={styles.fixedModalContent}>
                  <Image
                    source={selectedImage.src}
                    style={styles.fixedModalImage}
                    resizeMode="contain"
                  />
                  <TouchableOpacity style={styles.modalBookmarkIcon} onPress={() => toggleBookmark(selectedImage.id)}>
                    {bookmarked[selectedImage?.id] ? (
                      <WishFullIcon width={30} height={40} />
                    ) : (
                      <WishIcon width={30} height={40} fill="white" />
                    )}
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover', // 배경 이미지를 뷰에 맞게 조정
  },
  scrollContainer: {
    flexGrow: 1, // ScrollView의 내용이 화면을 넘어가도 스크롤 가능하도록 설정
    justifyContent: 'flex-start',
    backgroundColor: 'transparent',
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
    fontFamily: 'SUIT-Regular',
  },
  notificationItem: {
    width: '50%',
    height: 350,
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // 모달 배경 어둡게
  },
  fixedModalContent: {
    width: '80%',
    height: '70%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative', // 아이콘을 절대 위치로 배치할 수 있도록 함
    overflow: 'hidden',
  },
  fixedModalImage: {
    flex: 1,
    aspectRatio: 1,
  },
  modalBookmarkIcon: {
    position: 'absolute',
    right: 10, // 우측에서 10px 떨어짐
    bottom: 10, // 하단에서 10px 떨어짐
  },
});

export default MainView;
