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
                  비서1
                  <VChip color="success" size="small" class="ms-1">전사</VChip>
                </div>
                <div class="mt-2 mb-2">
                  <VSelect
                    v-model="secretary1Access"
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
                  비서2
                  <VChip color="success" size="small" class="ms-1">전사</VChip>
                </div>
                <div class="mt-2 mb-2">
                  <VSelect
                    v-model="secretary2Access"
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
                  비서3
                  <VChip color="success" size="small" class="ms-1">전사</VChip>
                </div>
                <div class="mt-2 mb-2">
                  <VSelect
                    v-model="secretary3Access"
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
                  비서4
                  <VChip color="success" size="small" class="ms-1">전사</VChip>
                </div>
                <div class="mt-2 mb-2">
                  <VSelect
                    v-model="secretary4Access"
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
                <div class="mt-2">비서5</div>
                <div class="mt-2 mb-2">
                  <VSelect
                    v-model="secretary5Access"
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
                    marginLeft:
                      workspaceStore.getIndentLevel(workspace.name) + 'px',
                  }"
                  :title="workspaceStore.getDisplayName(workspace.name)"
                >
                  {{ workspaceStore.getDisplayName(workspace.name) }}
                </div>
              </div>
            </td>
            <td class="text-center">
              <VSwitch
                v-model="workspace.secretary1"
                color="primary"
                hide-details
                density="compact"
                class="ma-0 pa-0 d-inline-block"
              />
            </td>
            <td class="text-center">
              <VSwitch
                v-model="workspace.secretary2"
                color="primary"
                hide-details
                density="compact"
                class="ma-0 pa-0 d-inline-block"
              />
            </td>
            <td class="text-center">
              <VSwitch
                v-model="workspace.secretary3"
                color="primary"
                hide-details
                density="compact"
                class="ma-0 pa-0 d-inline-block"
              />
            </td>
            <td class="text-center">
              <VSwitch
                v-model="workspace.secretary4"
                color="primary"
                hide-details
                density="compact"
                class="ma-0 pa-0 d-inline-block"
              />
            </td>
            <td class="text-center">
              <VSwitch
                v-model="workspace.secretary5"
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

// 비서 접근 옵션
const accessOptions = [
  { title: '전체 허용', value: 'full' },
  { title: '일부 허용', value: 'partial' },
  { title: '미허용', value: 'none' },
];

// 비서 접근 설정
const secretary1Access = ref('full');
const secretary2Access = ref('partial');
const secretary3Access = ref('none');
const secretary4Access = ref('partial');
const secretary5Access = ref('full');

// 필터링된 Workspace 데이터
const filteredWorkspaces = computed(() => {
  if (!filterText.value) return workspaceStore.workspaces;

  const query = filterText.value.toLowerCase();
  return workspaceStore.workspaces.filter(workspace =>
    workspace.name.toLowerCase().includes(query)
  );
});

// Workspace 데이터에 비서 접근 권한 초기화
onMounted(() => {
  // 각 Workspace에 비서 접근 권한 속성 추가
  workspaceStore.workspaces.forEach(workspace => {
    if (!workspace.hasOwnProperty('secretary1')) {
      workspace.secretary1 = secretary1Access.value === 'full';
      workspace.secretary2 = secretary2Access.value === 'full';
      workspace.secretary3 = secretary3Access.value === 'full';
      workspace.secretary4 = secretary4Access.value === 'full';
      workspace.secretary5 = secretary5Access.value === 'full';
    }
  });
});
</script>

<style scoped>
.llm-select {
  width: 150px;
}

.department-indent {
  transition: margin-left 0.3s ease;
}
</style>
