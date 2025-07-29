<template>
  <div>
    <div class="mb-4 text-body-2 text-medium-emphasis">
      ■ Workspace Admin/Operator를 지정하거나 삭제한다.
    </div>
    <!-- 필터/검색 영역 -->
    <div class="d-flex align-center mb-4 gap-2">
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
        label="사용자 검색"
        clearable
        density="compact"
        style="max-width: 200px"
        @keyup.enter="page = 1"
      />
      <VBtn variant="outlined" color="primary" @click="page = 1">검색</VBtn>
    </div>
    <!-- 공통 테이블 -->
    <CommonTable
      :data="filteredAdmins"
      :columns="columns"
      :page="page"
      :itemsPerPage="itemsPerPage"
      :totalItems="totalItems"
      :actions="['edit', 'delete']"
      @edit="openEditDialog"
      @delete="handleDelete"
      @page-change="handlePageChange"
    />
    <!-- 추가/수정 다이얼로그 -->
    <CommonModal
      :visible="dialogAdd"
      mode="add"
      title="Workspace Admin 추가"
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
          v-model="form.userId"
          label="ID"
          class="mb-3"
          @update:model-value="val => updateForm('userId', val)"
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
          class="mb-3"
          @update:model-value="val => updateForm('role', val)"
        />
      </template>
    </CommonModal>
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
        <VTextField
          v-model="form.name"
          label="이름"
          class="mb-3"
          @update:model-value="val => updateForm('name', val)"
        />
        <VTextField
          v-model="form.userId"
          label="ID"
          class="mb-3"
          @update:model-value="val => updateForm('userId', val)"
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
          class="mb-3"
          @update:model-value="val => updateForm('role', val)"
        />
      </template>
    </CommonModal>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue';
import CommonTable from '@/components/CommonTable.vue';
import CommonModal from '@/components/CommonModal.vue';
import { VBtn, VSelect, VTextField, VSpacer } from 'vuetify/components';

// props: workspaces, selectedWorkspace 등 필요시 받을 수 있음
// defineProps<{ workspaces: any, selectedWorkspace: any }>()

const workspaceAdmins = ref([
  {
    id: 1,
    name: '최지은',
    userId: 'choijieun',
    email: '111@aaa.com',
    role: 'Workspace Admin',
    updated: '2025-05-12 10:21',
  },
  {
    id: 2,
    name: '김종성',
    userId: 'ziippy',
    email: 'ziippy@hanwha.com',
    role: 'Workspace Operator',
    updated: '2025-05-12 10:21',
  },
  {
    id: 3,
    name: '민지영',
    userId: 'gzeromin',
    email: 'gzeromin@hanwha.com',
    role: 'Workspace Operator',
    updated: '2025-05-12 10:21',
  },
]);

const roles = ['Workspace Admin', 'Workspace Operator'];
const columns = [
  { key: 'name', label: '이름' },
  { key: 'userId', label: 'ID' },
  { key: 'email', label: '이메일' },
  { key: 'role', label: '권한' },
  { key: 'updated', label: 'Last Updated' },
];
const modalFields = [
  { key: 'name', label: '이름', type: 'text', required: true },
  { key: 'userId', label: 'ID', type: 'text', required: true },
  { key: 'email', label: '이메일', type: 'text', required: true },
  {
    key: 'role',
    label: '권한',
    type: 'select',
    options: roles,
    required: true,
  },
];
const filterColumns = [
  { label: '이름', key: 'name' },
  { label: 'ID', key: 'userId' },
  { label: '이메일', key: 'email' },
  { label: '권한', key: 'role' },
];
const selectedColumn = ref(filterColumns[0]);
const searchValue = ref('');
const filteredAdmins = computed(() => {
  if (!Array.isArray(workspaceAdmins.value)) return [];
  if (!searchValue.value) return workspaceAdmins.value;
  const key = selectedColumn.value.key;
  return workspaceAdmins.value.filter(admin =>
    String(admin[key] ?? '').includes(searchValue.value)
  );
});
const page = ref(1);
const itemsPerPage = 5;
const totalItems = computed(() => filteredAdmins.value.length);
const dialogAdd = ref(false);
const dialogEdit = ref(false);
const modalForm = ref({
  name: '',
  userId: '',
  email: '',
  role: roles[0],
});
function openAddDialog() {
  modalForm.value = {
    name: '',
    userId: '',
    email: '',
    role: roles[0],
  };
  dialogAdd.value = true;
}
function openEditDialog(admin) {
  modalForm.value = { ...admin };
  dialogEdit.value = true;
}
function handleAddConfirm(form) {
  workspaceAdmins.value.push({
    id: Date.now(),
    name: form.name,
    userId: form.userId,
    email: form.email,
    role: form.role,
    updated: new Date().toISOString().slice(0, 16).replace('T', ' '),
  });
  dialogAdd.value = false;
}
function handleEditConfirm(form) {
  const admin = workspaceAdmins.value.find(a => a.id === form.id);
  if (admin) {
    Object.assign(admin, form);
  }
  dialogEdit.value = false;
}
function handleDelete(admin) {
  workspaceAdmins.value = workspaceAdmins.value.filter(a => a.id !== admin.id);
}
function handlePageChange(val) {
  page.value = val;
}
function handleFormUpdate(updatedForm) {
  modalForm.value = updatedForm;
}
</script>
