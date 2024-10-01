import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Image, View, Text, StyleSheet, Touchable, TouchableOpacity } from 'react-native';

function BattleDetail({ navigation, route }): React.JSX.Element {
    
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
        rightName: ''
    });

    const voteItem = (name : string) => {
        // axios.post('XXXXXXXXXXXXXXXXXXXXXXXXXX', { battleId: battleItem.battleId, name: name });
        navigation.navigate('Battle');
    };

    useEffect(() => {
        if (item) {
            setBattleItem(item);
        }
    }, [item]);

    return (
        <View style={styles.container}>
            <View style={styles.battleItem}>
                <TouchableOpacity
                    style={styles.leftSide}
                    onPress={()=>{voteItem(item.leftName)}}
                >
                    <Text style={styles.userNameText}>{battleItem.leftName}</Text>
                    <Image
                        style={styles.image}
                        source={{ uri: item.leftImage }}
                    />
                </TouchableOpacity>
                <TouchableOpacity 
                    style={styles.rightSide}
                    onPress={()=>{voteItem(item.rightName)}}
                >
                    <Text style={styles.userNameText}>{battleItem.rightName}</Text>
                    <Image
                        style={styles.image}
                        source={{ uri: item.rightImage }}
                    />
                </TouchableOpacity>
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
        backgroundColor: '#121212',
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
        height: 350,
        borderRadius: 20,
    }
});

export default BattleDetail;