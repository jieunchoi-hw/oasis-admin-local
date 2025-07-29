<template>
  <div class="pa-0">
    <!-- 상단 타이틀/설명 -->
    <div class="d-flex align-center mb-2">
      <h2 class="text-h4 font-weight-bold mr-2">LLM 관리</h2>
      <VTooltip text="LLM을 조회하고 관리하세요.">
        <template #activator="{ props }">
          <VIcon
            v-bind="props"
            icon="ri-question-line"
            size="15"
            class="ms-0"
          />
        </template>
      </VTooltip>
    </div>
    <div class="mb-4 text-body-1 text-medium-emphasis">
      LLM을 조회하고 관리하세요.
    </div>

    <!-- 필터/검색 영역 -->
    <div class="d-flex align-center mb-4 mt-4 gap-2">
      <VBtn color="primary" @click="openAddDialog" style="min-width: 120px"
        >+ New</VBtn
      >
      <VSpacer />
      <VSelect
        v-model="selectedColumn"
        :items="filterColumns"
        item-title="label"
        item-value="key"
        style="max-width: 140px"
        density="compact"
      />
      <VTextField
        v-model="searchValue"
        label="검색어 입력"
        clearable
        density="compact"
        style="max-width: 200px"
        @keyup.enter="page = 1"
      />
      <VBtn variant="outlined" color="primary" @click="page = 1">검색</VBtn>
    </div>

    <!-- 공통 테이블 -->
    <CommonTable
      :data="filteredLLMs"
      :columns="columns"
      :page="page"
      :itemsPerPage="itemsPerPage"
      :totalItems="totalItems"
      :actions="['edit', 'delete']"
      @edit="openEditDialog"
      @delete="handleDelete"
      @page-change="handlePageChange"
      @action="
        ({ action, item }) =>
          action === 'toggle-control' && handleToggleControl(item)
      "
    >
      <!-- Level 컬럼 커스텀 렌더링 -->
      <template #cell-level="{ value }">
        <VChip :color="getLevelColor(value)" size="small" variant="tonal">
          {{ value }}
        </VChip>
      </template>

      <!-- Provider 컬럼 커스텀 렌더링 -->
      <template #cell-provider="{ value }">
        <span class="d-flex align-center gap-1">
          <img
            v-if="value === 'Open AI'"
            src="@/assets/images/logos/openai.png"
            alt="OpenAI"
            style="
              width: 20px;
              height: 20px;
              vertical-align: middle;
              margin-right: 4px;
            "
          />
          <img
            v-else-if="value === 'AOAI'"
            src="@/assets/images/logos/aoai.png"
            alt="AOAI"
            style="
              width: 20px;
              height: 20px;
              vertical-align: middle;
              margin-right: 4px;
            "
          />
          <span>{{ value }}</span>
        </span>
      </template>

      <!-- Control 컬럼 커스텀 렌더링 -->
      <template #cell-control="{ item }">
        <VSwitch
          v-if="item.level === 'Private'"
          v-model="item.control"
          @change="handleToggleControl(item)"
          color="primary"
          hide-details
        />
        <span v-else>-</span>
      </template>

      <!-- Status 컬럼 커스텀 렌더링 -->
      <template #cell-status="{ value }">
        <VChip
          v-if="value"
          :color="getStatusColor(value)"
          size="small"
          variant="tonal"
        >
          {{ value }}
        </VChip>
        <span v-else>-</span>
      </template>
    </CommonTable>

    <!-- 추가 다이얼로그 -->
    <CommonModal
      :visible="dialogAdd"
      mode="add"
      title="LLM 추가"
      :form="modalForm"
      :fields="modalFields"
      @confirm="handleAddConfirm"
      @close="dialogAdd = false"
      @update:form="handleFormUpdate"
    >
      <template #default="{ form, updateForm }">
        <VTextField
          v-model="form.name"
          label="이름"
          class="mb-3"
          @update:model-value="val => updateForm('name', val)"
        />
        <VSelect
          v-model="form.level"
          :items="levels"
          label="Level"
          class="mb-3"
          @update:model-value="val => updateForm('level', val)"
        />
        <VSelect
          v-model="form.provider"
          :items="providers"
          label="Provider"
          class="mb-3"
          @update:model-value="val => updateForm('provider', val)"
        />
        <VTextField
          v-model="form.credential"
          label="Credential"
          class="mb-3"
          @update:model-value="val => updateForm('credential', val)"
        />
        <VSelect
          v-model="form.status"
          :items="statuses"
          label="Status"
          class="mb-3"
          @update:model-value="val => updateForm('status', val)"
        />
        <div class="d-flex align-center">
          <VSwitch
            v-model="form.control"
            label="Control"
            color="primary"
            class="mr-2"
            @update:model-value="val => updateForm('control', val)"
          />
          <span class="text-caption text-medium-emphasis"
            >Private Level에서만 사용 가능</span
          >
        </div>
      </template>
    </CommonModal>

    <!-- 수정 다이얼로그 -->
    <CommonModal
      :visible="dialogEdit"
      mode="edit"
      :title="`${modalForm.name} 수정`"
      :form="modalForm"
      :fields="modalFields"
      @confirm="handleEditConfirm"
      @close="dialogEdit = false"
      @update:form="handleFormUpdate"
    >
      <template #default="{ form, updateForm }">
        <VSelect
          v-model="form.level"
          :items="levels"
          label="Level"
          class="mb-3"
          @update:model-value="val => updateForm('level', val)"
        />
        <VSelect
          v-model="form.provider"
          :items="providers"
          label="Provider"
          class="mb-3"
          @update:model-value="val => updateForm('provider', val)"
        />
        <VTextField
          v-model="form.credential"
          label="Credential"
          class="mb-3"
          @update:model-value="val => updateForm('credential', val)"
        />
        <VSelect
          v-model="form.status"
          :items="statuses"
          label="Status"
          class="mb-3"
          @update:model-value="val => updateForm('status', val)"
        />
        <div class="d-flex align-center">
          <VSwitch
            v-model="form.control"
            label="Control"
            color="primary"
            class="mr-2"
            @update:model-value="val => updateForm('control', val)"
          />
          <span class="text-caption text-medium-emphasis"
            >Private Level에서만 사용 가능</span
          >
        </div>
      </template>
    </CommonModal>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue';
import CommonTable from '@/components/CommonTable.vue';
import CommonModal from '@/components/CommonModal.vue';
import {
  VBtn,
  VSelect,
  VTextField,
  VTooltip,
  VIcon,
  VSpacer,
  VChip,
  VSwitch,
} from 'vuetify/components';

// Mock 데이터
const llms = ref([
  {
    id: 1,
    name: 'LLM1',
    level: 'Dedicated',
    provider: 'Open AI',
    credential: 'API-KEY1',
    control: false,
    status: '',
    updated: '2025-05-12 10:21',
  },
  {
    id: 2,
    name: 'LLM2',
    level: 'Public',
    provider: 'Open AI',
    credential: 'API-KEY2',
    control: false,
    status: '',
    updated: '2025-05-12 10:21',
  },
  {
    id: 3,
    name: 'LLM3',
    level: 'Dedicated',
    provider: 'AOAI',
    credential: 'API-KEY3',
    control: false,
    status: '',
    updated: '2025-05-12 10:21',
  },
  {
    id: 4,
    name: 'LLM4',
    level: 'Public',
    provider: 'AOAI',
    credential: 'API-KEY4',
    control: false,
    status: '',
    updated: '2025-05-12 10:21',
  },
  {
    id: 5,
    name: 'LLM5',
    level: 'Private',
    provider: '-',
    credential: '-',
    control: true,
    status: 'Running',
    updated: '2025-05-12 10:21',
  },
]);

const levels = ['Dedicated', 'Public', 'Private'];
const providers = ['Open AI', 'AOAI', '-'];
const statuses = ['Running', 'Stopped', 'Pending', ''];

// 테이블 컬럼 정의
const columns = [
  { key: 'name', label: '이름' },
  { key: 'level', label: 'Level' },
  { key: 'provider', label: 'Provider' },
  { key: 'credential', label: 'Credential' },
  { key: 'control', label: 'Control' },
  { key: 'status', label: 'Status' },
  { key: 'updated', label: 'Last Updated' },
];

// 모달 필드 정의
const modalFields = [
  { key: 'name', label: '이름', type: 'text', required: true },
  {
    key: 'level',
    label: 'Level',
    type: 'select',
    options: levels,
    required: true,
  },
  {
    key: 'provider',
    label: 'Provider',
    type: 'select',
    options: providers,
    required: true,
  },
  { key: 'credential', label: 'Credential', type: 'text', required: true },
  {
    key: 'status',
    label: 'Status',
    type: 'select',
    options: statuses,
    required: false,
  },
];

// 검색/필터
const filterColumns = [
  { label: '이름', key: 'name' },
  { label: 'Level', key: 'level' },
  { label: 'Provider', key: 'provider' },
  { label: 'Credential', key: 'credential' },
  { label: 'Status', key: 'status' },
];
const selectedColumn = ref(filterColumns[0]);
const searchValue = ref('');
const filteredLLMs = computed(() => {
  if (!Array.isArray(llms.value)) return [];
  if (!searchValue.value) return llms.value;
  const key = selectedColumn.value.key;
  return llms.value.filter(llm =>
    String(llm[key] ?? '').includes(searchValue.value)
  );
});

// 페이징
const page = ref(1);
const itemsPerPage = 5;
const totalItems = computed(() => filteredLLMs.value.length);

// 다이얼로그 상태
const dialogAdd = ref(false);
const dialogEdit = ref(false);
const modalForm = ref({
  name: '',
  level: levels[0],
  provider: '',
  credential: '',
  control: false,
  status: '',
});

function openAddDialog() {
  modalForm.value = {
    name: '',
    level: levels[0],
    provider: '',
    credential: '',
    control: false,
    status: '',
  };
  dialogAdd.value = true;
}
function openEditDialog(llm) {
  modalForm.value = { ...llm };
  dialogEdit.value = true;
}
function handleAddConfirm(form) {
  llms.value.push({
    id: Date.now(),
    name: form.name,
    level: form.level,
    provider: form.provider,
    credential: form.credential,
    control: form.control,
    status: form.status,
    updated: new Date().toISOString().slice(0, 16).replace('T', ' '),
  });
  dialogAdd.value = false;
}
function handleEditConfirm(form) {
  const llm = llms.value.find(l => l.id === form.id);
  if (llm) {
    Object.assign(llm, form);
  }
  dialogEdit.value = false;
}
function handleDelete(llm) {
  llms.value = llms.value.filter(l => l.id !== llm.id);
}
function handlePageChange(val) {
  page.value = val;
}
function handleToggleControl(llm) {
  if (llm.control) {
    llm.status = 'Running';
  } else {
    llm.status = 'Stopped';
  }
}
function handleFormUpdate(updatedForm) {
  modalForm.value = updatedForm;
}

// 커스텀 렌더링 함수들
function getLevelColor(level) {
  switch (level) {
    case 'Dedicated':
      return 'primary';
    case 'Public':
      return 'warning';
    case 'Private':
      return 'success';
    default:
      return 'default';
  }
}

function getStatusColor(status) {
  switch (status) {
    case 'Running':
      return 'success';
    case 'Stopped':
      return 'error';
    case 'Pending':
      return 'warning';
    default:
      return 'default';
  }
}
</script>

<style scoped></style>
