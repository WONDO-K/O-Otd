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

function Navbar(): React.JSX.Element {
  
    return (
        <View style={styles.container}>
            <Text style={styles.text}>로고</Text>
            <Text style={styles.text}>알림</Text>
        </View>
    );
}

export default Navbar;