import React, { useState, useEffect, useRef, useCallback } from 'react';
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

  const [inputText, setInputText] = useState(''); // 사용자 입력 텍스트
  const [searchType, setSearchType] = useState(''); // 실제 검색에 사용되는 텍스트
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
  const [currentPage, setCurrentPage] = useState(1); // 페이지 번호 관리

  const { accessToken, userId, API_URL } = useLoginStore();

  // onEndReached 호출 제어를 위한 플래그
  const onEndReachedCalledDuringMomentum = useRef<boolean>(false);

  // 초기 데이터 로드
  useEffect(() => {
    fetchGallery('', true); // 초기 로드에 빈 검색어 사용
  }, []);

  // 검색어가 변경될 때 데이터를 초기화하고 다시 로드
  useEffect(() => {
    if (searchType.trim() === '') {
      // 빈 검색어는 모든 데이터를 로드하도록 설정할 수 있습니다.
      fetchGallery('', true);
      return;
    }
    setMyFashion([]);
    setHasMore(true); // 새로운 검색 시 hasMore 초기화
    setCurrentPage(1); // 페이지 초기화
    fetchGallery(searchType, true);
  }, [searchType]);

  // API 요청 함수
  const fetchGallery = async (type: string, isNewSearch: boolean = false) => {
    if (isLoading || isLoadingMore || !hasMore) return;

    if (isNewSearch) {
      setIsLoading(true);
      setCurrentPage(1);
    } else {
      setIsLoadingMore(true);
    }

    try {
      const response = await axios.get(`${API_URL}/gallery/list`, {
        params: {
          "type": type.trim(),
          "page": isNewSearch ? 1 : currentPage + 1,
          "limit": 20, // 예시: 한 번에 20개씩 로드
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
        if (uniqueData.length < 20) { // 예시: 받아온 데이터 수가 limit보다 작으면 더 이상 데이터 없음
          setHasMore(false);
        } else {
          setCurrentPage(prevPage => prevPage + 1);
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
  const openModal = useCallback((item: ImageItem) => {
    const imageUrl = item.imageUrl || item.photoUrl;
    if (!imageUrl) {
      console.error('No imageUrl found in the item:', item);
      return;
    }
    setSelectedImage({ ...item, imageUrl }); // imageUrl을 보장
    setIsModalVisible(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalVisible(false);
    setSelectedImage(null);
  }, []);

  // 북마크 토글 함수
  const toggleBookmark = useCallback((id: number) => {
    setBookmarked((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  }, []);

  // 추가 로딩 함수
  const handleLoadMore = useCallback(() => {
    if (!isLoadingMore && hasMore) {
      fetchGallery(searchType);
    }
  }, [isLoadingMore, hasMore, searchType]);

  // 렌더리기 위한 로딩 컴포넌트
  const renderFooter = useCallback(() => {
    if (!isLoadingMore) return null;
    return (
      <View style={styles.loadingMore}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }, [isLoadingMore]);

  // 검색 입력 핸들러는 이제 inputText를 설정함
  const handleInputChange = useCallback((input: string) => {
    setInputText(input);
  }, []);

  // 검색 아이콘 터치 시 searchType을 설정 (변경된 부분)
  const handleSearchPress = useCallback(() => {
    const trimmedInput = inputText.trim();
    if (trimmedInput !== searchType.trim()) { // 실제로 변경된 경우에만 업데이트
      setSearchType(trimmedInput);
    }
  }, [inputText, searchType]);

  // FlatList의 헤더 컴포넌트로 사용할 Carousel과 SearchBar를 별도 컴포넌트로 분리 및 메모이제이션
  const renderHeader = useCallback(() => (
    <HeaderComponent
      openModal={openModal}
      handleSearchPress={handleSearchPress}
      inputText={inputText}
      handleInputChange={handleInputChange}
      isLoading={isLoading}
    />
  ), [openModal, handleSearchPress, inputText, handleInputChange, isLoading]);

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
            <TouchableOpacity onPress={() => fetchGallery(searchType, true)} style={styles.retryButton}>
              <Text style={styles.retryText}>다시 시도하기</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={myFashion}
            keyExtractor={(item, index) => `${item.imageId}_${index}`} // 고유 키 설정
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

// 별도 헤더 컴포넌트 정의 및 메모이제이션
const HeaderComponent = React.memo(({ openModal, handleSearchPress, inputText, handleInputChange, isLoading }) => (
  <>
    <Carousel openModal={openModal} />
    <View style={styles.searchBar}>
      <TouchableOpacity onPress={handleSearchPress} disabled={isLoading}>
        <Image source={require('../assets/Images/searchIcon.png')} style={styles.searchIcon} />
      </TouchableOpacity>
      <TextInput
        style={styles.searchInput}
        maxLength={30}
        placeholder="패션 검색"
        placeholderTextColor="gray"
        value={inputText}
        onChangeText={handleInputChange}
        onSubmitEditing={handleSearchPress} // 엔터 키로도 검색 트리거
        returnKeyType="search"
      />
      {isLoading && <ActivityIndicator size="small" color="#ffffff" style={styles.searchLoader} />}
    </View>
  </>
));

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
    marginRight: 10, // 검색 아이콘과 입력 필드 사이 간격 조정
  },
  searchInput: {
    flex: 1,
    height: '100%',
    color: 'white',
    fontSize: 20,
    fontFamily: 'SUIT-Regular',
  },
  searchLoader: {
    marginLeft: 10,
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
  loadingMore: {
    paddingVertical: 20,
  },
  flatListContent: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
});

export default MainView;
