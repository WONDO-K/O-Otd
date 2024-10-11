import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, Image, StyleSheet, TextInput, ScrollView, FlatList, ImageBackground } from 'react-native';
import axios from 'axios';
import MyFashionButton from '../components/MyFashionButton';
import { ContentText, ContentBoldText } from '../components/CustomTexts';
import { useLoginStore } from '../stores/LoginStore';

function Challenge({ navigation, route }): React.JSX.Element {
    const selectedSrc = route.params?.selectedImage;

    const [searchId, setSearchId] = useState('');
    const [searchResult, setSearchResult] = useState<string[]>([]);
    const [selectedUser, setSelectedUser] = useState('');
    const [selectedUserId, setSelectedUserId] = useState(0);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const {accessToken, userId} = useLoginStore();

    useEffect(() => {
        if (selectedSrc) {
            setSelectedImage(selectedSrc);
        }
    }, [selectedSrc]);

    const getSearch = async(searchId : string) => {
        try {
            const response = await axios.get(`https://j11e104.p.ssafy.io/user/user-list/search?nickname=${searchId}`, {
                headers: {
                    "Authorization": accessToken,
                    "Content-Type": "application/json",
                    "X-User-ID": userId,
                },
            });
            console.log(response.data);
            setSearchResult(response.data); // 상태 업데이트
        } catch (error) {
            console.error('Error fetching my fashion:', error);
        }
    };

    const battleRequest = async(selectedUser : string, selectedUserId : number, selectedImage : string) => {
        try {
            const nickname = await axios.get('https://j11e104.p.ssafy.io/user/myinfo', {
                headers: {
                    "Authorization": accessToken,
                    "Content-Type": "application/json",
                    "X-User-ID": userId,
                },
            });

            if (selectedUser === nickname.data.nickname) {
                console.error('Error: You cannot challenge yourself.');
                return;
            }

            await axios.post(`https://j11e104.p.ssafy.io/battle/create`, 
                {
                    "requesterId": userId,
                    "requesterName": nickname.data.nickname,
                    "requesterImage": selectedImage,
                    "responderId": selectedUserId,
                    "responderName": selectedUser
                },
                {
                    headers: {
                        Authorization: accessToken,
                        "Content-Type": "application/json",
                        "X-User-ID": userId,
                    },
                }
            );
            navigation.navigate('Battle');
        } catch (error) {
            console.error('Challenge Error:', error);
        }
    };

    return (
        <ImageBackground 
            source={require('../assets/Images/bg_img.jpg')}  // 배경 이미지 경로 설정
            style={styles.background}  // 스타일 설정
        >
            <View style={styles.container}>
                <View contentContainerStyle={styles.scrollContainer}>
                    {selectedUser ? (
                        <View style={styles.selectedSection}>
                            <TouchableOpacity style={styles.selectedBar} onPress={() => 
                                {
                                    setSelectedUser('')
                                    setSelectedUserId(0)
                                }}>
                                <ContentBoldText style={styles.selectedText}>{selectedUser}</ContentBoldText>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View style={styles.searchSection}>
                            <View style={[styles.searchBar, searchResult.length > 0 ? { borderTopLeftRadius: 20, borderTopRightRadius: 20 } : { borderRadius: 20 }]}>
                                <Image 
                                    source={require('../assets/Images/searchIcon.png')}
                                    style={styles.searchIcon}
                                />
                                <TextInput
                                    style={styles.searchInput}
                                    maxLength={30}
                                    placeholder='대전 상대 검색'
                                    placeholderTextColor='gray'
                                    value={searchId}
                                    onChangeText={(input) => {
                                        if (input.length <= 15) {
                                        setSearchId(input);
                                        }
                                    
                                        if (input.length > 0 && input.length <= 15) {
                                        getSearch(input);
                                        } else {
                                        setSearchResult([]);
                                        }
                                    }}
                                />
                            </View>
                            {searchResult.length > 0 && (
                                <View style={styles.resultList}>
                                    {searchResult.slice(0, 3).map((item, index) => (
                                        <TouchableOpacity
                                            key={index}
                                            style={[
                                                styles.resultItem
                                            ]}
                                            onPress={() => {
                                                setSelectedUser(item.nickname)
                                                setSelectedUserId(item.id)
                                            }}
                                        >
                                            <ContentText style={styles.resultText}>{item.nickname}</ContentText>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}
                        </View>
                    )}
                    <MyFashionButton selectedImage={selectedImage} onPress={() => navigation.navigate('MyFashion', { returnScreen: 'Challenge' })} />
                </View>
                <View style={styles.buttonSection}>
                    <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
                        <ContentText style={styles.buttonText}>Cancle</ContentText>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={(selectedUser && selectedImage) ? styles.activeButton : styles.deactiveButton}
                        disabled={!(selectedUser && selectedImage)}
                        onPress={() => battleRequest(selectedUser, selectedUserId, selectedImage)}           
                    >
                        <ContentText style={(selectedUser && selectedImage) ? styles.buttonText : styles.deactiveButtonText}>Accept</ContentText>
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
        // backgroundColor: '#121212',
        position: 'relative',

    },
    scrollContainer: {
        paddingBottom: 100, // 버튼 섹션 높이만큼 여백 추가
    },
    selectedSection: {
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 40,
    },
    selectedBar: {
        // backgroundColor: 'white',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: 250,
        height: 60,
        borderRadius: 20,
        padding: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        // borderColor: '#ffffff',
        // borderWidth: 5,
    },
    selectedText: {
        color: 'white',
        fontSize: 20,
    },
    searchSection: {
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 40,
    },
    searchBar: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: 350,
        height: 60,
        backgroundColor: '#262626',
        padding: 10,
    },
    searchIcon: {
        width: 20,
        height: 20,
        marginRight: 5,
    },
    searchInput: {
        width: 300,
        height: 60,
        color: 'white',
        fontSize: 20,
        fontFamily: 'SUIT-Regular',
    },
    resultList: {
        width: 350,
        backgroundColor: '#262626',
        marginTop: 10,
        position: 'absolute',
        zIndex: 1,
        top: 50,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        overflow: 'hidden',
    },
    resultItem: {
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#444',
    },
    resultText: {
        color: 'white',
        fontSize: 18,
    },
    gallery: {
        // backgroundColor: '#121212',
        width: '100%', 
        height: 400, 
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    galleryButton: {
        width: 250,
        height: 400,
        borderColor: 'white',
        borderWidth: 5,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonSection: {
        position: 'relative',
        bottom: 0,
        width: '80%',
        height: 100,
        opacity: 0.8,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        alignSelf: 'center',
        paddingVertical: 20,
    },
    button: {
        backgroundColor: '#949494',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: 'white',
    },
    activeButton: {
        backgroundColor: '#0D99FF',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: 'white',
    },
    deactiveButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: 'gray',
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
    },
    deactiveButtonText: {
        color: 'gray',
        fontSize: 18,
    },
    image: {
        width: 250,
        height: 400,
        marginTop: 20,
        borderRadius: 10,
    },
});

export default Challenge;