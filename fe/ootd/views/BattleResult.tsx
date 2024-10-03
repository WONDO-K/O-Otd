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
                        <Text style={styles.userNameText}>{item.leftName}</Text>
                    </View>
                    <View style={styles.rightSide}>
                        <Image style={styles.image} source={{ uri: item.rightImage }} />
                        <Text style={styles.userNameText}>{item.rightName}</Text>
                    </View>
                </View>

                <View style={styles.battleResult}>
                    <View style={styles.resultGraph}>
                        <Svg width={size} height={size}>
                            <Defs>
                                {/* 왼쪽 배경 색상 */}
                                <LinearGradient id="gradLeft" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <Stop offset="0%" stopColor="#FF05FF" />
                                    <Stop offset="100%" stopColor="#FF7A00" />
                                </LinearGradient>
                                {/* 오른쪽 배경 색상 */}
                                <LinearGradient id="gradRight" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <Stop offset="0%" stopColor="#680E7F" />
                                    <Stop offset="100%" stopColor="#1950E5" />
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
                            <View style={styles.leftColor}></View>
                            <Text style={styles.resultText}>{item.leftName}</Text>
                        </View>
                        <Text style={styles.voteCount}>{item.leftVote}({Math.round(leftPercentage)}%)</Text>
                        <View style={styles.resultLegend}>
                            <View style={styles.rightColor}></View>
                            <Text style={styles.resultText}>{item.rightName}</Text>
                        </View>
                        <Text style={styles.voteCount}>{item.rightVote}({Math.round(rightPercentage)}%)</Text>
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
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
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
        justifyContent: 'space-around',
        borderRadius: 20,
    },
    resultGraph: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: 200,
        height: 200,
    },
    resultLog: {
        width: 150,
        height: 200,
        justifyContent: 'center',
    },
    resultLegend: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    leftColor: {
        width: 10,
        height: 10,
        backgroundColor: '#FF05FF',
        borderRadius: 7.5,
        marginRight: 5,
    },
    rightColor: {
        width: 10,
        height: 10,
        backgroundColor: '#1950E5',
        borderRadius: 7.5,
        marginRight: 5,
    },
    resultText: {
        color: 'white',
    },
    allVoteCount: {
        color: 'white',
        alignSelf: 'center',
        marginBottom: 20,
    },
    voteCount:{
        color: 'white',
        fontSize: 30,
        alignSelf: 'flex-end',
    }
});

export default BattleResult;