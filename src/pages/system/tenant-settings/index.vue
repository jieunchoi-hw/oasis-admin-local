<script setup>
import { ref, watch, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { VTabs, VTab, VSelect } from "vuetify/components";
import { useTenantStore } from "@/stores/tenant";

const tenants = ref([
  { id: 1, name: "한화시스템" },
  { id: 2, name: "한화비전" },
  { id: 3, name: "한화오션" },
]);
const selectedTenant = ref(tenants.value[0]);

const route = useRoute();
const router = useRouter();

const tabs = [
  { title: "Tenant Admin 관리", key: "admin", path: "admin-users" },
  { title: "LLM", key: "llm", path: "llm" },
  { title: "MCP 서버", key: "mcp", path: "mcp-server" },
  { title: "Vector DB", key: "vectordb", path: "vectordb" },
  { title: "공식 비서", key: "secretary", path: "secretary" },
];
const activeTab = ref(0);

watch(
  () => route.path,
  (newPath) => {
    if (newPath.includes("/admin-users")) activeTab.value = 0;
    else if (newPath.includes("/llm")) activeTab.value = 1;
    else if (newPath.includes("/mcp-server")) activeTab.value = 2;
    else if (newPath.includes("/vectordb")) activeTab.value = 3;
    else if (newPath.includes("/secretary")) activeTab.value = 4;
  },
  { immediate: true }
);

function handleTabChange(tabIndex) {
  const tab = tabs[tabIndex];
  if (tab && tab.path) {
    router.push({
      path: `/system/tenant-settings/${tab.path}`,
      query: { ...route.query },
    });
  }
}

function handleTenantChange(tenant) {
  selectedTenant.value = tenant;
  const tenantStore = useTenantStore();
  tenantStore.setTenantId(tenant.id);
  router.push({
    path: route.path,
    query: { ...route.query, tenantId: tenant.id },
  });
}

onMounted(() => {
  if (!route.query.tenantId && tenants.value.length > 0) {
    router.replace({
      path: route.path,
      query: { ...route.query, tenantId: tenants.value[0].id },
    });
  }
});
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
      <VTab
        min-width="100"
        v-for="(tab, index) in tabs"
        :key="tab.key"
        :value="index"
      >
        {{ tab.title }}
      </VTab>
    </VTabs>
    <!-- 실제 탭별 내용은 children route로 -->
    <router-view :tenants="tenants" :selected-tenant="selectedTenant" />
  </div>
</template>
