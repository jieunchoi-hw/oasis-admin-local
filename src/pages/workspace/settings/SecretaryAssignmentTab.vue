<template>
  <div>
    <div class="d-flex justify-end mb-4">
      <VSpacer />
      <VTextField
        class="me-2"
        v-model="filterText"
        placeholder="사용자명으로 검색"
        variant="outlined"
        density="compact"
        style="max-width: 250px"
        hide-details
        prepend-inner-icon="ri-search-line"
      />
      <div class="d-flex">
        <VBtn color="primary"> Save </VBtn>
      </div>
    </div>

    <VCard>
      <VTable>
        <thead>
          <tr>
            <th></th>
            <th
              v-for="secretary in secretaryConfigs"
              :key="secretary.key"
              class="text-center"
            >
              <div class="d-flex flex-column align-center">
                <div class="mt-2">
                  {{ secretary.name }}
                  <VChip
                    v-if="secretary.isCompanyWide"
                    color="success"
                    size="small"
                    class="ms-1"
                  >
                    전사
                  </VChip>
                </div>
                <div class="mt-2 mb-2">
                  <VSelect
                    v-model="secretary.access"
                    :items="accessOptions"
                    variant="outlined"
                    density="compact"
                    hide-details
                    class="secretary-select"
                  />
                </div>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in filteredUsers" :key="user.id">
            <td>
              <div class="d-flex align-center">
                <div class="text-truncate" :title="user.name">
                  {{ user.name }}
                </div>
              </div>
            </td>
            <td
              v-for="secretary in secretaryConfigs"
              :key="secretary.key"
              class="text-center"
            >
              <VSwitch
                v-model="user[secretary.key]"
                color="primary"
                hide-details
                density="compact"
                class="ma-0 pa-0 d-inline-block"
              />
            </td>
          </tr>
        </tbody>
      </VTable>
    </VCard>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useWorkspaceUsersStore } from '@/stores/workspaceUsers';

const workspaceUsersStore = useWorkspaceUsersStore();

// 필터 상태
const filterText = ref('');

// 비서 접근 옵션
const accessOptions = [
  { title: '전체 허용', value: 'full' },
  { title: '일부 허용', value: 'partial' },
  { title: '미허용', value: 'none' },
];

// 비서 설정 - 동적으로 추가/제거 가능
const secretaryConfigs = ref([
  {
    key: 'secretary1',
    name: '비서 1',
    access: 'full',
    isCompanyWide: true,
  },
  { key: 'secretary2', name: '비서 2', access: 'full', isCompanyWide: true },
  { key: 'secretary3', name: '비서 3', access: 'none', isCompanyWide: false },
  { key: 'secretary4', name: '비서 4', access: 'none', isCompanyWide: false },
]);

// 필터링된 사용자 데이터
const filteredUsers = computed(() => {
  return workspaceUsersStore.searchUsers(filterText.value);
});

// 사용자 데이터에 비서 접근 권한 초기화
const initializeUserSecretaryAccess = () => {
  workspaceUsersStore.users.forEach(user => {
    secretaryConfigs.value.forEach(secretary => {
      if (!user.hasOwnProperty(secretary.key)) {
        user[secretary.key] = secretary.access === 'full';
      }
    });
  });
};

// 비서 접근 설정 변경 시 모든 사용자 권한 업데이트
const updateAllUsersAccess = (secretaryKey, accessValue) => {
  const isFullAccess = accessValue === 'full';
  workspaceUsersStore.users.forEach(user => {
    user[secretaryKey] = isFullAccess;
  });
};

// 비서 설정 변경 감지 및 처리
const setupSecretaryWatchers = () => {
  secretaryConfigs.value.forEach(secretary => {
    watch(
      () => secretary.access,
      newValue => {
        updateAllUsersAccess(secretary.key, newValue);
      }
    );
  });
};

// 새로운 비서 추가 함수 (API 연동 시 사용)
const addSecretary = secretaryData => {
  const newSecretary = {
    key: `secretary${secretaryConfigs.value.length + 1}`,
    access: 'none',
    isCompanyWide: false,
    ...secretaryData,
  };
  secretaryConfigs.value.push(newSecretary);

  // 기존 사용자들에게 새 비서 권한 초기화
  workspaceUsersStore.users.forEach(user => {
    user[newSecretary.key] = newSecretary.access === 'full';
  });

  // 새 비서에 대한 감시자 설정
  watch(
    () => newSecretary.access,
    newValue => {
      updateAllUsersAccess(newSecretary.key, newValue);
    }
  );
};

// 비서 제거 함수
const removeSecretary = secretaryKey => {
  const index = secretaryConfigs.value.findIndex(
    secretary => secretary.key === secretaryKey
  );
  if (index !== -1) {
    secretaryConfigs.value.splice(index, 1);

    // 사용자 데이터에서 해당 비서 권한 제거
    workspaceUsersStore.users.forEach(user => {
      delete user[secretaryKey];
    });
  }
};

// 컴포넌트 마운트 시 초기화
onMounted(() => {
  initializeUserSecretaryAccess();
  setupSecretaryWatchers();
});

// API에서 비서 목록을 가져오는 함수 (향후 API 연동 시 사용)
const loadSecretaryConfigsFromApi = async () => {
  try {
    // API 호출 예시
    // const response = await api.getSecretaryConfigs();
    // secretaryConfigs.value = response.data.map(secretary => ({
    //   key: secretary.key,
    //   name: secretary.name,
    //   access: secretary.defaultAccess || 'none',
    //   isCompanyWide: secretary.isCompanyWide || false
    // }));

    // 현재는 하드코딩된 설정 사용
    console.log('비서 설정을 API에서 로드할 예정입니다.');
  } catch (error) {
    console.error('비서 설정 로드 실패:', error);
  }
};

// 설정 저장 함수
const saveSettings = async () => {
  try {
    const settings = {
      secretaryConfigs: secretaryConfigs.value,
      userPermissions: workspaceUsersStore.users.map(user => ({
        userId: user.id,
        permissions: secretaryConfigs.value.map(secretary => ({
          secretaryKey: secretary.key,
          hasAccess: user[secretary.key],
        })),
      })),
    };

    await workspaceUsersStore.saveSettingsToApi(settings);
    console.log('비서 설정이 저장되었습니다.');
  } catch (error) {
    console.error('비서 설정 저장 실패:', error);
  }
};
</script>

<style scoped>
.secretary-select {
  width: 150px;
}
</style>
