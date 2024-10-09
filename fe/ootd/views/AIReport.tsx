import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import useAIStore from '../stores/AIStore'; // Zustand 스토어 가져오기
import { TitleText, TitleBoldText, ContentText, ContentBoldText } from '../components/CustomTexts';
import BackIcon from '../assets/Icons/Back_Icon.svg';

import WishFullIcon from '../assets/Icons/WishFull_Icon.svg';
import WishIcon from '../assets/Icons/Wish_Icon.svg';

// 메인 페이지
function AIReport(): React.JSX.Element {
  const navigation = useNavigation();
  const route = useRoute();

  const { images, type } = route.params;
  const { image } = useAIStore(); // Zustand에서 이미지 가져오기

  const [bookmarked, setBookmarked] = useState({});

  const toggleBookmark = (id) => {
    setBookmarked((prevState) => ({
      ...prevState,
      [id]: !prevState[id],  // 북마크 상태를 토글
    }));
  };

  const getTypeExplain = (type: string) => {
    switch (type) {
      case 'street_look':
        return {
          title: '스트릿 룩',
          description: '길거리 패션에서 영감을 받은 자유롭고 개성 넘치는 스타일입니다. 유행을 빠르게 반영하고 자신만의 독특한 패션을 표현하는 것이 특징입니다.',
        };
      case 'casual_look':
        return {
          title: '캐주얼 룩',
          description: '실용적인 옷차림으로 일상에서 자주 입으며, 편안함을 중시하는 스타일입니다. 격식을 차리지 않고 편하게 입는 패션입니다.',
        };
      case 'sporty_look':
        return {
          title: '스포티 룩',
          description: '운동복에서 영감을 받은 활동적인 스타일입니다. 애슬레저 트렌드로 일상에서도 운동복을 착용하는 것이 특징입니다.',
        };
      case 'chic_look':
        return {
          title: '시크 룩',
          description: '세련되고 도시적인 느낌을 주는 스타일입니다. 주로 검정, 회색, 화이트 색상과 깔끔한 실루엣을 사용해 우아하면서도 차가운 이미지를 연출하는 패션입니다.',
        };
      case 'minimal_look':
        return {
          title: '미니멀 룩',
          description: '세련되고 도시적인 느낌을 주는 스타일입니다. 주로 검정, 회색, 화이트 색상과 깔끔한 실루엣을 사용해 우아하면서도 차가운 이미지를 연출하는 패션입니다.',
        };
      case 'classic_look':
        return {
          title: '클래식 룩',
          description: '시간이 지나도 변하지 않는 우아하고 품격 있는 스타일입니다. 단정하고 격식 있는 이미지를 표현하는 것이 특징입니다.',
        };
      default:
        return {
          title: '알 수 없는 스타일',
          description: '이 스타일에 대한 설명을 찾을 수 없습니다. 다른 이미지를 시도해 보세요.',
        };
    } 
  }

  const { title, description } = getTypeExplain(type);

  return (
    <ImageBackground
      source={require('../assets/Images/bg_img.jpg')} // 배경 이미지 경로
      style={styles.background} // 배경 스타일 설정
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <BackIcon 
            onPress={() => navigation.goBack()}
            style={{
              position: 'absolute',
              top: 30, 
              left: 20,
            }}
          />
          <TitleText style={styles.title}><TitleBoldText>AI</TitleBoldText> Lens</TitleText>

          <View style={styles.reportBox}>
          {image ? (
            <Image
              source={{ uri: `data:image/jpeg;base64,${image}` }} // base64로 이미지 표시
              style={styles.photo}
            />
          ) : (
            <ContentText style={styles.noPhotoText}>저장된 이미지가 없습니다.</ContentText> // 이미지가 없을 때 표시
          )}
            <View style={styles.reportContents}>
              <ContentText style={styles.reportName}>
                {title}
              </ContentText>
              <ContentText style={styles.reportText}>
                {description}
              </ContentText>
            </View>
          </View>
          
          <TitleText style={styles.title}>Similar Styles</TitleText>
          <FlatList
            style={{marginTop: 20}}
            data={images}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <View style={styles.notificationItem}>
                <ImageBackground
                  source={{ uri: item }}
                  style={styles.notificationImage}
                  resizeMode="cover"
                >
                  <TouchableOpacity
                    style={styles.bookmarkIcon}
                    onPress={() => toggleBookmark(index)}
                  >
                    {bookmarked[index] ? (
                      <WishFullIcon width={30} height={40} fill={'white'} /> // 북마크가 활성화된 경우
                    ) : (
                      <WishIcon width={30} height={40} fill={'white'} /> // 비활성화된 경우
                    )}
                  </TouchableOpacity>
                </ImageBackground>
              </View>
            )}
            numColumns={2}
          />
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    resizeMode: 'cover',
    alignItems: 'center',
  },
  background: {
    flex: 1,
    resizeMode: 'cover', // 배경 이미지를 뷰에 맞게 조정
  },
  scrollContainer: {
    flexGrow: 1,  // ScrollView의 내용이 화면을 넘어가도 스크롤 가능하도록 설정
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 40,
    textAlign: 'center',
    color: '#ffffff',
    marginTop: 20,
  },
  reportBox: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent:'space-between',
    width: "90%",
    height: 300,
    padding: 5,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
    borderRadius: 10,

    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  
    elevation: 3,
    shadowColor: 'black',
  },
  photo: {
    width: "50%",
    height: "95%",
    borderRadius: 10,
  },
  noPhotoText: {
    fontSize: 20,
    color: 'white',
    marginTop: 20,
  },
  reportContents: {
    display: 'flex',
    flexDirection: 'column',
    width: "50%",
    height: "90%",
    padding: 5,
    paddingLeft: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reportName: {
    fontSize: 30,
    color: 'white',
    width: "100%",
    height: "30%",
    textAlign: 'center',
    justifyContent: 'center',
  },
  reportText: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    width: "100%",
    height: "70%",
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  notificationItem: {
    width: '50%',
    height: 300,
  },
  notificationImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  bookmarkIcon: {
    position: 'absolute',
    right: 10,
    bottom: 10,
  },
  icon: {
    width: 30,
    height: 30,
  },
});

export default AIReport;
