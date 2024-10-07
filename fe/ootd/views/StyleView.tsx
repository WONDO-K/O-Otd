import React, { useState, useEffect, useRef } from 'react';
import { Animated, Text, View, StyleSheet, TouchableOpacity, Image, FlatList, ImageBackground } from 'react-native';
import UploadIcon from '../assets/Icons/Upload_Icon.svg';
import { ScrollView } from 'react-native-gesture-handler';
import { TitleText, TitleBoldText, ContentText, ContentBoldText } from '../components/CustomTexts';

function StyleView({ navigation, route }): React.JSX.Element {
    // Main 이미지와 Sub 이미지 상태 관리
    const [mainImage, setMainImage] = useState<string | null>(null);
    const [subImage, setSubImage] = useState<string | null>(null);
    const [recommendedImages, setRecommendedImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingText, setLoadingText] = useState('Loading');

    const scrollViewRef = useRef<ScrollView>(null);
    const scrollY = new Animated.Value(0);

    useEffect(() => {
        const textList = ['Loading', 'Loading.', 'Loading..', 'Loading...'];
        let index = 0;

        const interval = setInterval(() => {
            setLoadingText(textList[index % 4]);
            index += 1;
        }, 300);

        // 컴포넌트가 언마운트되면 interval을 정리
        return () => clearInterval(interval);
    }, []);

    const fetchRecommendedImages = async (mainImage: string, subImage: string) => {
        setRecommendedImages([])
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

            // if (scrollViewRef.current) {
            //     scrollViewRef.current.scrollTo({
            //         y: 660,
            //         animated: true,
            //     });
            // }
            if (scrollViewRef.current) {
                Animated.timing(scrollY, {
                    toValue: 660,
                    duration: 750, // 애니메이션 지속 시간 (밀리초 단위)
                    useNativeDriver: false,
                }).start();
    
                scrollY.addListener(({ value }) => {
                    scrollViewRef.current.scrollTo({
                        y: value,
                        animated: false,
                    });
                });
            }
        }, 1500); // 임시 딜레이
    };

    const isButtonDisabled = !mainImage || !subImage;

    return (
        <ImageBackground 
            source={require('../assets/Images/bg_img.jpg')}  // 배경 이미지 경로 설정
            style={styles.background}  // 스타일 설정
        >
        <ScrollView  ref={scrollViewRef} style={styles.container}>
            <View style={styles.recommend}>
                <TitleText style={styles.title}><TitleBoldText>AI</TitleBoldText> Style Maker</TitleText>
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
                        onPress={() => {
                            setRecommendedImages([])
                            navigation.navigate('StyleSelect', { setFor: 'sub', setSubImage })
                        }}
                    >
                        {subImage ? (
                            <Image source={{ uri: subImage }} style={styles.image} />
                        ) : (
                            <UploadIcon width={30} height={30} />
                        )}
                    </TouchableOpacity>
                </View>

                {/* <ContentText style={styles.textContents}>
                    AI가 두 패션의 색깔을 더해,{"\n"}
                    유사한 감각의 스타일을 제공합니다.{"\n"}
                </ContentText> */}

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
                    <ContentBoldText style={isButtonDisabled ? styles.disabledButtonText : styles.enabledButtonText}>
                        {loading ? loadingText : 'Try !'}
                    </ContentBoldText>
                </TouchableOpacity>
            </View>
            {recommendedImages.length > 0 && (
                <View style={styles.recommendationList}>
                    <TitleText style={styles.listTitle}><TitleBoldText>AI</TitleBoldText> Picks</TitleText>
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
    },
    recommend: {
        marginTop: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 40,
        color: 'white',
    },
    imageContainer: {
        width: 225,
        height: 330,
        position: 'relative',
        margin: 60,
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
        left: -50,
        transform: [
            { rotateY: '15deg' }
        ],
        zIndex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        elevation: 3,  // elevation 값을 조절하여 그림자의 크기와 강도를 변경
        shadowColor: 'black', // 그림자 색상
    },
    subImage: {
        width: 170,
        height: 230,
        // backgroundColor: '#121212',
        backgroundColor: 'rgba(88, 88, 88, 0.7)',
        borderColor: 'white',
        borderWidth: 5,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: 120,
        left: 105,
        transform: [{ rotateY: '-30deg' }],
        zIndex: 2,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    recommendButton: {
        borderColor: '#ffffff',
        borderWidth: 2,
        width: 150,
        height: 50,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    enabledButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.3)'
    },
    disabledButton: {
         backgroundColor: 'rgba(128, 128, 128, 0.7)'
    },
    enabledButtonText: {
        color: 'white',
        fontSize: 24,
    },
    disabledButtonText: {
        color: '#949494',
        fontSize: 24,
    },
    recommendationList: {
        marginTop: 50,
    },
    listTitle: {
        fontSize: 30,
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
    textContents: {
        width: '80%',
        borderRadius: 10,
        fontSize: 20,
        color: '#ffffff',
        textAlign: 'center',
        paddingTop: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        elevation: 3,  // elevation 값을 조절하여 그림자의 크기와 강도를 변경
        shadowColor: 'black', // 그림자 색상
    },
});

export default StyleView;
