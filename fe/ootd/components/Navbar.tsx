import React, {useState} from 'react';
import { View, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ContentText, ContentBoldText } from './CustomTexts.tsx';

import LogoIcon from '../assets/Icons/OOTD_Icon.svg';
import NoticeIcon from '../assets/Icons/Notice_Icon.svg';
import HowIcon from '../assets/Icons/How_Icon.svg';
import CloseIcon from '../assets/Icons/Close_Icon.svg';

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#121212',
        minHeight: 60,
        height: '10%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    buttonContainer:{
        alignItems: 'center',
        flexDirection: 'row',
        gap: 20,
    },
    text: {
        color: 'white',
        fontSize: 30,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        position:'absolute',
        top: 70,
        right: 10,
        width: '75%',
        borderRadius: 10,
        color: '#ffffff',
        paddingTop: 15,
        backgroundColor: 'rgba(255, 255, 255, 1)',
    },
    modalTitle: {
        marginBottom: 20,
        alignSelf: 'flex-start',
        marginLeft: 20,
        color: 'black',
        fontSize: 28,
    },
    modalText: {
        maxWidth: '95%',
        color: 'black',
        fontSize: 16,
        marginBottom: 20,
    },
    modalLine: {
        alignSelf: 'center',
        width: '80%',
        flexDirection: 'row',
    },
    closeButton: {
        position:'absolute', 
        top: 15, 
        right: 15, 
        padding: 10,
    },
    notificationBadge: {
        position: 'absolute',
        top: -5,
        right: -5,
        backgroundColor: 'red',
        borderRadius: 10,
        paddingHorizontal: 5,
        paddingVertical: 2,
        minWidth: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    notificationText: {
        color: 'white',
        fontSize: 12,
        textAlign: 'center',
    },
})

function Navbar({ currentRoute, unreadCount }: { currentRoute: string }): React.JSX.Element {
    const navigation = useNavigation();
    const [isModalVisible, setModalVisible] = useState(false);

    const isActive = (screens: string[]) => screens.includes(currentRoute);
    const handleNotificationPress = () => {
        if (isActive(['Notification'])) {
            navigation.goBack(); // Notification 화면일 경우 뒤로가기
        } else {
            navigation.navigate('Notification'); // 그 외의 경우 Notification 화면으로 이동
        }
    };

    const renderModalContent = () => {
        if (isActive(['StyleView'])) {
            return (
                <>
                    <View style={styles.modalLine}>
                        <ContentText style={styles.modalText}>1. </ContentText>
                        <ContentText style={styles.modalText}>
                            <ContentBoldText>메인</ContentBoldText>이 되는 패션 이미지와 <ContentBoldText>서브</ContentBoldText> 패션 이미지를 업로드 하세요.
                        </ContentText>
                    </View>
                    <View style={styles.modalLine}>
                        <ContentText style={styles.modalText}>2. </ContentText>
                        <ContentText style={styles.modalText}>
                            <ContentBoldText>Try!</ContentBoldText> 버튼을 누르면 AI가 <ContentBoldText>추천 스타일링</ContentBoldText>을 <ContentBoldText>제공</ContentBoldText>합니다.
                        </ContentText>
                    </View>
                </>
            );
        } else if (isActive(['AIView'])) {
            return (
                <>
                    <View style={styles.modalLine}>
                        <ContentText style={styles.modalText}>1. </ContentText>
                        <ContentText style={styles.modalText}>
                            <ContentBoldText>궁금한 스타일</ContentBoldText> 사진을 업로드하세요.
                        </ContentText>
                    </View>
                    <View style={styles.modalLine}>
                        <ContentText style={styles.modalText}>2. </ContentText>
                        <ContentText style={styles.modalText}>
                            <ContentBoldText>Try!</ContentBoldText> 버튼을 눌러 업로드한 사진 <ContentBoldText>어떤 스타일</ContentBoldText>인지 <ContentBoldText>분석</ContentBoldText> 받으세요.
                        </ContentText>
                    </View>
                    <View style={styles.modalLine}>
                        <ContentText style={styles.modalText}>3. </ContentText>
                        <ContentText style={styles.modalText}>
                            AI는 <ContentBoldText>업로드한 패션</ContentBoldText>과 <ContentBoldText>유사한 감각의 룩</ContentBoldText>도 추천합니다.
                        </ContentText>
                    </View>
                </>
            );
        } else if (isActive(['Battle'])) {
            return (
                <>
                    <View style={styles.modalLine}>
                        <ContentText style={styles.modalText}>1. </ContentText>
                        <ContentText style={styles.modalText}>
                            <ContentBoldText>Challenge!</ContentBoldText> 버튼을 통해 <ContentBoldText>원하는 상대</ContentBoldText>와 <ContentBoldText>스타일 대결</ContentBoldText>을 할 수 있습니다.
                        </ContentText>
                    </View>
                    <View style={styles.modalLine}>
                        <ContentText style={styles.modalText}>2. </ContentText>
                        <ContentText style={styles.modalText}>
                            대결을 신청받은 상대가 3일 내에 수락하면 대결이 진행됩니다.
                        </ContentText>
                    </View>
                    <View style={styles.modalLine}>
                        <ContentText style={styles.modalText}>3. </ContentText>
                        <ContentText style={styles.modalText}>
                            진행중인 대결의 경우 <ContentBoldText>다른 사람들</ContentBoldText>의 <ContentBoldText>스타일도 평가</ContentBoldText> 할 수 있습니다.
                        </ContentText>
                    </View>
                    <View style={styles.modalLine}>
                        <ContentText style={styles.modalText}>4. </ContentText>
                        <ContentText style={styles.modalText}>
                            대결은 24시간 동안 진행되고 이후 결과를 확인할 수 있습니다.
                        </ContentText>
                    </View>
                </>
            );
        }
        return null;
    };

    const handleHowIconPress = () => {
        setModalVisible(true); // 모달 열기
    };

    const handleCloseModal = () => {
        setModalVisible(false); // 모달 닫기
    };
    
    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => navigation.navigate('MainView')}>
                <LogoIcon width={120} height={60} />
            </TouchableOpacity>
            <View style={styles.buttonContainer}>
                {isActive(['StyleView', 'AIView', 'Battle']) && (
                    <TouchableOpacity onPress={handleHowIconPress}>
                        <HowIcon />
                    </TouchableOpacity>
                )}
                <TouchableOpacity onPress={handleNotificationPress}>
                    <NoticeIcon width={30} height={30} />
                    {unreadCount > 0 && (
                        <View style={styles.notificationBadge}>
                            <ContentBoldText style={styles.notificationText}>{unreadCount}</ContentBoldText>
                        </View>
                    )}
                </TouchableOpacity>
            </View>

            <Modal
                transparent={true}
                visible={isModalVisible}
                animationType="fade"
                onRequestClose={handleCloseModal}
            >
                <TouchableOpacity 
                    style={styles.modalContainer} 
                    onPress={handleCloseModal} // 모달 바깥 영역 클릭 시 닫기
                    activeOpacity={1}
                >
                    <View style={styles.modalContent}>
                        <TouchableOpacity style={styles.closeButton} onPress={handleCloseModal}>
                            <CloseIcon/>
                        </TouchableOpacity>
                        <ContentBoldText style={styles.modalTitle}>Guide</ContentBoldText>
                        {renderModalContent()}
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );  
}

export default Navbar;