import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, Image, StyleSheet, TextInput, ScrollView, FlatList } from 'react-native';
import axios from 'axios';
import UploadIcon from '../assets/Icons/Upload_Icon.svg';
import { useLoginStore } from '../stores/LoginStore';

function MyFashion({ navigation, route }): React.JSX.Element {
    const { accessToken, userId } = useLoginStore();
    const [myFashion, setMyFashion] = useState([]);

    const getMyFashion = async () => {
        try {
            const response = await axios.get(`https://j11e104.p.ssafy.io/gallery/myfashion/${userId}`, {
                headers: {
                    "Authorization": accessToken,
                    "Content-Type": "application/json",
                    "X-User-ID": userId,
                }
            });
            console.log(response.data);
            setMyFashion(response.data); // 상태 업데이트
        } catch (error) {
            console.error('Error fetching my fashion:', error);
        }
    };

    useEffect(() => {
        getMyFashion();  // 컴포넌트가 마운트될 때 데이터 가져오기
    }, []);

    return (
        <View style={styles.container}>
            <TouchableOpacity 
                style={styles.imageIconBox}
                onPress={() => navigation.goBack()}
            >
                {/* <Image source={require('../assets/Images/chooseIcon.png')} style={styles.imageIcon} /> */}
                <UploadIcon width={25} height={25} />
            </TouchableOpacity>
            <FlatList
                data={myFashion}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.notificationItem}
                        onPress={() => {
                            if (route.params?.returnScreen) {
                                navigation.navigate(route.params.returnScreen, { selectedImage: item.imageUrl });
                            } else {
                                navigation.goBack();
                            }
                        }}
                    >
                        <Image style={styles.notificationImage} source={{uri: item.imageUrl}} />
                    </TouchableOpacity>
                )}
                numColumns={2}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#121212',
    },
    imageIcon: {
        width: 20,
        height: 20,
    },
    imageIconBox: {
        borderColor: '#0D99FF',
        borderWidth: 5,
        borderRadius: 10,
        padding: 30,
        margin: 30,
    },
    notificationItem: {
        width: '50%',
        height: 350,
    },
    notificationImage: {
        width: '100%',
        height: '100%',
    },
});

export default MyFashion;
