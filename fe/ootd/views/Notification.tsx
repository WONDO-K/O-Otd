import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import axios from 'axios';

function Notification({ navigation }): React.JSX.Element {

    const [notifications, setNotifications] = useState<string[]>([]);

    // 시간을 계산하는 함수
    const timeSince = (dateString:string) => {
        const now = new Date(); // 현재 시간
        const createdAt = new Date(dateString); // createdAt 시간
        const difference = now - createdAt; // 밀리초 단위 시간 차이 계산

        const minutes = Math.floor(difference / (1000 * 60)); // 분
        const hours = Math.floor(difference / (1000 * 60 * 60)); // 시간
        const days = Math.floor(difference / (1000 * 60 * 60 * 24)); // 일
        
        // return `${now}`;

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

    useEffect(() => {
        const fetchNotifications = async () => {
            // try {
            //     const response = await axios.get('https://api.example.com/notifications');
            //     setNotifications(response.data);
            // } catch (error) {
            //     console.error('Error fetching notifications:', error);
            // }
            const data = [
                {
                    id: 1,
                    userId: 12345, // 수신자의 아이디
                    title: "request",
                    message: "가소롭다는표정의손우혁님께서 대전을 신청하셨습니다.",
                    timestamp: "2024-10-04T12:00:00",
                    isRead: false
                },
                {
                    id: 2,
                    userId: 12345, // 수신자의 아이디
                    title: "request",
                    message: "다해줬잖아표정의손우혁님께서 대전을 신청하셨습니다.",
                    timestamp: "2024-10-04T12:00:00",
                    isRead: false
                },
                {
                    id: 3,
                    userId: 12345, // 수신자의 아이디
                    title: "request",
                    message: "한심하다는표정의손우혁님께서 대전을 신청하셨습니다.",
                    timestamp: "2024-10-04T12:00:00",
                    isRead: false
                },
            ];
            setNotifications(data);
        };

        fetchNotifications();
    }, []);
    
    return (
        <View style={styles.container}>
            <FlatList
                data={notifications}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.notificationItem}
                        onPress={() => {
                            setTimeout(() => {
                                navigation.navigate('ChallengeDetail', { item });
                            }, 0);  // 렌더링 후에 navigation 호출
                        }}
                    >
                        <Text style={styles.notificationText}>{item.message}</Text>
                        <Text style={styles.notificationTime}>{timeSince(item.timestamp)}</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
    },
    notificationItem: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent:'space-between',
        alignItems: 'center',
        padding: 15,
    },
    notificationText: {
        width: '70%',
        fontSize: 18,
        color: 'white',
    },
    notificationTime: {
        color: 'white',
    }
});

export default Notification;
