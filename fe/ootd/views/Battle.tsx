import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, Switch, StyleSheet, ScrollView, ImageBackground } from 'react-native'; 
import { FlatList } from 'react-native-gesture-handler';
// import BattleIcon from '../assets/Icons/Battle_Icon.svg';
import BattleIcon from '../assets/Icons/Battle_Icon1.svg';
// import BattleIcon from '../assets/Icons/Battle_Icon2.svg';
// import BattleIcon from '../assets/Icons/Battle_Icon3.svg';
// import BattleIcon from '../assets/Icons/Battle_Icon4.svg';
import { TitleText, TitleBoldText } from '../components/CustomTexts';
import axios from 'axios';

import BattleItemProgress from '../components/BattleItemProgress';
import BattleItemComplete from '../components/BattleItemComplete';
import LinearGradient from 'react-native-linear-gradient';

type Battle = {
    battleId: number;
    title: string;
    participantCount: number;
    status: string;
    startedAt: string;
    endedAt: string;
    leftImage: string;
    rightImage: string;
    myPick: string | null;
};

function Battle({ navigation }): React.JSX.Element {

    const [selectedCategory, setSelectedCategory] = useState('진행 중');
    const [selectedSort, setSelectedSort] = useState('최신순');
    const [isEnabled, setIsEnabled] = useState(false);
    const [battleList, setBattleList] = useState([]);

    const calculateRemainingTime = (startedAt: string): string => {
        const now = new Date(); // 현재 시간
        const startTime = new Date(startedAt);
    
        // 경과 시간 (밀리초 단위)
        const elapsedTime = now.getTime() - startTime.getTime();
    
        // 하루는 24시간, 즉 86,400,000 밀리초
        const oneDayInMilliseconds = 24 * 60 * 60 * 1000;
    
        // 하루에서 경과 시간을 뺀 나머지 시간 계산
        const remainingTime = oneDayInMilliseconds - elapsedTime;
    
        if (remainingTime < 0) {
            return '투표 종료'; // 만약 하루가 지났다면 '시간 초과'를 반환
        }
    
        // 남은 시간을 시(hour)와 분(minute) 단위로 변환
        const remainingHours = Math.floor((remainingTime / (1000 * 60 * 60)) % 24);
        const remainingMinutes = Math.floor((remainingTime / (1000 * 60)) % 60);
        // ${remainingMinutes}m
        if (remainingHours > 0) {
            return `${remainingHours} 시간`;
        } else {
            return `${remainingMinutes} 분`;
        }
    };
  
    const selectCategory = (category: string) => {
        setSelectedCategory(category);
        setSelectedSort('최신순');
    };
    const selectSort = (sort: string) => {
        setSelectedSort(sort);
    };

    const nameSlice = (name: string) => {
        if (name.length > 6) {
            return name.slice(0, 6) + '...';
        } else {
            return name;
        }
    }

    const getBattleList = (category: string, sort: string) => {
        if (category === '진행 중') {
            const data = {
                "ongoingBattles": [
                    {
                        "battleId": 1,
                        "title": "Summer Fashion Battle",
                        "participantCount": 2,
                        "status": "IN_PROGRESS",
                        "startedAt": "2024-09-25T01:00:00",
                        "leftImage": "https://o-otd.b-cdn.net/ootd_images/ootd_images_part_1/img_1.png",
                        "rightImage": "https://o-otd.b-cdn.net/ootd_images/ootd_images_part_1/img_10.png",
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
                        "leftImage": "https://o-otd.b-cdn.net/ootd_images/ootd_images_part_9/img_184929.png",
                        "rightImage": "https://o-otd.b-cdn.net/ootd_images/ootd_images_part_9/img_184928.png",
                        "myPick": "left",
                        "leftName": "유저네임3",
                        "rightName": "유저네임4"
                    }
                ],
            }

            setBattleList(data.ongoingBattles);
        } else {
            const data = {
                "completedBattles": [
                    {
                        "battleId": 2,
                        "title": "Winter Fashion Battle",
                        "participantCount": 2,
                        "status": "COMPLETED",
                        "startedAt": "2024-08-01T10:00:00",
                        "endedAt": "2024-08-10T18:00:00",
                        "leftImage": "https://o-otd.b-cdn.net/ootd_images/ootd_images_part_9/img_184930.png",
                        "rightImage": "https://o-otd.b-cdn.net/ootd_images/ootd_images_part_9/img_18493.png",
                        "myPick": "right",
                        "leftName": "악질유저기무동현사마",
                        "rightName": "쌀선대원군",
                        "leftVote": 49,
                        "rightVote": 78,
                        "winner": "right",
                    },
                    {
                        "battleId": 4,
                        "title": "Spring Style Competition",
                        "participantCount": 2,
                        "status": "COMPLETED",
                        "startedAt": "2024-07-01T09:00:00",
                        "endedAt": "2024-07-07T17:00:00",
                        "leftImage": "https://placekitten.com/200/300",
                        "rightImage": "https://placedog.net/500",
                        "myPick": null,
                        "leftName": "유저네임7",
                        "rightName": "유저네임8",
                        "leftVote": 35,
                        "rightVote": 15,
                        "winner": "left",
                    }
                ]
            }
            setBattleList(data.completedBattles)
        };
        // axios.get('https://api.example.com/battle', {
        //     params: {
        //         category: category,
        //         sort: sort
        //     }
        // })
        // .then(response => {
        //     // setBattleList(response.data); 
        // })
        // .catch(error => {
        //     console.error(error);
        // });
    };

    useEffect(() => {
            getBattleList(selectedCategory, selectedSort);
        }, [selectedCategory, selectedSort]);
  
    return (
        <ImageBackground 
            source={require('../assets/Images/bg_img.jpg')}  // 배경 이미지 경로 설정
            style={styles.background}  // 스타일 설정
        >
            <ScrollView style={styles.container}>
                {/* 배틀 헤더 */}
                <View style={styles.battleHeader}>
                    <TitleBoldText style={styles.battleHeaderText}>
                        Beyond U
                    </TitleBoldText>
                </View>
                <TouchableOpacity style={styles.battleHeaderButton} onPress={() => navigation.navigate('Challenge')}>
                    {/* <BattleIcon/> */}
                    <Text
                        style={{
                            fontSize: 16,
                            color: 'blcak',
                            fontWeight: 'bold',
                        }}
                    >신청</Text>
                </TouchableOpacity>
                {/* 배틀 카테고리 */}
                <View style={styles.battleTab}>
                    <View style={styles.battleCategory}>
                        <TouchableOpacity
                            style={styles.battleCategoryButton}
                            onPress={() => selectCategory('진행 중')}
                        >
                            <Text
                                style={[
                                    styles.battleCategoryButtonText,
                                    {
                                        color: selectedCategory === '진행 중' ? 'white' : 'gray',
                                        padding: selectedCategory === '진행 중' ? 5 : 0,
                                    },
                                ]}
                            >
                                진행 중
                            </Text>
                            {selectedCategory === '진행 중' &&
                                <LinearGradient
                                    style={{
                                        width: '63%',
                                        alignSelf : 'center',
                                        height: 3 
                                    }}
                                    colors={['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.65)', 'rgba(255, 255, 255, 0)']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                />
                            }
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={styles.battleCategoryButton}
                            onPress={() => selectCategory('결과')}
                        >
                            <Text
                                style={[
                                    styles.battleCategoryButtonText,
                                    {
                                        color: selectedCategory === '결과' ? 'white' : 'gray',
                                        padding: selectedCategory === '결과' ? 5 : 0,
                                    },
                                ]}
                            >
                                결과
                            </Text>
                            {selectedCategory === '결과' &&
                                <LinearGradient
                                    style={{
                                        width: '40%',
                                        alignSelf : 'center',
                                        height: 3 
                                    }}
                                    colors={['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.65)', 'rgba(255, 255, 255, 0)']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                />
                            }
                        </TouchableOpacity>
                    </View>
                    <View style={styles.myBattle}>
                    </View>
                </View>
                {/* 배틀 정렬 */}
                <View style={styles.battleSort}>
                    <TouchableOpacity style={[
                                styles.battleSortButton,
                                {
                                    // backgroundColor: selectedSort === '최신순' ? '#5b5b5b' : '#6f6f6f',
                                    
                                    borderWidth: selectedSort === '최신순' ? 2 : 0,
                                },
                            ]}
                            onPress={() => selectSort('최신순')}>
                            <Text style={[
                                styles.battleSortButtonText,
                                {
                                    color: selectedSort === '최신순' ? 'white' : 'gray'
                                }
                            ]}>최신순</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[
                                styles.battleSortButton,
                                {
                                    // backgroundColor: selectedSort === '인기순' ? '#5b5b5b' : '#6f6f6f',
                                    borderWidth: selectedSort === '인기순' ? 2 : 0,
                                },
                            ]}
                            onPress={() => selectSort('인기순')}>
                        <Text style={[
                            styles.battleSortButtonText,
                            {
                                color: selectedSort === '인기순' ? 'white' : 'gray'
                            }
                        ]}>인기순</Text>
                    </TouchableOpacity>
                </View>
                {/* 배틀 목록 */}
                <FlatList
                    data={battleList}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        selectedCategory === '진행 중' ? (
                            <BattleItemProgress
                                item={item}
                                onPress={() => navigation.navigate('BattleDetail', item)}
                                calculateRemainingTime={calculateRemainingTime}
                                nameSlice={nameSlice}
                            />
                        ) : (
                            <BattleItemComplete
                                item={item}
                                onPress={() => navigation.navigate('BattleResult', item)}
                                calculateRemainingTime={calculateRemainingTime}
                                nameSlice={nameSlice}
                            />
                        )
                    )}
                    style={styles.battleList}
                    nestedScrollEnabled={true}
                />
            </ScrollView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        resizeMode: 'cover', // 배경 이미지가 뷰의 크기에 맞게 조정됨
    },
    container: {
        // backgroundColor: '#121212',
    },
    battleHeader: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 30,
    },
    battleHeaderText: {
        color: 'white',
        fontSize: 40,
    },
    battleHeaderButton: {
        backgroundColor: 'white',
        // backgroundColor: '#FFFFFF',
        borderRadius: 10,
        width: 80,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'flex-end',
        marginRight: 20,
    },
    battleHeaderButtonText:{
        fontSize: 20,
        color: 'black',
        fontWeight: 'bold',
    },
    battleTab:{
        display: 'flex',
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderColor: 'gray',
    },
    battleCategory:{
        display: 'flex',
        flexDirection: 'row',
    },
    battleCategoryButton:{ 
        width: '50%',
        height: 45,
        justifyContent: 'center',
    },
    battleCategoryButtonText:{
        color: 'black',
        fontSize: 25,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    battleSort: {
        display: 'flex',
        flexDirection: 'row',
    },
    battleSortButton: {
        marginTop: 15,
        marginBottom: 5,
        marginHorizontal: 7,
        borderRadius: 22,
        borderColor: 'white',
        width: 90,
        height: 43,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    battleSortButtonText: {
        fontSize: 20,
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 2,
    },
    switchText: {
        color: 'white',
    },
    myBattle: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 20,
        marginEnd: '5%'
    },
    battleList: {
        display: 'flex',
        flexDirection: 'column',
        alignContent: 'center',
    },
});

export default Battle;