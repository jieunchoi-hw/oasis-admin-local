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
  VSwitch,
} from "vuetify/components";

// Mock 데이터
const mcpServers = ref([
  {
    id: 1,
    name: "MCP Server 1",
    status: "Offline",
    connection: "Disconnected",
    control: false,
    updated: "2025-05-12 10:21",
  },
  {
    id: 2,
    name: "MCP Server 2",
    status: "Online",
    connection: "Connected",
    control: true,
    updated: "2025-05-12 10:21",
  },
  {
    id: 3,
    name: "MCP Server 3",
    status: "Online",
    connection: "Connected",
    control: true,
    updated: "2025-05-12 10:21",
  },
]);

const statuses = ["Online", "Offline", "Maintenance"];
const connections = ["Connected", "Disconnected", "Pending"];

// 테이블 컬럼 정의
const columns = [
  { key: "name", label: "이름" },
  { key: "status", label: "상태" },
  { key: "connection", label: "연결 상태" },
  { key: "control", label: "Control" },
  { key: "updated", label: "Last Updated" },
];

// 모달 필드 정의
const modalFields = [
  { key: "name", label: "서버 이름", type: "text", required: true },
  {
    key: "status",
    label: "상태",
    type: "select",
    options: statuses,
    required: true,
  },
  {
    key: "connection",
    label: "연결 상태",
    type: "select",
    options: connections,
    required: true,
  },
];

// 검색/필터
const filterColumns = [
  { label: "이름", key: "name" },
  { label: "상태", key: "status" },
  { label: "연결 상태", key: "connection" },
];
const selectedColumn = ref(filterColumns[0]);
const searchValue = ref("");
const filteredServers = computed(() => {
  if (!Array.isArray(mcpServers.value)) return [];
  if (!searchValue.value) return mcpServers.value;
  const key = selectedColumn.value.key;
  return mcpServers.value.filter((server) =>
    String(server[key] ?? "").includes(searchValue.value)
  );
});

// 페이징
const page = ref(1);
const itemsPerPage = 5;
const totalItems = computed(() => filteredServers.value.length);

// 다이얼로그 상태
const dialogAdd = ref(false);
const dialogEdit = ref(false);
const modalForm = ref({
  name: "",
  status: statuses[0],
  connection: connections[0],
  control: false,
});

function openAddDialog() {
  modalForm.value = {
    name: "",
    status: statuses[0],
    connection: connections[0],
    control: false,
  };
  dialogAdd.value = true;
}
function openEditDialog(server) {
  modalForm.value = { ...server };
  dialogEdit.value = true;
}
function handleAddConfirm(form) {
  mcpServers.value.push({
    id: Date.now(),
    name: form.name,
    status: form.status,
    connection: form.connection,
    control: form.control,
    updated: new Date().toISOString().slice(0, 16).replace("T", " "),
  });
  dialogAdd.value = false;
}
function handleEditConfirm(form) {
  const server = mcpServers.value.find((s) => s.id === form.id);
  if (server) {
    Object.assign(server, form);
  }
  dialogEdit.value = false;
}
function handleDelete(server) {
  mcpServers.value = mcpServers.value.filter((s) => s.id !== server.id);
}
function handlePageChange(val) {
  page.value = val;
}
function handleToggleControl(server) {
  // Control 토글 시 상태 업데이트 로직
  if (server.control) {
    server.status = "Online";
    server.connection = "Connected";
  } else {
    server.status = "Offline";
    server.connection = "Disconnected";
  }
}
function handleFormUpdate(updatedForm) {
  modalForm.value = updatedForm;
}

// 커스텀 렌더링 함수들
function getStatusColor(status) {
  switch (status) {
    case "Online":
      return "success";
    case "Offline":
      return "error";
    case "Maintenance":
      return "warning";
    default:
      return "default";
  }
}

function getConnectionColor(connection) {
  switch (connection) {
    case "Connected":
      return "success";
    case "Disconnected":
      return "error";
    case "Pending":
      return "warning";
    default:
      return "default";
  }
}
</script>

<template>
  <div class="pa-0">
    <!-- 상단 타이틀/설명 -->
    <div class="d-flex align-center mb-2">
      <h2 class="text-h4 font-weight-bold mr-2">MCP 서버 관리</h2>
      <VTooltip text="MCP 서버를 조회하고 관리하세요.">
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
      MCP 서버를 조회하고 관리하세요.
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
      :data="filteredServers"
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
      <!-- 상태 컬럼 커스텀 렌더링 -->
      <template #cell-status="{ value }">
        <VChip :color="getStatusColor(value)" size="small" variant="tonal">
          {{ value }}
        </VChip>
      </template>

      <!-- 연결 상태 컬럼 커스텀 렌더링 -->
      <template #cell-connection="{ value }">
        <VChip :color="getConnectionColor(value)" size="small" variant="tonal">
          {{ value }}
        </VChip>
      </template>

      <!-- Control 컬럼 커스텀 렌더링 -->
      <template #cell-control="{ item }">
        <VSwitch
          v-model="item.control"
          @change="handleToggleControl(item)"
          color="primary"
          hide-details
        />
      </template>
    </CommonTable>

    <!-- 추가 다이얼로그 -->
    <CommonModal
      :visible="dialogAdd"
      mode="add"
      title="MCP 서버 추가"
      :form="modalForm"
      :fields="modalFields"
      @confirm="handleAddConfirm"
      @close="dialogAdd = false"
      @update:form="handleFormUpdate"
    >
      <template #default="{ form, updateForm }">
        <VTextField
          v-model="form.name"
          label="서버 이름"
          class="mb-3"
          @update:model-value="(val) => updateForm('name', val)"
        />
        <VSelect
          v-model="form.status"
          :items="statuses"
          label="상태"
          class="mb-3"
          @update:model-value="(val) => updateForm('status', val)"
        />
        <VSelect
          v-model="form.connection"
          :items="connections"
          label="연결 상태"
          class="mb-3"
          @update:model-value="(val) => updateForm('connection', val)"
        />
        <div class="d-flex align-center">
          <VSwitch
            v-model="form.control"
            label="Control"
            color="primary"
            class="mr-2"
            @update:model-value="(val) => updateForm('control', val)"
          />
          <span class="text-caption text-medium-emphasis"
            >서버 활성화/비활성화</span
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
          v-model="form.status"
          :items="statuses"
          label="상태"
          class="mb-3"
          @update:model-value="(val) => updateForm('status', val)"
        />
        <VSelect
          v-model="form.connection"
          :items="connections"
          label="연결 상태"
          class="mb-3"
          @update:model-value="(val) => updateForm('connection', val)"
        />
        <div class="d-flex align-center">
          <VSwitch
            v-model="form.control"
            label="Control"
            color="primary"
            class="mr-2"
            @update:model-value="(val) => updateForm('control', val)"
          />
          <span class="text-caption text-medium-emphasis"
            >서버 활성화/비활성화</span
          >
        </div>
      </template>
    </CommonModal>
  </div>
</template>

<style scoped></style>
