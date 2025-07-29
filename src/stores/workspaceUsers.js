// src/stores/workspaceUsers.js
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useWorkspaceUsersStore = defineStore('workspaceUsers', () => {
  // 사용자 목록
  const users = ref([
    { id: 1, name: '양승철' },
    { id: 2, name: '김종성' },
    { id: 3, name: '황명선' },
    { id: 4, name: '김아현' },
    { id: 5, name: '박성권' },
    { id: 6, name: '전승현' },
    { id: 7, name: '신강식' },
    { id: 8, name: '이보미' },
  ]);

  // 사용자 추가
  function addUser(userData) {
    const newId = Math.max(...users.value.map(u => u.id)) + 1;
    const newUser = { id: newId, ...userData };
    users.value.push(newUser);
    return newUser;
  }

  // 사용자 업데이트
  function updateUser(userId, updates) {
    const index = users.value.findIndex(u => u.id === userId);
    if (index !== -1) {
      users.value[index] = { ...users.value[index], ...updates };
    }
  }

  // 사용자 삭제
  function removeUser(userId) {
    const index = users.value.findIndex(u => u.id === userId);
    if (index !== -1) {
      users.value.splice(index, 1);
    }
  }

  // 사용자 검색
  const searchUsers = query => {
    if (!query) return users.value;
    const lowerQuery = query.toLowerCase();
    return users.value.filter(u => u.name.toLowerCase().includes(lowerQuery));
  };

  // API 호출을 통한 설정 저장 헬퍼 함수 (각 컴포넌트에서 사용 가능)
  async function saveSettingsToApi(data) {
    // API 호출 로직을 추가할 수 있음
    console.log('Settings saved to API:', data);
    return Promise.resolve(true);
  }

  return {
    users,
    addUser,
    updateUser,
    removeUser,
    searchUsers,
    saveSettingsToApi,
  };
});
