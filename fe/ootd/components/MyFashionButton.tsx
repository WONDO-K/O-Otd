import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import UploadIcon from '../assets/Icons/Upload_Icon.svg';

interface MyFashionProps {
    selectedImage: string | null;
    onPress: () => void;
}

const MyFashion: React.FC<MyFashionProps> = ({ selectedImage, onPress }) => {
    return (
        <View style={styles.gallery}>
            {selectedImage ? (
                <TouchableOpacity onPress={onPress}>
                    <Image source={{ uri: selectedImage }} style={styles.image} />
                </TouchableOpacity>
            ) : (
                <TouchableOpacity onPress={onPress} style={styles.galleryButton}>
                    {/* <Image source={require('../assets/Images/chooseIcon.png')} style={{ width: 100, height: 100 }} /> */}
                    <UploadIcon width={75} height={75} />
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
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
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        elevation: 3,  // elevation 값을 조절하여 그림자의 크기와 강도를 변경
        shadowColor: 'black', // 그림자 색상
    },
    image: {
        width: 250,
        height: 400,
        marginTop: 20,
        borderRadius: 10,
    },
});

export default MyFashion;
