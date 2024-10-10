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
                    1. 메인이 되는 패션 이미지와 서브 패션 이미지를 업로드 하세요.{"\n"}
                    2. Try! 버튼을 누르면 AI가 추천 스타일링을 제공합니다.
   
                </ContentText>
            );
        } else if (isActive(['AIView'])) {
            return (
                <ContentText style={styles.modalText}>
                    1. 궁금한 스타일 사진을 업로드하세요.{"\n"}
                    2. Analyze! 버튼을 눌러 업로드한 사진 어떤 스타일인지 분석 받으세요.{"\n"}
                    3. AI는 업로드한 패션과 유사한 감각의 룩도 추천합니다.
 
                </ContentText>
            );
        } else if (isActive(['Battle'])) {
            return (
                <ContentText style={styles.modalText}>
                    1. Challenge! 버튼을 통해 원하는 상대와 스타일 대결을 할 수 있습니다.{"\n"}
                    2. 진행중인 대결의 경우 다른 사람들의 스타일 대결도 평가 할 수 있습니다.
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