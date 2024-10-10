import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Image, View, Text, StyleSheet, Touchable, TouchableOpacity, ImageBackground } from 'react-native';
import { ContentBoldText } from '../components/CustomTexts';
import { useLoginStore } from '../stores/LoginStore';

function BattleDetail({ navigation, route }): React.JSX.Element {
    
    const item = route.params;
    const {accessToken, userId} = useLoginStore();
    const [battleItem, setBattleItem] = useState<{
        battleId: number;
        title: string;
        status: string;
        createdAt: string;
        expiresAt: string;
        requesterId: number;
        responderId: number;
        requesterImage: string;
        responderImage: string;
        myPickUserId: number | null;
        requesterName: string;
        responderName: string;
        requesterVotes: number;
        responderVotes: number;
    }>({
        battleId: 0,
        title: '',
        status: '',
        createdAt: '',
        expiresAt: '',
        requesterId: 0,
        responderId: 0,
        requesterImage: '',
        responderImage: '',
        myPickUserId: null,
        requesterName: '',
        responderName: '',
        requesterVotes: 0,
        responderVotes: 0,
    });

    const voteItem = async(candidate_id : number) => {
        try {
            console.log(`https://j11e104.p.ssafy.io/battle/vote/${battleItem.battleId}`)
            await axios.post(`https://j11e104.p.ssafy.io/battle/vote/${battleItem.battleId}`, 
                {
                    "userId": userId,
                    "votedForId": candidate_id   
                },
                {
                    headers: {
                        "Authorization": accessToken,
                        "Content-Type": "application/json",
                        "X-User-ID": userId,
                    }
                }
            );

            navigation.navigate('Battle');
        } catch (error) {
            console.error('Vote Error Vote:', error);
        }
    };

    useEffect(() => {
        if (item) {
            setBattleItem(item);
        }
    }, [item]);

    return (
        <ImageBackground 
            source={require('../assets/Images/bg_img.jpg')}  // 배경 이미지 경로 설정
            style={styles.background}  // 스타일 설정
        >
            <View style={styles.container}>
                <View style={styles.battleItem}>
                    <TouchableOpacity
                        style={styles.leftSide}
                        onPress={()=>{voteItem(item.requesterId)}}
                    >
                        <ContentBoldText style={styles.userNameText}>{battleItem.requesterName}</ContentBoldText>
                        <Image
                            style={styles.image}
                            source={{ uri: item.requesterImage }}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={styles.rightSide}
                        onPress={()=>{voteItem(item.responderId)}}
                    >
                        <ContentBoldText style={styles.userNameText}>{battleItem.responderName}</ContentBoldText>
                        <Image
                            style={styles.image}
                            source={{ uri: item.responderImage }}
                        />
                    </TouchableOpacity>
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
        marginBottom: 20,
    },
    image: {
        width: '100%',
        height: 350,
        borderRadius: 20,
    }
});

export default BattleDetail;