import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, Image, StyleSheet, FlatList } from 'react-native';
import UploadIcon from '../assets/Icons/Upload_Icon.svg';
import WishIcon from '../assets/Icons/Wish_Icon.svg';
import MyFashionIcon from '../assets/Icons/MyFashion_Icon.svg';

function StyleSelect({ navigation, route }): React.JSX.Element {

    const [allFashionData, setAllFashionData] = useState({ myFashion: [], myCollection: [] });
    const [fashionList, setFashionList] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('myFashion');
    const [selectedSort, setSelectedSort] = useState('최신순');

    const fetchAllData = async () => {
        const myFashion = [
            { 
                id: 1, 
                imageUrl: "https://placekitten.com/200/300",
                addedAt: "2024-06-02T12:30:00",
                battleCount: 8
            },
            { 
                id: 2, 
                imageUrl: "https://placedog.net/500", 
                addedAt: "2024-06-02T12:31:00",
                battleCount: 22
            }, 
            { 
                id: 3, 
                imageUrl: "https://placekitten.com/200/300",
                addedAt: "2024-06-02T12:32:00",
                battleCount: 17
            },
            { 
                id: 4, 
                imageUrl: "https://placedog.net/500",
                addedAt: "2024-06-02T12:33:00",
                battleCount: 3
            },
            { 
                id: 5, 
                imageUrl: "https://placekitten.com/200/300",  
                addedAt: "2024-06-02T12:34:00",
                battleCount: 5
            },
            { 
                id: 6, 
                imageUrl: "https://placedog.net/500",  
                addedAt: "2024-06-02T12:35:00",
                battleCount: 7
            },
        ];

        const myCollection = [
            { 
                id: 1, 
                imageUrl: "https://placedog.net/500", 
                addedAt: "2024-06-02T12:30:00",
                addedCount: 64
            },
            { 
                id: 2, 
                imageUrl: "https://placekitten.com/200/300",
                addedAt: "2024-06-02T12:34:00",
                addedCount: 6
            },
            { 
                id: 3, 
                imageUrl: "https://placedog.net/500",
                addedAt: "2024-07-02T12:30:00",
                addedCount: 44
            },
            { 
                id: 4, 
                imageUrl: "https://placekitten.com/200/300",
                addedAt: "2024-07-14T12:35:00",
                addedCount: 55
            },
            { 
                id: 5, 
                imageUrl: "https://placedog.net/500",
                addedAt: "2024-07-16T12:35:00",
                addedCount: 12
            },
            { 
                id: 6, 
                imageUrl: "https://placekitten.com/200/300",
                addedAt: "2024-07-17T11:00:00",
                addedCount: 7
            },
        ];

        setAllFashionData({ myFashion, myCollection });
        setFashionList(myFashion);
    };

    useEffect(() => {
        if (selectedCategory === 'myFashion') {
            setFashionList(allFashionData.myFashion);
        } else {
            setFashionList(allFashionData.myCollection);
        }
    }, [selectedCategory, allFashionData]);

    const sortFashionList = (sortType) => {
        let sortedList = [...fashionList];

        if (sortType === '최신순') {
            sortedList.sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt));
        } else if (sortType === '인기순') {
            if (selectedCategory === 'myFashion') {
                sortedList.sort((a, b) => b.battleCount - a.battleCount);
            } else if (selectedCategory === 'myCollection') {
                sortedList.sort((a, b) => b.addedCount - a.addedCount);
            }
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
        <View style={styles.container}>
            <TouchableOpacity 
                style={styles.imageIconBox}
                onPress={() => navigation.goBack()}
            >
                <UploadIcon width={25} height={25} />
            </TouchableOpacity>

            {/* 카테고리 선택 버튼 */}
            <View style={styles.categoryContainer}>
                <TouchableOpacity onPress={() => setSelectedCategory('myFashion')}>
                    <MyFashionIcon 
                        width={30} 
                        height={30} 
                        fill={selectedCategory === 'myFashion' ? 'white' : 'gray'}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setSelectedCategory('myCollection')}>
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
                    style={[styles.battleSortButton, { backgroundColor: selectedSort === '최신순' ? 'white' : 'gray' }]}
                    onPress={() => setSelectedSort('최신순')}
                >
                    <Text style={styles.battleSortButtonText}>최신순</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.battleSortButton, { backgroundColor: selectedSort === '인기순' ? 'white' : 'gray' }]}
                    onPress={() => setSelectedSort('인기순')}
                >
                    <Text style={styles.battleSortButtonText}>인기순</Text>
                </TouchableOpacity>
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
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'black',
    },
    imageIconBox: {
        borderColor: '#0D99FF',
        borderWidth: 5,
        borderRadius: 10,
        padding: 30,
        margin: 30,
    },
    categoryContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        paddingBottom: 10,
        borderWidth: 1,
        borderBottomColor: '#949494',
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
    },
    battleSortButton: {
        margin: 10,
        borderRadius: 10,
        width: 80,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },
    battleSortButtonText: {
        fontSize: 20,
        color: 'black',
        fontWeight: 'bold',
    },
});

export default StyleSelect;
