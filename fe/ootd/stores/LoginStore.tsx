import create from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface LoginState {
  accessToken: string | null;
  refreshToken: string | null;
  setAccessToken: (accessToken: string) => void;
  setRefreshToken: (refreshToken: string) => void;
  clearTokens: () => void;
  loadTokens: () => Promise<void>;
}

export const useLoginStore = create<LoginState>((set) => ({
  accessToken: null,
  refreshToken: null,
  
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

  clearTokens: async () => {
    set({ accessToken: null, refreshToken: null });
    await AsyncStorage.removeItem('accessToken');
    await AsyncStorage.removeItem('refreshToken');
  },

  loadTokens: async () => {
    const accessToken = await AsyncStorage.getItem('accessToken');
    const refreshToken = await AsyncStorage.getItem('refreshToken');
    set({ accessToken, refreshToken });
  },
}));
