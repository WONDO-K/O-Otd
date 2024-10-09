import React, { useMemo, useRef, useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Animated,
  TouchableOpacity,
  ImageBackground,
  ActivityIndicator,
  Text,
} from 'react-native';
import axios from 'axios';
import { TitleText, TitleBoldText } from '../components/CustomTexts';
import { useLoginStore } from '../stores/LoginStore';

const windowWidth = Dimensions.get('window').width;
const margin = 12; // 좌우 여백 크기 재조정
const cardSize = { width: windowWidth * 0.65, height: 400 }; // 카드 너비와 높이
const offset = cardSize.width + margin; // 각 카드의 너비와 여백 계산

interface CarouselProps {
  openModal: (item: any) => void; // openModal의 타입 정의
}

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

export default function Carousel({ openModal }: CarouselProps) {
  const scrollX = useRef(new Animated.Value(0)).current; // 스크롤 애니메이션 값
  const flatListRef = useRef(null);
  const intervalRef = useRef<number>(0);
  const [currentIndex, setCurrentIndex] = useState(1);
  const [weeklyStyle, setWeeklyStyle] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    accessToken,
    userId,
    API_URL,
  } = useLoginStore();

  const getWeeklyStyle = async () => {
    try {
      const response = await axios.get(`${API_URL}/gallery/week-pick`, {
        headers: {
          "Authorization": accessToken,
          "Content-Type": "application/json",
          "X-User-ID": userId,
        },
      });
      console.log('금주의 스타일:', response.data);

      // isDelete가 false인 데이터만 설정 (선택 사항)
      setWeeklyStyle(response.data.filter((item: any) => !item.isDelete));
      setLoading(false);
    } catch (error) {
      console.error('Weekly Style Error:', error);
      setError('스타일을 불러오는 데 실패했습니다.');
      setLoading(false);
    }
  }

  useEffect(() => {
    getWeeklyStyle();
  }, []);

  // 양 끝에 데이터를 복사하여 무한 스크롤처럼 보이게 함
  const infiniteData = useMemo(() => {
    if (weeklyStyle.length === 0) return [];
    const firstItem = weeklyStyle[0];
    const lastItem = weeklyStyle[weeklyStyle.length - 1];
    return [lastItem, ...weeklyStyle, firstItem];
  }, [weeklyStyle]);

  // 스크롤 위치에 맞춰 크기 변경
  const snapToOffsets = useMemo(() => {
    return infiniteData.map((_, index) => index * offset);
  }, [infiniteData]);

  const handleScrollEnd = (e: any) => {
    const contentOffsetX = e.nativeEvent.contentOffset.x;
    const newIndex = Math.round(contentOffsetX / offset);

    if (!flatListRef.current) return; // 방어 코드

    setCurrentIndex(newIndex); // 스크롤이 멈출 때 현재 인덱스 업데이트

    if (newIndex === 0) {
      flatListRef.current.scrollToOffset({
        offset: (infiniteData.length - 2) * offset,
        animated: false,
      });
      setCurrentIndex(infiniteData.length - 2);
    } else if (newIndex === infiniteData.length - 1) {
      flatListRef.current.scrollToOffset({
        offset: offset,
        animated: false,
      });
      setCurrentIndex(1);
    }
  };

  // 자동 스크롤 기능 주석 처리 시작
  /*
  const startAutoScroll = () => {
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        let nextIndex = prevIndex + 1;

        if (nextIndex === infiniteData.length - 1) {
          // 마지막 인덱스에서 첫 번째로 이동할 때 애니메이션 적용
          flatListRef.current?.scrollToOffset({
            offset: nextIndex * offset,
            animated: true, // 오른쪽으로 부드럽게 이동
          });

          // 다음 애니메이션을 위한 짧은 지연 후 첫 번째 인덱스로 이동
          setTimeout(() => {
            flatListRef.current?.scrollToOffset({
              offset: offset,
              animated: false, // 애니메이션 없이 첫 번째로 이동
            });
            setCurrentIndex(1);
          }, 300); // 애니메이션 시간과 맞추기 위해 지연 시간 설정

          nextIndex = 1;
        } else {
          // 일반적인 자동 스크롤 애니메이션
          flatListRef.current?.scrollToOffset({
            offset: nextIndex * offset,
            animated: true, // 애니메이션 적용
          });
        }

        return nextIndex;
      });
    }, 5000); // 5초 간격으로 스크롤
  };

  const stopAutoScroll = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };
  */
  // 자동 스크롤 기능 주석 처리 끝

  useEffect(() => {
    if (infiniteData.length > 0) {
      flatListRef.current?.scrollToOffset({ offset: offset, animated: false });
      setCurrentIndex(1);
      // 자동 스크롤 시작 주석 처리
      // startAutoScroll();
    }

    // 컴포넌트 언마운트 시 타이머 정리 주석 처리
    return () => {
      // stopAutoScroll();
    };
  }, [infiniteData, offset]);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TitleText style={styles.title}>
        <TitleBoldText>Weekly</TitleBoldText> Styles
      </TitleText>
      <Animated.FlatList
        ref={flatListRef}
        data={infiniteData}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToOffsets={snapToOffsets}
        decelerationRate="fast"
        contentContainerStyle={{ paddingHorizontal: (windowWidth - cardSize.width) / 2 }} // 좌우 패딩 재조정
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
        renderItem={({ item, index }) => {
          const inputRange = [
            (index - 1) * offset,
            index * offset,
            (index + 1) * offset,
          ];

          // 스크롤에 따른 크기 변화 설정
          const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.85, 1, 0.85], // 좌우는 85%, 중앙은 100% 크기
            extrapolate: 'clamp',
          });

          return (
            <TouchableOpacity onPress={() => openModal(item)} style={{ marginRight: margin }}>
              <Animated.View style={{ transform: [{ scale }] }}>
                <View style={{ borderRadius: 10, overflow: 'hidden' }}>
                  <ImageBackground 
                    style={cardSize} 
                    source={{ uri: item.imageUrl || item.photoUrl }} // imageUrl 또는 photoUrl 사용
                    onError={(e) => {
                      console.error('이미지 로딩 실패:', e.nativeEvent.error);
                    }}
                  >
                    {/* 이미지 위에 추가적인 정보 표시 가능 */}
                  </ImageBackground>
                </View>
              </Animated.View>
            </TouchableOpacity>
          );
        }}
        // keyExtractor 수정: 인덱스를 포함하여 키의 고유성 보장
        keyExtractor={(item, index) => `${item.galleryId || item.imageId}_${item.photoName || index}`}
        getItemLayout={(data, index) => ({
          length: offset, // 각 아이템의 고정 길이
          offset: offset * index, // 각 아이템의 오프셋
          index, // 현재 인덱스
        })}
        onMomentumScrollEnd={handleScrollEnd}
        // 자동 스크롤 중지/재개 이벤트 주석 처리
        // onScrollBeginDrag={stopAutoScroll} // 사용자가 스크롤 시작 시 자동 스크롤 중지
        // onScrollEndDrag={startAutoScroll} // 사용자가 스크롤을 끝내면 자동 스크롤 재개
        scrollEventThrottle={16}
        initialScrollIndex={1}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: windowWidth,
    height: cardSize.height + 120,
    paddingBottom: 10,
  },
  title: {
    marginTop: 20,
    marginBottom: 20,
    fontSize: 40,
    textAlign: 'center',
    color: '#ffffff',
    zIndex: 2,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000', // 배경 색상
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#000000', // 배경 색상
  },
  errorText: {
    color: '#ff0000',
    fontSize: 16,
    textAlign: 'center',
  },
});

