import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  FlatList,
  ActivityIndicator,
  Modal,
  TouchableWithoutFeedback,
  Image,
} from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import Carousel from '../components/Carousel';
import CategoryButtons from '../components/CategoryButtons';
import WishFullIcon from '../assets/Icons/WishFull_Icon.svg';
import WishIcon from '../assets/Icons/Wish_Icon.svg';
import { useLoginStore } from '../stores/LoginStore';
import CategoryContext from '../components/CategoryContext'; // Context 가져오기

// HeaderComponent는 Carousel과 CategoryButtons를 포함
const HeaderComponent = React.memo(({ openModal }) => (
  <View>
    <Carousel openModal={openModal} />
    <CategoryButtons />
  </View>
));

function MainView(): React.JSX.Element {
  const navigation = useNavigation();

  const [category, setCategory] = useState<string>(''); 
  const [myFashion, setMyFashion] = useState<any[]>([]);
  const [bookmarked, setBookmarked] = useState<{ [key: string]: boolean }>({});
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<any>(null);
  
  const [isLoadingInitial, setIsLoadingInitial] = useState<boolean>(false);
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
    setHasMore(true); 
    setCurrentPage(1);
    fetchGallery(category, true);
  }, [category]);

  const fetchGallery = useCallback(async (type: string, isNewSearch: boolean = false) => {
    if (isLoadingInitial || isLoadingMore || !hasMore) return;

    if (isNewSearch) {
      setIsLoadingInitial(true);
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
        if (isNewSearch) {
          setMyFashion(uniqueData);
        } else {
          setMyFashion(prev => [...prev, ...uniqueData]);
        }

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
        setIsLoadingInitial(false);
      } else {
        setIsLoadingMore(false);
      }
    }
  }, [isLoadingInitial, isLoadingMore, hasMore, currentPage, API_URL, accessToken, userId]);

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

    console.log('Toggling bookmark request');

    try {
      if (!isBookmarked) {
        const bookmarkedResponse = await axios.post(`${API_URL}/gallery/my-collection`, body, {
          headers: {
            "Authorization": accessToken,
            "Content-Type": "application/json",
            "X-User-ID": userId,
          },
        });
        console.log('Bookmark added:', bookmarkedResponse.data);
      } else {
        await axios.delete(`${API_URL}/gallery/my-collection`, {
          data: body,
          headers: {
            "Authorization": accessToken,
            "Content-Type": "application/json",
            "X-User-ID": userId,
          },
        });
        console.log('Bookmark removed');
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
      fetchGallery(category);
    }
  }, [isLoadingMore, hasMore, category, fetchGallery]);

  const onCategoryPress = useCallback((selectedCategory: string) => {
    if (selectedCategory !== category.trim()) {
      setCategory(selectedCategory);
    }
  }, [category]);

  // Header 컴포넌트를 메모이제이션하여 불필요한 리렌더링 방지
  const renderHeader = useCallback(() => (
    <HeaderComponent 
      openModal={openModal} 
    />
  ), [openModal]);

  // ListEmptyComponent: show loader if isLoadingInitial, show error if error, else nothing
  const renderListEmptyComponent = useCallback(() => {
    if (isLoadingInitial) {
      return (
        <View style={styles.listEmptyContainer}>
          <ActivityIndicator size="large" color="#ffffff" />
        </View>
      );
    }
    if (error) {
      return (
        <View style={styles.listEmptyContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={() => fetchGallery(category, true)} style={styles.retryButton}>
            <Text style={styles.retryText}>다시 시도하기</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return null;
  }, [isLoadingInitial, error, fetchGallery, category]);

  return (
    <ImageBackground
      source={require('../assets/Images/bg_img.jpg')}
      style={styles.background}
    >
      <CategoryContext.Provider value={{ activeCategory: category, onCategoryPress }}>
        <View style={styles.container}>
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
            ListEmptyComponent={renderListEmptyComponent}
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
            style={styles.flatList} // FlatList에 flex:1 적용
          />

          {/* 모달 */}
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
      </CategoryContext.Provider>
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
  flatList: {
    flex: 1,
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
  listEmptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    minHeight: 200, // 갤러리 목록의 최소 높이 설정
  },
  errorContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
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
  flatListContent: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
});

export default MainView;
