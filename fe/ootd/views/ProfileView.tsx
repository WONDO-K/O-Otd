import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  TouchableWithoutFeedback,
  Animated,
  Easing,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import useAIStore from '../stores/AIStore';
import { useLoginStore } from '../stores/LoginStore';
import axios from 'axios';

import WishFullIcon from '../assets/Icons/WishFull_Icon.svg';
import WishIcon from '../assets/Icons/Wish_Icon.svg';
import PencilIcon from '../assets/Icons/Pencil_Icon.svg';
import MyFashionIcon from '../assets/Icons/MyFashion_Icon.svg';
import BattleIcon from '../assets/Icons/Battle_Icon.svg';

// 메인 페이지
function ProfileView(): React.JSX.Element {
  const navigation = useNavigation();
  const route = useRoute();

  const { accessToken, userId } = useLoginStore();

  const [myFashion, setMyFashion] = useState([]);
  const [bookmarked, setBookmarked] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('마이 패션');
  const [selectedSort, setSelectedSort] = useState('최신순');
  const [pictureList, setPictureList] = useState([]);
  const [nickname, setNickname] = useState(null);

  // 모달 관련 상태
  const [modalVisible, setModalVisible] = useState(false);
  const [newNickname, setNewNickname] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const shakeAnimation = useRef(new Animated.Value(0)).current;

  // API 주소
  const API_URL = 'https://j11e104.p.ssafy.io';

  const handleRefresh = () => {
    navigation.replace('ProfileView');  // 현재 화면을 대체해서 새로고침과 유사한 효과
  };

  const selectCategory = (category: string) => {
    setSelectedCategory(category);
    setSelectedSort('최신순');
  };
  const selectSort = (sort: string) => {
    setSelectedSort(sort);
  };

  // API에서 nickname 가져오는 로직
  const getNickname = async () => {
    console.log('닉네임 가져오기 함수');
    console.log('엑세스', accessToken);
    console.log('userId', userId);
    try {
      const response = await axios.get(`${API_URL}/user/myinfo`, {
        headers: {
          "Authorization": accessToken,
          "Content-Type": "application/json",
          "X-User-ID": userId,
        },
      });
      console.log(response.data);

      setNickname(response.data.nickname);  // nickname만 상태에 저장
      console.log('닉네임', response.data.nickname);
    } catch (error) {
      console.error('Error nickname:', error);
    }
  };

  useEffect(() => {
    getNickname();  // 컴포넌트가 마운트될 때 nickname 가져오기
  }, []);

  const getPictureList = (category: string, sort: string) => {
    if (category === '마이 패션') {
      const data = {
        "myFashionList": [
          {
            "wardrobeId": 1,
            "createdAt": "2024-09-25T00:00:00",
            "ImageUrl": "https://placekitten.com/200/300",
            "wardrobeBattle": 3,
            "wardrobeWin": 2,
          },
          {
            "wardrobeId": 2,
            "createdAt": "2024-09-20T00:00:00",
            "imageUrl": "https://picsum.photos/400/400",
            "wardrobeBattle": 2,
            "wardrobeWin": 1,
          }
        ],
      }

      setPictureList(data.myFashionList);
    } else if (category === '마이 갤러리') {
      const data = {
        "myGalleryList": [
          {
            "clotheId": 2,
            "likeAt": "2024-09-22T00:00:00",
            "imageUrl": "https://picsum.photos/200/300",
            "totalPick": 43,
            "monthlyPick": 15,
            "weeklyPick": 3,
          },
          {
            "clotheId": 2,
            "likeAt": "2024-09-24T00:00:00",
            "imageUrl": "https://placedog.net/500",
            "totalPick": 46,
            "monthlyPick": 14,
            "weeklyPick": 13,
          }
        ]
      }
      setPictureList(data.myGalleryList)
    } else if(category === '마이 문철') {
      const data = {
        "myBattleList": [
          {
            "battleId": 1,
            "title": "Summer Fashion Battle",
            "participantCount": 2,
            "status": "IN_PROGRESS",
            "startedAt": "2024-09-25T01:00:00",
            "leftImage": "https://placekitten.com/200/300",
            "rightImage": "https://placedog.net/500",
            "myPick": null,
            "leftName": "악질유저기무동현",
            "rightName": "분탕장인손우혁"
          },
          {
            "battleId": 3,
            "title": "Autumn Collection Showdown",
            "participantCount": 2,
            "status": "IN_PROGRESS",
            "startedAt": "2024-09-25T00:00:00",
            "leftImage": "https://picsum.photos/400/400",
            "rightImage": "https://picsum.photos/200/300",
            "myPick": "left",
            "leftName": "유저네임3",
            "rightName": "유저네임4"
          }
        ],
      }
      setPictureList(data.myBattleList);
    };
  };

  const toggleBookmark = (id) => {
    setBookmarked((prevState) => ({
      ...prevState,
      [id]: !prevState[id],  // 북마크 상태를 토글
    }));
  };

  // 닉네임 변경 핸들러
  const handleChangeNickname = async () => {
    if (!newNickname.trim()) {
      setErrorMessage('닉네임을 입력해주세요.');
      triggerShake();
      return;
    }

    try {
      // 중복 검사
      const checkResponse = await axios.get(`${API_URL}/user/check/nickname`, {
        params: { nickname: newNickname.trim() },
        headers: {
          "Authorization": accessToken,
          "Content-Type": "application/json",
          "X-User-ID": userId,
        },
      });

      console.log('!!!!!!!!!!!!!!!!!!!!!중복확인',checkResponse.data);

      if (checkResponse.data) {
        setErrorMessage('이미 존재하는 닉네임입니다.');
        triggerShake();
        return;
      }

      // 닉네임 변경 API 요청
      const updateResponse = await axios.post(`${API_URL}/user/update/nickname/${userId}`, {
        "newNickName": newNickname.trim(),
      }, {
        headers: {
          "Authorization": accessToken,
          "Content-Type": "application/json",
          "X-User-ID": userId,
        },
      });

      // 닉네임 변경 성공 후 최신 닉네임을 다시 가져오기
      await getNickname();

      setModalVisible(false);
      setNewNickname('');
      setErrorMessage('');
    } catch (error) {
      console.error('닉네임 변경 중 오류 발생:', error);
      setErrorMessage('닉네임 변경에 실패했습니다.');
      triggerShake();
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
    setNewNickname('');
    setErrorMessage('');
  };

  return (
    <ImageBackground
      source={require('../assets/Images/bg_img.jpg')} // 배경 이미지 경로
      style={styles.background} // 배경 스타일 설정
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <TouchableOpacity
            style={styles.nicknameBox}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.nickname}>{nickname}</Text>
            <PencilIcon width={30} height={30} style={styles.pencil} />
          </TouchableOpacity>

          {/* 모달 구현 */}
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
                    <Text style={styles.modalTitle}>닉네임 변경</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder="새 닉네임을 입력하세요"
                      value={newNickname}
                      onChangeText={(text: string) => {
                        setNewNickname(text);
                        if (errorMessage) setErrorMessage('');
                      }}
                    />
                    {errorMessage ? (
                      <Text style={styles.errorText}>{errorMessage}</Text>
                    ) : null}
                    <View style={styles.modalButtons}>
                      <TouchableOpacity style={styles.confirmButton} onPress={handleChangeNickname}>
                        <Text style={styles.confirmButtonText}>확인</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.cancelButton} onPress={closeModal}>
                        <Text style={styles.cancelButtonText}>취소</Text>
                      </TouchableOpacity>
                    </View>
                  </Animated.View>
                </TouchableWithoutFeedback>
              </View>
            </TouchableWithoutFeedback>
          </Modal>

          <View style={styles.profileCategory}>
            <View style={styles.iconContainer}>
              <TouchableOpacity
                style={styles.profileCategoryButton}
                onPress={() => selectCategory('마이 패션')}
              >
                <View
                  style={[
                    styles.iconWrapper,
                    {
                      borderBottomWidth: selectedCategory === '마이 패션' ? 3 : 0,
                      borderColor: selectedCategory === '마이 패션' ? 'white' : 'transparent',
                    },
                  ]}
                >
                  <MyFashionIcon
                    fill={selectedCategory === '마이 패션' ? 'white' : '#949494'}
                    width={30}
                    height={30}
                  />
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.iconContainer}>
              <TouchableOpacity
                style={styles.profileCategoryButton}
                onPress={() => selectCategory('마이 갤러리')}
              >
                <View
                  style={[
                    styles.iconWrapper,
                    {
                      borderBottomWidth: selectedCategory === '마이 갤러리' ? 3 : 0,
                      borderColor: selectedCategory === '마이 갤러리' ? 'white' : 'transparent',
                    },
                  ]}
                >
                  <WishIcon
                    fill={selectedCategory === '마이 갤러리' ? 'white' : '#949494'}
                    width={30}
                    height={30}
                  />
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.iconContainer}>
              <TouchableOpacity
                style={styles.profileCategoryButton}
                onPress={() => {
                  selectCategory('마이 문철');
                  handleRefresh();
                }}
              >
                <View
                  style={[
                    styles.iconWrapper,
                    {
                      borderBottomWidth: selectedCategory === '마이 문철' ? 3 : 0,
                      borderColor: selectedCategory === '마이 문철' ? 'white' : 'transparent',
                    },
                  ]}
                >
                  <BattleIcon
                    fill={selectedCategory === '마이 문철' ? 'white' : '#949494'}
                    width={30}
                    height={30}
                  />
                </View>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.profileSort}>
            {selectedCategory === '마이 패션' &&
              ['최신순', '출전 수', '승리 수'].map((sort) => (
                <TouchableOpacity
                  key={sort}
                  style={[
                    styles.profileSortButton,
                    {
                      backgroundColor: selectedSort === sort ? 'white' : 'gray',
                    },
                  ]}
                  onPress={() => selectSort(sort)}
                >
                  <Text style={styles.profileSortButtonText}>{sort}</Text>
                </TouchableOpacity>
              ))}

            {selectedCategory === '마이 갤러리' &&
              ['최신순', '인기순'].map((sort) => (
                <TouchableOpacity
                  key={sort}
                  style={[
                    styles.profileSortButton,
                    {
                      backgroundColor: selectedSort === sort ? 'white' : 'gray',
                    },
                  ]}
                  onPress={() => selectSort(sort)}
                >
                  <Text style={styles.profileSortButtonText}>{sort}</Text>
                </TouchableOpacity>
              ))}

            {selectedCategory === '마이 문철' &&
              ['최신순', '투표 수'].map((sort) => (
                <TouchableOpacity
                  key={sort}
                  style={[
                    styles.profileSortButton,
                    {
                      backgroundColor: selectedSort === sort ? 'white' : 'gray',
                    },
                  ]}
                  onPress={() => selectSort(sort)}
                >
                  <Text style={styles.profileSortButtonText}>{sort}</Text>
                </TouchableOpacity>
              ))}
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    resizeMode: 'cover',
    alignItems: 'center',
    flex: 1,
  },
  background: {
    flex: 1,
    resizeMode: 'cover', // 배경 이미지를 뷰에 맞게 조정
  },
  scrollContainer: {
    flexGrow: 1, // ScrollView의 내용이 화면을 넘어가도 스크롤 가능하도록 설정
    justifyContent: 'flex-start',
  },
  nicknameBox: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 100,
  },
  nickname: {
    fontSize: 35,
    textAlign: 'center',
    color: '#ffffff',
  },
  pencil: {
    marginLeft: 10,
    marginTop: 7,
  },
  title: {
    fontSize: 40,
    textAlign: 'center',
    color: '#ffffff',
    marginTop: 20,
  },
  notificationItem: {
    width: '50%',
    height: 300,
  },
  notificationImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
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
  profileCategoryButton: {
    width: '90%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileCategoryButtonText: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  profileSort: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingLeft: 5,
  },
  profileSortButton: {
    marginTop: 15,
    marginBottom: 5,
    marginHorizontal: 5,
    borderRadius: 22,
    borderColor: 'white',
    width: 70,
    height: 37,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileSortButtonText: {
      fontSize: 16,
      color: 'white',
      textAlign: 'center',
      marginBottom: 2,
  },
  switchText: {
    color: 'white',
  },
  profileCategory: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    height: 40,
    marginBottom: 5,
    paddingBottom: 7,
    borderBottomWidth: 1,
    borderColor: 'gray',
  },
  iconContainer: {
    flex: 1, // 아이콘을 3등분하기 위한 설정
    alignItems: 'center',
  },
  iconWrapper: {
    padding: 5,
    width: '100%',
    height: 60,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 3,
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
    fontWeight: 'bold',
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
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  confirmButton: {
    backgroundColor: '#4285F4',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: 'center',
    marginRight: 10,
    flex: 1,
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#aaa',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ProfileView;
