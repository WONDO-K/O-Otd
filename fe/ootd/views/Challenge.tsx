import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, Image, StyleSheet, TextInput, ScrollView, FlatList, ImageBackground } from 'react-native';
import axios from 'axios';
import { launchImageLibrary, ImageLibraryOptions } from 'react-native-image-picker';
import GalleryButton from '../components/GalleryButton';
import MyFashionButton from '../components/MyFashionButton';

function Challenge({ navigation, route }): React.JSX.Element {
    const selectedSrc = route.params?.selectedImage;

    const [searchId, setSearchId] = useState('');
    const [searchResult, setSearchResult] = useState<string[]>([]);
    const [selectedUser, setSelectedUser] = useState('');
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    useEffect(() => {
        if (selectedSrc) {
            setSelectedImage(selectedSrc);
        }
    }, [selectedSrc]);

    const getSearch = (searchId : string) => {
        // axios.get(`https://api.example.com/users/${searchId}`)
        // .then(response => {
        //     setSearchResult(response.data);
        // }).catch(error => {
        //     console.log(error);
        // })
        const data = ['키무라', '키무라기무동현', '키무라김기무동현'];
        setSearchResult(data);
    };

    const battleRequest = (selectedUser : string, selectedImage : string) => {
        // axios.post('https://api.example.com/battle', {
        //     userId: selectedUserId,
        //     image: selectedImage
        // }).then(response => {
        //     console.log(response.data);
        // }).catch(error => {
        //     console.log(error);
        // })
        navigation.navigate('Battle');
    };

    // const selectImage = () => {
    //     const options: ImageLibraryOptions = {
    //         mediaType: 'photo', // 'photo', 'video', 또는 'mixed'
    //         quality: 1,
    //       };
    
    //     launchImageLibrary(options, (response) => {
    //         if (response.didCancel) {
    //             console.log('사용자가 취소했습니다.');
    //         } else if (response.errorMessage) {
    //             console.log('에러:', response.errorMessage);
    //         } else if (response.assets && response.assets.length > 0) {
    //             const selectedImageUri = response.assets[0].uri; // 선택된 이미지의 URI
    //             if (selectedImageUri) { // undefined가 아닌 경우에만 상태를 업데이트
    //                 setSelectedImage(selectedImageUri); // string | null 타입만 할당
    //             }
    //         }
    //     });
    // };

    return (
        <ImageBackground 
            source={require('../assets/Images/bg_img.jpg')}  // 배경 이미지 경로 설정
            style={styles.background}  // 스타일 설정
        >
            <View style={styles.container}>
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    {selectedUser ? (
                        <View style={styles.selectedSection}>
                            <TouchableOpacity style={styles.selectedBar} onPress={() => setSelectedUser('')}>
                                <Text style={styles.selectedText}>{selectedUser}</Text>
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
                                            onPress={() => setSelectedUser(item)}
                                        >
                                            <Text style={styles.resultText}>{item}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}
                        </View>
                    )}
                    <MyFashionButton selectedImage={selectedImage} onPress={() => navigation.navigate('MyFashion', { returnScreen: 'Challenge' })} />
                </ScrollView>
                <View style={styles.buttonSection}>
                    <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
                        <Text style={styles.buttonText}>Decline</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={(selectedUser && selectedImage) ? styles.activeButton : styles.deactiveButton}
                        disabled={!(selectedUser && selectedImage)}
                        onPress={() => battleRequest(selectedUser, selectedImage)}           
                    >
                        <Text style={(selectedUser && selectedImage) ? styles.buttonText : styles.deactiveButtonText}>Accept</Text>
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
        backgroundColor: 'white',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: 350,
        height: 60,
        borderRadius: 20,
        padding: 10,
    },
    selectedText: {
        color: 'black',
        fontSize: 20,
        fontWeight: 'bold',
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
    },
    resultList: {
        width: 350,
        // backgroundColor: '#262626',
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
        borderWidth: 3,
        borderColor: 'white',
    },
    activeButton: {
        backgroundColor: '#0D99FF',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        borderWidth: 3,
        borderColor: 'white',
    },
    deactiveButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        borderWidth: 3,
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
