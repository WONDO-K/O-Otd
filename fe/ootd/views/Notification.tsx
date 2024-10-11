import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { ContentText } from '../components/CustomTexts';
import { useLoginStore } from '../stores/LoginStore';
import axios from 'axios';

function Notification({ navigation }): React.JSX.Element {

    const [notifications, setNotifications] = useState<string[]>([]);
    const {accessToken, userId} = useLoginStore();

    // 시간을 계산하는 함수
    const timeSince = (dateString:string) => {
        const now = new Date(); // 현재 시간
        const createdAt = new Date(dateString); // createdAt 시간
        const difference = now - createdAt; // 밀리초 단위 시간 차이 계산

        const minutes = Math.floor(difference / (1000 * 60)); // 분
        const hours = Math.floor(difference / (1000 * 60 * 60)); // 시간
        const days = Math.floor(difference / (1000 * 60 * 60 * 24)); // 일
        
        if (days > 0) {
            return `${days}일 전`;
        } else if (hours > 0) {
            return `${hours}시간 전`;
        } else if (minutes > 0) {
            return `${minutes}분 전`;
        } else {
            return `방금 전`;
        }
    };

    const fetchNotifications = async () => {
        try {
            const response = await axios.get(`https://j11e104.p.ssafy.io/battle/notifications/list/${userId}`, {
                headers: {
                    "Authorization": accessToken,
                    "Content-Type": "application/json",
                    "X-User-ID": userId,
                }
            });
            console.log(response.data);
            setNotifications(response.data); // 상태 업데이트
            console.log(`https://j11e104.p.ssafy.io/battle/notifications/read-all/${userId}`);
            await axios.post(`https://j11e104.p.ssafy.io/battle/notifications/read-all/${userId}`,
                {}, 
                {
                    headers: {
                        "Authorization": accessToken,
                        "Content-Type": "application/json",
                        "X-User-ID": userId,
                    }
                }
            );
            console.log(response.data);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);
    
    return (
        <View style={styles.container}>
            {notifications.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <ContentText style={styles.emptyText}>아직 알림이 없습니다.</ContentText>
                </View>
            ) : (
                <FlatList
                    data={notifications}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity style={styles.notificationItem}
                            onPress={() => {
                                if (item.title === 'request') {
                                    navigation.navigate('ChallengeDetail', { item });
                                }
                            }}
                        >
                            {!item.read && (
                                <View style={styles.unreadIndicator} />
                            )}
                            <View style={styles.notificationContent}>
                                <ContentText style={styles.notificationText}>
                                    {item.message}
                                </ContentText>
                                <ContentText style={styles.notificationTime}>
                                    {timeSince(item.timestamp)}
                                </ContentText>
                            </View>
                        </TouchableOpacity>
                    )}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
    },
    notificationItem: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    notificationText: {
        width: '80%',
        fontSize: 18,
        color: 'white',
    },
    notificationTime: {
        color: 'white',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 18,
        color: 'gray',
    },
    unreadIndicator: {
        width: 10,
        height: 10,
        backgroundColor: 'red',
        borderRadius: 5,
        marginLeft: 5,
    },
    notificationContent: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
    },
});

export default Notification;