import React, { useState, useEffect, useCallback } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image, FlatList } from 'react-native';
import UploadIcon from '../assets/Icons/Upload_Icon.svg';
import { useFocusEffect } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';

function StyleView({ navigation, route }): React.JSX.Element {
    // Main 이미지와 Sub 이미지 상태 관리
    const [mainImage, setMainImage] = useState<string | null>(null);
    const [subImage, setSubImage] = useState<string | null>(null);
    const [recommendedImages, setRecommendedImages] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchRecommendedImages = async (mainImage: string, subImage: string) => {
        setLoading(true);
    
        // 실제 API 요청을 위한 로직 작성 (여기서는 임시로 데이터를 사용)
        const data = [
            { id: '1', src: 'https://placekitten.com/200/300' },
            { id: '2', src: 'https://placedog.net/400' },
            { id: '3', src: 'https://placekitten.com/200/300' },
            { id: '4', src: 'https://placedog.net/400' },
        ];
    
        setTimeout(() => {
            setLoading(false);
            setRecommendedImages(data);
        }, 1500); // 임시 딜레이
    };

    const isButtonDisabled = !mainImage || !subImage;

    return (
        <ScrollView style={styles.container}>
            <View style={styles.recommend}>
                <Text style={styles.title}>패션 추천</Text>
                <View style={styles.imageContainer}>
                    {/* Main 이미지 */}
                    <TouchableOpacity
                        style={styles.mainImage}
                        onPress={() => navigation.navigate('StyleSelect', { setFor: 'main', setMainImage })}
                    >
                        {mainImage ? (
                            <Image source={{ uri: mainImage }} style={styles.image} />
                        ) : (
                            <UploadIcon width={45} height={45} />
                        )}
                    </TouchableOpacity>

                    {/* Sub 이미지 */}
                    <TouchableOpacity
                        style={styles.subImage}
                        onPress={() => navigation.navigate('StyleSelect', { setFor: 'sub', setSubImage })}
                    >
                        {subImage ? (
                            <Image source={{ uri: subImage }} style={styles.image} />
                        ) : (
                            <UploadIcon width={30} height={30} />
                        )}
                    </TouchableOpacity>
                </View>

                {/* 추천 받기 버튼 */}
                <TouchableOpacity
                    style={[styles.recommendButton, isButtonDisabled ? styles.disabledButton : styles.enabledButton]}
                    disabled={isButtonDisabled} // 이미지가 둘 다 선택되지 않았으면 비활성화
                    onPress={() => {
                        if (mainImage && subImage) {
                            fetchRecommendedImages(mainImage, subImage);
                        }
                    }}
                >
                    <Text style={isButtonDisabled ? styles.disabledButtonText : styles.enabledButtonText}>
                        {loading ? '추천 중...' : '추천 받기'}
                    </Text>
                </TouchableOpacity>
            </View>
            {recommendedImages.length > 0 && (
                <View style={styles.recommendationList}>
                    <Text style={styles.listTitle}>추천된 이미지</Text>
                    <FlatList
                        data={recommendedImages}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <View style={styles.recommendationItem}>
                                <Image source={{ uri: item.src }} style={styles.recommendationImage} />
                            </View>
                        )}
                        numColumns={2}
                        nestedScrollEnabled={true}
                    />
                </View>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
    },
    recommend: {
        marginTop: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 40,
        color: 'white',
        marginBottom: 50,
    },
    imageContainer: {
        width: 200,
        height: 300,
        position: 'relative',
        marginBottom: 50,
    },
    mainImage: {
        width: '100%',
        height: '100%',
        borderColor: 'white',
        borderWidth: 5,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        overflow: 'hidden',
        left: -20,
        transform: [
            { rotateY: '10deg' }
        ],
        zIndex: 1,
    },
    subImage: {
        width: 150,
        height: 200,
        backgroundColor: '#121212',
        borderColor: 'white',
        borderWidth: 5,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: 120,
        left: 120,
        transform: [{ rotateY: '-30deg' }],
        zIndex: 2,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    recommendButton: {
        width: 150,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        borderRadius: 10,
        marginTop: 20,
    },
    enabledButton: {
        backgroundColor: 'white',
        borderColor: 'black',
        borderWidth: 2,
    },
    disabledButton: {
        backgroundColor: 'gray',
        borderColor: 'gray',
        borderWidth: 2,
    },
    enabledButtonText: {
        color: 'black',
    },
    disabledButtonText: {
        color: 'darkgray',
    },
    recommendationList: {
        marginTop: 20,
    },
    listTitle: {
        fontSize: 24,
        color: 'white',
        marginBottom: 20,
        textAlign: 'center',
    },
    recommendationItem: {
        width: '50%',
    },
    recommendationImage: {
        width: '100%',
        height: 350,
    },
    
});

export default StyleView;
