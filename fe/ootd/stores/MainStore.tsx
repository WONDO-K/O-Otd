// MainStore.tsx
import create from 'zustand';

// 상태 타입 정의
interface MainStoreState {
  count: number;
  increase: () => void;
  decrease: () => void;
}

// Zustand 스토어 생성
const useMainStore = create<MainStoreState>((set) => ({
  count: 0,
  increase: () => set((state) => ({ count: state.count + 1 })),
  decrease: () => set((state) => ({ count: state.count - 1 })),
}));

export default useMainStore;
