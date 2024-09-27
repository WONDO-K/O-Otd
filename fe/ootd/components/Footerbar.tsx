import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import HomeIcon from '../assets/Icons/House_Icon.svg';
import StyleIcon from '../assets/Icons/Style_Icon.svg';
import AIIcon from '../assets/Icons/AI_Icon.svg';
import BattleIcon from '../assets/Icons/VS_Icon.svg';
import ProfileIcon from '../assets/Icons/Profile_Icon.svg';

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'black',
        minHeight: 50,
        height: '7%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 30,
    },
    icon: {
        display: 'flex',
        flexDirection: 'column', // 아이콘과 텍스트를 세로로 배치
        justifyContent: 'space-between', // 아이콘과 텍스트 간 간격 추가
        alignItems: 'center',
        height: '60%',
    },
    icon: {
        display: 'flex',
        flexDirection: 'column', // 아이콘과 텍스트를 세로로 배치
        justifyContent: 'space-between', // 아이콘과 텍스트 간 간격 추가
        alignItems: 'center',
        height: '60%',
    },
    text: {
        color: 'white', // 글자 색상을 흰색으로 설정
        fontSize: 12,   // 글자 크기 설정
    },
})

function Footerbar(): React.JSX.Element {
    const navigation = useNavigation();
    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => navigation.navigate('MainView')}>
                <View style={styles.icon}>
                    <HomeIcon width={20} height={20} />
                    <Text style={styles.text}>Home</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('StyleView')}>
                <View style={styles.icon}>
                    <StyleIcon width={20} height={20} />
                    <Text style={styles.text}>Style</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('AIView')}>
                <View style={styles.icon}>
                    <AIIcon width={20} height={20} />
                    <Text style={styles.text}>AI</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Battle')}>
                <View style={styles.icon}>
                    <BattleIcon width={20} height={20} />
                    <Text style={styles.text}>BTU</Text>
                </View>
            </TouchableOpacity>
            <View style={styles.icon}>
                <ProfileIcon width={20} height={20} />
                <Text style={styles.text}>Profile</Text>
            </View>
        </View>
    );
}

export default Footerbar;