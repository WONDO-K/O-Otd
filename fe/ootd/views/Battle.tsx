import React, { useState, useEffect, useCallback } from 'react';
import { Text, View, TouchableOpacity, Switch, StyleSheet, ScrollView, ImageBackground } from 'react-native'; 
import { useFocusEffect } from '@react-navigation/native';
import { FlatList } from 'react-native-gesture-handler';
import SendIcon from '../assets/Icons/Send_Icon'
import { useLoginStore } from '../stores/LoginStore';

import { TitleBoldText, ContentBoldText } from '../components/CustomTexts';
import axios from 'axios';

import BattleItemProgress from '../components/BattleItemProgress';
import BattleItemComplete from '../components/BattleItemComplete';
import LinearGradient from 'react-native-linear-gradient';

type Battle = {
    battleId: number;
    title: string;
    participantCount: number;
    status: string;
    createdAt: string;
    endedAt: string;
    requesterImage: string;
    responderImage: string;
    myPickUserId: string | null;
};

function Battle({ navigation }): React.JSX.Element {

    const [selectedCategory, setSelectedCategory] = useState('active');
    const [selectedSort, setSelectedSort] = useState('recent');
    const [isEnabled, setIsEnabled] = useState(false);
    const [battleList, setBattleList] = useState([]);
    const {accessToken, userId} = useLoginStore();

    const calculateRemainingTime = (createdAt: string): string => {
        const now = new Date(); // 현재 시간
        const startTime = new Date(createdAt);
    
        // 경과 시간 (밀리초 단위)
        const elapsedTime = now.getTime() - startTime.getTime();
    
        // 하루는 24시간, 즉 86,400,000 밀리초
        const oneDayInMilliseconds = 24 * 60 * 60 * 1000;
    
        // 하루에서 경과 시간을 뺀 나머지 시간 계산
        const remainingTime = oneDayInMilliseconds - elapsedTime;
    
        if (remainingTime < 0) {
            return '종료'; // 만약 하루가 지났다면 '시간 초과'를 반환
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
        setSelectedSort('recent');
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

    const getBattleList = async(category: string, sort: string) => {
        setBattleList([]);
        try {
            const response = await axios.get(`https://j11e104.p.ssafy.io/battle/list/${category}/${sort}/${userId}`, {
                headers: {
                    "Authorization": accessToken,
                    "Content-Type": "application/json",
                    "X-User-ID": userId,
                }
            });
            console.log(response.data);
            setBattleList(response.data); // 상태 업데이트
        } catch (error) {
            console.error('Error fetching my fashion:', error);
        }
    };

    useEffect(() => {
            getBattleList(selectedCategory, selectedSort);
        }, [selectedCategory, selectedSort]);

    useFocusEffect(
        useCallback(() => {
            getBattleList(selectedCategory, selectedSort);
        }, [selectedCategory, selectedSort])
    );
  
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
                    <ContentBoldText
                        style={styles.battleHeaderButtonText}
                    >Challenge </ContentBoldText>
                    <SendIcon width={20} height={20} />
                </TouchableOpacity>
                {/* 배틀 카테고리 */}
                <View style={styles.battleTab}>
                    <View style={styles.battleCategory}>
                        <TouchableOpacity
                            style={styles.battleCategoryButton}
                            onPress={() => selectCategory('active')}
                        >
                            <ContentBoldText
                                style={[
                                    styles.battleCategoryButtonText,
                                    {
                                        color: selectedCategory === 'active' ? 'white' : 'gray',
                                        padding: selectedCategory === 'active' ? 5 : 0,
                                    },
                                ]}
                            >
                                진행 중
                            </ContentBoldText>
                            {selectedCategory === 'active' &&
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
                            onPress={() => selectCategory('completed')}
                        >
                            <ContentBoldText
                                style={[
                                    styles.battleCategoryButtonText,
                                    {
                                        color: selectedCategory === 'completed' ? 'white' : 'gray',
                                        padding: selectedCategory === 'completed' ? 5 : 0,
                                    },
                                ]}
                            >
                                결과
                            </ContentBoldText>
                            {selectedCategory === 'completed' &&
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
                                    borderWidth: selectedSort === 'recent' ? 2 : 0,
                                },
                            ]}
                            onPress={() => selectSort('recent')}>
                            <ContentBoldText style={[
                                styles.battleSortButtonText,
                                {
                                    color: selectedSort === 'recent' ? 'white' : 'gray'
                                }
                            ]}>최신순</ContentBoldText>
                    </TouchableOpacity>
                    <TouchableOpacity style={[
                                styles.battleSortButton,
                                {
                                    borderWidth: selectedSort === 'popular' ? 2 : 0,
                                },
                            ]}
                            onPress={() => selectSort('popular')}>
                        <ContentBoldText style={[
                            styles.battleSortButtonText,
                            {
                                color: selectedSort === 'popular' ? 'white' : 'gray'
                            }
                        ]}>인기순</ContentBoldText>
                    </TouchableOpacity>
                </View>
                {/* 배틀 목록 */}
                <FlatList
                    data={battleList}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        selectedCategory === 'active' ? (
                            <BattleItemProgress
                                item={item}
                                onPress={() => {
                                    if (item.myPickUserId === null) {
                                        navigation.navigate('BattleDetail', item)
                                    }
                                }}
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
        marginTop: 40,
        marginBottom: 30,
    },
    battleHeaderText: {
        color: 'white',
        fontSize: 40,
    },
    battleHeaderButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.45)',
        width: 120,
        height: 40,
        borderRadius: 10,
        borderColor: 'white',
        borderWidth: 2,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'flex-end',
        marginRight: 20,
        marginBottom: 10,
    },
    battleHeaderButtonText:{
        fontSize: 16,
        color: 'white',
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
        textAlign: 'center',
    },
    battleSort: {
        display: 'flex',
        flexDirection: 'row',
    },
    battleSortButton: {
        marginTop: 15,
        marginBottom: 5,
        marginHorizontal: 5,
        borderRadius: 22,
        borderColor: 'white',
        width: 70,
        height: 37,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    battleSortButtonText: {
        fontSize: 16,
        color: 'white',
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
