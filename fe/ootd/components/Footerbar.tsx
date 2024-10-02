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
        backgroundColor: '#121212',
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
    text: {
        fontSize: 12,   // 글자 크기 설정
    },
})

function Footerbar({ currentRoute }: { currentRoute: string }): React.JSX.Element {
    const navigation = useNavigation();
    const isActive = (screens: string[]) => screens.includes(currentRoute);
    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => navigation.navigate('MainView')}>
                <View style={styles.icon}>
                    <HomeIcon
                        width={20}
                        height={20}
                        fill={isActive(['MainView', 'LoginView', 'Notification']) ? 'white' : '#949494'}
                    />
                    <Text style={[styles.text, {color: isActive(['MainView', 'LoginView', 'Notification']) ? 'white' : '#949494'}]}>Home</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('StyleView')}>
                <View style={styles.icon}>
                    <StyleIcon
                        width={20}
                        height={20} 
                        fill={isActive(['StyleView', 'StyleSelect']) ? 'white' : '#949494'}
                    />
                    <Text style={[styles.text, {color: isActive(['StyleView', 'StyleSelect']) ? 'white' : '#949494'}]}>Style</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('AIView')}>
                <View style={styles.icon}>
                    <AIIcon
                        width={20}
                        height={20} 
                        fill={isActive(['AIView', 'AIReport']) ? 'white' : '#949494'}
                    />
                    <Text style={[styles.text, {color: isActive(['AIView', 'AIReport']) ? 'white' : '#949494'}]}>AI</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Battle')}>
                <View style={styles.icon}>
                    <BattleIcon
                        width={20}
                        height={20} 
                        fill={isActive(['Battle', 'BattleDetail', 'BattleResult', 'MyFashion', 'Challenge', 'ChallengeDetail']) ? 'white' : '#949494'}
                    />
                    <Text style={[styles.text, {color: isActive(['Battle', 'BattleDetail', 'BattleResult', 'MyFashion', 'Challenge', 'ChallengeDetail']) ? 'white' : '#949494'}]}>BTU</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('ProfileView')}>
                <View style={styles.icon}>
                    <ProfileIcon
                        width={20}
                        height={20} 
                        fill={isActive(['ProfileView']) ? 'white' : '#949494'}
                    />
                    <Text style={[styles.text, {color: isActive(['ProfileView']) ? 'white' : '#949494'}]}>Profile</Text>
                </View>
            </TouchableOpacity>
        </View>
    );
}

export default Footerbar;