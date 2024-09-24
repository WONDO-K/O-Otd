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
        blurType="light"
        blurAmount={2}
        style={styles.blurView}
      >
        <View style={styles.container}>
          <Text style={styles.title}>금주의 스타일</Text>
          <View style={{ marginBottom: 10 }} />
          <FlatList
            ref={flatListRef}
            data={infiniteData}
            snapToOffsets={snapToOffsets}
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
    height: cardSize.height + 100, // cardSize에 맞춰 높이 설정
    paddingBottom: 10,
  },
  title: {
    fontSize: 40,
    textAlign: 'center',
    color: '#ffffff',
  },
  blurView: {
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 50, // 그림자 높이 조정
  },
});
