import React, { useState } from 'react';
import { Text, View, TouchableOpacity, Image, StyleSheet, TextInput, ScrollView } from 'react-native';

function Challenge(): React.JSX.Element {

    const [searchId, setSearchId] = useState('');

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.searchSection}>
                    <View style={styles.searchBar}>
                        <Image 
                            source={require('../assets/images/searchIcon.png')}
                            style={styles.searchIcon}
                        />
                        <TextInput
                            style={styles.searchInput}
                            maxLength={15}
                            placeholder='대전 상대 검색'
                            placeholderTextColor='gray'
                            value={searchId}
                            onChangeText={(input) => setSearchId(input)}
                        />
                    </View>
                </View>
                <View style={styles.gallery}>
                </View>
            </ScrollView>

            <View style={styles.buttonSection}>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Decline</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Accept</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        position: 'relative',
    },
    scrollContainer: {
        paddingBottom: 100, // 버튼 섹션 높이만큼 여백 추가
    },
    searchSection: {
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 40,
    },
    searchBar: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: 350,
        height: 60,
        backgroundColor: '#262626',
        borderRadius: 20,
        padding: 10,
    },
    searchIcon: {
        width: 20,
        height: 20,
        marginRight: 5,
    },
    searchInput: {
        width: 300,
        height: 60,
        color: 'white',
        fontSize: 20,
    },
    text: {
        color: 'white',
        textAlign: 'center',
        fontSize: 24,
    },
    gallery: {
        backgroundColor: 'white',
        height: 1000,
        width: '100%',
    },
    buttonSection: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: 100,
        backgroundColor: 'black',
        opacity: 0.8,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingBottom: 20,
    },
    button: {
        backgroundColor: '#444',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
    },
});

export default Challenge;
