<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import CommonTable from "../components/CommonTable.vue";
import CommonModal from "../components/CommonModal.vue";
import {
  VBtn,
  VSelect,
  VTextField,
  VTooltip,
  VIcon,
  VSpacer,
  VTabs,
  VTab,
  VWindow,
  VWindowItem,
  VCard,
  VCheckbox,
  VChip,
} from "vuetify/components";
import { useTenantStore } from "@/stores/tenant";

// Mock 데이터
const tenants = ref([
  { id: 1, name: "한화시스템" },
  { id: 2, name: "한화비전" },
  { id: 3, name: "한화오션" },
]);

const selectedTenant = ref(tenants.value[0]);

const tenantAdmins = ref([
  {
    id: 1,
    name: "최지은",
    userId: "choijieun",
    email: "111@aaa.com",
    role: "Tenant Admin",
    updated: "2025-05-12 10:21",
  },
  {
    id: 2,
    name: "김종성",
    userId: "ziippy",
    email: "ziippy@hanwha.com",
    role: "Tenant Operator",
    updated: "2025-05-12 10:21",
  },
  {
    id: 3,
    name: "민지영",
    userId: "gzeromin",
    email: "gzeromin@hanwha.com",
    role: "Tenant Operator",
    updated: "2025-05-12 10:21",
  },
]);

const roles = ["Tenant Admin", "Tenant Operator"];

// 라우터 관련
const route = useRoute();
const router = useRouter();

// 탭 관련
const activeTab = ref(0);
const tabs = [
  { title: "Tenant Admin 관리", key: "admin", path: "admin-users" },
  { title: "LLM", key: "llm", path: "llm" },
  { title: "MCP 서버", key: "mcp", path: "mcp-server" },
  { title: "Vector DB", key: "vectordb", path: "vectordb" },
  { title: "공식 비서", key: "secretary", path: "secretary" },
];

// 라우터 경로에 따라 탭 설정
const pathToTabIndex = {
  "admin-users": 0,
  llm: 1,
  "mcp-server": 2,
  vectordb: 3,
  secretary: 4,
};

// URL 파라미터에서 테넌트 ID 감지
const tenantIdFromUrl = route.query.tenantId;
if (tenantIdFromUrl) {
  const tenant = tenants.value.find((t) => t.id == tenantIdFromUrl);
  if (tenant) {
    selectedTenant.value = tenant;
  }
}

// tenantId 파라미터가 없으면 첫번째 tenant로 자동 이동
onMounted(() => {
  if (!route.query.tenantId && tenants.value.length > 0) {
    router.replace({
      path: route.path,
      query: { ...route.query, tenantId: tenants.value[0].id },
    });
  }
});

// 현재 경로에 따라 탭 설정
if (route.path.includes("/admin-users")) {
  activeTab.value = 0;
} else if (route.path.includes("/llm")) {
  activeTab.value = 1;
} else if (route.path.includes("/mcp-server")) {
  activeTab.value = 2;
} else if (route.path.includes("/vectordb")) {
  activeTab.value = 3;
} else if (route.path.includes("/secretary")) {
  activeTab.value = 4;
}

// 테이블 컬럼 정의
const columns = [
  { key: "name", label: "이름" },
  { key: "userId", label: "ID" },
  { key: "email", label: "이메일" },
  { key: "role", label: "권한" },
  { key: "updated", label: "Last Updated" },
];

// 모달 필드 정의
const modalFields = [
  { key: "name", label: "이름", type: "text", required: true },
  { key: "userId", label: "ID", type: "text", required: true },
  { key: "email", label: "이메일", type: "text", required: true },
  {
    key: "role",
    label: "권한",
    type: "select",
    options: roles,
    required: true,
  },
];

// 검색/필터
const filterColumns = [
  { label: "이름", key: "name" },
  { label: "ID", key: "userId" },
  { label: "이메일", key: "email" },
  { label: "권한", key: "role" },
];
const selectedColumn = ref(filterColumns[0]);
const searchValue = ref("");
const filteredAdmins = computed(() => {
  if (!Array.isArray(tenantAdmins.value)) return [];
  if (!searchValue.value) return tenantAdmins.value;
  const key = selectedColumn.value.key;
  return tenantAdmins.value.filter((admin) =>
    String(admin[key] ?? "").includes(searchValue.value)
  );
});

// 페이징
const page = ref(1);
const itemsPerPage = 5;
const totalItems = computed(() => filteredAdmins.value.length);

// 다이얼로그 상태
const dialogAdd = ref(false);
const dialogEdit = ref(false);
const modalForm = ref({
  name: "",
  userId: "",
  email: "",
  role: roles[0],
});

function openAddDialog() {
  modalForm.value = {
    name: "",
    userId: "",
    email: "",
    role: roles[0],
  };
  dialogAdd.value = true;
}
function openEditDialog(admin) {
  modalForm.value = { ...admin };
  dialogEdit.value = true;
}
function handleAddConfirm(form) {
  tenantAdmins.value.push({
    id: Date.now(),
    name: form.name,
    userId: form.userId,
    email: form.email,
    role: form.role,
    updated: new Date().toISOString().slice(0, 16).replace("T", " "),
  });
  dialogAdd.value = false;
}
function handleEditConfirm(form) {
  const admin = tenantAdmins.value.find((a) => a.id === form.id);
  if (admin) {
    Object.assign(admin, form);
  }
  dialogEdit.value = false;
}
function handleDelete(admin) {
  tenantAdmins.value = tenantAdmins.value.filter((a) => a.id !== admin.id);
}
function handlePageChange(val) {
  page.value = val;
}
function handleFormUpdate(updatedForm) {
  modalForm.value = updatedForm;
}
function handleTenantChange(tenant) {
  selectedTenant.value = tenant;
  const tenantStore = useTenantStore();
  tenantStore.setTenantId(tenant.id);
  // URL 파라미터 업데이트
  router.push({
    path: route.path,
    query: { ...route.query, tenantId: tenant.id },
  });
  // 여기서 해당 테넌트의 데이터를 로드하는 로직 추가
  console.log("Tenant changed to:", tenant.name);
}

function handleTabChange(tabIndex) {
  const tab = tabs[tabIndex];
  if (tab && tab.path) {
    router.push({
      path: `/system/tenant-settings/${tab.path}`,
      query: { ...route.query },
    });
  }
}

// LLM 관련 상태
const llm1Selected = ref(false);
const llm2Selected = ref(false);
const llm3Selected = ref(false);
const llm4Selected = ref(false);
const llm5Selected = ref(false);

const assignedLlm1Selected = ref(false);
const assignedLlm4Selected = ref(false);
const assignedLlm5Selected = ref(false);

// 전체선택 상태
const selectAllLeft = ref(false);
const selectAllRight = ref(false);

// LLM 이동 관련 computed
const hasSelectedLeft = computed(() => {
  return (
    llm1Selected.value ||
    llm2Selected.value ||
    llm3Selected.value ||
    llm4Selected.value ||
    llm5Selected.value
  );
});

const hasSelectedRight = computed(() => {
  return (
    assignedLlm1Selected.value ||
    assignedLlm4Selected.value ||
    assignedLlm5Selected.value
  );
});

// 전체선택 computed
const allLeftSelected = computed(() => {
  return (
    llm1Selected.value &&
    llm2Selected.value &&
    llm3Selected.value &&
    llm4Selected.value &&
    llm5Selected.value
  );
});

const allRightSelected = computed(() => {
  return (
    assignedLlm1Selected.value &&
    assignedLlm4Selected.value &&
    assignedLlm5Selected.value
  );
});

// 전체선택 감시
watch(selectAllLeft, (newValue) => {
  llm1Selected.value = newValue;
  llm2Selected.value = newValue;
  llm3Selected.value = newValue;
  llm4Selected.value = newValue;
  llm5Selected.value = newValue;
});

watch(selectAllRight, (newValue) => {
  assignedLlm1Selected.value = newValue;
  assignedLlm4Selected.value = newValue;
  assignedLlm5Selected.value = newValue;
});

// 개별 선택 감시하여 전체선택 상태 업데이트
watch(
  [llm1Selected, llm2Selected, llm3Selected, llm4Selected, llm5Selected],
  () => {
    selectAllLeft.value = allLeftSelected.value;
  }
);

watch(
  [assignedLlm1Selected, assignedLlm4Selected, assignedLlm5Selected],
  () => {
    selectAllRight.value = allRightSelected.value;
  }
);

// LLM 이동 함수
function moveToRight() {
  // 선택된 LLM을 오른쪽으로 이동하는 로직
  console.log("Move selected LLMs to right");
}

function moveToLeft() {
  // 선택된 LLM을 왼쪽으로 이동하는 로직
  console.log("Move selected LLMs to left");
}

function saveLLMAssignments() {
  // LLM 배정 저장 로직
  console.log("Save LLM assignments");
}
</script>

<template>
  <div class="pa-0">
    <!-- 상단 타이틀/테넌트 선택 -->
    <div class="d-flex align-center justify-space-between mb-4">
      <div class="d-flex align-center">
        <h2 class="text-h4 font-weight-bold mr-4">Tenant별 설정</h2>
        <VSelect
          v-model="selectedTenant"
          :items="tenants"
          item-title="name"
          item-value="id"
          style="min-width: 200px"
          density="compact"
          @update:model-value="handleTenantChange"
        />
      </div>
    </div>

    <div class="mb-4 text-body-1 text-medium-emphasis">
      Tenant 별로 사용할 Resource를 배정한다.
    </div>

    <!-- 탭 네비게이션 -->
    <VTabs
      v-model="activeTab"
      class="mb-4"
      @update:model-value="handleTabChange"
    >
      <VTab v-for="(tab, index) in tabs" :key="tab.key" :value="index">
        {{ tab.title }}
      </VTab>
    </VTabs>

    <!-- 탭 컨텐츠 -->
    <VWindow v-model="activeTab">
      <!-- Tenant Admin 관리 탭 -->
      <VWindowItem :value="0">
        <div class="mb-4 text-body-2 text-medium-emphasis">
          ■ Tenant Admin/Operator를 지정하거나 삭제한다.
        </div>

        <!-- 필터/검색 영역 -->
        <div class="d-flex align-center mb-4 gap-2">
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
          <VBtn color="primary" @click="openAddDialog" style="min-width: 120px"
            >+ New</VBtn
          >
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
      </VWindowItem>

      <!-- LLM 탭 -->
      <VWindowItem :value="1">
        <div class="d-flex justify-space-between align-center mb-4">
          <div class="text-body-2 text-medium-emphasis">
            ■ 한화시스템에서 사용하는 LLM를 배정한다.
          </div>
          <VBtn color="primary" @click="saveLLMAssignments"> Save </VBtn>
        </div>

        <div class="d-flex gap-4" style="height: 600px">
          <!-- 왼쪽 패널: 사용 가능한 LLM -->
          <div class="flex-grow-1 d-flex flex-column">
            <div class="d-flex align-center justify-space-between mb-3">
              <div class="d-flex align-center">
                <VChip color="warning" size="small" class="ms-2">Public</VChip>
                <VTooltip
                  text="Tenant Level에 맞는 LLM들을 선택하여 테넌트에 배정할 수 있습니다."
                >
                  <template #activator="{ props }">
                    <VIcon
                      v-bind="props"
                      icon="ri-question-line"
                      size="15"
                      class="ms-1 text-medium-emphasis"
                    />
                  </template>
                </VTooltip>
              </div>
              <div class="d-flex align-center gap-2 me-3">
                <VBtn
                  variant="plain"
                  size="small"
                  prepend-icon="ri-refresh-line"
                  class="pa-0"
                >
                </VBtn>
                <VBtn variant="text" size="small"> 전체선택 </VBtn>
                <VCheckbox
                  v-model="selectAllLeft"
                  color="primary"
                  hide-details
                />
              </div>
            </div>

            <div class="flex-grow-1 overflow-y-auto">
              <!-- LLM 카드들 -->
              <div class="d-flex flex-column gap-3">
                <!-- LLM 1 -->
                <VCard class="pa-3" color="warning" variant="tonal">
                  <div class="d-flex align-center justify-space-between">
                    <div class="d-flex align-center gap-3">
                      <VIcon icon="ri-ai-generate" size="24" color="primary" />
                      <div>
                        <div class="text-subtitle-2 font-weight-medium">
                          LLM 1 (Open AI - Dedicated)
                        </div>
                        <div class="text-caption text-medium-emphasis">
                          LLM 1 is blah blah...
                        </div>
                      </div>
                    </div>
                    <div class="d-flex align-center gap-2">
                      <VBtn variant="text" size="small" color="primary"
                        >detail</VBtn
                      >
                      <VCheckbox
                        v-model="llm1Selected"
                        color="primary"
                        hide-details
                      />
                    </div>
                  </div>
                </VCard>

                <!-- LLM 2 -->
                <VCard class="pa-3">
                  <div class="d-flex align-center justify-space-between">
                    <div class="d-flex align-center gap-3">
                      <VIcon icon="ri-ai-generate" size="24" color="primary" />
                      <div>
                        <div class="text-subtitle-2 font-weight-medium">
                          LLM 2 (Open AI - Public)
                        </div>
                        <div class="text-caption text-medium-emphasis">
                          LLM 1 is blah blah...
                        </div>
                      </div>
                    </div>
                    <div class="d-flex align-center gap-2">
                      <VBtn variant="text" size="small" color="primary"
                        >detail</VBtn
                      >
                      <VCheckbox
                        v-model="llm2Selected"
                        color="primary"
                        hide-details
                      />
                    </div>
                  </div>
                </VCard>

                <!-- LLM 3 -->
                <VCard class="pa-3">
                  <div class="d-flex align-center justify-space-between">
                    <div class="d-flex align-center gap-3">
                      <VIcon icon="ri-azure-line" size="24" color="primary" />
                      <div>
                        <div class="text-subtitle-2 font-weight-medium">
                          LLM 3 (AOAI - Dedicated)
                        </div>
                        <div class="text-caption text-medium-emphasis">
                          LLM 1 is blah blah...
                        </div>
                      </div>
                    </div>
                    <div class="d-flex align-center gap-2">
                      <VBtn variant="text" size="small" color="primary"
                        >detail</VBtn
                      >
                      <VCheckbox
                        v-model="llm3Selected"
                        color="primary"
                        hide-details
                      />
                    </div>
                  </div>
                </VCard>

                <!-- LLM 4 -->
                <VCard class="pa-3" color="warning" variant="tonal">
                  <div class="d-flex align-center justify-space-between">
                    <div class="d-flex align-center gap-3">
                      <VIcon icon="ri-azure-line" size="24" color="primary" />
                      <div>
                        <div class="text-subtitle-2 font-weight-medium">
                          LLM 4 (AOAI - Public)
                        </div>
                        <div class="text-caption text-medium-emphasis">
                          LLM 1 is blah blah...
                        </div>
                      </div>
                    </div>
                    <div class="d-flex align-center gap-2">
                      <VBtn variant="text" size="small" color="primary"
                        >detail</VBtn
                      >
                      <VCheckbox
                        v-model="llm4Selected"
                        color="primary"
                        hide-details
                      />
                    </div>
                  </div>
                </VCard>

                <!-- LLM 5 -->
                <VCard class="pa-3" color="warning" variant="tonal">
                  <div class="d-flex align-center justify-space-between">
                    <div class="d-flex align-center gap-3">
                      <VIcon
                        icon="ri-settings-3-line"
                        size="24"
                        color="primary"
                      />
                      <div>
                        <div class="text-subtitle-2 font-weight-medium">
                          LLM 5 (Private)
                        </div>
                        <div class="text-caption text-medium-emphasis">
                          LLM 1 is blah blah...
                        </div>
                      </div>
                    </div>
                    <div class="d-flex align-center gap-2">
                      <VBtn variant="text" size="small" color="primary"
                        >detail</VBtn
                      >
                      <VCheckbox
                        v-model="llm5Selected"
                        color="primary"
                        hide-details
                      />
                    </div>
                  </div>
                </VCard>
              </div>
            </div>
          </div>

          <!-- 중앙 이동 버튼 -->
          <div class="d-flex flex-column justify-center gap-2">
            <VBtn
              color="primary"
              variant="outlined"
              size="large"
              prepend-icon="ri-arrow-right-line"
              :disabled="!hasSelectedLeft"
              @click="moveToRight"
            />
            <VBtn
              color="primary"
              variant="outlined"
              size="large"
              prepend-icon="ri-arrow-left-line"
              :disabled="!hasSelectedRight"
              @click="moveToLeft"
            />
          </div>

          <!-- 오른쪽 패널: 배정된 LLM -->
          <div class="flex-grow-1 d-flex flex-column">
            <div class="d-flex align-center justify-end mb-3 me-3">
              <VBtn variant="text" size="small"> 전체선택 </VBtn>
              <VCheckbox
                v-model="selectAllRight"
                color="primary"
                hide-details
              />
            </div>

            <div class="flex-grow-1 overflow-y-auto">
              <!-- 배정된 LLM 카드들 -->
              <div class="d-flex flex-column gap-3">
                <!-- 배정된 LLM 1 -->
                <VCard class="pa-3">
                  <div class="d-flex align-center justify-space-between">
                    <div class="d-flex align-center gap-3">
                      <VIcon icon="ri-ai-generate" size="24" color="primary" />
                      <div>
                        <div class="text-subtitle-2 font-weight-medium">
                          LLM 1 (Open AI - Dedicated)
                        </div>
                        <div class="text-caption text-medium-emphasis">
                          LLM 1 is blah blah...
                        </div>
                      </div>
                    </div>
                    <div class="d-flex align-center gap-2">
                      <VBtn variant="text" size="small" color="primary"
                        >detail</VBtn
                      >
                      <VCheckbox
                        v-model="assignedLlm1Selected"
                        color="primary"
                        hide-details
                      />
                    </div>
                  </div>
                </VCard>

                <!-- 배정된 LLM 4 -->
                <VCard class="pa-3">
                  <div class="d-flex align-center justify-space-between">
                    <div class="d-flex align-center gap-3">
                      <VIcon icon="ri-azure-line" size="24" color="primary" />
                      <div>
                        <div class="text-subtitle-2 font-weight-medium">
                          LLM 4 (AOAI - Public)
                        </div>
                        <div class="text-caption text-medium-emphasis">
                          LLM 1 is blah blah...
                        </div>
                      </div>
                    </div>
                    <div class="d-flex align-center gap-2">
                      <VBtn variant="text" size="small" color="primary"
                        >detail</VBtn
                      >
                      <VCheckbox
                        v-model="assignedLlm4Selected"
                        color="primary"
                        hide-details
                      />
                    </div>
                  </div>
                </VCard>

                <!-- 배정된 LLM 5 -->
                <VCard class="pa-3">
                  <div class="d-flex align-center justify-space-between">
                    <div class="d-flex align-center gap-3">
                      <VIcon
                        icon="ri-settings-3-line"
                        size="24"
                        color="primary"
                      />
                      <div>
                        <div class="text-subtitle-2 font-weight-medium">
                          LLM 5 (Private)
                        </div>
                        <div class="text-caption text-medium-emphasis">
                          LLM 1 is blah blah...
                        </div>
                      </div>
                    </div>
                    <div class="d-flex align-center gap-2">
                      <VBtn variant="text" size="small" color="primary"
                        >detail</VBtn
                      >
                      <VCheckbox
                        v-model="assignedLlm5Selected"
                        color="primary"
                        hide-details
                      />
                    </div>
                  </div>
                </VCard>
              </div>
            </div>
          </div>
        </div>
      </VWindowItem>

      <!-- MCP 서버 탭 -->
      <VWindowItem :value="2">
        <div class="text-center pa-8">
          <VIcon icon="ri-server-line" size="64" color="grey" class="mb-4" />
          <h3 class="text-h5 mb-2">MCP 서버 관리</h3>
          <p class="text-medium-emphasis">
            MCP 서버 배정 관리 기능이 준비 중입니다.
          </p>
        </div>
      </VWindowItem>

      <!-- Vector DB 탭 -->
      <VWindowItem :value="3">
        <div class="text-center pa-8">
          <VIcon
            icon="ri-database-2-line"
            size="64"
            color="grey"
            class="mb-4"
          />
          <h3 class="text-h5 mb-2">Vector DB 관리</h3>
          <p class="text-medium-emphasis">
            Vector DB 배정 관리 기능이 준비 중입니다.
          </p>
        </div>
      </VWindowItem>

      <!-- 공식 비서 탭 -->
      <VWindowItem :value="4">
        <div class="text-center pa-8">
          <VIcon
            icon="ri-customer-service-2-line"
            size="64"
            color="grey"
            class="mb-4"
          />
          <h3 class="text-h5 mb-2">공식 비서 관리</h3>
          <p class="text-medium-emphasis">
            공식 비서 배정 관리 기능이 준비 중입니다.
          </p>
        </div>
      </VWindowItem>
    </VWindow>

    <!-- 추가 다이얼로그 -->
    <CommonModal
      :visible="dialogAdd"
      mode="add"
      title="Tenant Admin 추가"
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
          @update:model-value="(val) => updateForm('name', val)"
        />
        <VTextField
          v-model="form.userId"
          label="ID"
          class="mb-3"
          @update:model-value="(val) => updateForm('userId', val)"
        />
        <VTextField
          v-model="form.email"
          label="이메일"
          class="mb-3"
          @update:model-value="(val) => updateForm('email', val)"
        />
        <VSelect
          v-model="form.role"
          :items="roles"
          label="권한"
          class="mb-3"
          @update:model-value="(val) => updateForm('role', val)"
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
          label="이름"
          class="mb-3"
          @update:model-value="(val) => updateForm('name', val)"
        />
        <VTextField
          v-model="form.userId"
          label="ID"
          class="mb-3"
          @update:model-value="(val) => updateForm('userId', val)"
        />
        <VTextField
          v-model="form.email"
          label="이메일"
          class="mb-3"
          @update:model-value="(val) => updateForm('email', val)"
        />
        <VSelect
          v-model="form.role"
          :items="roles"
          label="권한"
          class="mb-3"
          @update:model-value="(val) => updateForm('role', val)"
        />
      </template>
    </CommonModal>
  </div>
</template>

<style scoped></style>
