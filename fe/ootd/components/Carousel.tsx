// src/components/Carousel.tsx
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
import { TitleText, TitleBoldText } from './CustomTexts';
import { useLoginStore } from '../stores/LoginStore';

const windowWidth = Dimensions.get('window').width;
const margin = 12;
const cardSize = { width: windowWidth * 0.65, height: 400 };
const offset = cardSize.width + margin;

interface CarouselProps {
  openModal: (item: any) => void;
}

const Carousel: React.FC<CarouselProps> = ({ openModal }) => {
  console.log('Carousel 렌더링'); // 리렌더링 확인용 로그
  const scrollX = useRef(new Animated.Value(0)).current; 
  const flatListRef = useRef<any>(null);
  const [weeklyStyle, setWeeklyStyle] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { accessToken, userId, API_URL } = useLoginStore();

  const getWeeklyStyle = async () => {
    try {
      const response = await axios.get(`${API_URL}/gallery/week-pick`, {
        headers: {
          "Authorization": accessToken,
          "Content-Type": "application/json",
          "X-User-ID": userId,
        },
      });
      setWeeklyStyle(response.data.filter((item: any) => !item.isDelete));
      setLoading(false);
    } catch (error) {
      console.error('Weekly Style Error:', error);
      setError('스타일을 불러오는 데 실패했습니다.');
      setLoading(false);
    }
  };

  useEffect(() => {
    getWeeklyStyle();
  }, []);

  const infiniteData = useMemo(() => {
    if (weeklyStyle.length === 0) return [];
    const firstItem = weeklyStyle[0];
    const lastItem = weeklyStyle[weeklyStyle.length - 1];
    return [lastItem, ...weeklyStyle, firstItem];
  }, [weeklyStyle]);

  const snapToOffsets = useMemo(() => {
    return infiniteData.map((_, index) => index * offset);
  }, [infiniteData]);

  const handleScrollEnd = (e: any) => {
    const contentOffsetX = e.nativeEvent.contentOffset.x;
    const newIndex = Math.round(contentOffsetX / offset);

    if (!flatListRef.current) return;

    if (newIndex === 0) {
      flatListRef.current.scrollToOffset({
        offset: (infiniteData.length - 2) * offset,
        animated: false,
      });
    } else if (newIndex === infiniteData.length - 1) {
      flatListRef.current.scrollToOffset({
        offset: offset,
        animated: false,
      });
    }
  };

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
        contentContainerStyle={{ paddingHorizontal: (windowWidth - cardSize.width) / 2 }}
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

          const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.85, 1, 0.85],
            extrapolate: 'clamp',
          });

          return (
            <TouchableOpacity onPress={() => openModal(item)} style={{ marginRight: margin }}>
              <Animated.View style={{ transform: [{ scale }] }}>
                <View style={{ borderRadius: 10, overflow: 'hidden' }}>
                  <ImageBackground 
                    style={cardSize} 
                    source={{ uri: item.imageUrl || item.photoUrl }}
                  >
                  </ImageBackground>
                </View>
              </Animated.View>
            </TouchableOpacity>
          );
        }}
        keyExtractor={(item, index) => `${item.galleryId || item.imageId}_${item.photoName || index}`}
        getItemLayout={(data, index) => ({
          length: offset,
          offset: offset * index,
          index,
        })}
        onMomentumScrollEnd={handleScrollEnd}
        scrollEventThrottle={16}
        initialScrollIndex={1}
      />
    </View>
  );
};

// 커스텀 비교 함수: openModal이 변경되지 않으면 리렌더링 방지
const areEqual = (prevProps: CarouselProps, nextProps: CarouselProps) => {
  return prevProps.openModal === nextProps.openModal;
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: windowWidth,
    height: cardSize.height + 120, // 캐러셀 높이에 맞게 조정
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
    width: cardSize.width,
    height: cardSize.height,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000', // 캐러셀 영역만 덮도록 설정
  },
  errorContainer: {
    width: cardSize.width,
    height: cardSize.height,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#000000', // 캐러셀 영역만 덮도록 설정
  },
  errorText: {
    color: '#ff0000',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default React.memo(Carousel, areEqual);
