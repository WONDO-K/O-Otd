import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, Image, StyleSheet, FlatList, ImageBackground } from 'react-native';
import UploadIcon from '../assets/Icons/Upload_Icon.svg';
import WishIcon from '../assets/Icons/Wish_Icon.svg';
import MyFashionIcon from '../assets/Icons/MyFashion_Icon.svg';
import { ContentBoldText } from '../components/CustomTexts';
import { useLoginStore } from '../stores/LoginStore';
import axios from 'axios';

function StyleSelect({ navigation, route }): React.JSX.Element {

    const [allFashionData, setAllFashionData] = useState({ myFashion: [], myCollection: [] });
    const [fashionList, setFashionList] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('myFashion');
    const [selectedSort, setSelectedSort] = useState('최신순');
    const {accessToken, userId} = useLoginStore();

    const fetchAllData = async () => {
        try {
            const collectionResponse = await axios.get(`https://j11e104.p.ssafy.io/gallery/my-collection/${userId}`, {
                headers: {
                    Authorization: accessToken,
                    "Content-Type": "application/json",
                    "X-User-ID": userId,
                }
            })
                
            const fashionResponse = await axios.get(`https://j11e104.p.ssafy.io/gallery/myfashion/${userId}`, {
                headers: {
                    Authorization: accessToken,
                    "Content-Type": "application/json",
                    "X-User-ID": userId,
                }
            })
    
            // 각 응답에서 데이터를 추출합니다.
            const myCollection = collectionResponse.data;
            const myFashion = fashionResponse.data;
    
            // 상태 업데이트
            setAllFashionData({ myFashion, myCollection });
            setFashionList(myFashion);
            
            console.log('myCollection:', myCollection);
            console.log('myFashion:', myFashion);
    
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    function updateCategory(category: string) {
        setSelectedCategory(category);
        setSelectedSort('최신순');
        setFashionList(category === 'myFashion' ? allFashionData.myFashion : allFashionData.myCollection);
    }

    useEffect(() => {
        if (selectedCategory === 'myFashion') {
            setFashionList(allFashionData.myFashion);
        } else {
            setFashionList(allFashionData.myCollection);
        }
    }, [selectedCategory, allFashionData]);

    
    const sortFashionList = (sortType: string) => {
        let sortedList = [...fashionList];

        if (sortType === '최신순') {
            if (selectedCategory === 'myFashion') {
                sortedList.sort((a, b) => new Date(b.createDate) - new Date(a.createDate));
            } else {
                sortedList.sort((a, b) => new Date(b.likeDateTime) - new Date(a.likeDateTime));
            }
        } else if (sortType === '출전 수') {
            sortedList.sort((a, b) => b.wardrobeBattle - a.wardrobeBattle); // 출전 수 기준 정렬
        } else if (sortType === '승리 수') {
            sortedList.sort((a, b) => b.wardrobeWin - a.wardrobeWin); // 승리 수 기준 정렬
        } else if (sortType === '인기순') {
            sortedList.sort((a, b) => b.likeCount - a.likeCount);
        }

        setFashionList(sortedList);
    };

    useEffect(() => {
        sortFashionList(selectedSort);
    }, [selectedSort]);

    useEffect(() => {
        fetchAllData();
    }, []);

    return (
        <ImageBackground 
            source={require('../assets/Images/bg_img.jpg')}  // 배경 이미지 경로 설정
            style={styles.background}  // 스타일 설정
        >
            <View style={styles.container}>
                <TouchableOpacity 
                    style={styles.imageIconBox}
                    onPress={() => navigation.goBack()}
                >
                    <UploadIcon width={25} height={25} />
                </TouchableOpacity>

                {/* 카테고리 선택 버튼 */}
                <View style={styles.categoryContainer}>
                    <TouchableOpacity onPress={() => {
                        updateCategory('myFashion')
                    }}>
                        <MyFashionIcon 
                            width={30} 
                            height={30} 
                            fill={selectedCategory === 'myFashion' ? 'white' : 'gray'}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        updateCategory('myCollection')
                    }}>
                        <WishIcon 
                            width={30} 
                            height={30}
                            fill={selectedCategory === 'myCollection' ? 'white' : 'gray'} 
                        />
                    </TouchableOpacity>
                </View>

                {/* 정렬 버튼 */}
                <View style={styles.battleSort}>
                    <TouchableOpacity
                        style={[styles.battleSortButton, { borderWidth: selectedSort === '최신순' ? 2 : 0 }]}
                        onPress={() => setSelectedSort('최신순')}
                    >
                        <ContentBoldText style={styles.battleSortButtonText}>최신순</ContentBoldText>
                    </TouchableOpacity>

                    {selectedCategory === 'myFashion' && (
                        <>
                            <TouchableOpacity
                                style={[styles.battleSortButton, { borderWidth: selectedSort === '출전 수' ? 2 : 0 }]}
                                onPress={() => setSelectedSort('출전 수')}
                            >
                                <ContentBoldText style={styles.battleSortButtonText}>출전 수</ContentBoldText>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.battleSortButton, { borderWidth: selectedSort === '승리 수' ? 2 : 0 }]}
                                onPress={() => setSelectedSort('승리 수')}
                            >
                                <ContentBoldText style={styles.battleSortButtonText}>승리 수</ContentBoldText>
                            </TouchableOpacity>
                        </>
                    )}

                    {selectedCategory === 'myCollection' && (
                        <TouchableOpacity
                            style={[styles.battleSortButton, { borderWidth: selectedSort === '인기순' ? 2 : 0 }]}
                            onPress={() => setSelectedSort('인기순')}
                        >
                            <ContentBoldText style={styles.battleSortButtonText}>인기순</ContentBoldText>
                        </TouchableOpacity>
                    )}
                </View>

                {/* 이미지 리스트 */}
                <FlatList
                    data={fashionList}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.notificationItem}
                            onPress={() => {
                                if (route.params?.setFor === 'main') {
                                    route.params.setMainImage(item.imageUrl);
                                } else if (route.params?.setFor === 'sub') {
                                    route.params.setSubImage(item.imageUrl);
                                }
                                navigation.goBack();
                            }}
                        >
                            <Image style={styles.notificationImage} source={{ uri: item.imageUrl }} />
                        </TouchableOpacity>
                    )}
                    numColumns={2}
                />
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
        alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor: '#121212',
    },
    imageIconBox: {
        // borderColor: '#ffffff',
        // borderWidth: 5,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        elevation: 3,  // elevation 값을 조절하여 그림자의 크기와 강도를 변경
        shadowColor: 'black', // 그림자 색상
        borderRadius: 10,
        padding: 30,
        margin: 30,
    },
    categoryContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        paddingBottom: 10,
    },
    notificationItem: {
        width: '50%',
        height: 350,
    },
    notificationImage: {
        width: '100%',
        height: '100%',
    },
    battleSort: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginBottom: 10,
    },
    battleSortButton: {
        marginTop: 15,
        marginBottom: 5,
        marginHorizontal: 5,
        borderRadius: 22,
        borderColor: 'white',
        width: 70,
        height: 37,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    battleSortButtonText: {
        fontSize: 16,
        color: 'white',
    },
});

export default StyleSelect;
