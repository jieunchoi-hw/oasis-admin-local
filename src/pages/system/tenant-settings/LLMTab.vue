<template>
  <div>
    <!-- 상단 설명 및 Save 버튼 -->
    <div class="d-flex justify-space-between align-center mb-4">
      <div class="text-body-2 text-medium-emphasis">
        ■ 한화시스템에서 사용하는 LLM를 배정한다.
      </div>
      <VBtn color="primary" @click="saveLLMAssignments"> Save </VBtn>
    </div>
    <div class="d-flex gap-4" style="height: 600px">
      <!-- 왼쪽 패널: 사용 가능한 LLM -->
      <div class="flex-grow-1 d-flex flex-column">
        <div class="d-flex align-center justify-space-between mb-3">
          <div class="d-flex align-center">
            <VChip color="warning" size="small" class="ms-2">Public</VChip>
            <VTooltip
              text="Tenant Level에 맞는 LLM들을 선택하여 테넌트에 배정할 수 있습니다."
            >
              <template #activator="{ props }">
                <VIcon
                  v-bind="props"
                  icon="ri-question-line"
                  size="15"
                  class="ms-1 text-medium-emphasis"
                />
              </template>
            </VTooltip>
          </div>
          <div class="d-flex align-center gap-2 me-3">
            <VBtn
              variant="plain"
              size="small"
              prepend-icon="ri-refresh-line"
              class="pa-0"
            >
            </VBtn>
            <VBtn variant="text" size="small"> 전체선택 </VBtn>
            <VCheckbox v-model="selectAllLeft" color="primary" hide-details />
          </div>
        </div>
        <div class="flex-grow-1 overflow-y-auto">
          <!-- LLM 카드들 -->
          <div class="d-flex flex-column gap-3">
            <VCard
              v-for="(llm, index) in availableLLMs"
              :key="llm.id"
              class="pa-3"
              :color="llm.color"
              v-bind="llm.variant ? { variant: llm.variant } : {}"
            >
              <div class="d-flex align-center justify-space-between">
                <div class="d-flex align-center gap-3">
                  <template
                    v-if="
                      llm.icon.endsWith &&
                      (llm.icon.endsWith('.png') || llm.icon.endsWith('.svg'))
                    "
                  >
                    <img
                      :src="llm.icon"
                      alt="icon"
                      style="width: 24px; height: 24px"
                    />
                  </template>
                  <template v-else>
                    <VIcon :icon="llm.icon" size="24" color="primary" />
                  </template>
                  <div>
                    <div class="text-heading-6 font-weight-medium">
                      {{ llm.name }} ({{ llm.level }})
                    </div>
                    <div class="text-caption text-medium-emphasis">
                      {{ llm.desc }}
                    </div>
                  </div>
                </div>
                <div class="d-flex align-center gap-2">
                  <VBtn variant="text" size="small" color="primary"
                    >detail</VBtn
                  >
                  <template v-if="!llm.used">
                    <VTooltip text="1 provider – 1key">
                      <template #activator="{ props }">
                        <span v-bind="props">
                          <VCheckbox
                            v-model="selectedLLMs[index]"
                            color="primary"
                            hide-details
                            :disabled="!llm.used"
                          />
                        </span>
                      </template>
                    </VTooltip>
                  </template>
                  <VCheckbox
                    v-else
                    v-model="selectedLLMs[index]"
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
          prepend-icon="ri-arrow-left-line"
          :disabled="!hasSelectedRight"
          @click="moveToLeft"
        />
        <VBtn
          color="primary"
          variant="outlined"
          prepend-icon="ri-arrow-right-line"
          :disabled="!hasSelectedLeft"
          @click="moveToRight"
        />
      </div>
      <!-- 오른쪽 패널: 배정된 LLM -->
      <div class="flex-grow-1 d-flex flex-column">
        <div class="d-flex align-center justify-end mb-3 me-3">
          <VBtn variant="text" size="small"> 전체선택 </VBtn>
          <VCheckbox v-model="selectAllRight" color="primary" hide-details />
        </div>
        <div class="flex-grow-1 overflow-y-auto">
          <!-- 배정된 LLM 카드들 -->
          <div class="d-flex flex-column gap-3">
            <VCard
              v-for="(llm, index) in assignedLLMs"
              :key="llm.id"
              class="pa-3"
            >
              <div class="d-flex align-center justify-space-between">
                <div class="d-flex align-center gap-3">
                  <template
                    v-if="
                      llm.icon.endsWith &&
                      (llm.icon.endsWith('.png') || llm.icon.endsWith('.svg'))
                    "
                  >
                    <img
                      :src="llm.icon"
                      alt="icon"
                      style="width: 24px; height: 24px"
                    />
                  </template>
                  <template v-else>
                    <VIcon :icon="llm.icon" size="24" color="primary" />
                  </template>
                  <div>
                    <div class="text-heading-6 font-weight-medium">
                      {{ llm.name }} ({{ llm.level }})
                    </div>
                    <div class="text-caption text-medium-emphasis">
                      {{ llm.desc }}
                    </div>
                  </div>
                </div>
                <div class="d-flex align-center gap-2">
                  <VBtn variant="text" size="small" color="primary"
                    >detail</VBtn
                  >
                  <VCheckbox
                    v-model="selectedAssignedLLMs[index]"
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
import openaiLogo from '@/assets/images/logos/openai.png';
import aoaiLogo from '@/assets/images/logos/aoai.png';
// 필요시 props로 tenants, selectedTenant 받을 수 있음
// defineProps<{ tenants: any, selectedTenant: any }>()

// 사용 가능한 LLM 목록
const availableLLMs = ref([
  {
    id: 1,
    name: 'LLM 1',
    provider: 'Open AI',
    level: 'Dedicated',
    desc: 'LLM 1 is blah blah...',
    icon: openaiLogo,
    color: 'warning',
    variant: 'tonal',
    used: true,
  },
  {
    id: 2,
    name: 'LLM 2',
    provider: 'Open AI',
    level: 'Public',
    desc: 'LLM 1 is blah blah...',
    icon: openaiLogo,
    color: 'gray',
    variant: 'tonal',
    used: false,
  },
  {
    id: 3,
    name: 'LLM 3',
    provider: 'AOAI',
    level: 'Dedicated',
    desc: 'LLM 1 is blah blah...',
    icon: aoaiLogo,
    color: 'gray',
    variant: 'tonal',
    used: false,
  },
  {
    id: 4,
    name: 'LLM 4',
    provider: 'AOAI',
    level: 'Public',
    desc: 'LLM 1 is blah blah...',
    icon: aoaiLogo,
    color: 'warning',
    variant: 'tonal',
    used: true,
  },
  {
    id: 5,
    name: 'LLM 5',
    provider: 'Private',
    level: 'Private',
    desc: 'LLM 1 is blah blah...',
    icon: 'ri-bill-line',
    color: 'warning',
    variant: 'tonal',
    used: true,
  },
]);
const selectedLLMs = ref([true, false, false, true, true]);

// 배정된 LLM 목록(예시)
const assignedLLMs = ref([
  {
    id: 1,
    name: 'LLM 1',
    provider: 'Open AI',
    level: 'Dedicated',
    desc: 'LLM 1 is blah blah...',
    icon: openaiLogo,
  },
  {
    id: 4,
    name: 'LLM 4',
    provider: 'AOAI',
    level: 'Public',
    desc: 'LLM 1 is blah blah...',
    icon: aoaiLogo,
  },
  {
    id: 5,
    name: 'LLM 5',
    provider: 'Private',
    level: 'Private',
    desc: 'LLM 1 is blah blah...',
    icon: 'ri-bill-line',
  },
]);
const selectedAssignedLLMs = ref([false, false, false]);

// 전체선택 상태
const selectAllLeft = ref(false);
const selectAllRight = ref(false);

const hasSelectedLeft = computed(() => selectedLLMs.value.some(Boolean));
const hasSelectedRight = computed(() =>
  selectedAssignedLLMs.value.some(Boolean)
);
const allLeftSelected = computed(() => selectedLLMs.value.every(Boolean));
const allRightSelected = computed(() =>
  selectedAssignedLLMs.value.every(Boolean)
);

watch(selectAllLeft, val => {
  selectedLLMs.value = selectedLLMs.value.map(() => val);
});
watch(selectAllRight, val => {
  selectedAssignedLLMs.value = selectedAssignedLLMs.value.map(() => val);
});
watch(selectedLLMs, () => {
  selectAllLeft.value = allLeftSelected.value;
});
watch(selectedAssignedLLMs, () => {
  selectAllRight.value = allRightSelected.value;
});

function moveToRight() {
  // 선택된 LLM을 오른쪽(배정)으로 이동하는 로직 (예시)
  availableLLMs.value.forEach((llm, idx) => {
    if (
      selectedLLMs.value[idx] &&
      !assignedLLMs.value.find(a => a.id === llm.id)
    ) {
      assignedLLMs.value.push({ ...llm });
      selectedAssignedLLMs.value.push(false);
    }
  });
  selectedLLMs.value = selectedLLMs.value.map(() => false);
}
function moveToLeft() {
  // 선택된 배정된 LLM을 왼쪽(해제)으로 이동하는 로직 (예시)
  for (let i = assignedLLMs.value.length - 1; i >= 0; i--) {
    if (selectedAssignedLLMs.value[i]) {
      assignedLLMs.value.splice(i, 1);
      selectedAssignedLLMs.value.splice(i, 1);
    }
  }
}
function saveLLMAssignments() {
  // LLM 배정 저장 로직
  console.log('Save LLM assignments', assignedLLMs.value);
}
</script>
