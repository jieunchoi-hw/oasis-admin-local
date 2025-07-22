<template>
  <div>
    <!-- 상단 설명 및 Save 버튼 -->
    <div class="d-flex justify-space-between align-center mb-4">
      <div class="text-body-2 text-medium-emphasis">
        ■ 한화시스템에서 사용하는 공식 비서를 배정한다.
      </div>
      <VBtn color="primary" @click="saveSecretaryAssignments"> Save </VBtn>
    </div>
    <div class="d-flex gap-4" style="height: 600px">
      <!-- 왼쪽 패널: 사용 가능한 비서 -->
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
              v-for="(secretary, index) in secretaries"
              :key="secretary.id"
              :color="secretary.color"
              v-bind="secretary.variant ? { variant: secretary.variant } : {}"
              class="pa-3"
            >
              <div class="d-flex align-center justify-space-between">
                <div class="d-flex align-center gap-3">
                  <VIcon icon="ri-robot-2-line" size="24" color="primary" />
                  <div>
                    <div class="text-heading-6 font-weight-medium">
                      {{ secretary.name }}
                    </div>
                    <div class="text-caption text-medium-emphasis mb-1">
                      {{ secretary.description }}
                    </div>
                    <div class="d-flex flex-wrap gap-1 mb-1">
                      <VChip
                        v-for="cap in secretary.capabilities.slice(0, 2)"
                        :key="cap"
                        size="x-small"
                        variant="tonal"
                        color="grey"
                      >
                        {{ cap }}
                      </VChip>
                    </div>
                    <div class="text-caption text-medium-emphasis">
                      월 이용: {{ secretary.monthlyUsage }}회
                    </div>
                    <div class="text-caption text-disabled">
                      업데이트: {{ secretary.updated }}
                    </div>
                  </div>
                </div>
                <div class="d-flex align-center gap-2">
                  <VBtn variant="text" size="small" color="primary"
                    >detail</VBtn
                  >
                  <VCheckbox
                    v-model="selectedSecretaries[index]"
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
          size="large"
          prepend-icon="ri-arrow-right-line"
          :disabled="!hasSelectedLeft"
          @click="moveToRight"
        />
        <VBtn
          color="primary"
          variant="outlined"
          size="large"
          prepend-icon="ri-arrow-left-line"
          :disabled="!hasSelectedRight"
          @click="moveToLeft"
        />
      </div>
      <!-- 오른쪽 패널: 배정된 비서 -->
      <div class="flex-grow-1 d-flex flex-column">
        <div class="d-flex align-center justify-end mb-3 me-3">
          <VBtn variant="text" size="small"> 전체선택 </VBtn>
          <VCheckbox v-model="selectAllRight" color="primary" hide-details />
        </div>
        <div class="flex-grow-1 overflow-y-auto">
          <div class="d-flex flex-column gap-3">
            <VCard
              v-for="(secretary, index) in assignedSecretaries"
              :key="secretary.id"
              class="pa-3"
            >
              <div class="d-flex align-center justify-space-between">
                <div class="d-flex align-center gap-3">
                  <VIcon icon="ri-user-3-line" size="24" color="primary" />
                  <div>
                    <div class="text-heading-6 font-weight-medium">
                      {{ secretary.name }}
                    </div>
                    <div class="text-caption text-medium-emphasis mb-1">
                      {{ secretary.description }}
                    </div>
                    <div class="d-flex flex-wrap gap-1 mb-1">
                      <VChip
                        v-for="cap in secretary.capabilities.slice(0, 2)"
                        :key="cap"
                        size="x-small"
                        variant="tonal"
                        color="grey"
                      >
                        {{ cap }}
                      </VChip>
                    </div>
                    <div class="text-caption text-medium-emphasis">
                      월 이용: {{ secretary.monthlyUsage }}회
                    </div>
                    <div class="text-caption text-disabled">
                      업데이트: {{ secretary.updated }}
                    </div>
                  </div>
                </div>
                <div class="d-flex align-center gap-2">
                  <VBtn variant="text" size="small" color="primary"
                    >detail</VBtn
                  >
                  <VCheckbox
                    v-model="selectedAssignedSecretaries[index]"
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

const secretaries = ref([
  {
    id: 1,
    name: '전사 업무 규정',
    description: '회사 업무 규정 Q&A, 업무 담당자 검색 등 전사 공통 업무 비서',
    capabilities: [
      '첨부된 파일 기반 질문/답변',
      '실시간 검색 + 이미지 생성/편집 능력',
    ],
    monthlyUsage: 100,
    updated: '2025-05-12 10:21',
    color: 'primary',
    variant: 'tonal',
  },
  {
    id: 2,
    name: '키워드 검색',
    description: '키워드만 넣으면 핵심 정보와 최신 소식 정리',
    capabilities: [
      '첨부된 파일 기반 질문/답변',
      '실시간 검색 + 이미지 생성/편집 능력',
    ],
    monthlyUsage: 100,
    updated: '2025-05-12 10:21',
  },
  {
    id: 3,
    name: '데이터 분석',
    description: '엑셀/CSV 올리고 분석, 편집 요청',
    capabilities: [
      '첨부된 파일 기반 질문/답변',
      '실시간 검색 + 이미지 생성/편집 능력',
    ],
    monthlyUsage: 200,
    updated: '2025-05-12 10:21',
  },
]);
const selectedSecretaries = ref([true, false, false]);

const assignedSecretaries = ref([
  {
    id: 1,
    name: '전사 업무 규정',
    description: '회사 업무 규정 Q&A, 업무 담당자 검색 등 전사 공통 업무 비서',
    capabilities: [
      '첨부된 파일 기반 질문/답변',
      '실시간 검색 + 이미지 생성/편집 능력',
    ],
    monthlyUsage: 100,
    updated: '2025-05-12 10:21',
  },
]);
const selectedAssignedSecretaries = ref([false]);

const selectAllLeft = ref(false);
const selectAllRight = ref(false);

const hasSelectedLeft = computed(() => selectedSecretaries.value.some(Boolean));
const hasSelectedRight = computed(() =>
  selectedAssignedSecretaries.value.some(Boolean)
);
const allLeftSelected = computed(() =>
  selectedSecretaries.value.every(Boolean)
);
const allRightSelected = computed(() =>
  selectedAssignedSecretaries.value.every(Boolean)
);

watch(selectAllLeft, val => {
  selectedSecretaries.value = selectedSecretaries.value.map(() => val);
});
watch(selectAllRight, val => {
  selectedAssignedSecretaries.value = selectedAssignedSecretaries.value.map(
    () => val
  );
});
watch(selectedSecretaries, () => {
  selectAllLeft.value = allLeftSelected.value;
});
watch(selectedAssignedSecretaries, () => {
  selectAllRight.value = allRightSelected.value;
});

function moveToRight() {
  secretaries.value.forEach((sec, idx) => {
    if (
      selectedSecretaries.value[idx] &&
      !assignedSecretaries.value.find(a => a.id === sec.id)
    ) {
      assignedSecretaries.value.push({ ...sec });
      selectedAssignedSecretaries.value.push(false);
    }
  });
  selectedSecretaries.value = selectedSecretaries.value.map(() => false);
}
function moveToLeft() {
  for (let i = assignedSecretaries.value.length - 1; i >= 0; i--) {
    if (selectedAssignedSecretaries.value[i]) {
      assignedSecretaries.value.splice(i, 1);
      selectedAssignedSecretaries.value.splice(i, 1);
    }
  }
}
function saveSecretaryAssignments() {
  console.log('Save Secretary assignments', assignedSecretaries.value);
}
</script>
