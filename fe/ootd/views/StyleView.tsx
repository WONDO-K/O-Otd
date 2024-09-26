import React, { useState, useEffect, useCallback } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import UploadIcon from '../assets/Icons/Upload_Icon.svg';
import { useFocusEffect } from '@react-navigation/native';

function StyleView({ navigation, route }): React.JSX.Element {
    // Main 이미지와 Sub 이미지 상태 관리
    const [mainImage, setMainImage] = useState<string | null>(null);
    const [subImage, setSubImage] = useState<string | null>(null);

    useFocusEffect(
        useCallback(() => {
            if (route.params?.selectedImage && route.params?.setFor) {
                if (route.params.setFor === 'main') {
                    setMainImage(route.params.selectedImage);  // 메인 이미지 업데이트
                } else if (route.params.setFor === 'sub') {
                    setSubImage(route.params.selectedImage);  // 서브 이미지 업데이트
                }
            }
        }, [route.params?.selectedImage, route.params?.setFor])
    );

    const isButtonDisabled = !mainImage || !subImage;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>추천</Text>
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
            >
                <Text style={isButtonDisabled ? styles.disabledButtonText : styles.enabledButtonText}>
                    추천 받기
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 30,
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
        backgroundColor: 'black',
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
});

export default StyleView;
