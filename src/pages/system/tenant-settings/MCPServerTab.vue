<template>
  <div>
    <!-- 상단 설명 및 Save 버튼 -->
    <div class="d-flex justify-space-between align-center mb-4">
      <div class="text-body-2 text-medium-emphasis">
        ■ 한화시스템에서 사용하는 MCP 서버를 배정한다.
      </div>
      <VBtn color="primary" @click="saveMCPAssignments"> Save </VBtn>
    </div>
    <div class="d-flex gap-4" style="height: 600px">
      <!-- 왼쪽 패널: 사용 가능한 MCP 서버 -->
      <div class="flex-grow-1 d-flex flex-column">
        <div class="d-flex align-center justify-space-between mb-3">
          <div class="d-flex align-center"></div>
          <div class="d-flex align-center gap-2 me-3">
            <VBtn
              variant="plain"
              size="small"
              prepend-icon="ri-refresh-line"
              class="pa-0"
            ></VBtn>
            <VBtn variant="text" size="small"> 전체선택 </VBtn>
            <VCheckbox v-model="selectAllLeft" color="primary" hide-details />
          </div>
        </div>
        <div class="flex-grow-1 overflow-y-auto">
          <div class="d-flex flex-column gap-3">
            <VCard
              v-for="(mcp, index) in mcpServers"
              :key="mcp.id"
              class="pa-3"
              :color="mcp.color"
              v-bind="mcp.variant ? { variant: mcp.variant } : {}"
            >
              <div class="d-flex align-center justify-space-between">
                <div class="d-flex align-center gap-3">
                  <VIcon :icon="mcp.icon" size="24" color="primary" />
                  <div>
                    <div class="text-heading-6 font-weight-medium">
                      {{ mcp.name }}
                    </div>
                    <div class="text-caption text-medium-emphasis">
                      {{ mcp.desc }}
                    </div>
                  </div>
                </div>
                <div class="d-flex align-center gap-2">
                  <VBtn variant="text" size="small" color="primary"
                    >detail</VBtn
                  >
                  <VCheckbox
                    v-model="selectedMCPs[index]"
                    color="primary"
                    hide-details
                  />
                </div>
              </div>
            </VCard>
          </div>
        </div>
      </div>
      <!-- 중앙 이동 버튼 -->
      <div class="d-flex flex-column justify-center gap-2">
        <VBtn
          color="primary"
          variant="outlined"
          prepend-icon="ri-arrow-right-line"
          :disabled="!hasSelectedLeft"
          @click="moveToRight"
        />
        <VBtn
          color="primary"
          variant="outlined"
          prepend-icon="ri-arrow-left-line"
          :disabled="!hasSelectedRight"
          @click="moveToLeft"
        />
      </div>
      <!-- 오른쪽 패널: 배정된 MCP 서버 -->
      <div class="flex-grow-1 d-flex flex-column">
        <div class="d-flex align-center justify-end mb-3 me-3">
          <VBtn variant="text" size="small"> 전체선택 </VBtn>
          <VCheckbox v-model="selectAllRight" color="primary" hide-details />
        </div>
        <div class="flex-grow-1 overflow-y-auto">
          <div class="d-flex flex-column gap-3">
            <VCard
              v-for="(mcp, index) in assignedMCPs"
              :key="mcp.id"
              class="pa-3"
              v-bind="mcp.variant ? { variant: mcp.variant } : {}"
            >
              <div class="d-flex align-center justify-space-between">
                <div class="d-flex align-center gap-3">
                  <VIcon :icon="mcp.icon" size="24" color="primary" />
                  <div>
                    <div class="text-heading-6 font-weight-medium">
                      {{ mcp.name }}
                    </div>
                    <div class="text-caption text-medium-emphasis">
                      {{ mcp.desc }}
                    </div>
                  </div>
                </div>
                <div class="d-flex align-center gap-2">
                  <VBtn variant="text" size="small" color="primary"
                    >detail</VBtn
                  >
                  <VCheckbox
                    v-model="selectedAssignedMCPs[index]"
                    color="primary"
                    hide-details
                  />
                </div>
              </div>
            </VCard>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, watch } from 'vue';
import {
  VBtn,
  VChip,
  VTooltip,
  VIcon,
  VCheckbox,
  VCard,
} from 'vuetify/components';

const mcpServers = ref([
  {
    id: 1,
    name: 'MCP Server 1',
    desc: 'MCP Server 1 is blah blah...',
    icon: 'ri-server-line',
    color: 'warning',
    variant: 'tonal',
  },
  {
    id: 2,
    name: 'MCP Server 2',
    desc: 'MCP Server 2 is blah blah...',
    icon: 'ri-server-line',
  },
  {
    id: 3,
    name: 'MCP Server 3',
    desc: 'MCP Server 3 is blah blah...',
    icon: 'ri-server-line',
  },
  {
    id: 4,
    name: 'MCP Server 4',
    desc: 'MCP Server 4 is blah blah...',
    icon: 'ri-server-line',
    color: 'warning',
    variant: 'tonal',
  },
  {
    id: 5,
    name: 'MCP Server 5',
    desc: 'MCP Server 5 is blah blah...',
    icon: 'ri-server-line',
    color: 'warning',
    variant: 'tonal',
  },
]);
const selectedMCPs = ref([true, false, false, true, true]);

const assignedMCPs = ref([
  {
    id: 1,
    name: 'MCP Server 1',
    desc: 'MCP Server 1 is blah blah...',
    icon: 'ri-server-line',
    color: 'warning',
  },
  {
    id: 4,
    name: 'MCP Server 4',
    desc: 'MCP Server 4 is blah blah...',
    icon: 'ri-server-line',
    color: 'warning',
  },
  {
    id: 5,
    name: 'MCP Server 5',
    desc: 'MCP Server 5 is blah blah...',
    icon: 'ri-server-line',
    color: 'warning',
  },
]);
const selectedAssignedMCPs = ref([false, false, false]);

const selectAllLeft = ref(false);
const selectAllRight = ref(false);

const hasSelectedLeft = computed(() => selectedMCPs.value.some(Boolean));
const hasSelectedRight = computed(() =>
  selectedAssignedMCPs.value.some(Boolean)
);
const allLeftSelected = computed(() => selectedMCPs.value.every(Boolean));
const allRightSelected = computed(() =>
  selectedAssignedMCPs.value.every(Boolean)
);

watch(selectAllLeft, val => {
  selectedMCPs.value = selectedMCPs.value.map(() => val);
});
watch(selectAllRight, val => {
  selectedAssignedMCPs.value = selectedAssignedMCPs.value.map(() => val);
});
watch(selectedMCPs, () => {
  selectAllLeft.value = allLeftSelected.value;
});
watch(selectedAssignedMCPs, () => {
  selectAllRight.value = allRightSelected.value;
});

function moveToRight() {
  mcpServers.value.forEach((mcp, idx) => {
    if (
      selectedMCPs.value[idx] &&
      !assignedMCPs.value.find(a => a.id === mcp.id)
    ) {
      assignedMCPs.value.push({ ...mcp });
      selectedAssignedMCPs.value.push(false);
    }
  });
  selectedMCPs.value = selectedMCPs.value.map(() => false);
}
function moveToLeft() {
  for (let i = assignedMCPs.value.length - 1; i >= 0; i--) {
    if (selectedAssignedMCPs.value[i]) {
      assignedMCPs.value.splice(i, 1);
      selectedAssignedMCPs.value.splice(i, 1);
    }
  }
}
function saveMCPAssignments() {
  console.log('Save MCP assignments', assignedMCPs.value);
}
</script>
