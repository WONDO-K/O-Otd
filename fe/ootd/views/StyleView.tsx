import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

function StyleView({}): React.JSX.Element {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>추천</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center'
    },
    title: {
        fontSize: 24,
        color: 'white',
        marginBottom: 20
    }
});

export default StyleView;
