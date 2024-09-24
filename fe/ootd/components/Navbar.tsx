import React from 'react';
import { View, StyleSheet } from 'react-native';

import LogoIcon from '../assets/Icons/OOTD_Icon.svg';
import NoticeIcon from '../assets/Icons/Notice_Icon.svg';

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
    return (
        <View style={styles.container}>
            <LogoIcon width={120} height={60} />
            <NoticeIcon width={50} height={50} />
        </View>
    );
}

export default Navbar;