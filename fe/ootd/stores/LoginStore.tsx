import create from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface LoginState {
  accessToken: string | null;
  refreshToken: string | null;
  userId: number | null;  // userId를 int로 변경
  userRole: string | null;
  setAccessToken: (accessToken: string) => Promise<void>;
  setRefreshToken: (refreshToken: string) => Promise<void>;
  setUserId: (userId: number) => Promise<void>;  // userId 함수도 int로 수정
  setUserRole: (userRole: string) => Promise<void>;
  clearAll: () => Promise<void>;
  loadAll: () => Promise<void>;
}

export const useLoginStore = create<LoginState>((set) => ({
  accessToken: null,
  refreshToken: null,
  userId: null,        // userId를 null로 초기화
  userRole: null,

  // AccessToken 설정 함수
  setAccessToken: async (accessToken) => {
    set({ accessToken });
    await AsyncStorage.setItem('accessToken', accessToken);
  },

  // RefreshToken 설정 함수
  setRefreshToken: async (refreshToken) => {
    set({ refreshToken });
    await AsyncStorage.setItem('refreshToken', refreshToken);
  },

  // UserId 설정 함수 (string으로 저장하고, int로 변환하여 사용)
  setUserId: async (userId: number) => {
    set({ userId });
    await AsyncStorage.setItem('userId', userId.toString()); // 저장할 때는 string으로 변환
  },

  // UserRole 설정 함수
  setUserRole: async (userRole) => {
    set({ userRole });
    await AsyncStorage.setItem('userRole', userRole);
  },

  // 모든 토큰 및 사용자 정보 초기화 함수
  clearAll: async () => {
    set({ accessToken: null, refreshToken: null, userId: null, userRole: null });
    await AsyncStorage.removeItem('accessToken');
    await AsyncStorage.removeItem('refreshToken');
    await AsyncStorage.removeItem('userId');
    await AsyncStorage.removeItem('userRole');
  },

  // 모든 토큰 및 사용자 정보 불러오기 함수 (userId를 int로 변환)
  loadAll: async () => {
    const [accessToken, refreshToken, userIdString, userRole] = await Promise.all([
      AsyncStorage.getItem('accessToken'),
      AsyncStorage.getItem('refreshToken'),
      AsyncStorage.getItem('userId'),
      AsyncStorage.getItem('userRole'),
    ]);
    const userId = userIdString ? parseInt(userIdString, 10) : null; // 불러올 때는 int로 변환
    set({ accessToken, refreshToken, userId, userRole });
  },
}));
