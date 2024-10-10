// ProfileView.js

import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  ActivityIndicator,
  Image,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';

import WishFullIcon from '../assets/Icons/WishFull_Icon.svg';
import WishIcon from '../assets/Icons/Wish_Icon.svg';
import PencilIcon from '../assets/Icons/Pencil_Icon.svg';
import MyFashionIcon from '../assets/Icons/MyFashion_Icon.svg';
import BattleIcon from '../assets/Icons/Battle_Icon.svg';
import LinearGradient from 'react-native-linear-gradient';
import { ContentBoldText } from '../components/CustomTexts';
import { useLoginStore } from '../stores/LoginStore';
import BattleItemProgress from '../components/BattleItemProgress';
import BattleItemComplete from '../components/BattleItemComplete';

function ProfileView(): React.JSX.Element {
  const navigation = useNavigation();
  const route = useRoute();

  const { accessToken, userId, API_URL } = useLoginStore();

  const [myFashion, setMyFashion] = useState([]);
  const [bookmarked, setBookmarked] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('마이 패션');
  const [selectedSort, setSelectedSort] = useState('최신순');
  const [pictureList, setPictureList] = useState([]);
  const [nickname, setNickname] = useState(null);

  const [myFashionList, setMyFashionList] = useState([]); // 마이 패션 데이터
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태

  const [myGalleryList, setMyGalleryList] = useState([]); // 마이 갤러리 데이터
  const [isGalleryLoading, setIsGalleryLoading] = useState(false);
  const [galleryError, setGalleryError] = useState(null);

  const [myBattleList, setMyBattleList] = useState([]); // 마이 문철 데이터

  // 모달 관련 상태
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  // 닉네임 변경 관련 상태
  const [nicknameModalVisible, setNicknameModalVisible] = useState(false);
  const [newNickname, setNewNickname] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const shakeAnimation = useRef(new Animated.Value(0)).current;

  const selectCategory = (category: string) => {
    setSelectedCategory(category);
    setSelectedSort('최신순');
  };
  const selectSort = (sort: string) => {
    setSelectedSort(sort);
  };

  // API에서 nickname 가져오는 로직
  const getNickname = async () => {
    try {
      const response = await axios.get(`${API_URL}/user/myinfo`, {
        headers: {
          "Authorization": accessToken,
          "Content-Type": "application/json",
          "X-User-ID": userId,
        },
      });
      console.log(response.data);

      setNickname(response.data.nickname);  // nickname 저장
      console.log('닉네임', response.data.nickname);
    } catch (error) {
      console.error('Error nickname:', error);
    }
  };

  useEffect(() => {
    getNickname();  // 컴포넌트가 마운트될 때 nickname 가져오기
    fetchMyFashion()
  }, []);

  // 마이 패션 데이터를 가져오는 함수
  const fetchMyFashion = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/gallery/myfashion/${userId}`, {
        headers: {
          "Authorization": accessToken,
          "Content-Type": "application/json",
          "X-User-ID": userId,
        },
      });
      const fetchedData = response.data;

      // 데이터 정렬 로직
      if (selectedSort === '최신순') {
        fetchedData.sort((a, b) => new Date(b.createDate) - new Date(a.createDate));
      } else if (selectedSort === '출전 수') {
        fetchedData.sort((a, b) => b.wardrobeBattle - a.wardrobeBattle);
      } else if (selectedSort === '승리 수') {
        fetchedData.sort((a, b) => b.wardrobeWin - a.wardrobeWin);
      }

      // 마이 패션 데이터 상태 업데이트
      setMyFashionList(fetchedData);
    } catch (error) {
      console.error('Error fetching my fashion:', error);
    }
  }, [API_URL, accessToken, userId, selectedSort]);

  // 마이 갤러리 데이터 가져오기 함수
  const fetchMyCollection = useCallback(async () => {
    setIsGalleryLoading(true);
    setGalleryError(null);
    try {
      const response = await axios.get(`${API_URL}/gallery/my-collection/${userId}`, {
        headers: {
          "Authorization": accessToken,
          "Content-Type": "application/json",
          "X-User-ID": userId,
        },
      });
      let fetchedData = response.data; // 응답 데이터 형식에 따라 조정 필요

      // 정렬 로직
      if (selectedSort === '최신순') {
        fetchedData.sort((a, b) => new Date(b.likeDateTime) - new Date(a.likeDateTime));
      } else if (selectedSort === '인기순') {
        fetchedData.sort((a, b) => b.likesCount - a.likesCount);
      }

      setMyGalleryList(fetchedData);
    } catch (error) {
      console.error('Error fetching my collection:', error);
      setGalleryError('찜 목록을 불러오는 데 실패했습니다.');
    } finally {
      setIsGalleryLoading(false);
    }
  }, [API_URL, accessToken, userId, selectedSort]);

  // 마이 문철 데이터를 가져오는 함수
  const fetchMyBattle = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/battle/list/${userId}`, {
        headers: {
          "Authorization": accessToken,
          "Content-Type": "application/json",
          "X-User-ID": userId,
        },
      });
      const fetchedData = response.data;

      // 데이터 정렬 로직
      if (selectedSort === '최신순') {
        fetchedData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      } else if (selectedSort === '인기순') {
        fetchedData.sort((a, b) => (b.requesterVotes+b.responderVotes) - (a.requesterVotes+a.responderVotes));
      }

      // 마이 문철 데이터 상태 업데이트
      setMyBattleList(fetchedData);
    } catch (error) {
      console.error('Error fetching my battles:', error);
    }
  }, [API_URL, accessToken, userId, selectedSort]);

  useEffect(() => {
    if (selectedCategory === '마이 패션') {
      fetchMyFashion();
    }
  }, [selectedCategory, fetchMyFashion]);

  useEffect(() => {
    if (selectedCategory === '마이 패션') {
      fetchMyFashion();
    }
  }, [selectedSort, selectedCategory, fetchMyFashion]);

  useEffect(() => {
    if (selectedCategory === '마이 갤러리') {
      fetchMyCollection();
    }
  }, [selectedCategory, fetchMyCollection]);

  useEffect(() => {
    if (selectedCategory === '마이 갤러리') {
      fetchMyCollection();
    }
  }, [selectedSort, selectedCategory, fetchMyCollection]);

  useEffect(() => {
    if (selectedCategory === '마이 문철') {
      fetchMyBattle();
    }
  }, [selectedCategory, fetchMyBattle]);

  useEffect(() => {
    if (selectedCategory === '마이 문철') {
      fetchMyBattle();
    }
  }, [selectedSort, selectedCategory, fetchMyBattle]);

  // 닉네임 변경 핸들러 (기존 코드 유지)
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

      console.log(checkResponse.data);
      if (checkResponse.data) { // API 응답 형식에 따라 조정
        setErrorMessage('이미 존재하는 닉네임입니다.');
        triggerShake();
        return;
      }

      // 닉네임 변경 API 요청
      const updateResponse = await axios.post(`${API_URL}/user/update/nickname/${userId}`, {
        "newNickname": newNickname.trim(),
      }, {
        headers: {
          "Authorization": accessToken,
          "Content-Type": "application/json",
          "X-User-ID": userId,
        },
      });

      // 닉네임 변경 성공 후 최신 닉네임을 다시 가져오기
      await getNickname();

      setNicknameModalVisible(false);
      setNewNickname('');
      setErrorMessage('');
    } catch (error) {
      console.error('닉네임 변경 중 오류 발생:', error);
      setErrorMessage('닉네임 변경에 실패했습니다.');
      triggerShake();
    }
  };

  // 쉐이크 애니메이션 트리거 (기존 코드 유지)
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

  // 모달 닫기 및 상태 초기화 (기존 코드 유지)
  const closeNicknameModal = () => {
    setNicknameModalVisible(false);
    setNewNickname('');
    setErrorMessage('');
  };

  // openModal 함수 정의
  const openModal = useCallback((item: any) => {
    const imageUrl = item.imageUrl || item.photoUrl;
    if (!imageUrl) {
      console.error('No imageUrl found in the item:', item);
      return;
    }
    setSelectedImage({ ...item, imageUrl });
    setIsModalVisible(true);
  }, []);

  // closeModal 함수 정의
  const closeImageModal = useCallback(() => {
    setIsModalVisible(false);
    setSelectedImage(null);
  }, []);

  const nameSlice = (name: string) => {
    if (name.length > 6) {
        return name.slice(0, 6) + '...';
    } else {
        return name;
    }
  } 

  const calculateRemainingTime = (createdAt: string): string => {
    const now = new Date(); // 현재 시간
    const startTime = new Date(createdAt);

    // 경과 시간 (밀리초 단위)
    const elapsedTime = now.getTime() - startTime.getTime();

    // 하루는 24시간, 즉 86,400,000 밀리초
    const oneDayInMilliseconds = 24 * 60 * 60 * 1000;

    // 하루에서 경과 시간을 뺀 나머지 시간 계산
    const remainingTime = oneDayInMilliseconds - elapsedTime;

    if (remainingTime < 0) {
        return '종료'; // 만약 하루가 지났다면 '시간 초과'를 반환
    }

    // 남은 시간을 시(hour)와 분(minute) 단위로 변환
    const remainingHours = Math.floor((remainingTime / (1000 * 60 * 60)) % 24);
    const remainingMinutes = Math.floor((remainingTime / (1000 * 60)) % 60);
    // ${remainingMinutes}m
    if (remainingHours > 0) {
        return `${remainingHours} 시간`;
    } else {
        return `${remainingMinutes} 분`;
    }
  };

  return (
    <ImageBackground
      source={require('../assets/Images/bg_img.jpg')} // 배경 이미지 경로
      style={styles.background} // 배경 스타일 설정
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          {/* 닉네임 박스 */}
          <TouchableOpacity
            style={styles.nicknameBox}
            onPress={() => setNicknameModalVisible(true)}
          >
            <Text style={styles.nickname}>{nickname}</Text>
            <PencilIcon width={30} height={30} style={styles.pencil} />
          </TouchableOpacity>

          {/* 닉네임 변경 모달 */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={nicknameModalVisible}
            onRequestClose={closeNicknameModal}
          >
            <TouchableWithoutFeedback onPress={closeNicknameModal}>
              <View style={styles.nicknameModalOverlay}>
                <TouchableWithoutFeedback>
                  <Animated.View
                    style={[
                      styles.nicknameModalContainer,
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
                      <TouchableOpacity style={styles.cancelButton} onPress={closeNicknameModal}>
                        <Text style={styles.cancelButtonText}>취소</Text>
                      </TouchableOpacity>
                    </View>
                  </Animated.View>
                </TouchableWithoutFeedback>
              </View>
            </TouchableWithoutFeedback>
          </Modal>

          {/* 카테고리 선택 */}
          <View style={styles.profileCategory}>
            <View style={styles.iconContainer}>
              <TouchableOpacity
                style={styles.profileCategoryButton}
                onPress={() => selectCategory('마이 패션')}
              >
                <View style={styles.iconWrapper}>
                  <MyFashionIcon
                    fill={selectedCategory === '마이 패션' ? 'white' : '#949494'}
                    width={30}
                    height={30}
                  />
                  {selectedCategory === '마이 패션' &&
                    <LinearGradient
                      style={styles.linearGradient}
                      colors={['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.65)', 'rgba(255, 255, 255, 0)']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                    />
                  }
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.iconContainer}>
              <TouchableOpacity
                style={styles.profileCategoryButton}
                onPress={() => selectCategory('마이 갤러리')}
              >
                <View style={styles.iconWrapper}>
                  <WishIcon
                    fill={selectedCategory === '마이 갤러리' ? 'white' : '#949494'}
                    width={30}
                    height={30}
                  />
                  {selectedCategory === '마이 갤러리' &&
                    <LinearGradient
                      style={styles.linearGradient}
                      colors={['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.65)', 'rgba(255, 255, 255, 0)']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                    />
                  }
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.iconContainer}>
              <TouchableOpacity
                style={styles.profileCategoryButton}
                onPress={() => selectCategory('마이 문철')}
              >
                <View style={styles.iconWrapper}>
                  <BattleIcon
                    fill={selectedCategory === '마이 문철' ? 'white' : '#949494'}
                    width={30}
                    height={30}
                  />
                  {selectedCategory === '마이 문철' &&
                    <LinearGradient
                      style={styles.linearGradient}
                      colors={['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.65)', 'rgba(255, 255, 255, 0)']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                    />
                  }
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* 정렬 선택 */}
          <View style={styles.profileSort}>
            {selectedCategory === '마이 패션' && ['최신순', '출전 수', '승리 수'].map((sort) => (
              <TouchableOpacity
                key={sort}
                style={[
                  styles.profileSortButton,
                  {
                    borderWidth: selectedSort === sort ? 2 : 0,
                  },
                ]}
                onPress={() => selectSort(sort)}
              >
                <ContentBoldText style={styles.profileSortButtonText}>{sort}</ContentBoldText>
              </TouchableOpacity>
            ))}

            {selectedCategory === '마이 갤러리' && ['최신순', '인기순'].map((sort) => (
              <TouchableOpacity
                key={sort}
                style={[
                  styles.profileSortButton,
                  {
                    borderWidth: selectedSort === sort ? 2 : 0,
                  },
                ]}
                onPress={() => selectSort(sort)}
              >
                <ContentBoldText style={styles.profileSortButtonText}>{sort}</ContentBoldText>
              </TouchableOpacity>
            ))}

            {selectedCategory === '마이 문철' && ['최신순', '인기순'].map((sort) => (
              <TouchableOpacity
                key={sort}
                style={[
                  styles.profileSortButton,
                  {
                    borderWidth: selectedSort === sort ? 2 : 0,
                  },
                ]}
                onPress={() => selectSort(sort)}
              >
                <ContentBoldText style={styles.profileSortButtonText}>{sort}</ContentBoldText>
              </TouchableOpacity>
            ))}
          </View>

          {/* 마이 패션 콘텐츠 */}
          {selectedCategory === '마이 패션' && (
            isLoading ? (
              <ActivityIndicator size="large" color="#ffffff" style={styles.galleryLoader} />
            ) : error ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{galleryError}</Text>
                <TouchableOpacity onPress={fetchMyFashion} style={styles.retryButton}>
                  <Text style={styles.retryText}>다시 시도하기</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <FlatList
                data={myFashionList}
                keyExtractor={(item, index) => `${item.wardrobeId}_${index}`}
                renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => openModal(item)} style={styles.notificationItem}>
                    <ImageBackground source={{ uri: item.imageUrl }} style={styles.notificationImage} resizeMode="cover"/>
                  </TouchableOpacity>
                )}
                numColumns={2}
                contentContainerStyle={styles.flatListContent}
              />
            )
          )}

          {/* 마이 갤러리 콘텐츠 */}
          {selectedCategory === '마이 갤러리' && (
            isGalleryLoading ? (
              <ActivityIndicator size="large" color="#ffffff" style={styles.galleryLoader} />
            ) : galleryError ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{galleryError}</Text>
                <TouchableOpacity onPress={fetchMyCollection} style={styles.retryButton}>
                  <Text style={styles.retryText}>다시 시도하기</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <FlatList
                data={myGalleryList}
                keyExtractor={(item, index) => `${item.clothesId}_${index}`}
                renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => openModal(item)} style={styles.notificationItem}>
                    <ImageBackground source={{ uri: item.imageUrl }} style={styles.notificationImage} resizeMode="cover">
                      {/* <TouchableOpacity style={styles.bookmarkIcon} onPress={() => toggleBookmark(item.clothesId)}> */}
                      <View style={styles.bookmarkIcon}>
                        <WishFullIcon width={30} height={40} fill="white" />
                      </View>
                      {/* </TouchableOpacity> */}
                    </ImageBackground>
                  </TouchableOpacity>
                )}
                numColumns={2}
                contentContainerStyle={styles.flatListContent}
              />
            )
          )}

          {/* 마이 문철 콘텐츠 */}
          {selectedCategory === '마이 문철' && (
            isLoading ? (
              <ActivityIndicator size="large" color="#ffffff" style={styles.galleryLoader} />
            ) : error ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity onPress={fetchMyBattle} style={styles.retryButton}>
                  <Text style={styles.retryText}>다시 시도하기</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <FlatList
                data={myBattleList}
                keyExtractor={(item, index) => `${item.battleId}_${index}`}
                renderItem={({ item }) => (
                  item.status === 'ACTIVE' ? (
                    <BattleItemProgress
                      item={item}
                      onPress={() => {
                        if (item.myPickUserId === null) {
                          navigation.navigate('BattleDetail', item);
                        } else {
                          Alert.alert('이미 진행한 투표입니다.')
                        }
                      }}
                      calculateRemainingTime={calculateRemainingTime}
                      nameSlice={nameSlice}
                    />
                  ) : (
                    <BattleItemComplete
                      item={item}
                      onPress={() => navigation.navigate('BattleResult', item)}
                      calculateRemainingTime={calculateRemainingTime}
                      nameSlice={nameSlice}
                    />
                  )
                )}
                numColumns={1} // 배틀 목록은 하나씩 세로로 표시
                contentContainerStyle={styles.flatListContent}
              />
            )
          )}

          {/* 이미지 모달 구현 */}
          <Modal
            visible={isModalVisible}
            transparent={true}
            animationType="fade"
            onRequestClose={closeImageModal}
          >
            <TouchableWithoutFeedback onPress={closeImageModal}>
              <View style={styles.profileModalContainer}>
                {selectedImage && (
                  <View style={styles.profileFixedModalContent}>
                    <Image
                      source={{ uri: selectedImage.imageUrl }}
                      style={styles.profileFixedModalImage}
                      resizeMode="contain"
                    />
                    {/* <TouchableOpacity style={styles.profileModalBookmarkIcon} onPress={() => toggleBookmark(selectedImage.clothesId || selectedImage.imageId)}> */}
                    <View style={styles.bookmarkIcon}>
                      <WishFullIcon width={30} height={40} fill="white" />
                    </View>
                    {/* </TouchableOpacity> */}
                  </View>
                )}
              </View>
            </TouchableWithoutFeedback>
          </Modal>
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
    flexGrow: 1,  // ScrollView의 내용이 화면을 넘어가도 스크롤 가능하도록 설정
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
  flatListContainer: {
    flex: 1,
    paddingHorizontal: 20,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationItem: {
    width: '48%',
    height: 300,
    marginBottom: 10,
    marginRight: 10,
  },
  notificationImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
    borderRadius: 10,
    overflow: 'hidden',
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
    width: "90%",
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
    width: "100%",
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
    flex: 1,  // 아이콘을 3등분하기 위한 설정
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
  linearGradient: {
    width: '63%',
    alignSelf: 'center',
    height: 3,
  },
  // 닉네임 변경 모달 관련 스타일
  nicknameModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nicknameModalContainer: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  // 이미지 모달 관련 스타일
  profileModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // MainView와 동일하게 설정
  },
  profileFixedModalContent: {
    width: '80%',
    height: '70%',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  profileFixedModalImage: {
    flex: 1,
    aspectRatio: 1,
  },
  profileModalBookmarkIcon: {
    position: 'absolute',
    right: 10,
    bottom: 10,
  },
  // 공통 모달 스타일 (이미지 모달)
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
  galleryLoader: {
    marginTop: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: 'transparent',
  },
  retryButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#ffffff',
    borderRadius: 5,
  },
  retryText: {
    color: '#000000',
    fontSize: 16,
  },
  flatListContent: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
});

export default ProfileView;
