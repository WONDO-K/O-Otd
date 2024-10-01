import React, { useMemo, useRef, useEffect } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';

import { BlurView } from '@react-native-community/blur';

const windowWidth = Dimensions.get('window').width;
const margin = 24;
const cardSize = { width: windowWidth - 48 * 2, height: 400 };
const offset = cardSize.width + margin;

export default function Carousel() {
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
    [],
  );

  // 1. 데이터를 양 끝에 복사해서 추가
  const infiniteData = useMemo(() => {
    const firstItem = data[0];
    const lastItem = data[data.length - 1];
    return [lastItem, ...data, firstItem];
  }, [data]);

  const flatListRef = useRef(null);

  // 2. snapToOffsets 설정
  const snapToOffsets = useMemo(() => {
    return Array.from({ length: infiniteData.length }).map(
      (_, index) => index * offset
    );
  }, [infiniteData]);

  // 3. 컴포넌트가 마운트된 후에 FlatList를 첫 번째 실제 항목으로 스크롤
  // useEffect(() => {
  //   if (flatListRef.current) {
  //     flatListRef.current.scrollToOffset({
  //       offset: offset,
  //       animated: false,
  //     });
  //   }
  // }, [offset]);

  // 4. 스크롤 끝 처리 방어 코드 추가
  const handleScrollEnd = (e) => {
    const contentOffsetX = e.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / offset);

    if (!flatListRef.current) return; // 방어 코드: flatListRef가 존재할 때만 실행

    if (currentIndex === 0) {
      // 마지막 이미지에서 첫 번째 이미지로 이동 시도 시
      flatListRef.current.scrollToOffset({
        offset: (infiniteData.length - 2) * offset,
        animated: false,
      });
    } else if (currentIndex === infiniteData.length - 1) {
      // 첫 번째 이미지에서 마지막 이미지로 이동 시도 시
      flatListRef.current.scrollToOffset({
        offset: offset,
        animated: false,
      });
    }
  };

  return (
    <>
      <BlurView
        blurType="dark"
        blurAmount={10}
        overlayColor="rgba(255, 255, 255, 0)"
        style={styles.blurView}
      >
        <View style={styles.container}>
          <Text style={styles.title}>금주의 스타일</Text>
          <View style={{ marginBottom: 10 }} />
          {/* <FlatList
            ref={flatListRef}
            data={infiniteData}
            snapToOffsets={snapToOffsets}
            snapToInterval={offset}
            decelerationRate="fast"
            horizontal
            pagingEnabled
            onMomentumScrollEnd={handleScrollEnd}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 48 }}
            style={{ height: cardSize.height }} // 높이 설정
            renderItem={({ item }) => (
              <TouchableOpacity style={{ marginRight: margin }}>
                <ImageBackground style={cardSize} source={item.carouselImageUrl} />
              </TouchableOpacity>
            )}
            keyExtractor={(_, index) => String(index)}
            getItemLayout={(data, index) => ({
              length: offset,
              offset: offset * index,
              index,
            })}
            initialScrollIndex={1}
          /> */}
          <FlatList
            ref={flatListRef}
            data={infiniteData}
            horizontal
            snapToOffsets={snapToOffsets} // 아이템 간격에 따라 스냅
            decelerationRate="fast"  // 스크롤 속도 제어
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 48 }}
            style={{ height: cardSize.height }} // 높이 설정
            renderItem={({ item }) => (
              <TouchableOpacity style={{ marginRight: margin }}>
                <ImageBackground style={cardSize} source={item.carouselImageUrl} />
              </TouchableOpacity>
            )}
            keyExtractor={(_, index) => String(index)}
            getItemLayout={(data, index) => ({
              length: offset,
              offset: offset * index,
              index,
            })}
            onScrollEndDrag={(e) => {
              const contentOffsetX = e.nativeEvent.contentOffset.x;
              const currentIndex = Math.round(contentOffsetX / offset);
              if (flatListRef.current) {
                flatListRef.current.scrollToOffset({
                  offset: currentIndex * offset,
                  animated: true,  // 애니메이션 추가
                });
              }
            }}
            onMomentumScrollEnd={handleScrollEnd}
            scrollEventThrottle={16}  // 스크롤 이벤트 주기 조정
            initialScrollIndex={1}
          />
        </View>
      </BlurView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: windowWidth,
    height: cardSize.height + 80,
    paddingBottom: 10,
    zIndex: 1,
    // backgroundColor: 'rgba(128, 128, 128, 0.25)',
  },
  title: {
    fontFamily: 'GmarketSansTTFMedium',
    // fontFamily: 'SUIT-Regular',
    // fontFamily: 'SCDream5',
    // fontFamily: 'Paperlogy-5Medium',
    // fontFamily: 'Pretendard-Regular',
    // fontFamily: 'Freesentation-5Medium',
    fontSize: 40,
    textAlign: 'center',
    color: '#ffffff',
    zIndex: 2,
  },
  blurView: {
    borderColor: '#ffffff',
    borderWidth: 3,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 50, // 그림자 높이 조정
  },
});
