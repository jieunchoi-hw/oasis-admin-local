<script setup>
import { ref, computed } from "vue";
import {
  VIcon,
  VBtn,
  VDialog,
  VCard,
  VCardTitle,
  VCardText,
  VCardActions,
  VTextField,
  VSelect,
  VTooltip,
  VTable,
  VPagination,
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
const pagedUsers = computed(() => {
  const start = (page.value - 1) * itemsPerPage;
  return filteredUsers.value.slice(start, start + itemsPerPage);
});

// 다이얼로그 상태
const dialogAdd = ref(false);
const dialogEdit = ref(false);
const editUser = ref(null);

// 추가 폼
const addForm = ref({ name: "", email: "", role: roles[0] });
function openAddDialog() {
  addForm.value = { name: "", email: "", role: roles[0] };
  dialogAdd.value = true;
}
function confirmAdd() {
  users.value.push({
    id: Date.now(),
    name: addForm.value.name,
    tenant: "한화시스템",
    email: addForm.value.email,
    role: addForm.value.role,
    updated: new Date().toISOString().slice(0, 16).replace("T", " "),
    description: "",
  });
  dialogAdd.value = false;
}

// 수정 폼
const editForm = ref({ name: "", email: "", role: "", description: "" });
function openEditDialog(user) {
  editUser.value = user;
  editForm.value = { ...user };
  dialogEdit.value = true;
}
function confirmEdit() {
  Object.assign(editUser.value, editForm.value);
  dialogEdit.value = false;
}
function deleteUser(user) {
  users.value = users.value.filter((u) => u.id !== user.id);
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
    <VRow>
      <VCol cols="12">
        <VCard rounded="lg" elevation="1">
          <VTable class="mb-2" density="comfortable">
            <thead>
              <tr>
                <th>이름</th>
                <th>Tenant 명</th>
                <th>이메일</th>
                <th>권한</th>
                <th>Last Updated</th>
                <th>관리</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in pagedUsers" :key="user.id">
                <td>{{ user.name }}</td>
                <td>{{ user.tenant }}</td>
                <td>{{ user.email }}</td>
                <td>{{ user.role }}</td>
                <td>{{ user.updated }}</td>
                <td>
                  <VBtn
                    size="small"
                    variant="tonal"
                    color="primary"
                    @click="openEditDialog(user)"
                    >수정</VBtn
                  >
                  <VBtn
                    size="small"
                    variant="tonal"
                    color="error"
                    class="ml-2"
                    @click="deleteUser(user)"
                    >삭제</VBtn
                  >
                </td>
              </tr>
            </tbody>
          </VTable>
        </VCard>
      </VCol>
    </VRow>
    <!-- 유저 테이블 -->

    <!-- 페이징 -->
    <VPagination
      v-model="page"
      class="mt-4"
      :length="Math.ceil(filteredUsers.length / itemsPerPage)"
      size="small"
    />

    <!-- 추가 다이얼로그 -->
    <VDialog v-model="dialogAdd" max-width="400">
      <VCard>
        <VCardTitle class="d-flex align-center justify-space-between">
          <span class="font-weight-bold">System Admin 추가</span>
          <VBtn icon @click="dialogAdd = false"
            ><VIcon icon="ri-close-line"
          /></VBtn>
        </VCardTitle>
        <VCardText>
          <VTextField v-model="addForm.name" label="이름" class="mb-2" />
          <VTextField v-model="addForm.email" label="이메일" class="mb-2" />
          <VSelect v-model="addForm.role" :items="roles" label="권한" />
        </VCardText>
        <VCardActions class="justify-end">
          <VBtn color="black" @click="confirmAdd">Confirm</VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <!-- 수정 다이얼로그 -->
    <VDialog v-model="dialogEdit" max-width="400">
      <VCard>
        <VCardTitle class="d-flex align-center justify-space-between">
          <span class="font-weight-bold">[{{ editForm.name }}] 수정</span>
          <VBtn icon @click="dialogEdit = false"
            ><VIcon icon="ri-close-line"
          /></VBtn>
        </VCardTitle>
        <VCardText>
          <VSelect
            v-model="editForm.role"
            :items="roles"
            label="권한"
            class="mb-2"
          />
          <VTextField v-model="editForm.description" label="Description" />
        </VCardText>
        <VCardActions class="justify-end">
          <VBtn color="black" @click="confirmEdit">Save</VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </div>
</template>

<style scoped></style>
