import React from 'react';
import { View, TouchableOpacity, Text, Image, StyleSheet } from 'react-native';
import { ContentText, ContentBoldText } from './CustomTexts';

type BattleItemProgressProps = {
  item: any;
  onPress: () => void;
  calculateRemainingTime: (startedAt: string) => string;
  nameSlice: (name: string) => string;
};

const BattleItemProgress: React.FC<BattleItemProgressProps> = ({ item, onPress, calculateRemainingTime, nameSlice }) => {
    return (
        <TouchableOpacity
            style={styles.battleItem}
            onPress={onPress}
        >
            <View style={styles.battleTitle}>
                <ContentBoldText style={styles.battleNameText}>{nameSlice(item.leftName)}</ContentBoldText>
                <ContentText style={styles.battleTimeText}>{calculateRemainingTime(item.startedAt)}</ContentText>
                <ContentBoldText style={styles.battleNameText}>{nameSlice(item.rightName)}</ContentBoldText>
            </View>
            <View style={styles.battleContent}>
                <Image 
                style={[
                    styles.battleImage,
                    item.myPick === 'left' && styles.pickedImage,
                    item.myPick === 'right' && styles.unPickedImage
                ]} 
                source={{ uri: item.leftImage }} 
                />
                <Image 
                style={[
                    styles.battleImage,
                    item.myPick === 'left' && styles.unPickedImage,
                    item.myPick === 'right' && styles.pickedImage
                ]} 
                source={{ uri: item.rightImage }} 
                />
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    battleItem: {
        display: 'flex',
        backgroundColor: '#2C2F33',
        borderRadius: 10,
        borderColor: '#949494',
        borderWidth: 2,
        margin: 10,
    },
    battleNameText:{
        color: '#C8D3F1',
        width: '38%',
        textAlign: 'center',
        fontSize:20,
    },
    battleTimeText:{
        color: '#C8D3F1',
        width: '24%',
        textAlign: 'center',
    },
    battleTitle: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal:10,
        marginTop: '2%',
    },
    battleContent: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        width: '94%',
        margin: '3%'
    },
    battleImage: {
        width: '50%',
        height: 300,
    },
    pickedImage: {
        borderColor: 'rgba(255,209,102,0.8)',
        borderWidth: 3,
    },
    unPickedImage: {
        // width: '40%',
        // height: 200,
        opacity: 0.3,
    },
});

export default BattleItemProgress;
