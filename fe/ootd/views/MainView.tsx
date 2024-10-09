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

function MainView(): React.JSX.Element {
  const navigation = useNavigation();

  const [inputText, setInputText] = useState(''); 
  const [searchType, setSearchType] = useState(''); 
  const [myFashion, setMyFashion] = useState([]);
  const [bookmarked, setBookmarked] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1); 

  const { accessToken, userId, API_URL } = useLoginStore();
  const onEndReachedCalledDuringMomentum = useRef(false);

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

  const fetchGallery = async (type, isNewSearch = false) => {
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
          (item, index, self) => index === self.findIndex((t) => t.imageId === item.imageId)
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
  };

  const openModal = useCallback((item) => {
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

  const toggleBookmark = useCallback((id) => {
    setBookmarked((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  }, []);

  const handleLoadMore = useCallback(() => {
    if (!isLoadingMore && hasMore) {
      fetchGallery(searchType);
    }
  }, [isLoadingMore, hasMore, searchType]);

  const handleInputChange = useCallback((input) => {
    setInputText(input);
  }, []);

  const handleSearchPress = useCallback(() => {
    const trimmedInput = inputText.trim();
    if (trimmedInput !== searchType.trim()) {
      setSearchType(trimmedInput);
    }
  }, [inputText, searchType]);

  return (
    <ImageBackground
      source={require('../assets/Images/bg_img.jpg')}
      style={styles.background}
    >
      <View style={styles.container}>
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
            onSubmitEditing={handleSearchPress}
            returnKeyType="search"
          />
          {isLoading && <ActivityIndicator size="small" color="#ffffff" style={styles.searchLoader} />}
        </View>
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
                  <TouchableOpacity style={styles.bookmarkIcon} onPress={() => toggleBookmark(item.imageId || 0)}>
                    {bookmarked[item.imageId || 0] ? (
                      <WishFullIcon width={30} height={40} />
                    ) : (
                      <WishIcon width={30} height={40} fill="white" />
                    )}
                  </TouchableOpacity>
                </ImageBackground>
              </TouchableOpacity>
            )}
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
