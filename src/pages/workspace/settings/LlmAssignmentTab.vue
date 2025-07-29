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
            <th v-for="llm in llmConfigs" :key="llm.key" class="text-center">
              <div class="d-flex flex-column align-center">
                <div class="mt-2">
                  {{ llm.name }}
                  <VChip
                    v-if="llm.isCompanyWide"
                    color="success"
                    size="small"
                    class="ms-1"
                  >
                    전사
                  </VChip>
                </div>
                <div class="mt-2 mb-2">
                  <VSelect
                    v-model="llm.access"
                    :items="accessOptions"
                    variant="outlined"
                    density="compact"
                    hide-details
                    class="llm-select"
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
            <td v-for="llm in llmConfigs" :key="llm.key" class="text-center">
              <VSwitch
                v-model="user[llm.key]"
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

// LLM 접근 옵션
const accessOptions = [
  { title: '전체 허용', value: 'full' },
  { title: '일부 허용', value: 'partial' },
  { title: '미허용', value: 'none' },
];

// LLM 설정 - 동적으로 추가/제거 가능
const llmConfigs = ref([
  { key: 'llm1', name: 'LLM 1', access: 'full', isCompanyWide: true },
  { key: 'llm2', name: 'LLM 2', access: 'full', isCompanyWide: true },
  { key: 'llm3', name: 'LLM 3', access: 'partial', isCompanyWide: false },
  { key: 'llm4', name: 'LLM 4', access: 'none', isCompanyWide: false },
  { key: 'llm5', name: 'LLM 5', access: 'none', isCompanyWide: false },
]);

// 필터링된 사용자 데이터
const filteredUsers = computed(() => {
  return workspaceUsersStore.searchUsers(filterText.value);
});

// 사용자 데이터에 LLM 접근 권한 초기화
const initializeUserLlmAccess = () => {
  workspaceUsersStore.users.forEach(user => {
    llmConfigs.value.forEach(llm => {
      if (!user.hasOwnProperty(llm.key)) {
        user[llm.key] = llm.access === 'full';
      }
    });
  });
};

// LLM 접근 설정 변경 시 모든 사용자 권한 업데이트
const updateAllUsersAccess = (llmKey, accessValue) => {
  const isFullAccess = accessValue === 'full';
  workspaceUsersStore.users.forEach(user => {
    user[llmKey] = isFullAccess;
  });
};

// LLM 설정 변경 감지 및 처리
const setupLlmWatchers = () => {
  llmConfigs.value.forEach(llm => {
    watch(
      () => llm.access,
      newValue => {
        updateAllUsersAccess(llm.key, newValue);
      }
    );
  });
};

// 새로운 LLM 추가 함수 (API 연동 시 사용)
const addLlm = llmData => {
  const newLlm = {
    key: `llm${llmConfigs.value.length + 1}`,
    access: 'none',
    isCompanyWide: false,
    ...llmData,
  };
  llmConfigs.value.push(newLlm);

  // 기존 사용자들에게 새 LLM 권한 초기화
  workspaceUsersStore.users.forEach(user => {
    user[newLlm.key] = newLlm.access === 'full';
  });

  // 새 LLM에 대한 감시자 설정
  watch(
    () => newLlm.access,
    newValue => {
      updateAllUsersAccess(newLlm.key, newValue);
    }
  );
};

// LLM 제거 함수
const removeLlm = llmKey => {
  const index = llmConfigs.value.findIndex(llm => llm.key === llmKey);
  if (index !== -1) {
    llmConfigs.value.splice(index, 1);

    // 사용자 데이터에서 해당 LLM 권한 제거
    workspaceUsersStore.users.forEach(user => {
      delete user[llmKey];
    });
  }
};

// 컴포넌트 마운트 시 초기화
onMounted(() => {
  initializeUserLlmAccess();
  setupLlmWatchers();
});

// API에서 LLM 목록을 가져오는 함수 (향후 API 연동 시 사용)
const loadLlmConfigsFromApi = async () => {
  try {
    // API 호출 예시
    // const response = await api.getLlmConfigs();
    // llmConfigs.value = response.data.map(llm => ({
    //   key: llm.key,
    //   name: llm.name,
    //   access: llm.defaultAccess || 'none',
    //   isCompanyWide: llm.isCompanyWide || false
    // }));

    // 현재는 하드코딩된 설정 사용
    console.log('LLM 설정을 API에서 로드할 예정입니다.');
  } catch (error) {
    console.error('LLM 설정 로드 실패:', error);
  }
};

// 설정 저장 함수
const saveSettings = async () => {
  try {
    const settings = {
      llmConfigs: llmConfigs.value,
      userPermissions: workspaceUsersStore.users.map(user => ({
        userId: user.id,
        permissions: llmConfigs.value.map(llm => ({
          llmKey: llm.key,
          hasAccess: user[llm.key],
        })),
      })),
    };

    await workspaceUsersStore.saveSettingsToApi(settings);
    console.log('설정이 저장되었습니다.');
  } catch (error) {
    console.error('설정 저장 실패:', error);
  }
};
</script>

<style scoped>
.llm-select {
  width: 150px;
}
</style>
