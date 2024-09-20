import React, { useState } from 'react';
import { Text, View, TouchableOpacity, Image, StyleSheet, TextInput, ScrollView, FlatList } from 'react-native';
import axios from 'axios';
import { launchImageLibrary, ImageLibraryOptions } from 'react-native-image-picker';

function Challenge({ navigation }): React.JSX.Element {

    const [searchId, setSearchId] = useState('');
    const [searchResult, setSearchResult] = useState<string[]>([]);
    const [selectedUser, setSelectedUser] = useState('');
    // const [selectedImage, setSelectedImage] = useState('');
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

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
                        <View style={styles.searchBar}>
                            <Image 
                                source={require('../assets/images/searchIcon.png')}
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
                            <FlatList
                                data={searchResult}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item }) => (
                                    <TouchableOpacity style={styles.resultItem} onPress={() => setSelectedUser(item)}>
                                        <Text style={styles.resultText}>{item}</Text>
                                    </TouchableOpacity>
                                )}
                                style={styles.resultList}
                            />
                        )}
                    </View>
                )}
                <View style={styles.gallery}>
                    {selectedImage ? (
                        <TouchableOpacity onPress={selectImage}>
                            <Image source={{ uri: selectedImage }} style={styles.image} />
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity onPress={selectImage} style={styles.galleryButton}>
                            <Image source={require('../assets/images/chooseIcon.png')} style={{ width: 100, height: 100 }} />
                        </TouchableOpacity>
                    )}
                    {/* <TouchableOpacity onPress={selectImage} style={styles.activeButton}>
                        <Text style={styles.buttonText}>갤러리에서 이미지 선택</Text>
                    </TouchableOpacity>
                    {selectedImage && (
                        <TouchableOpacity onPress={selectImage}>
                            <Image source={{ uri: selectedImage }} style={styles.image} />
                        </TouchableOpacity>
                    )} */}
                </View>
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
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
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
        backgroundColor: 'black',
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
        backgroundColor: 'black',
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
