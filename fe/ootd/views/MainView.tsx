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

// Carousel 컴포넌트를 메모이제이션하여 불필요한 리렌더링 방지
const MemoizedCarousel = React.memo(({ openModal }: { openModal: (item: any) => void }) => (
  <Carousel openModal={openModal} />
));

// SearchBar 컴포넌트 분리 및 내부 상태 관리
const SearchBar: React.FC<{ onSearchPress: (searchTerm: string) => void; isLoading: boolean }> = React.memo(({ onSearchPress, isLoading }) => {
  const [inputText, setInputText] = useState<string>('');

  const handleChangeText = useCallback((text: string) => {
    setInputText(text);
  }, []);

  const handlePress = useCallback(() => {
    onSearchPress(inputText.trim());
  }, [onSearchPress, inputText]);

  return (
    <View style={styles.searchBar}>
      <TouchableOpacity onPress={handlePress} disabled={isLoading}>
        <Image source={require('../assets/Images/searchIcon.png')} style={styles.searchIcon} />
      </TouchableOpacity>
      <TextInput
        style={styles.searchInput}
        maxLength={30}
        placeholder="패션 검색"
        placeholderTextColor="gray"
        value={inputText}
        onChangeText={handleChangeText}
        onSubmitEditing={handlePress}
        returnKeyType="search"
      />
      {isLoading && <ActivityIndicator size="small" color="#ffffff" style={styles.searchLoader} />}
    </View>
  );
});

// HeaderComponent는 Carousel과 SearchBar를 포함하며, 메모이제이션됨
const HeaderComponent: React.FC<{ openModal: (item: any) => void; onSearchPress: (searchTerm: string) => void; isLoading: boolean }> = React.memo(({ openModal, onSearchPress, isLoading }) => (
  <>
    <MemoizedCarousel openModal={openModal} />
    <SearchBar onSearchPress={onSearchPress} isLoading={isLoading} />
  </>
));

function MainView(): React.JSX.Element {
  const navigation = useNavigation();

  const [searchType, setSearchType] = useState<string>(''); 
  const [myFashion, setMyFashion] = useState<any[]>([]);
  const [bookmarked, setBookmarked] = useState<{ [key: string]: boolean }>({});
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<any>(null);
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1); 

  const { accessToken, userId, API_URL } = useLoginStore();
  const onEndReachedCalledDuringMomentum = useRef<boolean>(false);

  useEffect(() => {
    fetchGallery('', true); 
  }, []);

  useEffect(() => {
    if (searchType.trim() === '') {
      fetchGallery('', true);
      return;
    }
    setMyFashion([]);
    setHasMore(true); 
    setCurrentPage(1);
    fetchGallery(searchType, true);
  }, [searchType]);

  const fetchGallery = useCallback(async (type: string, isNewSearch: boolean = false) => {
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
          "limit": 20,
        },
        headers: {
          "Authorization": accessToken,
          "Content-Type": "application/json",
          "X-User-ID": userId,
        },
      });
      const fetchedData = response.data;

      if (fetchedData.length > 0) {
        const uniqueData = fetchedData.filter(
          (item: any, index: number, self: any[]) => index === self.findIndex((t) => t.imageId === item.imageId)
        );
        setMyFashion((prev) => isNewSearch ? uniqueData : [...prev, ...uniqueData]);
        if (uniqueData.length < 20) {
          setHasMore(false);
        } else {
          setCurrentPage(prevPage => prevPage + 1);
        }
      } else {
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
  }, [isLoading, isLoadingMore, hasMore, currentPage, API_URL, accessToken, userId]);

  const openModal = useCallback((item: any) => {
    const imageUrl = item.imageUrl || item.photoUrl;
    if (!imageUrl) {
      console.error('No imageUrl found in the item:', item);
      return;
    }
    setSelectedImage({ ...item, imageUrl });
    setIsModalVisible(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalVisible(false);
    setSelectedImage(null);
  }, []);

  const toggleBookmark = useCallback(async (id: string) => {
    const isBookmarked = !!bookmarked[id];

    setBookmarked((prevState) => ({
      ...prevState,
      [id]: !isBookmarked,
    }));

    const body = {
      userId: userId,
      clothesId: id,
    };

    console.log('!!!!!!!!!!!!!!!Toggling bookmark 요청 들어옴!');

    try {
      if (!isBookmarked) {
        const bookmarked = await axios.post(`${API_URL}/gallery/my-collection`, body, {
          headers: {
            "Authorization": accessToken,
            "Content-Type": "application/json",
            "X-User-ID": userId,
          },
        });
        console.log('!!!!!!!!!!!!!!!Toggling bookmark 요청 결과:', bookmarked.data);
      } else {
        await axios.delete(`${API_URL}/gallery/my-collection`, {
          data: body,
          headers: {
            "Authorization": accessToken,
            "Content-Type": "application/json",
            "X-User-ID": userId,
          },
        });
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      setBookmarked((prevState) => ({
        ...prevState,
        [id]: isBookmarked,
      }));
    }
  }, [bookmarked, API_URL, accessToken, userId]);

  const handleLoadMore = useCallback(() => {
    if (!isLoadingMore && hasMore) {
      fetchGallery(searchType);
    }
  }, [isLoadingMore, hasMore, searchType, fetchGallery]);

  const onSearchPress = useCallback((searchTerm: string) => {
    if (searchTerm !== searchType.trim()) {
      setSearchType(searchTerm);
    }
  }, [searchType]);

  // useCallback을 사용하여 renderHeader 함수 메모이제이션
  const renderHeader = useCallback(() => (
    <HeaderComponent 
      openModal={openModal} 
      onSearchPress={onSearchPress} 
      isLoading={isLoading} 
    />
  ), [openModal, onSearchPress, isLoading]);

  return (
    <ImageBackground
      source={require('../assets/Images/bg_img.jpg')}
      style={styles.background}
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
            keyExtractor={(item, index) => `${item.imageId}_${index}`}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => openModal(item)} style={styles.notificationItem}>
                <ImageBackground source={{ uri: item.imageUrl }} style={styles.notificationImage} resizeMode="cover">
                  <TouchableOpacity style={styles.bookmarkIcon} onPress={() => toggleBookmark(item.imageId)}>
                    {bookmarked[item.imageId] ? (
                      <WishFullIcon width={30} height={40} />
                    ) : (
                      <WishIcon width={30} height={40} fill="white" />
                    )}
                  </TouchableOpacity>
                </ImageBackground>
              </TouchableOpacity>
            )}
            ListHeaderComponent={renderHeader}
            ListFooterComponent={isLoadingMore ? <ActivityIndicator size="large" color="#ffffff" /> : null}
            numColumns={2}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
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
                  <TouchableOpacity style={styles.modalBookmarkIcon} onPress={() => toggleBookmark(selectedImage.imageId)}>
                    {bookmarked[selectedImage.imageId] ? (
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
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    height: 62,
    backgroundColor: '#262626',
    borderRadius: 20,
    padding: 10,
    alignSelf: 'center',
    marginBottom: 20,
  },
  searchIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    color: 'white',
    fontSize: 20,
    fontFamily: 'SUIT-Regular',
    padding: 5,
  },
  searchLoader: {
    marginLeft: 10,
  },
  notificationItem: {
    flex: 1,
    margin: 5,
    height: 200,
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  fixedModalContent: {
    width: '80%',
    height: '70%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  fixedModalImage: {
    flex: 1,
    aspectRatio: 1,
  },
  modalBookmarkIcon: {
    position: 'absolute',
    right: 10,
    bottom: 10,
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
