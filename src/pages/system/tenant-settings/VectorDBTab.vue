<template>
  <div>
    <!-- 상단 설명 및 Save 버튼 -->
    <div class="d-flex justify-space-between align-center mb-4">
      <div class="text-body-2 text-medium-emphasis">
        ■ 한화시스템에서 사용하는 Vector DB를 배정한다.
      </div>
      <VBtn color="primary" @click="saveVectorDBAssignments"> Save </VBtn>
    </div>
    <div class="d-flex gap-4" style="height: 600px">
      <!-- 왼쪽 패널: 사용 가능한 Vector DB -->
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
              v-for="(db, index) in vectorDBs"
              :key="db.id"
              class="pa-3"
              :color="db.color"
              v-bind="db.variant ? { variant: db.variant } : {}"
            >
              <div class="d-flex align-center justify-space-between">
                <div class="d-flex align-center gap-3">
                  <VIcon :icon="db.icon" size="24" color="primary" />
                  <div>
                    <div class="text-heading-6 font-weight-medium">
                      {{ db.name }}
                    </div>
                    <div class="text-caption text-medium-emphasis">
                      {{ db.desc }}
                    </div>
                  </div>
                </div>
                <div class="d-flex align-center gap-2">
                  <VBtn variant="text" size="small" color="primary"
                    >detail</VBtn
                  >
                  <VCheckbox
                    v-model="selectedVectorDBs[index]"
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
      <!-- 오른쪽 패널: 배정된 Vector DB -->
      <div class="flex-grow-1 d-flex flex-column">
        <div class="d-flex align-center justify-end mb-3 me-3">
          <VBtn variant="text" size="small"> 전체선택 </VBtn>
          <VCheckbox v-model="selectAllRight" color="primary" hide-details />
        </div>
        <div class="flex-grow-1 overflow-y-auto">
          <div class="d-flex flex-column gap-3">
            <VCard
              v-for="(db, index) in assignedVectorDBs"
              :key="db.id"
              class="pa-3"
              v-bind="db.variant ? { variant: db.variant } : {}"
            >
              <div class="d-flex align-center justify-space-between">
                <div class="d-flex align-center gap-3">
                  <VIcon :icon="db.icon" size="24" color="primary" />
                  <div>
                    <div class="text-heading-6 font-weight-medium">
                      {{ db.name }}
                    </div>
                    <div class="text-caption text-medium-emphasis">
                      {{ db.desc }}
                    </div>
                  </div>
                </div>
                <div class="d-flex align-center gap-2">
                  <VBtn variant="text" size="small" color="primary"
                    >detail</VBtn
                  >
                  <VCheckbox
                    v-model="selectedAssignedVectorDBs[index]"
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

const vectorDBs = ref([
  {
    id: 1,
    name: 'Vector DB 1',
    desc: 'Vector DB 1 is blah blah...',
    icon: 'ri-database-2-line',
    color: 'info',
    variant: 'tonal',
  },
  {
    id: 2,
    name: 'Vector DB 2',
    desc: 'Vector DB 2 is blah blah...',
    icon: 'ri-database-2-line',
    color: 'gray',
  },
  {
    id: 3,
    name: 'Vector DB 3',
    desc: 'Vector DB 3 is blah blah...',
    icon: 'ri-database-2-line',
  },
  {
    id: 4,
    name: 'Vector DB 4',
    desc: 'Vector DB 4 is blah blah...',
    icon: 'ri-database-2-line',
    color: 'info',
    variant: 'tonal',
  },
  {
    id: 5,
    name: 'Vector DB 5',
    desc: 'Vector DB 5 is blah blah...',
    icon: 'ri-database-2-line',
    color: 'info',
    variant: 'tonal',
  },
]);
const selectedVectorDBs = ref([true, false, false, true, true]);

const assignedVectorDBs = ref([
  {
    id: 1,
    name: 'Vector DB 1',
    desc: 'Vector DB 1 is blah blah...',
    icon: 'ri-database-2-line',
    color: 'info',
  },
  {
    id: 4,
    name: 'Vector DB 4',
    desc: 'Vector DB 4 is blah blah...',
    icon: 'ri-database-2-line',
    color: 'info',
  },
  {
    id: 5,
    name: 'Vector DB 5',
    desc: 'Vector DB 5 is blah blah...',
    icon: 'ri-database-2-line',
    color: 'info',
  },
]);
const selectedAssignedVectorDBs = ref([false, false, false]);

const selectAllLeft = ref(false);
const selectAllRight = ref(false);

const hasSelectedLeft = computed(() => selectedVectorDBs.value.some(Boolean));
const hasSelectedRight = computed(() =>
  selectedAssignedVectorDBs.value.some(Boolean)
);
const allLeftSelected = computed(() => selectedVectorDBs.value.every(Boolean));
const allRightSelected = computed(() =>
  selectedAssignedVectorDBs.value.every(Boolean)
);

watch(selectAllLeft, val => {
  selectedVectorDBs.value = selectedVectorDBs.value.map(() => val);
});
watch(selectAllRight, val => {
  selectedAssignedVectorDBs.value = selectedAssignedVectorDBs.value.map(
    () => val
  );
});
watch(selectedVectorDBs, () => {
  selectAllLeft.value = allLeftSelected.value;
});
watch(selectedAssignedVectorDBs, () => {
  selectAllRight.value = allRightSelected.value;
});

function moveToRight() {
  vectorDBs.value.forEach((db, idx) => {
    if (
      selectedVectorDBs.value[idx] &&
      !assignedVectorDBs.value.find(a => a.id === db.id)
    ) {
      assignedVectorDBs.value.push({ ...db });
      selectedAssignedVectorDBs.value.push(false);
    }
  });
  selectedVectorDBs.value = selectedVectorDBs.value.map(() => false);
}
function moveToLeft() {
  for (let i = assignedVectorDBs.value.length - 1; i >= 0; i--) {
    if (selectedAssignedVectorDBs.value[i]) {
      assignedVectorDBs.value.splice(i, 1);
      selectedAssignedVectorDBs.value.splice(i, 1);
    }
  }
}
function saveVectorDBAssignments() {
  console.log('Save Vector DB assignments', assignedVectorDBs.value);
}
</script>
