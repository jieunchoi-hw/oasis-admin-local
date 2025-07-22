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
  VTextField as VTextFieldComponent,
} from 'vuetify/components';

// Mock 데이터
const users = ref([
  {
    id: 1,
    name: 'System Admin1',
    tenant: '한화시스템',
    email: '111@aaa.com',
    role: 'System Admin',
    updated: '2025-05-12 10:21',
    description: '한화그룹 총괄 Admin',
  },
  {
    id: 2,
    name: 'System Operator',
    tenant: '한화시스템',
    email: '222@aaa.com',
    role: 'System Operator',
    updated: '2025-05-12 10:21',
    description: '',
  },
  {
    id: 3,
    name: 'System Operator2',
    tenant: '한화시스템',
    email: '333@aaa.com',
    role: 'System Operator',
    updated: '2025-05-12 10:21',
    description: '',
  },
]);

const roles = ['System Admin', 'System Operator'];

// 테이블 컬럼 정의
const columns = [
  { key: 'name', label: '이름' },
  { key: 'tenant', label: 'Tenant 명' },
  { key: 'email', label: '이메일' },
  { key: 'role', label: '권한' },
  { key: 'updated', label: 'Last Updated' },
];

// 모달 필드 정의
const modalFields = [
  { key: 'name', label: '이름', type: 'text', required: true },
  { key: 'email', label: '이메일', type: 'text', required: true },
  {
    key: 'role',
    label: '권한',
    type: 'select',
    options: roles,
    required: true,
  },
];

// 검색/필터
const filterColumns = [
  { label: '이름', key: 'name' },
  { label: 'Tenant 명', key: 'tenant' },
  { label: '이메일', key: 'email' },
  { label: '권한', key: 'role' },
  { label: 'Last Updated', key: 'updated' },
];
const selectedColumn = ref(filterColumns[0]);
const searchValue = ref('');
const filteredUsers = computed(() => {
  if (!Array.isArray(users.value)) return [];
  if (!searchValue.value) return users.value;
  const key = selectedColumn.value.key;
  return users.value.filter(u =>
    String(u[key] ?? '').includes(searchValue.value)
  );
});

// 페이징
const page = ref(1);
const itemsPerPage = 5;
const totalItems = computed(() => filteredUsers.value.length);

// 다이얼로그 상태
const dialogAdd = ref(false);
const dialogEdit = ref(false);
const modalForm = ref({ name: '', email: '', role: roles[0] });

function openAddDialog() {
  modalForm.value = { name: '', email: '', role: roles[0] };
  dialogAdd.value = true;
}
function openEditDialog(user) {
  modalForm.value = { ...user };
  dialogEdit.value = true;
}
function handleAddConfirm(form) {
  users.value.push({
    id: Date.now(),
    name: form.name,
    tenant: '한화시스템',
    email: form.email,
    role: form.role,
    updated: new Date().toISOString().slice(0, 16).replace('T', ' '),
    description: '',
  });
  dialogAdd.value = false;
}
function handleEditConfirm(form) {
  const user = users.value.find(u => u.id === form.id);
  if (user) {
    Object.assign(user, form);
  }
  dialogEdit.value = false;
}
function handleDelete(user) {
  users.value = users.value.filter(u => u.id !== user.id);
}
function handlePageChange(val) {
  page.value = val;
}
function handleFormUpdate(updatedForm) {
  modalForm.value = updatedForm;
}
</script>

<template>
  <div class="pa-0">
    <!-- 상단 타이틀/설명 -->
    <div class="d-flex align-center mb-2">
      <h2 class="text-h4 font-weight-bold mr-2">System Admin 사용자 관리</h2>
      <VTooltip text="System Admin을 조회하고 권한을 관리하세요.">
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
      System Admin을 조회하고 권한을 관리하세요.
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
      :data="filteredUsers"
      :columns="columns"
      :page="page"
      :itemsPerPage="itemsPerPage"
      :totalItems="totalItems"
      :actions="['edit', 'delete']"
      @edit="openEditDialog"
      @delete="handleDelete"
      @page-change="handlePageChange"
    />

    <!-- 추가 다이얼로그 -->
    <CommonModal
      :visible="dialogAdd"
      mode="add"
      title="System Admin 추가"
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
        <VTextField
          v-model="form.email"
          label="이메일"
          class="mb-3"
          @update:model-value="val => updateForm('email', val)"
        />
        <VSelect
          v-model="form.role"
          :items="roles"
          label="권한"
          @update:model-value="val => updateForm('role', val)"
        />
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
          v-model="form.role"
          :items="roles"
          label="권한"
          class="mb-3"
          @update:model-value="val => updateForm('role', val)"
        />
        <VTextField
          v-model="form.description"
          label="Description"
          @update:model-value="val => updateForm('description', val)"
        />
      </template>
    </CommonModal>
  </div>
</template>

<style scoped></style>
