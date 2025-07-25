import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    role: 'system', // 기본 권한은 system으로 설정
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
      } else {
        // 사용자 정보가 없거나 권한이 없으면 기본값 'system'으로 설정
        this.role = 'system';
      }
    },
    logout() {
      this.user = null;
      this.role = 'system';
    }
  },
});
