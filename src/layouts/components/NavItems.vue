<script setup>
import { computed } from "vue";
import VerticalNavSectionTitle from "@/@layouts/components/VerticalNavSectionTitle.vue";
import VerticalNavGroup from "@layouts/components/VerticalNavGroup.vue";
import VerticalNavLink from "@layouts/components/VerticalNavLink.vue";
import { useTenantStore } from "@/stores/tenant";

// props 정의
const props = defineProps({
  currentAccountType: {
    type: String,
    default: "System",
  },
});

// 권한별 메뉴 구조 정의
const menuStructure = {
  System: {
    dashboard: {
      title: "Dashboard",
      icon: "ri-home-smile-line",
      to: "/dashboard",
    },
    systemAdmin: {
      title: "System Admin 사용자 관리",
      icon: "ri-user-settings-line",
      to: "/system/admin-users",
    },
    llmManagement: {
      title: "LLM 관리",
      icon: "ri-robot-line",
      to: "/system/llm-management",
    },
    mcpServer: {
      title: "MCP 서버 관리",
      icon: "ri-server-line",
      to: "/system/mcp-server",
    },
    vectorDB: {
      title: "Vector DB 관리",
      icon: "ri-database-2-line",
      to: "/system/vector-db",
    },
    officialSecretary: {
      title: "공식 비서 관리",
      icon: "ri-customer-service-2-line",
      to: "/system/official-secretary",
    },
    tenantManagement: {
      title: "Tenant 관리",
      icon: "ri-building-line",
      to: "/system/tenant-management",
    },
    systemTenantSettings: {
      title: "Tenant별 설정",
      icon: "ri-settings-3-line",
      to: "/system/tenant-settings",
      hasTabs: true,
      tabs: [
        {
          title: "Tenant Admin 사용자 관리",
          to: "/system/tenant-settings/admin-users",
        },
        { title: "LLM 배정", to: "/system/tenant-settings/llm" },
        {
          title: "MCP 서버 배정",
          to: "/system/tenant-settings/mcp-server",
        },
        {
          title: "Vector DB 배정",
          to: "/system/tenant-settings/vectordb",
        },
        {
          title: "공식비서 배정",
          to: "/system/tenant-settings/secretary",
        },
      ],
    },
  },
  Tenant: {
    dashboard: {
      title: "Dashboard",
      icon: "ri-home-smile-line",
      to: "/dashboard",
    },
    tenantSettings: {
      title: "테넌트 설정",
      icon: "ri-settings-3-line",
      to: "/tenant/settings",
      hasTabs: true,
      tabs: [
        { title: "기본정보 관리", to: "/tenant/settings/basic-info" },
        {
          title: "Tenant Admin 사용자 관리",
          to: "/tenant/settings/admin-users",
        },
        { title: "LLM 사용 설정", to: "/tenant/settings/llm-usage" },
        { title: "MCP 서버 사용 설정", to: "/tenant/settings/mcp-usage" },
        { title: "Vector DB 사용 설정", to: "/tenant/settings/vector-usage" },
        { title: "전사 비서 설정", to: "/tenant/settings/company-secretary" },
        { title: "비서 승인 관리", to: "/tenant/settings/secretary-approval" },
      ],
    },
    workspaceSettings: {
      title: "Workspace 별설정",
      icon: "ri-layout-grid-line",
      to: "/tenant/workspace-settings",
      hasTabs: true,
      tabs: [
        { title: "LLM 배정", to: "/tenant/workspace-settings/llm-assignment" },
        {
          title: "MCP 서버 배정",
          to: "/tenant/workspace-settings/mcp-assignment",
        },
        {
          title: "비서 배정",
          to: "/tenant/workspace-settings/secretary-assignment",
        },
      ],
    },
  },
  Workspace: {
    dashboard: {
      title: "Dashboard",
      icon: "ri-home-smile-line",
      to: "/dashboard",
    },
    workspaceSettings: {
      title: "Workspace 설정",
      icon: "ri-settings-3-line",
      to: "/workspace/settings",
      hasTabs: true,
      tabs: [
        { title: "Workspace 사용자 관리", to: "/workspace/settings/users" },
        { title: "LLM 배정", to: "/workspace/settings/llm-assignment" },
        { title: "MCP 서버 배정", to: "/workspace/settings/mcp-assignment" },
        { title: "비서 배정", to: "/workspace/settings/secretary-assignment" },
      ],
    },
    userSecretary: {
      title: "사용자 비서 관리",
      icon: "ri-user-heart-line",
      to: "/workspace/user-secretary",
    },
  },
};

// 현재 권한에 따른 메뉴 가져오기
const currentMenus = computed(() => {
  return menuStructure[props.currentAccountType] || menuStructure.System;
});
const tenantStore = useTenantStore();

function getTabTo(tabTo) {
  if (tabTo.startsWith("/system/tenant-settings/")) {
    return { path: tabTo, query: { tenantId: tenantStore.tenantId } };
  }
  return tabTo;
}
</script>

<template>
  <!-- 👉 Dashboard -->
  <VerticalNavLink
    :item="{
      title: currentMenus.dashboard.title,
      icon: currentMenus.dashboard.icon,
      to: currentMenus.dashboard.to,
    }"
  />
  <!-- 👉 공통 메뉴 -->
  <VerticalNavSectionTitle
    v-if="props.currentAccountType !== 'Tenant'"
    :item="{
      heading: 'management',
    }"
  />

  <!-- 👉 권한별 메뉴 렌더링 -->
  <template v-for="(menu, key) in currentMenus" :key="key">
    <template v-if="key !== 'dashboard'">
      <!-- 탭이 있는 메뉴 -->
      <VerticalNavSectionTitle
        v-if="key === 'tenantManagement' || key === 'tenantSettings'"
        :item="{
          heading: 'tenant',
        }"
      />
      <VerticalNavGroup
        v-if="menu.hasTabs"
        :item="{
          title: menu.title,
          icon: menu.icon,
        }"
      >
        <VerticalNavLink
          v-for="tab in menu.tabs"
          :key="tab.to"
          :item="{
            title: tab.title,
            to: getTabTo(tab.to),
          }"
        />
      </VerticalNavGroup>

      <!-- 일반 메뉴 -->
      <VerticalNavLink
        v-else
        :item="{
          title: menu.title,
          icon: menu.icon,
          to: menu.to,
        }"
      />
    </template>
  </template>

  <!-- 👉 공통 메뉴 -->
  <VerticalNavSectionTitle
    :item="{
      heading: 'system',
    }"
  />

  <VerticalNavLink
    :item="{
      title: 'Account Settings',
      icon: 'ri-user-settings-line',
      to: '/account-settings',
    }"
  />

  <VerticalNavLink
    :item="{
      title: 'Login',
      icon: 'ri-login-box-line',
      to: '/login',
    }"
  />

  <VerticalNavLink
    :item="{
      title: 'Register',
      icon: 'ri-user-add-line',
      to: '/register',
    }"
  />
</template>
