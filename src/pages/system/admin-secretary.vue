<script setup>
import { ref, computed } from "vue";
import CommonTable from "@/components/CommonTable.vue";
import CommonModal from "@/components/CommonModal.vue";
import {
  VBtn,
  VSelect,
  VTextField,
  VTooltip,
  VIcon,
  VSpacer,
  VChip,
  VTextarea,
} from "vuetify/components";

// Mock 데이터
const secretaries = ref([
  {
    id: 1,
    name: "전사 업무 규정",
    description: "회사 업무 규정 Q&A, 업무 담당자 검색 등 전사 공통 업무 비서",
    capabilities: [
      "첨부된 파일 기반 질문/답변",
      "실시간 검색 + 이미지 생성/편집 능력",
    ],
    monthlyUsage: 100,
    updated: "2025-05-12 10:21",
  },
  {
    id: 2,
    name: "키워드 검색",
    description: "키워드만 넣으면 핵심 정보와 최신 소식 정리",
    capabilities: [
      "첨부된 파일 기반 질문/답변",
      "실시간 검색 + 이미지 생성/편집 능력",
    ],
    monthlyUsage: 100,
    updated: "2025-05-12 10:21",
  },
  {
    id: 3,
    name: "데이터 분석",
    description: "엑셀/CSV 올리고 분석, 편집 요청",
    capabilities: [
      "첨부된 파일 기반 질문/답변",
      "실시간 검색 + 이미지 생성/편집 능력",
    ],
    monthlyUsage: 200,
    updated: "2025-05-12 10:21",
  },
]);

const capabilities = [
  "첨부된 파일 기반 질문/답변",
  "실시간 검색 + 이미지 생성/편집 능력",
  "데이터 분석 및 시각화",
  "문서 요약 및 번역",
  "코드 분석 및 생성",
];

// 테이블 컬럼 정의
const columns = [
  { key: "name", label: "이름" },
  { key: "description", label: "비서 소개" },
  { key: "capabilities", label: "능력" },
  { key: "monthlyUsage", label: "월 이용 횟수" },
  { key: "updated", label: "Last Updated" },
];

// 모달 필드 정의
const modalFields = [
  { key: "name", label: "비서 이름", type: "text", required: true },
  { key: "description", label: "비서 소개", type: "textarea", required: true },
  {
    key: "capabilities",
    label: "능력",
    type: "multiselect",
    options: capabilities,
    required: true,
  },
  {
    key: "monthlyUsage",
    label: "월 이용 횟수",
    type: "number",
    required: true,
  },
];

// 검색/필터
const filterColumns = [
  { label: "이름", key: "name" },
  { label: "비서 소개", key: "description" },
  { label: "능력", key: "capabilities" },
];
const selectedColumn = ref(filterColumns[0]);
const searchValue = ref("");
const filteredSecretaries = computed(() => {
  if (!Array.isArray(secretaries.value)) return [];
  if (!searchValue.value) return secretaries.value;
  const key = selectedColumn.value.key;
  return secretaries.value.filter((secretary) => {
    if (key === "capabilities") {
      return secretary.capabilities.some((cap) =>
        cap.includes(searchValue.value)
      );
    }
    return String(secretary[key] ?? "").includes(searchValue.value);
  });
});

// 페이징
const page = ref(1);
const itemsPerPage = 5;
const totalItems = computed(() => filteredSecretaries.value.length);

// 다이얼로그 상태
const dialogAdd = ref(false);
const dialogEdit = ref(false);
const modalForm = ref({
  name: "",
  description: "",
  capabilities: [],
  monthlyUsage: 0,
});

function openAddDialog() {
  modalForm.value = {
    name: "",
    description: "",
    capabilities: [],
    monthlyUsage: 0,
  };
  dialogAdd.value = true;
}
function openEditDialog(secretary) {
  modalForm.value = { ...secretary };
  dialogEdit.value = true;
}
function handleAddConfirm(form) {
  secretaries.value.push({
    id: Date.now(),
    name: form.name,
    description: form.description,
    capabilities: form.capabilities,
    monthlyUsage: form.monthlyUsage,
    updated: new Date().toISOString().slice(0, 16).replace("T", " "),
  });
  dialogAdd.value = false;
}
function handleEditConfirm(form) {
  const secretary = secretaries.value.find((s) => s.id === form.id);
  if (secretary) {
    Object.assign(secretary, form);
  }
  dialogEdit.value = false;
}
function handleDelete(secretary) {
  secretaries.value = secretaries.value.filter((s) => s.id !== secretary.id);
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
      <h2 class="text-h4 font-weight-bold mr-2">공식 비서 관리</h2>
      <VTooltip text="공식 비서를 조회하고 관리하세요.">
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
      공식 비서를 조회하고 관리하세요.
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
      :data="filteredSecretaries"
      :columns="columns"
      :page="page"
      :itemsPerPage="itemsPerPage"
      :totalItems="totalItems"
      :actions="['edit', 'delete']"
      @edit="openEditDialog"
      @delete="handleDelete"
      @page-change="handlePageChange"
    >
      <!-- 비서 소개 컬럼 커스텀 렌더링 -->
      <template #cell-description="{ value }">
        <div class="text-caption" style="max-width: 200px; white-space: normal">
          {{ value }}
        </div>
      </template>

      <!-- 능력 컬럼 커스텀 렌더링 -->
      <template #cell-capabilities="{ value }">
        <div class="d-flex flex-wrap gap-1">
          <VChip
            v-for="capability in value"
            :key="capability"
            size="small"
            variant="tonal"
            color="grey"
          >
            {{ capability }}
          </VChip>
        </div>
      </template>

      <!-- 월 이용 횟수 컬럼 커스텀 렌더링 -->
      <template #cell-monthlyUsage="{ value }">
        <span class="font-weight-medium">{{ value }}</span>
      </template>
    </CommonTable>

    <!-- 추가 다이얼로그 -->
    <CommonModal
      :visible="dialogAdd"
      mode="add"
      title="공식 비서 추가"
      :form="modalForm"
      :fields="modalFields"
      @confirm="handleAddConfirm"
      @close="dialogAdd = false"
      @update:form="handleFormUpdate"
    >
      <template #default="{ form, updateForm }">
        <VTextField
          v-model="form.name"
          label="비서 이름"
          class="mb-3"
          @update:model-value="(val) => updateForm('name', val)"
        />
        <VTextarea
          v-model="form.description"
          label="비서 소개"
          class="mb-3"
          rows="3"
          @update:model-value="(val) => updateForm('description', val)"
        />
        <VSelect
          v-model="form.capabilities"
          :items="capabilities"
          label="능력"
          multiple
          chips
          class="mb-3"
          @update:model-value="(val) => updateForm('capabilities', val)"
        />
        <VTextField
          v-model="form.monthlyUsage"
          label="월 이용 횟수"
          type="number"
          class="mb-3"
          @update:model-value="
            (val) => updateForm('monthlyUsage', parseInt(val) || 0)
          "
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
          label="비서 이름"
          class="mb-3"
          @update:model-value="(val) => updateForm('name', val)"
        />
        <VTextarea
          v-model="form.description"
          label="비서 소개"
          class="mb-3"
          rows="3"
          @update:model-value="(val) => updateForm('description', val)"
        />
        <VSelect
          v-model="form.capabilities"
          :items="capabilities"
          label="능력"
          multiple
          chips
          class="mb-3"
          @update:model-value="(val) => updateForm('capabilities', val)"
        />
        <VTextField
          v-model="form.monthlyUsage"
          label="월 이용 횟수"
          type="number"
          class="mb-3"
          @update:model-value="
            (val) => updateForm('monthlyUsage', parseInt(val) || 0)
          "
        />
      </template>
    </CommonModal>
  </div>
</template>

<style scoped></style>
