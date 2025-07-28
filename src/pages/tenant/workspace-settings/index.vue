<template>
  <div class="d-flex align-center justify-space-between mb-4">
    <div class="d-flex align-center gap-2">
      <h2 class="text-h4 font-weight-bold mr-4">Workspace별 설정</h2>
      <VSelect
        v-model="selectedWorkspace"
        :items="workspaces"
        item-title="name"
        item-value="id"
        style="min-width: 200px"
        density="compact"
        @update:model-value="handleWorkspaceChange"
      />
      <VTooltip text="Custom Workspace를 추가합니다." location="top">
        <template #activator="{ props }">
          <VBtn
            v-bind="props"
            variant="outlined"
            @click="openAddWorkspaceModal"
          >
            + Workspace
          </VBtn>
        </template>
      </VTooltip>
    </div>
  </div>
  <div class="mb-4 text-body-1 text-medium-emphasis">
    Workspace 별로 사용할 Resource를 배정한다.
  </div>
  <VTabs v-model="tab" class="mb-4">
    <VTab
      min-width="100"
      v-for="item in tabItems"
      :key="item.value"
      :value="item.value"
    >
      {{ item.title }}
    </VTab>
  </VTabs>
  <VCardText>
    <VWindow v-model="tab" class="disable-tab-transition">
      <VWindowItem
        v-for="item in tabItems"
        :key="item.value"
        :value="item.value"
      >
        <RouterView />
      </VWindowItem>
    </VWindow>
  </VCardText>

  <!-- Add Workspace Modal -->
  <VDialog v-model="showAddWorkspaceModal" max-width="500px">
    <VCard>
      <VCardTitle class="text-h6 pa-4 pb-2"> Custom Workspace 추가 </VCardTitle>
      <VCardText class="pa-4 pt-2">
        <VForm @submit.prevent="addWorkspace">
          <div class="mb-4">
            <VLabel class="text-body-2 font-weight-medium mb-2"
              >상위 Workspace 선택</VLabel
            >
            <VSelect
              v-model="newWorkspace.parentId"
              :items="parentWorkspaceOptions"
              item-title="displayName"
              item-value="id"
              variant="outlined"
              density="compact"
              placeholder="상위 Workspace를 선택하세요"
              :rules="[v => !!v || '상위 Workspace를 선택해주세요']"
            />
          </div>
          <div class="mb-4">
            <VLabel class="text-body-2 font-weight-medium mb-2"
              >Workspace명</VLabel
            >
            <VTextField
              v-model="newWorkspace.name"
              variant="outlined"
              density="compact"
              placeholder="Workspace명을 입력하세요"
              :rules="[v => !!v || 'Workspace명을 입력해주세요']"
            />
          </div>
          <div class="mb-4">
            <VLabel class="text-body-2 font-weight-medium mb-2"
              >Workspace 설명</VLabel
            >
            <VTextarea
              v-model="newWorkspace.description"
              variant="outlined"
              density="compact"
              placeholder="Workspace에 대한 설명을 입력하세요"
              rows="3"
            />
          </div>
        </VForm>
      </VCardText>
      <VCardActions class="pa-4 pt-0">
        <VSpacer />
        <VBtn variant="outlined" @click="closeAddWorkspaceModal"> 취소 </VBtn>
        <VBtn
          color="primary"
          @click="addWorkspace"
          :loading="isAdding"
          :disabled="!newWorkspace.parentId || !newWorkspace.name"
        >
          저장
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useWorkspaceStore } from '@/stores/workspace';

const router = useRouter();
const route = useRoute();
const workspaceStore = useWorkspaceStore();

const tabItems = [
  { title: 'LLM 배정', value: 'llm-assignment' },
  { title: 'MCP 서버 배정', value: 'mcp-assignment' },
  { title: '비서 배정', value: 'secretary-assignment' },
];

// 현재 라우트의 마지막 부분에서 탭 값을 추출
const tab = ref(route.path.split('/').pop() || 'llm-assignment');

// Store에서 데이터 가져오기
const workspaces = computed(() => workspaceStore.workspaces);
const selectedWorkspace = computed({
  get: () => workspaceStore.selectedWorkspace,
  set: value => workspaceStore.selectWorkspace(value),
});

// Modal 관련 상태
const showAddWorkspaceModal = ref(false);
const isAdding = ref(false);

// 새 Workspace 데이터
const newWorkspace = ref({
  parentId: null,
  name: '',
  description: '',
});

// 상위 Workspace 옵션 (들여쓰기 포함)
const parentWorkspaceOptions = computed(() => {
  return workspaces.value.map(workspace => ({
    id: workspace.id,
    displayName: getDisplayNameWithIndent(workspace.name, workspace.level),
  }));
});

// 들여쓰기를 포함한 표시용 Workspace명
const getDisplayNameWithIndent = (name, level) => {
  const indent = '  '.repeat(level); // 레벨에 따른 들여쓰기
  return indent + workspaceStore.getDisplayName(name); // 앞의 대시들 제거
};

function handleWorkspaceChange(workspace) {
  workspaceStore.selectWorkspace(workspace);
}

function openAddWorkspaceModal() {
  showAddWorkspaceModal.value = true;
  newWorkspace.value = {
    parentId: null,
    name: '',
    description: '',
  };
}

function closeAddWorkspaceModal() {
  showAddWorkspaceModal.value = false;
}

function addWorkspace() {
  if (!newWorkspace.value.parentId || !newWorkspace.value.name) {
    return;
  }

  isAdding.value = true;

  // 선택된 상위 Workspace 정보 가져오기
  const parentWorkspace = workspaces.value.find(
    w => w.id === newWorkspace.value.parentId
  );

  // 새 Workspace 생성
  const newLevel = parentWorkspace ? parentWorkspace.level + 1 : 0;
  const prefix = '-'.repeat(newLevel);

  const workspaceData = {
    name: prefix + newWorkspace.value.name,
    level: newLevel,
    parentId: newWorkspace.value.parentId,
    description: newWorkspace.value.description,
  };

  // Store를 통해 Workspace 추가
  workspaceStore.addWorkspace(workspaceData);

  // 모달 닫기
  closeAddWorkspaceModal();
  isAdding.value = false;
}

// 탭이 변경되면 라우터 업데이트
watch(tab, newValue => {
  router.push(`/tenant/workspace-settings/${newValue}`);
});

// 라우터가 변경되면 탭 업데이트
watch(
  () => route.path,
  newValue => {
    const currentTab = newValue.split('/').pop();
    if (tab.value !== currentTab) {
      tab.value = currentTab;
    }
  }
);
</script>

<style scoped>
.disable-tab-transition {
  transition: none !important;
}
</style>
