import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Image, View, Text, StyleSheet, Touchable, TouchableOpacity } from 'react-native';

function BattleResult({ navigation, route }): React.JSX.Element {
    
    const item = route.params;

    const [battleItem, setBattleItem] = useState({
        battleId: 0,
        title: '',
        participantCount: 0,
        status: '',
        startedAt: '',
        leftImage: '',
        rightImage: '',
        myPick: null,
        leftName: '',
        rightName: '',
        leftVote: 0,
        rightVote: 0,
        winner: '',
    });

    useEffect(() => {
        if (item) {
            setBattleItem(item);
        }
    }, [item]);

    return (
        <View style={styles.container}>
            <View style={styles.battleItem}>
                <View style={styles.leftSide}>
                    <Image
                        style={styles.image}
                        source={{ uri: item.leftImage }}
                    />
                </View>
                <View style={styles.rightSide}>
                    <Image
                        style={styles.image}
                        source={{ uri: item.rightImage }}
                    />
                </View>
            </View>
            <View style={styles.battleResult}>
                <View></View>
                <View></View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'black',
    },
    battleItem: {
        display: 'flex',
        flexDirection: 'row',
    },
    leftSide: {
        width: '47%',
        alignItems: 'center',
        marginRight: '1%',
    },
    rightSide: {
        width: '47%',
        alignItems: 'center',
        marginLeft: '1%',
    },
    userNameText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    image: {
        width: '100%',
        height: 300,
        borderRadius: 20,
    },
    battleResult:{
        backgroundColor: '2C2F33',
        borderRadius: 20,
    }
});

export default BattleResult;