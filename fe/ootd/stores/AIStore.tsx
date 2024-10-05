import { create } from 'zustand';

// 상태 타입 정의
interface AIStoreState {
  image: any | null; // 단일 이미지 데이터를 저장 (Base64 또는 파일 정보)
  setImage: (image: any) => void;
  clearImage: () => void;
}

// Zustand 스토어 생성
const useAIStore = create<AIStoreState>((set) => ({
  image: null, // 초기 이미지는 null
  setImage: (image: any) => set(() => ({ image })), // 새로운 이미지로 덮어쓰기
  clearImage: () => set(() => ({ image: null })), // 이미지 초기화
}));

export default useAIStore;
