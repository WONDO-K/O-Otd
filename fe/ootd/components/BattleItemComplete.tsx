import React from 'react';
import { View, TouchableOpacity, Text, Image, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { ContentText, ContentBoldText } from './CustomTexts';

type BattleItemProgressProps = {
  item: any;
  onPress: () => void;
  calculateRemainingTime: (createdAt: string) => string;
  nameSlice: (name: string) => string;
};

const BattleItemProgress: React.FC<BattleItemProgressProps> = ({ item, onPress, calculateRemainingTime, nameSlice }) => {
    return (
        <TouchableOpacity
            style={styles.battleItem}
            onPress={onPress}
        >
            <View style={styles.battleTitle}>
                <ContentBoldText style={styles.battleNameText}>{nameSlice(item.requesterName)}</ContentBoldText>
                <ContentText style={styles.battleTimeText}>{calculateRemainingTime(item.createdAt)}</ContentText>
                <ContentBoldText style={styles.battleNameText}>{nameSlice(item.responderName)}</ContentBoldText>
            </View>
            <View style={styles.progressBarContainer}>
                {/* 왼쪽 그라데이션 진행 바 */}
                {item.requesterVotes >= item.responderVotes ? (
                    <LinearGradient
                        colors={['#ffa6a6', '#FF6B6B']} // 승리한 쪽 색상
                        start={{ x: 0, y: 0 }} 
                        end={{ x: 1, y: 0 }} 
                        style={[
                        styles.progressBar,
                        { width: `${(item.requesterVotes / (item.requesterVotes + item.responderVotes)) * 100 ?? 50}%` },
                        ]}
                    />
                ) : (
                    <View
                        style={[
                        styles.progressBar,
                        { width: `${(item.requesterVotes / (item.requesterVotes + item.responderVotes)) * 100 ?? 50}%`, backgroundColor: '#C0C0C0' }, // 회색 (패배)
                        ]}
                    />
                )}

                {/* 오른쪽 그라데이션 진행 바 */}
                {item.requesterVotes <= item.responderVotes ? (
                <LinearGradient
                    colors={['#6FBAFF', '#c1e2ff']} // 승리한 쪽 색상
                    start={{ x: 0, y: 0 }} 
                    end={{ x: 1, y: 0 }} 
                    style={[
                    styles.progressBar,
                    { width: `${(item.responderVotes / (item.requesterVotes + item.responderVotes)) * 100 ?? 50}%` },
                    ]}
                />
                ) : (
                <View
                    style={[
                    styles.progressBar,
                    { width: `${(item.responderVotes / (item.requesterVotes + item.responderVotes)) * 100 ?? 50}%`, backgroundColor: '#C0C0C0' }, // 회색 (패배)
                    ]}
                />
                )}
            </View>
        
            <View style={styles.battleContent}>
                <Image 
                    style={[
                        styles.battleImage,
                        item.myPickUserId === item.requesterId && styles.pickedImage,
                        item.myPickUserId === item.responderId && styles.unPickedImage
                    ]} 
                    source={{ uri: item.requesterImage }} 
                />
                <Image 
                    style={[
                        styles.battleImage,
                        item.myPickUserId === item.requesterId && styles.unPickedImage,
                        item.myPickUserId === item.responderId && styles.pickedImage
                    ]} 
                    source={{ uri: item.responderImage }} 
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
    progressBarContainer: {
        height: 10,
        width: '90%',
        alignSelf: 'center',
        backgroundColor: '#444',
        borderRadius: 5,
        flexDirection: 'row',
        overflow: 'hidden',
        marginVertical: 10,
    },
    progressBar: {
        height: '100%',
    },
});

export default BattleItemProgress;
