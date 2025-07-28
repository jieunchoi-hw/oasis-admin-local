<template>
  <div>
    <div class="d-flex justify-end mb-4">
      <VSpacer />
      <VTextField
        class="me-2"
        v-model="filterText"
        placeholder="부서명으로 검색"
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
            <th></th>
            <th class="text-center">
              <div class="d-flex flex-column align-center">
                <div class="mt-2">
                  LLM1
                  <VChip color="success" size="small" class="ms-1">전사</VChip>
                </div>
                <div class="mt-2 mb-2">
                  <VSelect
                    v-model="llm1Access"
                    :items="accessOptions"
                    variant="outlined"
                    density="compact"
                    hide-details
                    class="llm-select"
                  />
                </div>
              </div>
            </th>
            <th class="text-center">
              <div class="d-flex flex-column align-center">
                <div class="mt-2">
                  LLM2
                  <VChip color="success" size="small" class="ms-1">전사</VChip>
                </div>
                <div class="mt-2 mb-2">
                  <VSelect
                    v-model="llm2Access"
                    :items="accessOptions"
                    variant="outlined"
                    density="compact"
                    hide-details
                    class="llm-select"
                  />
                </div>
              </div>
            </th>
            <th class="text-center">
              <div class="d-flex flex-column align-center">
                <div class="mt-2">
                  LLM3
                  <VChip color="success" size="small" class="ms-1">전사</VChip>
                </div>
                <div class="mt-2 mb-2">
                  <VSelect
                    v-model="llm3Access"
                    :items="accessOptions"
                    variant="outlined"
                    density="compact"
                    hide-details
                    class="llm-select"
                  />
                </div>
              </div>
            </th>
            <th class="text-center">
              <div class="d-flex flex-column align-center">
                <div class="mt-2">
                  LLM4
                  <VChip color="success" size="small" class="ms-1">전사</VChip>
                </div>
                <div class="mt-2 mb-2">
                  <VSelect
                    v-model="llm4Access"
                    :items="accessOptions"
                    variant="outlined"
                    density="compact"
                    hide-details
                    class="llm-select"
                  />
                </div>
              </div>
            </th>
            <th class="text-center">
              <div class="d-flex flex-column align-center">
                <div class="mt-2">LLM5</div>
                <div class="mt-2 mb-2">
                  <VSelect
                    v-model="llm5Access"
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
          <tr v-for="workspace in filteredWorkspaces" :key="workspace.id">
            <td>
              <VChip
                size="x-small"
                :color="workspace.isCustom ? 'warning' : 'primary'"
              >
                {{ workspace.isCustom ? 'Custom' : 'Sync' }}
              </VChip>
            </td>
            <td>
              <div class="d-flex align-center">
                <div
                  class="text-truncate"
                  :style="{
                    marginLeft: workspace.level * 20 + 'px',
                  }"
                  :title="workspaceStore.getDisplayName(workspace.name)"
                >
                  {{ workspaceStore.getDisplayName(workspace.name) }}
                </div>
              </div>
            </td>
            <td class="text-center">
              <VSwitch
                v-model="workspace.llm1"
                color="primary"
                hide-details
                density="compact"
                class="ma-0 pa-0 d-inline-block"
              />
            </td>
            <td class="text-center">
              <VSwitch
                v-model="workspace.llm2"
                color="primary"
                hide-details
                density="compact"
                class="ma-0 pa-0 d-inline-block"
              />
            </td>
            <td class="text-center">
              <VSwitch
                v-model="workspace.llm3"
                color="primary"
                hide-details
                density="compact"
                class="ma-0 pa-0 d-inline-block"
              />
            </td>
            <td class="text-center">
              <VSwitch
                v-model="workspace.llm4"
                color="primary"
                hide-details
                density="compact"
                class="ma-0 pa-0 d-inline-block"
              />
            </td>
            <td class="text-center">
              <VSwitch
                v-model="workspace.llm5"
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
import { ref, computed, onMounted } from 'vue';
import { useWorkspaceStore } from '@/stores/workspace';

const workspaceStore = useWorkspaceStore();

// 필터 상태
const filterText = ref('');

// LLM 접근 옵션
const accessOptions = [
  { title: '전체 허용', value: 'full' },
  { title: '일부 허용', value: 'partial' },
  { title: '미허용', value: 'none' },
];

// LLM 접근 설정
const llm1Access = ref('full');
const llm2Access = ref('partial');
const llm3Access = ref('none');
const llm4Access = ref('partial');
const llm5Access = ref('full');

// 필터링된 Workspace 데이터
const filteredWorkspaces = computed(() => {
  if (!filterText.value) return workspaceStore.workspaces;

  const query = filterText.value.toLowerCase();
  return workspaceStore.workspaces.filter(workspace =>
    workspace.name.toLowerCase().includes(query)
  );
});

// Workspace 데이터에 LLM 접근 권한 초기화
onMounted(() => {
  // 각 Workspace에 LLM 접근 권한 속성 추가
  workspaceStore.workspaces.forEach(workspace => {
    if (!workspace.hasOwnProperty('llm1')) {
      workspace.llm1 = llm1Access.value === 'full';
      workspace.llm2 = llm2Access.value === 'full';
      workspace.llm3 = llm3Access.value === 'full';
      workspace.llm4 = llm4Access.value === 'full';
      workspace.llm5 = llm5Access.value === 'full';
    }
  });
});
</script>

<style scoped>
.llm-select {
  width: 150px;
}
</style>
