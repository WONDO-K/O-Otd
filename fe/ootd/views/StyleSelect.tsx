import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, Image, StyleSheet, FlatList } from 'react-native';
import axios from 'axios';
import UploadIcon from '../assets/Icons/Upload_Icon.svg';

function StyleSelect({ navigation, route }): React.JSX.Element {

    const [fashionList, setFashionList] = useState([]);
    const [selectedSort, setSelectedSort] = useState('최신순');

    const getFashionData = async () => {
        // try {
        //     const response = await axios.get('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX');
        //     setFashionList(response.data);
        // } catch (error) {
        //     console.error('Error fetching fashion data:', error);
        // }
        const data = [
            {
                id: 1,
                src: "https://placekitten.com/200/300"
            },
            {
                id: 2,
                src: "https://placedog.net/500"
            },
            {
                id: 3,
                src: "https://placekitten.com/200/300"  
            },
            {
                id: 4,
                src: "https://placedog.net/500"
            },
            {
                id: 5,
                src: "https://placekitten.com/200/300"
            },
            {
                id: 6,
                src: "https://placedog.net/500"
            },
        ];
        setFashionList(data);
    };

    useEffect(() => {
        getFashionData();
    }, []);

    return (
        <View style={styles.container}>
            <TouchableOpacity 
                style={styles.imageIconBox}
                onPress={() => navigation.goBack()}
            >
                <UploadIcon width={25} height={25} />
            </TouchableOpacity>
            <View style={styles.battleSort}>
                <TouchableOpacity style={[
                            styles.battleSortButton,
                            {
                                backgroundColor: selectedSort === '최신순' ? 'white' : 'gray',
                            },
                        ]}
                        onPress={() => setSelectedSort('최신순')}>
                    <Text style={styles.battleSortButtonText}>최신순</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[
                            styles.battleSortButton,
                            {
                                backgroundColor: selectedSort === '인기순' ? 'white' : 'gray',
                            },
                        ]}
                        onPress={() => setSelectedSort('인기순')}>
                    <Text style={styles.battleSortButtonText}>인기순</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={fashionList}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.notificationItem}
                        onPress={() => {
                            if (route.params?.setFor === 'main') {
                                route.params.setMainImage(item.src);
                            } else if (route.params?.setFor === 'sub') {
                                route.params.setSubImage(item.src);
                            }
                            navigation.goBack();
                        }}
                    >
                        <Image style={styles.notificationImage} source={{ uri: item.src }} />
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
    notificationItem: {
        width: '50%',
        height: 350,
    },
    notificationImage: {
        width: '100%',
        height: '100%',
    },
    battleSort: {
        display: 'flex',
        flexDirection: 'row',
    },
    battleSortButton: {
        margin: 10,
        borderRadius: 10,
        width: 80,
        height: 32,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    battleSortButtonText: {
        fontSize: 20,
        color: 'black',
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 2,
    },
});

export default StyleSelect;
