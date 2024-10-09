import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  TextInput,
  FlatList,
  ActivityIndicator,
  Modal,
  TouchableWithoutFeedback,
  Image,
} from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import Carousel from '../components/Carousel';
import WishFullIcon from '../assets/Icons/WishFull_Icon.svg';
import WishIcon from '../assets/Icons/Wish_Icon.svg';
import { useLoginStore } from '../stores/LoginStore';

// 통합된 이미지 아이템 인터페이스
interface ImageItem {
  imageId?: number;
  galleryId?: number;
  photoName?: string;
  imageUrl?: string; // MainView에서 사용
  photoUrl?: string; // Carousel에서 사용
  category?: string;
  uploadedAt?: string;
  isDelete?: boolean;
}

function MainView(): React.JSX.Element {
  const navigation = useNavigation();

  const [searchType, setSearchType] = useState('');
  const [myFashion, setMyFashion] = useState<ImageItem[]>([]);
  const [bookmarked, setBookmarked] = useState<{ [key: number]: boolean }>({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<ImageItem | null>(null);
  
  // 로딩 상태 관리
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  
  // 에러 상태 관리
  const [error, setError] = useState<string | null>(null);

  // 추가: 더 이상 데이터가 없는지 추적
  const [hasMore, setHasMore] = useState(true);

  const { accessToken, userId, API_URL } = useLoginStore();

  // onEndReached 호출 제어를 위한 플래그
  const onEndReachedCalledDuringMomentum = useRef<boolean>(false);

  // 검색어가 변경될 때 데이터를 초기화하고 다시 로드
  useEffect(() => {
    setMyFashion([]);
    setHasMore(true); // 새로운 검색 시 hasMore 초기화
    fetchGallery(searchType, true);
  }, [searchType]);

  // 초기 데이터 로드
  useEffect(() => {
    fetchGallery(searchType);
  }, []);

  // API 요청 함수
  const fetchGallery = async (type: string, isNewSearch: boolean = false) => {
    if (isLoading || isLoadingMore || !hasMore) return;

    if (isNewSearch) {
      setIsLoading(true);
    } else {
      setIsLoadingMore(true);
    }

    try {
      const response = await axios.get(`${API_URL}/gallery/list`, {
        params: {
          "type": type.trim(),
          // 페이지네이션을 위해 추가 파라미터 (예: page, limit) 필요 시 추가
        },
        headers: {
          "Authorization": accessToken,
          "Content-Type": "application/json",
          "X-User-ID": userId,
        },
      });
      const fetchedData: ImageItem[] = response.data; // response.data 사용

      console.log('갤러리 받아오기:', fetchedData);

      if (fetchedData.length > 0) {
        // 중복된 imageId 제거 (선택 사항)
        const uniqueData = fetchedData.filter(
          (item, index, self) => index === self.findIndex((t) => t.imageId === item.imageId)
        );
        setMyFashion((prev) => isNewSearch ? uniqueData : [...prev, ...uniqueData]);
        // 추가: 더 불러올 데이터가 있는지 확인
        if (uniqueData.length === 0) {
          setHasMore(false);
        }
      } else {
        // 더 이상 불러올 데이터가 없을 경우 처리
        setHasMore(false);
      }

      setError(null);
    } catch (err) {
      console.error('Error fetching gallery:', err);
      setError('이미지를 불러오는 데 실패했습니다.');
    } finally {
      if (isNewSearch) {
        setIsLoading(false);
      } else {
        setIsLoadingMore(false);
      }
    }
  };

  // openModal 함수 수정: imageUrl 또는 photoUrl을 사용
  const openModal = (item: ImageItem) => {
    const imageUrl = item.imageUrl || item.photoUrl;
    if (!imageUrl) {
      console.error('No imageUrl found in the item:', item);
      return;
    }
    setSelectedImage({ ...item, imageUrl }); // imageUrl을 보장
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setSelectedImage(null);
  };

  // 북마크 토글 함수
  const toggleBookmark = (id: number) => {
    setBookmarked((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  // 추가 로딩 함수
  const handleLoadMore = () => {
    if (!isLoadingMore && hasMore) {
      fetchGallery(searchType);
    }
  };

  // 렌더리기 위한 로딩 컴포넌트
  const renderFooter = () => {
    if (!isLoadingMore) return null;
    return (
      <View style={styles.loadingMore}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  };

  // 검색 입력 핸들러 (디바운싱 적용 가능)
  const handleSearchChange = (input: string) => {
    setSearchType(input);
  };

  // FlatList의 헤더 컴포넌트로 사용할 Carousel과 SearchBar
  const renderHeader = () => (
    <>
      <Carousel openModal={openModal} />
      <View style={styles.searchBar}>
        <Image source={require('../assets/Images/searchIcon.png')} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          maxLength={30}
          placeholder="패션 검색"
          placeholderTextColor="gray"
          value={searchType}
          onChangeText={handleSearchChange}
        />
      </View>
    </>
  );

  return (
    <ImageBackground
      source={require('../assets/Images/bg_img.jpg')} // 배경 이미지 경로
      style={styles.background} // 배경 스타일 설정
    >
      <View style={styles.container}>
        {isLoading && myFashion.length === 0 ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#ffffff" />
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : (
          <FlatList
            data={myFashion}
            keyExtractor={(item, index) => `${item.imageId}_${index}`} // 고유 키 설정 (프리픽스 추가)
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => openModal(item)} style={styles.notificationItem}>
                <ImageBackground source={{ uri: item.imageUrl }} style={styles.notificationImage} resizeMode="cover">
                  <TouchableOpacity style={styles.bookmarkIcon} onPress={() => toggleBookmark(item.imageId || 0)}>
                    {bookmarked[item.imageId || 0] ? (
                      <WishFullIcon width={30} height={40} /> // 북마크가 활성화된 경우
                    ) : (
                      <WishIcon width={30} height={40} fill="white" /> // 비활성화된 경우
                    )}
                  </TouchableOpacity>
                </ImageBackground>
              </TouchableOpacity>
            )}
            ListHeaderComponent={renderHeader} // 헤더 컴포넌트 추가
            numColumns={2}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={renderFooter}
            contentContainerStyle={styles.flatListContent}
            onMomentumScrollBegin={() => { onEndReachedCalledDuringMomentum.current = false; }}
            onEndReached={() => {
              if (!onEndReachedCalledDuringMomentum.current) {
                handleLoadMore();
                onEndReachedCalledDuringMomentum.current = true;
              }
            }}
          />
        )}

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
                    source={{ uri: selectedImage.imageUrl }}
                    style={styles.fixedModalImage}
                    resizeMode="contain"
                  />
                  <TouchableOpacity style={styles.modalBookmarkIcon} onPress={() => toggleBookmark(selectedImage.imageId || selectedImage.galleryId || 0)}>
                    {bookmarked[selectedImage.imageId || selectedImage.galleryId || 0] ? (
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
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover', // 배경 이미지를 뷰에 맞게 조정
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  searchBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '90%',
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
    flex: 1,
    height: '100%',
    color: 'white',
    fontSize: 20,
    fontFamily: 'SUIT-Regular',
  },
  notificationItem: {
    flex: 1,
    margin: 5,
    height: 200, // 적절한 높이 설정
  },
  notificationImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end', // 아이콘을 하단에 배치
    borderRadius: 10,
    overflow: 'hidden',
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
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: 'transparent',
  },
  errorText: {
    color: '#ff0000',
    fontSize: 16,
    textAlign: 'center',
  },
  loadingMore: {
    paddingVertical: 20,
  },
  flatListContent: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
});

export default MainView;
