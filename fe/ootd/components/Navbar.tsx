import React, {useState} from 'react';
import { View, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ContentText, ContentBoldText } from './CustomTexts.tsx';

import LogoIcon from '../assets/Icons/OOTD_Icon.svg';
import NoticeIcon from '../assets/Icons/Notice_Icon.svg';
import HowIcon from '../assets/Icons/How_Icon.svg';

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
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
    },
    modalContent: {
        width: '80%',
        borderRadius: 10,
        color: '#ffffff',
        paddingTop: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
    },
    modalText: {
        color: 'white',
        fontSize: 20,
        textAlign: 'center',
        marginBottom: 20,
    },
    closeButton: {
        width: '100%',
        padding: 10,
        borderRadius: 5,
    },
    closeButtonText: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
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
                <ContentText style={styles.modalText}>
                    AI가 두 패션의 색깔을 더해,{"\n"}
                    유사한 감각의 스타일을 제공합니다.{"\n"}    
                </ContentText>
            );
        } else if (isActive(['AIView'])) {
            return (
                <ContentText style={styles.modalText}>
                    AI가 당신의 패션을 분석하고,{"\n"}
                    유사한 스타일을 추천합니다.{"\n"}
                </ContentText>
            );
        } else if (isActive(['Battle'])) {
            return (
                <ContentText style={styles.modalText}>
                    설명 들어갈 공간{"\n"}
                    배틀 설명을 적어주세요.{"\n"}
                </ContentText>
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
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        {renderModalContent()}
                        <TouchableOpacity style={styles.closeButton} onPress={handleCloseModal}>
                            <ContentText style={styles.closeButtonText}>닫기</ContentText>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );  
}

export default Navbar;