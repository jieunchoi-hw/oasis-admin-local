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
            <th v-for="mcp in mcpConfigs" :key="mcp.key" class="text-center">
              <div class="d-flex flex-column align-center">
                <div class="mt-2">
                  {{ mcp.name }}
                  <VChip
                    v-if="mcp.isCompanyWide"
                    color="success"
                    size="small"
                    class="ms-1"
                  >
                    전사
                  </VChip>
                </div>
                <div class="mt-2 mb-2">
                  <VSelect
                    v-model="mcp.access"
                    :items="accessOptions"
                    variant="outlined"
                    density="compact"
                    hide-details
                    class="mcp-select"
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
            <td v-for="mcp in mcpConfigs" :key="mcp.key" class="text-center">
              <VSwitch
                v-model="user[mcp.key]"
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

// MCP 접근 옵션
const accessOptions = [
  { title: '전체 허용', value: 'full' },
  { title: '일부 허용', value: 'partial' },
  { title: '미허용', value: 'none' },
];

// MCP 설정 - 동적으로 추가/제거 가능
const mcpConfigs = ref([
  { key: 'mcp1', name: 'MCP 1', access: 'full', isCompanyWide: true },
  { key: 'mcp2', name: 'MCP 2', access: 'partial', isCompanyWide: false },
  { key: 'mcp3', name: 'MCP 3', access: 'none', isCompanyWide: false },
  { key: 'mcp4', name: 'MCP 4', access: 'none', isCompanyWide: false },
]);

// 필터링된 사용자 데이터
const filteredUsers = computed(() => {
  return workspaceUsersStore.searchUsers(filterText.value);
});

// 사용자 데이터에 MCP 접근 권한 초기화
const initializeUserMcpAccess = () => {
  workspaceUsersStore.users.forEach(user => {
    mcpConfigs.value.forEach(mcp => {
      if (!user.hasOwnProperty(mcp.key)) {
        user[mcp.key] = mcp.access === 'full';
      }
    });
  });
};

// MCP 접근 설정 변경 시 모든 사용자 권한 업데이트
const updateAllUsersAccess = (mcpKey, accessValue) => {
  const isFullAccess = accessValue === 'full';
  workspaceUsersStore.users.forEach(user => {
    user[mcpKey] = isFullAccess;
  });
};

// MCP 설정 변경 감지 및 처리
const setupMcpWatchers = () => {
  mcpConfigs.value.forEach(mcp => {
    watch(
      () => mcp.access,
      newValue => {
        updateAllUsersAccess(mcp.key, newValue);
      }
    );
  });
};

// 새로운 MCP 추가 함수 (API 연동 시 사용)
const addMcp = mcpData => {
  const newMcp = {
    key: `mcp${mcpConfigs.value.length + 1}`,
    access: 'none',
    isCompanyWide: false,
    ...mcpData,
  };
  mcpConfigs.value.push(newMcp);

  // 기존 사용자들에게 새 MCP 권한 초기화
  workspaceUsersStore.users.forEach(user => {
    user[newMcp.key] = newMcp.access === 'full';
  });

  // 새 MCP에 대한 감시자 설정
  watch(
    () => newMcp.access,
    newValue => {
      updateAllUsersAccess(newMcp.key, newValue);
    }
  );
};

// MCP 제거 함수
const removeMcp = mcpKey => {
  const index = mcpConfigs.value.findIndex(mcp => mcp.key === mcpKey);
  if (index !== -1) {
    mcpConfigs.value.splice(index, 1);

    // 사용자 데이터에서 해당 MCP 권한 제거
    workspaceUsersStore.users.forEach(user => {
      delete user[mcpKey];
    });
  }
};

// 컴포넌트 마운트 시 초기화
onMounted(() => {
  initializeUserMcpAccess();
  setupMcpWatchers();
});

// API에서 MCP 목록을 가져오는 함수 (향후 API 연동 시 사용)
const loadMcpConfigsFromApi = async () => {
  try {
    // API 호출 예시
    // const response = await api.getMcpConfigs();
    // mcpConfigs.value = response.data.map(mcp => ({
    //   key: mcp.key,
    //   name: mcp.name,
    //   access: mcp.defaultAccess || 'none',
    //   isCompanyWide: mcp.isCompanyWide || false
    // }));

    // 현재는 하드코딩된 설정 사용
    console.log('MCP 설정을 API에서 로드할 예정입니다.');
  } catch (error) {
    console.error('MCP 설정 로드 실패:', error);
  }
};

// 설정 저장 함수
const saveSettings = async () => {
  try {
    const settings = {
      mcpConfigs: mcpConfigs.value,
      userPermissions: workspaceUsersStore.users.map(user => ({
        userId: user.id,
        permissions: mcpConfigs.value.map(mcp => ({
          mcpKey: mcp.key,
          hasAccess: user[mcp.key],
        })),
      })),
    };

    await workspaceUsersStore.saveSettingsToApi(settings);
    console.log('MCP 설정이 저장되었습니다.');
  } catch (error) {
    console.error('MCP 설정 저장 실패:', error);
  }
};
</script>

<style scoped>
.mcp-select {
  width: 150px;
}
</style>
