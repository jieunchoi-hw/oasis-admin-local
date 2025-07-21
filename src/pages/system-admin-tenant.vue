<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import CommonTable from "../components/CommonTable.vue";
import CommonModal from "../components/CommonModal.vue";
import {
  VBtn,
  VSelect,
  VTextField,
  VTooltip,
  VIcon,
  VSpacer,
  VChip,
} from "vuetify/components";

// Mock 데이터
const tenants = ref([
  {
    id: 1,
    name: "한화시스템",
    description: "한화시스템 테넌트",
    integratedSecretary: 7,
    allowedLLMLevel: "Public",
    updated: "2025-05-12 10:21",
  },
  {
    id: 2,
    name: "한화비전",
    description: "한화시스템 비전",
    integratedSecretary: 12,
    allowedLLMLevel: "Dedicated",
    updated: "2025-05-12 10:21",
  },
  {
    id: 3,
    name: "한화오션",
    description: "한화시스템 오션 테스트",
    integratedSecretary: 5,
    allowedLLMLevel: "Private",
    updated: "2025-05-12 10:21",
  },
]);

const llmLevels = ["Public", "Dedicated", "Private"];

// 테이블 컬럼 정의
const columns = [
  { key: "name", label: "Tenant 명" },
  { key: "description", label: "설명" },
  { key: "integratedSecretary", label: "연동 비서" },
  { key: "allowedLLMLevel", label: "허용 LLM Level" },
  { key: "updated", label: "Last Updated" },
];

// 모달 필드 정의
const modalFields = [
  { key: "name", label: "Tenant 명", type: "text", required: true },
  { key: "description", label: "설명", type: "textarea", required: true },
  {
    key: "allowedLLMLevel",
    label: "허용 LLM Level",
    type: "select",
    options: llmLevels,
    required: true,
  },
];

// 검색/필터
const filterColumns = [
  { label: "Tenant 명", key: "name" },
  { label: "설명", key: "description" },
  { label: "허용 LLM Level", key: "allowedLLMLevel" },
];
const selectedColumn = ref(filterColumns[0]);
const searchValue = ref("");
const filteredTenants = computed(() => {
  if (!Array.isArray(tenants.value)) return [];
  if (!searchValue.value) return tenants.value;
  const key = selectedColumn.value.key;
  return tenants.value.filter((tenant) =>
    String(tenant[key] ?? "").includes(searchValue.value)
  );
});

// 페이징
const page = ref(1);
const itemsPerPage = 5;
const totalItems = computed(() => filteredTenants.value.length);

// 다이얼로그 상태
const dialogAdd = ref(false);
const dialogEdit = ref(false);
const modalForm = ref({
  name: "",
  description: "",
  allowedLLMLevel: llmLevels[0],
});

function openAddDialog() {
  modalForm.value = {
    name: "",
    description: "",
    allowedLLMLevel: llmLevels[0],
  };
  dialogAdd.value = true;
}
function openEditDialog(tenant) {
  modalForm.value = { ...tenant };
  dialogEdit.value = true;
}
function handleAddConfirm(form) {
  tenants.value.push({
    id: Date.now(),
    name: form.name,
    description: form.description,
    integratedSecretary: 0,
    allowedLLMLevel: form.allowedLLMLevel,
    updated: new Date().toISOString().slice(0, 16).replace("T", " "),
  });
  dialogAdd.value = false;
}
function handleEditConfirm(form) {
  const tenant = tenants.value.find((t) => t.id === form.id);
  if (tenant) {
    Object.assign(tenant, form);
  }
  dialogEdit.value = false;
}
function handleDelete(tenant) {
  tenants.value = tenants.value.filter((t) => t.id !== tenant.id);
}
function handlePageChange(val) {
  page.value = val;
}
function handleFormUpdate(updatedForm) {
  modalForm.value = updatedForm;
}
const router = useRouter();

function goToSettings(tenant) {
  // 테넌트 설정 페이지로 이동하는 로직
  console.log("Go to settings for:", tenant.name);
  // 실제로는 라우터를 통해 이동
  router.push(`/system/tenant-settings/admin-users?tenantId=${tenant.id}`);
}

// 커스텀 렌더링 함수들
function getLLMLevelColor(level) {
  switch (level) {
    case "Public":
      return "warning";
    case "Dedicated":
      return "primary";
    case "Private":
      return "success";
    default:
      return "default";
  }
}
</script>

<template>
  <div class="pa-0">
    <!-- 상단 타이틀/설명 -->
    <div class="d-flex align-center mb-2">
      <h2 class="text-h4 font-weight-bold mr-2">Tenant 관리</h2>
      <VTooltip text="Tenant를 조회하고 관리하세요.">
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
      Tenant를 조회하고 관리하세요.
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
      :data="filteredTenants"
      :columns="columns"
      :page="page"
      :itemsPerPage="itemsPerPage"
      :totalItems="totalItems"
      :actions="['edit', 'delete']"
      @edit="openEditDialog"
      @delete="handleDelete"
      @page-change="handlePageChange"
    >
      <!-- Tenant 명 컬럼 커스텀 렌더링 -->
      <template #cell-name="{ value, item }">
        <div class="d-flex align-center">
          <span class="mr-2">{{ value }}</span>
          <VTooltip text="Tenant 설정으로 이동">
            <template #activator="{ props }">
              <VBtn
                v-bind="props"
                size="x-small"
                variant="text"
                color="primary"
                icon
                @click="goToSettings(item)"
              >
                <VIcon size="16" icon="ri-external-link-line" />
              </VBtn>
            </template>
          </VTooltip>
        </div>
      </template>

      <!-- 허용 LLM Level 컬럼 커스텀 렌더링 -->
      <template #cell-allowedLLMLevel="{ value }">
        <VChip :color="getLLMLevelColor(value)" size="small" variant="tonal">
          {{ value }}
        </VChip>
      </template>

      <!-- 연동 비서 컬럼 커스텀 렌더링 -->
      <template #cell-integratedSecretary="{ value }">
        <span class="font-weight-medium">{{ value }}</span>
      </template>

      <!-- 관리 컬럼 커스텀 렌더링 -->
      <template #cell-management="{ item }">
        <VBtn
          size="small"
          variant="text"
          color="primary"
          @click="goToSettings(item)"
        >
          설정페이지로 이동
        </VBtn>
      </template>
    </CommonTable>

    <!-- 추가 다이얼로그 -->
    <CommonModal
      :visible="dialogAdd"
      mode="add"
      title="Tenant 추가"
      :form="modalForm"
      :fields="modalFields"
      @confirm="handleAddConfirm"
      @close="dialogAdd = false"
      @update:form="handleFormUpdate"
    >
      <template #default="{ form, updateForm }">
        <VTextField
          v-model="form.name"
          label="Tenant 명"
          class="mb-3"
          @update:model-value="(val) => updateForm('name', val)"
        />
        <VTextarea
          v-model="form.description"
          label="설명"
          class="mb-3"
          rows="3"
          @update:model-value="(val) => updateForm('description', val)"
        />
        <VSelect
          v-model="form.allowedLLMLevel"
          :items="llmLevels"
          label="허용 LLM Level"
          class="mb-3"
          @update:model-value="(val) => updateForm('allowedLLMLevel', val)"
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
        <VTextField
          v-model="form.name"
          label="Tenant 명"
          class="mb-3"
          @update:model-value="(val) => updateForm('name', val)"
        />
        <VTextarea
          v-model="form.description"
          label="설명"
          class="mb-3"
          rows="3"
          @update:model-value="(val) => updateForm('description', val)"
        />
        <VSelect
          v-model="form.allowedLLMLevel"
          :items="llmLevels"
          label="허용 LLM Level"
          class="mb-3"
          @update:model-value="(val) => updateForm('allowedLLMLevel', val)"
        />
      </template>
    </CommonModal>
  </div>
</template>

<style scoped></style>
