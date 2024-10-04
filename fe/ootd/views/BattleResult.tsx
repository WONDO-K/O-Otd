import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Image, View, Text, StyleSheet, Touchable, TouchableOpacity, ImageBackground } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Circle } from 'react-native-svg';

function BattleResult({ navigation, route }): React.JSX.Element {
    
    const item = route.params;

    const [battleItem, setBattleItem] = useState({
        battleId: 0,
        title: '',
        participantCount: 0,
        status: '',
        startedAt: '',
        leftImage: '',
        rightImage: '',
        myPick: null,
        leftName: '',
        rightName: '',
        leftVote: 0,
        rightVote: 0,
        winner: '',
    });

    useEffect(() => {
        if (item) {
            setBattleItem(item);
        }
    }, [item]);

    const size = 150; // 원형 프로그레스바의 크기
    const strokeWidth = 15; // 선의 두께
    const radius = (size - strokeWidth) / 2; // 원의 반지름
    const circumference = 2 * Math.PI * radius; // 원의 둘레
    const leftPercentage = (battleItem.leftVote / (battleItem.leftVote + battleItem.rightVote)) * 100;
    const rightPercentage = 100 - leftPercentage;

    const leftOffset = circumference - (leftPercentage / 100) * circumference;
    const rightOffset = circumference - (rightPercentage / 100) * circumference;

    return (
        <ImageBackground 
            source={require('../assets/Images/bg_img.jpg')}  // 배경 이미지 경로 설정
            style={styles.background}  // 스타일 설정
        >
            <View style={styles.container}>
                <View style={styles.battleItem}>
                    <View style={styles.leftSide}>
                        <Image style={styles.image} source={{ uri: item.leftImage }} />
                        <View style={{flexDirection:'row', alignItems: 'center'}}>
                            <View style={styles.leftColor}></View>
                            <Text style={styles.userNameText}>{item.leftName}</Text>
                        </View>
                    </View>
                    <View style={styles.rightSide}>
                        <Image style={styles.image} source={{ uri: item.rightImage }} />
                        <View style={{flexDirection:'row'}}>
                            <View style={styles.rightColor}></View>
                            <Text style={styles.userNameText}>{item.rightName}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.battleResult}>
                    <View style={styles.resultGraph}>
                        <Svg width={size} height={size}>
                            <Defs>
                                {/* 왼쪽 배경 색상 */}
                                <LinearGradient id="gradLeft" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <Stop offset="0%" stopColor="#ffa6a6" />
                                    <Stop offset="100%" stopColor="#ff8080" />
                                </LinearGradient>
                                {/* 오른쪽 배경 색상 */}
                                <LinearGradient id="gradRight" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <Stop offset="0%" stopColor="#98CEFF" />
                                    <Stop offset="100%" stopColor="#c1e2ff" />
                                </LinearGradient>
                            </Defs>
                            {/* 왼쪽 사용자 투표 결과 */}
                            <Circle
                                stroke="url(#gradLeft)"
                                cx={size / 2}
                                cy={size / 2}
                                r={radius}
                                strokeWidth={strokeWidth}
                                strokeDasharray={circumference}
                                strokeDashoffset={leftOffset}
                                rotation={-90 - (360 * leftPercentage) / 100}
                                originX={size / 2}
                                originY={size / 2}
                                fill="transparent"
                            />
                            {/* 오른쪽 사용자 투표 결과 */}
                            <Circle
                                stroke="url(#gradRight)"
                                cx={size / 2}
                                cy={size / 2}
                                r={radius}
                                strokeWidth={strokeWidth}
                                strokeDasharray={circumference}
                                strokeDashoffset={rightOffset}
                                rotation={-90}
                                originX={size / 2}
                                originY={size / 2}
                                fill="transparent"
                            />
                        </Svg>
                    </View>
                    <View style={styles.resultLog}>
                        <Text style={styles.allVoteCount}>총 투표 수 : {item.leftVote + item.rightVote}</Text>
                        <View style={styles.resultLegend}>
                            {/* <View style={styles.leftColor}></View>
                            <Text style={styles.resultText}>{item.leftName}</Text> */}
                            <View style={{flexDirection:'row'}}>
                                <View style={styles.leftColor}></View>
                                <Text style={styles.voteCount}>{Math.round(leftPercentage)}%</Text>
                            </View>
                            <View style={{flexDirection:'row'}}>
                                <View style={styles.rightColor}></View>
                                <Text style={styles.voteCount}>{Math.round(rightPercentage)}%</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        resizeMode: 'cover', // 배경 이미지가 뷰의 크기에 맞게 조정됨
    },
    container: {
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor: '#121212',
    },
    battleItem: {
        display: 'flex',
        flexDirection: 'row',
    },
    leftSide: {
        width: '47%',
        alignItems: 'center',
        marginRight: '1%',
    },
    rightSide: {
        width: '47%',
        alignItems: 'center',
        marginLeft: '1%',
    },
    userNameText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        marginVertical: 15,
    },
    image: {
        width: '100%',
        height: 300,
        borderRadius: 20,
    },
    battleResult: {
        display: 'flex',
        flexDirection: 'row',
        // backgroundColor: '#2C2F33',
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        elevation: 3,  // elevation 값을 조절하여 그림자의 크기와 강도를 변경
        shadowColor: 'black', // 그림자 색상
        width: '96%',
        height: '30%',
        justifyContent: 'space-around',
        borderRadius: 20,
    },
    resultGraph: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '50%',  // 화면 크기에 맞게 비율로 설정
    },
    resultLog: {
        width: '40%',  // 화면 크기에 맞게 비율로 설정
        height: 'auto',  // 높이를 자동으로 설정하여 내부 요소에 맞게 조정
        justifyContent: 'center',
    },
    resultLegend: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginVertical: 5,  // 요소 간의 수직 여백 추가
    },
    leftColor: {
        width: 10,
        height: 10,
        backgroundColor: 'rgb(255, 128, 128)',
        borderRadius: 7.5,
        marginRight: 5,
        alignSelf: 'center',
    },
    rightColor: {
        width: 10,
        height: 10,
        backgroundColor: 'rgb(152, 206, 255)',
        borderRadius: 7.5,
        marginRight: 5,
        alignSelf: 'center',
    },
    resultText: {
        color: 'white',
        fontSize: 16,  // 텍스트 크기를 조정하여 기기별 호환성 유지
        flexShrink: 1,  // 텍스트가 화면 밖으로 나가지 않도록 줄어들게 설정
    },
    allVoteCount: {
        color: 'white',
        alignSelf: 'center',
        marginBottom: 20,
        fontSize: 18,  // 투표 수의 텍스트 크기 조정
    },
    voteCount:{
        color: 'white',
        fontSize: 27,
        alignSelf: 'center',
    }
});

export default BattleResult;