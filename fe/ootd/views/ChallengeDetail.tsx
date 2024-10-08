import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, Image, StyleSheet, TextInput, ScrollView, ImageBackground } from 'react-native';
import axios from 'axios';
import { launchImageLibrary, ImageLibraryOptions } from 'react-native-image-picker';
import { ContentText, ContentBoldText } from '../components/CustomTexts';
import MyFashionButton from '../components/MyFashionButton';
import { useLoginStore } from '../stores/LoginStore';
import { useFocusEffect } from '@react-navigation/native';

function ChallengeDetail({ navigation, route }): React.JSX.Element {

    const { item } = route.params;
    const selectedSrc = route.params?.selectedImage;
    const { accessToken, userId } = useLoginStore();

    const [selectedUser, setSelectedUser] = useState('');
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [battleId, setBattleId] = useState(0)

    useEffect(() => {
        setSelectedUser(item.senderNickname);
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            if (item && item.battleId) {
                setBattleId(item.battleId);
            }
        }, [item])
    );

    useEffect(() => {
        if (item && item.senderUserName) {
            setSelectedUser(item.senderNickname);
        }
    }, [item]);

    useEffect(() => {
        if (selectedSrc) {
            setSelectedImage(selectedSrc);
        }
    }, [selectedSrc]);

    const battleRequest = async(selectedImage : string ) => {
        try {
            if (!selectedImage) {
                throw new Error('Selected image is not valid.');
            }
            console.log(`https://j11e104.p.ssafy.io/battle/response/${battleId}`);
            console.log(battleId, selectedImage);
            console.log({
                "userId": userId,
                "status": "ACTIVE",
                "responderImage": selectedImage
            });
            await axios.post(`https://j11e104.p.ssafy.io/battle/response/${battleId}`,
            {
                "userId": userId,
                "status": "ACTIVE",
                "responderImage": selectedImage
            },
            {
                headers: {
                    "Authorization": accessToken,
                    "Content-Type": "application/json",
                    "X-User-ID": userId,
                }
            });
            navigation.navigate('Battle');
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    const selectImage = () => {
        const options: ImageLibraryOptions = {
            mediaType: 'photo', // 'photo', 'video', 또는 'mixed'
            quality: 1,
          };
    
        launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                console.log('사용자가 취소했습니다.');
            } else if (response.errorMessage) {
                console.log('에러:', response.errorMessage);
            } else if (response.assets && response.assets.length > 0) {
                const selectedImageUri = response.assets[0].uri; // 선택된 이미지의 URI
                if (selectedImageUri) { // undefined가 아닌 경우에만 상태를 업데이트
                    setSelectedImage(selectedImageUri); // string | null 타입만 할당
                }
            }
        });
    };

    return (
        <ImageBackground 
            source={require('../assets/Images/bg_img.jpg')}  // 배경 이미지 경로 설정
            style={styles.background}  // 스타일 설정
        >
            <View style={styles.container}>
                <View style={styles.scrollContainer}>
                    <View style={styles.selectedSection}>
                        {/* <View style={styles.selectedBar}> */}
                            <ContentBoldText style={styles.selectedText}>{selectedUser} 님이 </ContentBoldText>
                            <ContentBoldText style={styles.selectedText}> 대전을 신청하셨습니다.</ContentBoldText>
                        {/* </View> */}
                    </View>
                    <MyFashionButton selectedImage={selectedImage} onPress={() => navigation.navigate('MyFashion', { returnScreen: 'ChallengeDetail' })} />
                </View>
                <View style={styles.buttonSection}>
                    <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
                        <ContentText style={styles.buttonText}>Decline</ContentText>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={(selectedUser && selectedImage) ? styles.activeButton : styles.deactiveButton}
                        disabled={!(selectedUser && selectedImage)}
                        onPress={() => {
                            if (selectedImage) {
                                battleRequest(selectedImage);
                            }
                        }}           
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
    selectedText: {
        paddingHorizontal: 40,
        color: '#C8D3F1',
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
        // backgroundColor: '#262626',
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        elevation: 3,  // elevation 값을 조절하여 그림자의 크기와 강도를 변경
        shadowColor: 'black', // 그림자 색상
        borderRadius: 20,
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
    },
    resultList: {
        width: 350,
        backgroundColor: '#262626',
        // borderBottomStartRadius: 10,
        // borderBottomEndRadius: 10,
        marginTop: 10,
        position: 'absolute',
        zIndex: 1,
        top: 50,
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
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: 100,
        // backgroundColor: '#121212',
        opacity: 0.8,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
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

export default ChallengeDetail;
