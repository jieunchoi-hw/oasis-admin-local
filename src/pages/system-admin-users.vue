<script setup>
import { ref, computed } from "vue";
import UserTable from "../components/UserTable.vue";
import UserModal from "../components/UserModal.vue";
import {
  VBtn,
  VSelect,
  VTextField,
  VTooltip,
  VIcon,
  VSpacer,
  VRow,
  VCol,
  VCard,
} from "vuetify/components";

// Mock 데이터
const users = ref([
  {
    id: 1,
    name: "System Admin1",
    tenant: "한화시스템",
    email: "111@aaa.com",
    role: "System Admin",
    updated: "2025-05-12 10:21",
    description: "한화그룹 총괄 Admin",
  },
  {
    id: 2,
    name: "System Operator",
    tenant: "한화시스템",
    email: "222@aaa.com",
    role: "System Operator",
    updated: "2025-05-12 10:21",
    description: "",
  },
  {
    id: 3,
    name: "System Operator2",
    tenant: "한화시스템",
    email: "333@aaa.com",
    role: "System Operator",
    updated: "2025-05-12 10:21",
    description: "",
  },
]);

const roles = ["System Admin", "System Operator"];

// 검색/필터
const filterColumns = [
  { label: "이름", key: "name" },
  { label: "Tenant 명", key: "tenant" },
  { label: "이메일", key: "email" },
  { label: "권한", key: "role" },
  { label: "Last Updated", key: "updated" },
];
const selectedColumn = ref(filterColumns[0]);
const searchValue = ref("");
const filteredUsers = computed(() => {
  if (!Array.isArray(users.value)) return [];
  if (!searchValue.value) return users.value;
  const key = selectedColumn.value.key;
  return users.value.filter((u) =>
    String(u[key] ?? "").includes(searchValue.value)
  );
});

// 페이징
const page = ref(1);
const itemsPerPage = 5;
const totalItems = computed(() => filteredUsers.value.length);

// 다이얼로그 상태
const dialogAdd = ref(false);
const dialogEdit = ref(false);
const editUser = ref(null);

// 추가/수정 모드
const modalMode = ref("add");
const modalUser = ref(null);

function openAddDialog() {
  modalMode.value = "add";
  modalUser.value = null;
  dialogAdd.value = true;
}
function openEditDialog(user) {
  modalMode.value = "edit";
  modalUser.value = user;
  dialogEdit.value = true;
}
function handleAddConfirm(form) {
  users.value.push({
    id: Date.now(),
    name: form.name,
    tenant: "한화시스템",
    email: form.email,
    role: form.role,
    updated: new Date().toISOString().slice(0, 16).replace("T", " "),
    description: "",
  });
  dialogAdd.value = false;
}
function handleEditConfirm(form) {
  if (modalUser.value) {
    Object.assign(modalUser.value, form);
  }
  dialogEdit.value = false;
}
function handleDelete(user) {
  users.value = users.value.filter((u) => u.id !== user.id);
}
function handlePageChange(val) {
  page.value = val;
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
    <UserTable
      :users="filteredUsers"
      :page="page"
      :itemsPerPage="itemsPerPage"
      :totalItems="totalItems"
      @edit="openEditDialog"
      @delete="handleDelete"
      @page-change="handlePageChange"
    />

    <!-- 추가 다이얼로그 -->
    <UserModal
      :visible="dialogAdd"
      mode="add"
      :roles="roles"
      @confirm="handleAddConfirm"
      @close="dialogAdd = false"
    />
    <!-- 수정 다이얼로그 -->
    <UserModal
      :visible="dialogEdit"
      mode="edit"
      :user="modalUser"
      :roles="roles"
      @confirm="handleEditConfirm"
      @close="dialogEdit = false"
    />
  </div>
</template>

<style scoped></style>
