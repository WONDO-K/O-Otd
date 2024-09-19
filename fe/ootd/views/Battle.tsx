import React, { useState } from 'react';
import { Text, View, TouchableOpacity, Switch, StyleSheet, ScrollView } from 'react-native';

function Battle(): React.JSX.Element {

    const [selectedCategory, setSelectedCategory] = useState('진행 중');
    const [selectedSort, setSelectedSort] = useState('최신순');
    const [isEnabled, setIsEnabled] = useState(false);
  
    const selectCategory = (category: string) => {
        setSelectedCategory(category);
    };
    const selectSort = (sort: string) => {
        setSelectedSort(sort);
    };
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);
  
    return (
        <ScrollView style={styles.container}>
            {/* 배틀 헤더 */}
            <View style={styles.battleHeader}>
                <Text style={styles.battleHeaderText}>패션 배틀</Text>
                <TouchableOpacity style={styles.battleHeaderButton}>
                    <Text style={styles.battleHeaderButtonText}>결투다!</Text>
                </TouchableOpacity>
            </View>
            {/* 배틀 카테고리 */}
            <View style={styles.battleTab}>
                <View style={styles.battleCategory}>
                    <TouchableOpacity style={[
                            styles.battleCategoryButton,
                            {
                                backgroundColor: selectedCategory === '진행 중' ? 'white' : 'gray',
                            },
                        ]}
                        onPress={() => selectCategory('진행 중')}
                    >
                        <Text
                            style={[
                                styles.battleCategoryButtonText
                            ]}
                        >진행 중</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[
                            styles.battleCategoryButton,
                            {
                                backgroundColor: selectedCategory === '결과' ? 'white' : 'gray',
                            },
                        ]}
                        onPress={() => selectCategory('결과')}
                    >
                        <Text
                            style={[
                                styles.battleCategoryButtonText
                            ]}
                        >결과</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.myBattle}>
                    <Text style={styles.switchText}>내 대전 보기</Text>
                    <Switch
                        trackColor={{ false: "#767577", true: "#81b0ff" }} // 트랙 색상 설정
                        thumbColor={isEnabled ? "#ffffff" : "#ffffff"} // 스위치 원 색상 설정
                        onValueChange={toggleSwitch} // 스위치가 변경될 때 호출되는 함수
                        value={isEnabled} // 현재 스위치 상태
                    />
                </View>
            </View>
            {/* 배틀 목록 */}
            <View style={styles.battleSort}>
                <TouchableOpacity style={[
                            styles.battleSortButton,
                            {
                                backgroundColor: selectedSort === '최신순' ? 'white' : 'gray',
                            },
                        ]}
                        onPress={() => selectSort('최신순')}>
                    <Text style={styles.battleSortButtonText}>최신순</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[
                            styles.battleSortButton,
                            {
                                backgroundColor: selectedSort === '인기순' ? 'white' : 'gray',
                            },
                        ]}
                        onPress={() => selectSort('인기순')}>
                    <Text style={styles.battleSortButtonText}>인기순</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'black',
    },
    battleHeader: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 30,
    },
    battleHeaderText: {
        color: 'white',
        fontSize: 30,
        fontWeight: 'bold',
    },
    battleHeaderButton: {
        backgroundColor: 'white',
        borderRadius: 10,
        width: 100,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    battleHeaderButtonText:{
        fontSize: 20,
        color: 'black',
        fontWeight: 'bold',
    },
    battleTab:{
        backgroundColor: 'black',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 30,
        borderBottomWidth: 1,
        borderColor: 'white',
    },
    battleCategory:{
        display: 'flex',
        flexDirection: 'row',
    },
    battleCategoryButton:{ 
        width: 100,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    battleCategoryButtonText:{
        color: 'black',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    battleSort: {
        display: 'flex',
        flexDirection: 'row',
    },
    battleSortButton: {
        margin: 10,
        borderRadius: 10,
        width: 100,
        height: 40,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    battleSortButtonText: {
        fontSize: 20,
        color: 'black',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    switchText: {
        color: 'white',
    },
    myBattle: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 20,
        marginEnd: '5%'
    },
});

export default Battle;