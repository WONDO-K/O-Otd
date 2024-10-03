import React, { useMemo, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Animated,
  TouchableOpacity,
  ImageBackground,
  FlatList,
  Text,
} from 'react-native';
import { TitleText } from '../components/CustomTexts';

const windowWidth = Dimensions.get('window').width;
const margin = 12; // 좌우 여백 크기 재조정
const cardSize = { width: windowWidth * 0.65, height: 400 }; // 카드 너비와 높이
const offset = cardSize.width + margin; // 각 카드의 너비와 여백 계산

export default function Carousel() {
  const scrollX = useRef(new Animated.Value(0)).current; // 스크롤 애니메이션 값
  const flatListRef = useRef(null);

  const data = useMemo(
    () => [
      {
        carouselImageUrl: require('../assets/Whale.jpg'),
      },
      {
        carouselImageUrl: require('../assets/Son.jpg'),
      },
      {
        carouselImageUrl: require('../assets/RealMan.jpg'),
      },
      {
        carouselImageUrl: require('../assets/IronMan_Japan.jpg'),
      },
      {
        carouselImageUrl: require('../assets/SpecialAgent_J.jpg'),
      },
      {
        carouselImageUrl: require('../assets/Whale_student.jpg'),
      },
    ],
    []
  );

  // 양 끝에 데이터를 복사하여 무한 스크롤처럼 보이게 함
  const infiniteData = useMemo(() => {
    const firstItem = data[0];
    const lastItem = data[data.length - 1];
    return [lastItem, ...data, firstItem];
  }, [data]);

  // 스크롤 위치에 맞춰 크기 변경
  const snapToOffsets = useMemo(() => {
    return Array.from({ length: infiniteData.length }).map((_, index) => index * offset);
  }, [infiniteData]);

  const handleScrollEnd = (e) => {
    const contentOffsetX = e.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / offset);

    if (!flatListRef.current) return; // 방어 코드

    if (currentIndex === 0) {
      flatListRef.current.scrollToOffset({
        offset: (infiniteData.length - 2) * offset,
        animated: false,
      });
    } else if (currentIndex === infiniteData.length - 1) {
      flatListRef.current.scrollToOffset({
        offset: offset,
        animated: false,
      });
    }
  };

  return (
    <View style={styles.container}>
      <TitleText style={styles.title}>Weekly Styles</TitleText>
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
            <TouchableOpacity style={{ marginRight: margin }}>
              <Animated.View style={{ transform: [{ scale }] }}>
                <View style={{ borderRadius: 10, overflow: 'hidden' }}>
                  <ImageBackground style={cardSize} source={item.carouselImageUrl} />
                </View>
              </Animated.View>
            </TouchableOpacity>
          );
        }}
        keyExtractor={(_, index) => String(index)}

        // getItemLayout 추가
        getItemLayout={(data, index) => ({
          length: offset, // 각 아이템의 고정 길이
          offset: offset * index, // 각 아이템의 오프셋
          index, // 현재 인덱스
        })}

        onMomentumScrollEnd={handleScrollEnd}
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
    marginVertical: 20,
    fontSize: 40,
    textAlign: 'center',
    color: '#ffffff',
    zIndex: 2,
  },
});
