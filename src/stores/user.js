import { defineStore } from 'pinia';

// 로컬 스토리지에서 사용자 정보와 역할 읽기
const getSavedState = () => {
  try {
    const savedRole = localStorage.getItem('userRole');
    const savedUserData = localStorage.getItem('userData');
    
    return {
      role: savedRole || 'system',
      user: savedUserData ? JSON.parse(savedUserData) : null
    };
  } catch (error) {
    console.error('로컬 스토리지에서 사용자 정보를 읽는 중 오류:', error);
    return {
      role: 'system',
      user: null
    };
  }
};

export const useUserStore = defineStore('user', {
  state: () => ({
    // 로컬 스토리지에서 상태 복원 또는 기본값 사용
    user: getSavedState().user,
    role: getSavedState().role, // 기본 권한은 로컬 스토리지에서 복원 또는 'system'
    // 현재 계정 타입 저장 (System, Tenant, Workspace)
    currentAccountType: localStorage.getItem('currentAccountType') || 'System'
  }),
  getters: {
    isLoggedIn: (state) => !!state.user,
    userRole: (state) => state.role,
  },
  actions: {
    setUser(userData) {
      this.user = userData;
      if (userData && userData.role) {
        this.role = userData.role;
        localStorage.setItem('userRole', userData.role);
      } else {
        // 사용자 정보가 없거나 권한이 없으면 기본값 'system'으로 설정
        this.role = 'system';
        localStorage.setItem('userRole', 'system');
      }
      
      // 사용자 데이터를 로컬 스토리지에 저장
      localStorage.setItem('userData', JSON.stringify(userData));
    },
    // 계정 타입 변경 (System, Tenant, Workspace)
    setAccountType(accountType) {
      this.currentAccountType = accountType;
      localStorage.setItem('currentAccountType', accountType);
    },
    logout() {
      this.user = null;
      this.role = 'system';
      // 로컬 스토리지 정리
      localStorage.removeItem('userRole');
      localStorage.removeItem('userData');
      localStorage.removeItem('currentAccountType');
    }
  },
});
