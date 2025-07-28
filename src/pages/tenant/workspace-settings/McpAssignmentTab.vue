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
                  MCP1
                  <VChip color="success" size="small" class="ms-1">전사</VChip>
                </div>
                <div class="mt-2 mb-2">
                  <VSelect
                    v-model="mcp1Access"
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
                  MCP2
                  <VChip color="success" size="small" class="ms-1">전사</VChip>
                </div>
                <div class="mt-2 mb-2">
                  <VSelect
                    v-model="mcp2Access"
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
                  MCP3
                  <VChip color="success" size="small" class="ms-1">전사</VChip>
                </div>
                <div class="mt-2 mb-2">
                  <VSelect
                    v-model="mcp3Access"
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
                  MCP4
                  <VChip color="success" size="small" class="ms-1">전사</VChip>
                </div>
                <div class="mt-2 mb-2">
                  <VSelect
                    v-model="mcp4Access"
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
                <div class="mt-2">MCP5</div>
                <div class="mt-2 mb-2">
                  <VSelect
                    v-model="mcp5Access"
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
          <tr v-for="(department, index) in filteredDepartments" :key="index">
            <td>
              <VChip size="x-small" color="primary"> Sync </VChip>
            </td>
            <td>
              <div class="d-flex align-center">
                <div
                  class="department-indent"
                  :style="{
                    marginLeft: getIndentLevel(department.name) + 'px',
                  }"
                >
                  {{ getDisplayName(department.name) }}
                </div>
              </div>
            </td>
            <td class="text-center">
              <VSwitch
                v-model="department.mcp1"
                color="primary"
                hide-details
                density="compact"
                class="ma-0 pa-0 d-inline-block"
              />
            </td>
            <td class="text-center">
              <VSwitch
                v-model="department.mcp2"
                color="primary"
                hide-details
                density="compact"
                class="ma-0 pa-0 d-inline-block"
              />
            </td>
            <td class="text-center">
              <VSwitch
                v-model="department.mcp3"
                color="primary"
                hide-details
                density="compact"
                class="ma-0 pa-0 d-inline-block"
              />
            </td>
            <td class="text-center">
              <VSwitch
                v-model="department.mcp4"
                color="primary"
                hide-details
                density="compact"
                class="ma-0 pa-0 d-inline-block"
              />
            </td>
            <td class="text-center">
              <VSwitch
                v-model="department.mcp5"
                color="primary"
                hide-details
                density="compact"
                class="ma-0 pa-0 d-inline-block"
              />
            </td>
          </tr>
          <tr
            v-for="(customDept, index) in filteredCustomDepartments"
            :key="`custom-${index}`"
          >
            <td>
              <VChip size="x-small" color="warning">Custom</VChip>
            </td>
            <td>
              <div class="d-flex align-center">
                <div
                  class="department-indent"
                  :style="{
                    marginLeft: getIndentLevel(customDept.name) + 'px',
                  }"
                >
                  {{ getDisplayName(customDept.name) }}
                </div>
              </div>
            </td>
            <td class="text-center">
              <VSwitch
                v-model="customDept.mcp1"
                color="primary"
                hide-details
                density="compact"
                class="ma-0 pa-0 d-inline-block"
              />
            </td>
            <td class="text-center">
              <VSwitch
                v-model="customDept.mcp2"
                color="primary"
                hide-details
                density="compact"
                class="ma-0 pa-0 d-inline-block"
              />
            </td>
            <td class="text-center">
              <VSwitch
                v-model="customDept.mcp3"
                color="primary"
                hide-details
                density="compact"
                class="ma-0 pa-0 d-inline-block"
              />
            </td>
            <td class="text-center">
              <VSwitch
                v-model="customDept.mcp4"
                color="primary"
                hide-details
                density="compact"
                class="ma-0 pa-0 d-inline-block"
              />
            </td>
            <td class="text-center">
              <VSwitch
                v-model="customDept.mcp5"
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
import { ref, computed } from 'vue';

// 필터 상태
const filterText = ref('');

// MCP 접근 옵션
const accessOptions = [
  { title: '전체 허용', value: 'full' },
  { title: '일부 허용', value: 'partial' },
  { title: '미허용', value: 'none' },
];

// MCP 접근 설정
const mcp1Access = ref('full');
const mcp2Access = ref('partial');
const mcp3Access = ref('none');
const mcp4Access = ref('partial');
const mcp5Access = ref('full');

// 부서 데이터
const departments = ref([
  {
    name: '솔루션 사업부',
    mcp1: true, // 전체 허용
    mcp2: false, // 일부 허용
    mcp3: false, // 미허용
    mcp4: false, // 일부 허용
    mcp5: true, // 전체 허용
  },
  {
    name: '-솔루션사업개발팀',
    mcp1: true, // 전체 허용
    mcp2: true, // 일부 허용
    mcp3: false, // 미허용
    mcp4: true, // 일부 허용
    mcp5: true, // 전체 허용
  },
  {
    name: '-ERP사업팀',
    mcp1: true, // 전체 허용
    mcp2: true, // 일부 허용
    mcp3: false, // 미허용
    mcp4: true, // 일부 허용
    mcp5: true, // 전체 허용
  },
  {
    name: '-PMO파트',
    mcp1: true, // 전체 허용
    mcp2: false, // 일부 허용
    mcp3: false, // 미허용
    mcp4: true, // 일부 허용
    mcp5: true, // 전체 허용
  },
  {
    name: '-제무(FCM) 파트',
    mcp1: true, // 전체 허용
    mcp2: true, // 일부 허용
    mcp3: false, // 미허용
    mcp4: true, // 일부 허용
    mcp5: true, // 전체 허용
  },
  {
    name: '-물류(SCM) 파트',
    mcp1: true, // 전체 허용
    mcp2: true, // 일부 허용
    mcp3: false, // 미허용
    mcp4: true, // 일부 허용
    mcp5: true, // 전체 허용
  },
  {
    name: '-개발팀',
    mcp1: true, // 전체 허용
    mcp2: true, // 일부 허용
    mcp3: false, // 미허용
    mcp4: true, // 일부 허용
    mcp5: true, // 전체 허용
  },
  {
    name: '-테스트팀',
    mcp1: true, // 전체 허용
    mcp2: true, // 일부 허용
    mcp3: false, // 미허용
    mcp4: false, // 일부 허용
    mcp5: true, // 전체 허용
  },
]);

// 커스텀 부서 데이터
const customDepartments = ref([
  {
    name: '--XXX프로젝트 TF',
    mcp1: true, // 전체 허용
    mcp2: true, // 일부 허용
    mcp3: false, // 미허용
    mcp4: false, // 일부 허용
    mcp5: true, // 전체 허용
  },
  {
    name: '--XXX프로젝트 하위 파트',
    mcp1: true, // 전체 허용
    mcp2: false, // 일부 허용
    mcp3: false, // 미허용
    mcp4: true, // 일부 허용
    mcp5: true, // 전체 허용
  },
  {
    name: '--YYY프로젝트 TF',
    mcp1: true, // 전체 허용
    mcp2: true, // 일부 허용
    mcp3: false, // 미허용
    mcp4: true, // 일부 허용
    mcp5: true, // 전체 허용
  },
]);

// 필터링된 부서 데이터
const filteredDepartments = computed(() => {
  if (!filterText.value) return departments.value;

  const query = filterText.value.toLowerCase();
  return departments.value.filter(dept =>
    dept.name.toLowerCase().includes(query)
  );
});

// 필터링된 커스텀 부서 데이터
const filteredCustomDepartments = computed(() => {
  if (!filterText.value) return customDepartments.value;

  const query = filterText.value.toLowerCase();
  return customDepartments.value.filter(dept =>
    dept.name.toLowerCase().includes(query)
  );
});

// 들여쓰기 레벨 계산 함수
const getIndentLevel = name => {
  const dashCount = (name.match(/-/g) || []).length;
  return dashCount * 20; // 대시 하나당 20px 들여쓰기
};

// 표시용 부서명 추출 함수 (대시 제거)
const getDisplayName = name => {
  return name.replace(/^-+/, ''); // 앞의 대시들 제거
};
</script>

<style scoped>
.llm-select {
  width: 150px;
}

.department-indent {
  transition: margin-left 0.3s ease;
}
</style>
