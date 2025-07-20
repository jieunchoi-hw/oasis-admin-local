<script setup>
import { ref, computed } from "vue";
import LLMTable from "../components/LLMTable.vue";
import LLMModal from "../components/LLMModal.vue";
import {
  VBtn,
  VSelect,
  VTextField,
  VTooltip,
  VIcon,
  VSpacer,
} from "vuetify/components";

// Mock 데이터
const llms = ref([
  {
    id: 1,
    name: "LLM1",
    level: "Dedicated",
    provider: "Open AI",
    credential: "API-KEY1",
    control: false,
    status: "",
    updated: "2025-05-12 10:21",
  },
  {
    id: 2,
    name: "LLM2",
    level: "Public",
    provider: "Open AI",
    credential: "API-KEY2",
    control: false,
    status: "",
    updated: "2025-05-12 10:21",
  },
  {
    id: 3,
    name: "LLM3",
    level: "Dedicated",
    provider: "AOAI",
    credential: "API-KEY3",
    control: false,
    status: "",
    updated: "2025-05-12 10:21",
  },
  {
    id: 4,
    name: "LLM4",
    level: "Public",
    provider: "AOAI",
    credential: "API-KEY4",
    control: false,
    status: "",
    updated: "2025-05-12 10:21",
  },
  {
    id: 5,
    name: "LLM5",
    level: "Private",
    provider: "-",
    credential: "-",
    control: true,
    status: "Running",
    updated: "2025-05-12 10:21",
  },
]);

const levels = ["Dedicated", "Public", "Private"];
const providers = ["Open AI", "AOAI", "-"];
const statuses = ["Running", "Stopped", "Pending", ""];

// 검색/필터
const filterColumns = [
  { label: "이름", key: "name" },
  { label: "Level", key: "level" },
  { label: "Provider", key: "provider" },
  { label: "Credential", key: "credential" },
  { label: "Status", key: "status" },
];
const selectedColumn = ref(filterColumns[0]);
const searchValue = ref("");
const filteredLLMs = computed(() => {
  if (!Array.isArray(llms.value)) return [];
  if (!searchValue.value) return llms.value;
  const key = selectedColumn.value.key;
  return llms.value.filter((llm) =>
    String(llm[key] ?? "").includes(searchValue.value)
  );
});

// 페이징
const page = ref(1);
const itemsPerPage = 5;
const totalItems = computed(() => filteredLLMs.value.length);

// 다이얼로그 상태
const dialogAdd = ref(false);
const dialogEdit = ref(false);
const modalLLM = ref(null);

function openAddDialog() {
  modalLLM.value = null;
  dialogAdd.value = true;
}
function openEditDialog(llm) {
  modalLLM.value = llm;
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
    updated: new Date().toISOString().slice(0, 16).replace("T", " "),
  });
  dialogAdd.value = false;
}
function handleEditConfirm(form) {
  if (modalLLM.value) {
    Object.assign(modalLLM.value, form);
  }
  dialogEdit.value = false;
}
function handleDelete(llm) {
  llms.value = llms.value.filter((l) => l.id !== llm.id);
}
function handlePageChange(val) {
  page.value = val;
}
function handleToggleControl(llm) {
  // Control 토글 시 상태 업데이트 로직
  if (llm.control) {
    llm.status = "Running";
  } else {
    llm.status = "Stopped";
  }
}
</script>

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

    <!-- LLM 테이블 -->
    <LLMTable
      :llms="filteredLLMs"
      :page="page"
      :itemsPerPage="itemsPerPage"
      :totalItems="totalItems"
      @edit="openEditDialog"
      @delete="handleDelete"
      @page-change="handlePageChange"
      @toggle-control="handleToggleControl"
    />

    <!-- 추가 다이얼로그 -->
    <LLMModal
      :visible="dialogAdd"
      mode="add"
      :levels="levels"
      :providers="providers"
      :statuses="statuses"
      @confirm="handleAddConfirm"
      @close="dialogAdd = false"
    />
    <!-- 수정 다이얼로그 -->
    <LLMModal
      :visible="dialogEdit"
      mode="edit"
      :llm="modalLLM"
      :levels="levels"
      :providers="providers"
      :statuses="statuses"
      @confirm="handleEditConfirm"
      @close="dialogEdit = false"
    />
  </div>
</template>

<style scoped></style>
