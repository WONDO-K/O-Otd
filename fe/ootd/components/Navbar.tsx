import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import LogoIcon from '../assets/Icons/OOTD_Icon.svg';
import NoticeIcon from '../assets/Icons/Notice_Icon.svg';
import MainView from '../views/MainView.tsx';
import LoginView from '../views/LoginView.tsx';

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'black',
        height: '10%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    text: {
        color: 'white',
        fontSize: 30,
    }
})

function Navbar(): React.JSX.Element {
    const navigation = useNavigation();
    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => navigation.navigate('MainView')}>
                <LogoIcon width={120} height={60} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Notification')}>
                <NoticeIcon width={40} height={40} />
            </TouchableOpacity>
        </View>
    );
}

export default Navbar;