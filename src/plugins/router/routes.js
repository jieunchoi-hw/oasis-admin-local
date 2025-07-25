export const routes = [
  { path: '/', redirect: '/dashboard' },
  {
    path: '/',
    component: () => import('@/layouts/default.vue'),
    children: [
      {
        path: 'dashboard',
        component: () => import('@/pages/dashboard.vue'),
      },
      {
        path: 'account-settings',
        component: () => import('@/pages/account-settings.vue'),
      },
      {
        path: 'typography',
        component: () => import('@/pages/typography.vue'),
      },
      {
        path: 'icons',
        component: () => import('@/pages/icons.vue'),
      },
      {
        path: 'cards',
        component: () => import('@/pages/cards.vue'),
      },
      {
        path: 'tables',
        component: () => import('@/pages/tables.vue'),
      },
      {
        path: 'form-layouts',
        component: () => import('@/pages/form-layouts.vue'),
      },
      {
        path: 'system/dashboard',
        component: () => import('@/pages/system/dashboard.vue'),
      },
      {
        path: 'system/admin-users',
        component: () => import('@/pages/system/admin-users.vue'),
      },
      {
        path: 'system/llm-management',
        component: () => import('@/pages/system/admin-llm.vue'),
      },
      {
        path: 'system/mcp-server',
        component: () => import('@/pages/system/admin-mcp.vue'),
      },
      {
        path: 'system/vector-db',
        component: () => import('@/pages/system/admin-vectordb.vue'),
      },
      {
        path: 'system/official-secretary',
        component: () => import('@/pages/system/admin-secretary.vue'),
      },
      {
        path: 'system/tenant-management',
        component: () => import('@/pages/system/admin-tenant.vue'),
      },
      {
        path: 'system/tenant-settings',
        component: () => import('@/pages/system/tenant-settings/index.vue'),
        children: [
          { path: '', redirect: 'admin-users' },
          {
            path: 'admin-users',
            component: () =>
              import('@/pages/system/tenant-settings/TenantAdminTab.vue'),
          },
          {
            path: 'llm',
            component: () =>
              import('@/pages/system/tenant-settings/LLMTab.vue'),
          },
          {
            path: 'mcp-server',
            component: () =>
              import('@/pages/system/tenant-settings/MCPServerTab.vue'),
          },
          {
            path: 'vectordb',
            component: () =>
              import('@/pages/system/tenant-settings/VectorDBTab.vue'),
          },
          {
            path: 'secretary',
            component: () =>
              import('@/pages/system/tenant-settings/SecretaryTab.vue'),
          },
        ],
      },
      {
        path: 'tenant/dashboard',
        component: () => import('@/pages/tenant/dashboard.vue'),
      },
      {
        path: 'tenant/settings',
        component: () => import('@/pages/tenant/settings/index.vue'),
        children: [
          { path: '', redirect: 'basic-info' },
          {
            path: 'basic-info',
            component: () => import('@/pages/tenant/settings/BasicInfoTab.vue'),
          },
          {
            path: 'admin-users',
            component: () => import('@/pages/tenant/settings/AdminUsersTab.vue'),
          },
          {
            path: 'llm-usage',
            component: () => import('@/pages/tenant/settings/LlmUsageTab.vue'),
          },
          {
            path: 'mcp-usage',
            component: () => import('@/pages/tenant/settings/McpUsageTab.vue'),
          },
          {
            path: 'vector-usage',
            component: () => import('@/pages/tenant/settings/VectorUsageTab.vue'),
          },
          {
            path: 'company-secretary',
            component: () => import('@/pages/tenant/settings/CompanySecretaryTab.vue'),
          },
          {
            path: 'secretary-approval',
            component: () => import('@/pages/tenant/settings/SecretaryApprovalTab.vue'),
          },
        ],
      },
      {
        path: 'tenant/workspace-settings',
        component: () => import('@/pages/tenant/workspace-settings/index.vue'),
        children: [
          { path: '', redirect: 'llm-assignment' },
          {
            path: 'llm-assignment',
            component: () => import('@/pages/tenant/workspace-settings/LlmAssignmentTab.vue'),
          },
          {
            path: 'mcp-assignment',
            component: () => import('@/pages/tenant/workspace-settings/McpAssignmentTab.vue'),
          },
          {
            path: 'secretary-assignment',
            component: () => import('@/pages/tenant/workspace-settings/SecretaryAssignmentTab.vue'),
          },
        ],
      },
      {
        path: 'workspace/dashboard',
        component: () => import('@/pages/workspace/dashboard.vue'),
      },
    ],
  },
  {
    path: '/',
    component: () => import('@/layouts/blank.vue'),
    children: [
      {
        path: 'login',
        component: () => import('@/pages/login.vue'),
      },
      {
        path: 'register',
        component: () => import('@/pages/register.vue'),
      },
      {
        path: '/:pathMatch(.*)*',
        component: () => import('@/pages/[...error].vue'),
      },
    ],
  },
];
