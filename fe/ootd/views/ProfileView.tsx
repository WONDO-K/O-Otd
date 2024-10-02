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

import WishFullIcon from '../assets/Icons/WishFull_Icon.svg';
import WishIcon from '../assets/Icons/Wish_Icon.svg';
import PencilIcon from '../assets/Icons/Pencil_Icon.svg';
import MyFashionIcon from '../assets/Icons/MyFashion_Icon.svg';
import BattleIcon from '../assets/Icons/Battle_Icon.svg';

// 메인 페이지
function ProfileView(): React.JSX.Element {
  const navigation = useNavigation();
  const route = useRoute();

  const [myFashion, setMyFashion] = useState([]);
  const [bookmarked, setBookmarked] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('마이 패션');
  const [selectedSort, setSelectedSort] = useState('최신순');
  const [pictureList, setPictureList] = useState([]);

  const selectCategory = (category: string) => {
    setSelectedCategory(category);
    setSelectedSort('최신순');
};
const selectSort = (sort: string) => {
    setSelectedSort(sort);
};

const getPictureList = (category: string, sort: string) => {
  if (category === '마이 패션') {
      const data = {
          "myFashionList": [
              {
                "wardrobeId": 1,
                "createdAt": "2024-09-25T00:00:00",
                "ImageUrl": "https://placekitten.com/200/300",
                "wardrobeBattle": 3,
                "wardrobeWin": 2,
              },
              {
                "wardrobeId": 2,
                "createdAt": "2024-09-20T00:00:00",
                "imageUrl": "https://picsum.photos/400/400",
                "wardrobeBattle": 2,
                "wardrobeWin": 1,
              }
          ],
      }

      setPictureList(data.myFashionList);
  } else if (category === '마이 갤러리') {
      const data = {
          "myGalleryList": [
              {
                "clotheId": 2,
                "likeAt": "2024-09-22T00:00:00",
                "imageUrl": "https://picsum.photos/200/300",
                "totalPick": 43,
                "monthlyPick": 15,
                "weeklyPick": 3,
              },
              {
                "clotheId": 2,
                "likeAt": "2024-09-24T00:00:00",
                "imageUrl": "https://placedog.net/500",
                "totalPick": 46,
                "monthlyPick": 14,
                "weeklyPick": 13,
              }
          ]
      }
      setPictureList(data.myGalleryList)
    } else if(category === '마이 문철') {
      const data = {
        "myBattleList": [
            {
                "battleId": 1,
                "title": "Summer Fashion Battle",
                "participantCount": 2,
                "status": "IN_PROGRESS",
                "startedAt": "2024-09-25T01:00:00",
                "leftImage": "https://placekitten.com/200/300",
                "rightImage": "https://placedog.net/500",
                "myPick": null,
                "leftName": "악질유저기무동현",
                "rightName": "분탕장인손우혁"
            },
            {
                "battleId": 3,
                "title": "Autumn Collection Showdown",
                "participantCount": 2,
                "status": "IN_PROGRESS",
                "startedAt": "2024-09-25T00:00:00",
                "leftImage": "https://picsum.photos/400/400",
                "rightImage": "https://picsum.photos/200/300",
                "myPick": "left",
                "leftName": "유저네임3",
                "rightName": "유저네임4"
            }
        ],
      }
      setPictureList(data.myBattleList);
    };
  };

  const toggleBookmark = (id) => {
    setBookmarked((prevState) => ({
      ...prevState,
      [id]: !prevState[id],  // 북마크 상태를 토글
    }));
  };

  // useEffect(() => {
  //   getMyFashion();  // 컴포넌트가 마운트될 때 데이터 가져오기
  // }, []);

  return (
    <>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.nicknameBox}>
          <Text style={styles.nickname}>신주쿠헌옷수거함지배자</Text>
          <PencilIcon width={30} height={30} style={styles.pencil} />
        </TouchableOpacity>

        <View style={styles.profileCategory}>
          <View style={styles.iconContainer}>
            <TouchableOpacity
              style={styles.profileCategoryButton}
              onPress={() => selectCategory('마이 패션')}
            >
              <View
                style={[
                  styles.iconWrapper,
                  {
                    borderBottomWidth: selectedCategory === '마이 패션' ? 3 : 0,
                    borderColor: selectedCategory === '마이 패션' ? 'white' : 'transparent',
                  },
                ]}
              >
                <MyFashionIcon
                  fill={selectedCategory === '마이 패션' ? 'white' : '#949494'}
                  width={30}
                  height={30}
                />
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.iconContainer}>
            <TouchableOpacity
              style={styles.profileCategoryButton}
              onPress={() => selectCategory('마이 갤러리')}
            >
              <View
                style={[
                  styles.iconWrapper,
                  {
                    borderBottomWidth: selectedCategory === '마이 갤러리' ? 3 : 0,
                    borderColor: selectedCategory === '마이 갤러리' ? 'white' : 'transparent',
                  },
                ]}
              >
                <WishIcon
                  fill={selectedCategory === '마이 갤러리' ? 'white' : '#949494'}
                  width={30}
                  height={30}
                />
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.iconContainer}>
            <TouchableOpacity
              style={styles.profileCategoryButton}
              onPress={() => selectCategory('마이 문철')}
            >
              <View
                style={[
                  styles.iconWrapper,
                  {
                    borderBottomWidth: selectedCategory === '마이 문철' ? 3 : 0,
                    borderColor: selectedCategory === '마이 문철' ? 'white' : 'transparent',
                  },
                ]}
              >
                <BattleIcon
                  fill={selectedCategory === '마이 문철' ? 'white' : '#949494'}
                  width={30}
                  height={30}
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>


        {/* <View style={styles.profileTab}>
          <View style={styles.profileCategory}>
              <TouchableOpacity
                  style={styles.profileCategoryButton}
                  onPress={() => selectCategory('마이 패션')}
              >
                <View
                    style={[
                        {
                          padding: selectedCategory === '마이 패션' ? 5 : 0,
                          borderBottomWidth: selectedCategory === '마이 패션' ? 3 : 0,
                          borderColor: selectedCategory === '마이 패션' ? 'white' : 'transparent',
                        },
                    ]}
                >
                  <MyFashionIcon
                    fill={selectedCategory === '마이 패션' ? 'white' : '#949494'}
                    width={40}
                    height={40}
                  />
                </View>
              </TouchableOpacity>

        <TouchableOpacity
          style={styles.profileCategoryButton}
          onPress={() => selectCategory('마이 갤러리')}
        >
          <View
            style={[
              {
                padding: selectedCategory === '마이 갤러리' ? 5 : 0,
                borderBottomWidth: selectedCategory === '마이 갤러리' ? 3 : 0,
                borderColor: selectedCategory === '마이 갤러리' ? 'white' : 'transparent',
              },
            ]}
          >
            <WishIcon
              fill={selectedCategory === '마이 갤러리' ? 'white' : '#949494'}
              width={35}
              height={40}
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.profileCategoryButton}
          onPress={() => selectCategory('마이 문철')}
        >
          <View
            style={[
              {
                padding: selectedCategory === '마이 문철' ? 5 : 0,
                borderBottomWidth: selectedCategory === '마이 문철' ? 3 : 0,
                borderColor: selectedCategory === '마이 문철' ? 'white' : 'transparent',
              },
            ]}
          >
            <BattleIcon
              fill={selectedCategory === '마이 문철' ? 'white' : '#949494'}
              width={40}
              height={40}
            />
          </View>
        </TouchableOpacity>
          </View> */}
                <View style={styles.profileSort}>
      {selectedCategory === '마이 패션' && ['최신순', '출전 수', '승리 수'].map((sort) => (
        <TouchableOpacity
          key={sort}
          style={[
            styles.profileSortButton,
            {
              backgroundColor: selectedSort === sort ? 'white' : 'gray',
            },
          ]}
          onPress={() => selectSort(sort)}
        >
          <Text style={styles.profileSortButtonText}>{sort}</Text>
        </TouchableOpacity>
      ))}

      {selectedCategory === '마이 갤러리' && ['최신순', '인기순'].map((sort) => (
        <TouchableOpacity
          key={sort}
          style={[
            styles.profileSortButton,
            {
              backgroundColor: selectedSort === sort ? 'white' : 'gray',
            },
          ]}
          onPress={() => selectSort(sort)}
        >
          <Text style={styles.profileSortButtonText}>{sort}</Text>
        </TouchableOpacity>
      ))}

      {selectedCategory === '마이 문철' && ['최신순', '투표 수'].map((sort) => (
        <TouchableOpacity
          key={sort}
          style={[
            styles.profileSortButton,
            {
              backgroundColor: selectedSort === sort ? 'white' : 'gray',
            },
          ]}
          onPress={() => selectSort(sort)}
        >
          <Text style={styles.profileSortButtonText}>{sort}</Text>
        </TouchableOpacity>
        ))}
      </View>
    </View>

      {/* <View style={styles.profileSort}>
      {selectedCategory === '마이 패션' && ['최신순', '출전 수', '승리 수'].map((sort) => (
        <TouchableOpacity
          key={sort}
          style={[
            styles.profileSortButton,
            {
              backgroundColor: selectedSort === sort ? 'white' : 'gray',
            },
          ]}
          onPress={() => selectSort(sort)}
        >
          <Text style={styles.profileSortButtonText}>{sort}</Text>
        </TouchableOpacity>
      ))}

      {selectedCategory === '마이 갤러리' && ['최신순', '인기순'].map((sort) => (
        <TouchableOpacity
          key={sort}
          style={[
            styles.profileSortButton,
            {
              backgroundColor: selectedSort === sort ? 'white' : 'gray',
            },
          ]}
          onPress={() => selectSort(sort)}
        >
          <Text style={styles.profileSortButtonText}>{sort}</Text>
        </TouchableOpacity>
      ))}

      {selectedCategory === '마이 문철' && ['최신순', '투표 수'].map((sort) => (
        <TouchableOpacity
          key={sort}
          style={[
            styles.profileSortButton,
            {
              backgroundColor: selectedSort === sort ? 'white' : 'gray',
            },
          ]}
          onPress={() => selectSort(sort)}
        >
          <Text style={styles.profileSortButtonText}>{sort}</Text>
        </TouchableOpacity>
        ))}
      </View>
 */}



        {/* <FlatList
          style={{marginTop: 20}}
          data={myFashion}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.notificationItem}>
              <ImageBackground
                source={item.src}
                style={styles.notificationImage}
                resizeMode="cover"
              >
                <TouchableOpacity
                  style={styles.bookmarkIcon}
                  onPress={() => toggleBookmark(item.id)}
                >
                {bookmarked[item.id] ? (
                  <WishFullIcon width={30} height={40} /> // 북마크가 활성화된 경우
                ) : (
                  <WishIcon width={30} height={40} /> // 비활성화된 경우
                )}
                </TouchableOpacity>
              </ImageBackground>
            </View>
          )}
          numColumns={2}
        />

      </View> */}
      </ScrollView>
      </>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    resizeMode: 'cover',
    alignItems: 'center',
    backgroundColor: '#121212',
    flex: 1,
  },
  backgroundImage: {
    flex: 1, // 화면 전체를 덮도록 설정
  },
  scrollContainer: {
    flexGrow: 1,  // ScrollView의 내용이 화면을 넘어가도 스크롤 가능하도록 설정
    justifyContent: 'flex-start',
  },
  nicknameBox: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 100,
  },
  nickname: {
    fontSize: 35,
    textAlign: 'center',
    color: '#ffffff',
  },
  pencil: {
    marginLeft: 10,
    marginTop: 7,
  },
  title: {
    fontSize: 40,
    textAlign: 'center',
    color: '#ffffff',
    marginTop: 20,
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
  line: {
    borderBottomColor: 'white', // 선 색상
    borderBottomWidth: 2, // 선 두께
    width: '100%', // 선의 길이를 부모의 너비로 설정
    marginTop: 10,
  },

  profileTab:{
    backgroundColor: '#121212',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
    paddingTop: 10,
    borderBottomWidth: 1,
    borderColor: 'gray',
  },
  // profileCategory:{
  //     display: 'flex',
  //     flexDirection: 'row',
  //     justifyContent:'space-around',
  //     alignItems: 'center',
  //     width: '100%',
  //     height: 40,
  //     marginBottom: 5,
  // },
  profileCategoryButton:{ 
      width: "90%",
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
  },
  profileCategoryButtonText:{
      color: 'black',
      fontSize: 20,
      fontWeight: 'bold',
      textAlign: 'center',
  },
  profileSort: {
    width: "100%",
    display: 'flex',
    flexDirection: 'row',
    justifyContent : 'flex-start',
    paddingLeft: 5,
  },
  profileSortButton: {
      margin: 10,
      borderRadius: 10,
      width: 80,
      height: 32,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
  },
  profileSortButtonText: {
      fontSize: 20,
      color: 'black',
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 2,
  },
  switchText: {
      color: 'white',
  },
  profileCategory: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    height: 40,
    marginBottom: 5,
    paddingBottom: 7,
    borderBottomWidth: 1,
    borderColor: 'gray',
  },
  iconContainer: {
    flex: 1,  // 아이콘을 3등분하기 위한 설정
    alignItems: 'center',
  },
  iconWrapper: {
    padding: 5,
    width: '100%',
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
});

export default ProfileView;
