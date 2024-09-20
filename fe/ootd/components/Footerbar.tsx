import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'black',
        height: '10%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 30,
    },
    text: {
        color: 'white',
        fontSize: 30,
    }
})

function Footerbar(): React.JSX.Element {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>홈</Text>
            <Text style={styles.text}>스타일</Text>
            <Text style={styles.text}>AI</Text>
            <Text style={styles.text}>배틀</Text>
            <Text style={styles.text}>프로필</Text>
        </View>
    );
}

export default Footerbar;