import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, Switch, StyleSheet, ScrollView, ImageBackground } from 'react-native'; 
import { FlatList } from 'react-native-gesture-handler';
import BattleIcon from '../assets/Icons/Battle_Icon.svg';
import { TitleText } from '../components/CustomTexts';
import axios from 'axios';

import BattleItemProgress from '../components/BattleItemProgress';
import BattleItemComplete from '../components/BattleItemComplete';

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
    };
    const selectSort = (sort: string) => {
        setSelectedSort(sort);
    };
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);

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
                        "leftName": "유저네임5",
                        "rightName": "유저네임6",
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
                    <TitleText style={styles.battleHeaderText}>
                        Beyond U
                    </TitleText>
                </View>
                <TouchableOpacity style={styles.battleHeaderButton} onPress={() => navigation.navigate('Challenge')}>
                    <BattleIcon/>
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
                                        borderBottomWidth: selectedCategory === '진행 중' ? 3 : 0,
                                        borderColor: selectedCategory === '진행 중' ? 'white' : 'transparent',
                                    },
                                ]}
                            >진행 중</Text>
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
                                        borderBottomWidth: selectedCategory === '결과' ? 3 : 0,
                                        borderColor: selectedCategory === '결과' ? 'white' : 'transparent',
                                    },
                                ]}
                            >결과</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.myBattle}>
                        <Text style={styles.switchText}>My    </Text>
                        <Switch
                            trackColor={{ false: "#767577", true: "#81b0ff" }} // 트랙 색상 설정
                            thumbColor={isEnabled ? "#ffffff" : "#ffffff"} // 스위치 원 색상 설정
                            onValueChange={toggleSwitch} // 스위치가 변경될 때 호출되는 함수
                            value={isEnabled} // 현재 스위치 상태
                        />
                    </View>
                </View>
                {/* 배틀 정렬 */}
                <View style={styles.battleSort}>
                    <TouchableOpacity style={[
                                styles.battleSortButton,
                                {
                                    backgroundColor: selectedSort === '최신순' ? 'white' : 'gray',
                                },
                            ]}
                            onPress={() => selectSort('최신순')}>
                        <Text style={styles.battleSortButtonText}>최신순</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[
                                styles.battleSortButton,
                                {
                                    backgroundColor: selectedSort === '인기순' ? 'white' : 'gray',
                                },
                            ]}
                            onPress={() => selectSort('인기순')}>
                        <Text style={styles.battleSortButtonText}>인기순</Text>
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
        // backgroundColor: '#121212',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 30,
        borderBottomWidth: 1,
        borderColor: 'gray',
    },
    battleCategory:{
        display: 'flex',
        flexDirection: 'row',
    },
    battleCategoryButton:{ 
        width: 100,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    battleCategoryButtonText:{
        color: 'black',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    battleSort: {
        display: 'flex',
        flexDirection: 'row',
    },
    battleSortButton: {
        margin: 10,
        borderRadius: 10,
        width: 80,
        height: 32,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    battleSortButtonText: {
        fontSize: 20,
        color: 'black',
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