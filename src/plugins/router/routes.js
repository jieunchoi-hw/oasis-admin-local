export const routes = [
  { path: "/", redirect: "/dashboard" },
  {
    path: "/",
    component: () => import("@/layouts/default.vue"),
    children: [
      {
        path: "dashboard",
        component: () => import("@/pages/dashboard.vue"),
      },
      {
        path: "account-settings",
        component: () => import("@/pages/account-settings.vue"),
      },
      {
        path: "typography",
        component: () => import("@/pages/typography.vue"),
      },
      {
        path: "icons",
        component: () => import("@/pages/icons.vue"),
      },
      {
        path: "cards",
        component: () => import("@/pages/cards.vue"),
      },
      {
        path: "tables",
        component: () => import("@/pages/tables.vue"),
      },
      {
        path: "form-layouts",
        component: () => import("@/pages/form-layouts.vue"),
      },
      {
        path: "system/admin-users",
        component: () => import("@/pages/system-admin-users.vue"),
      },
      {
        path: "system/llm-management",
        component: () => import("@/pages/system-admin-llm.vue"),
      },
      {
        path: "system/mcp-server",
        component: () => import("@/pages/system-admin-mcp.vue"),
      },
      {
        path: "system/vector-db",
        component: () => import("@/pages/system-admin-vectordb.vue"),
      },
      {
        path: "system/official-secretary",
        component: () => import("@/pages/system-admin-secretary.vue"),
      },
      {
        path: "system/tenant-management",
        component: () => import("@/pages/system-admin-tenant.vue"),
      },
    ],
  },
  {
    path: "/",
    component: () => import("@/layouts/blank.vue"),
    children: [
      {
        path: "login",
        component: () => import("@/pages/login.vue"),
      },
      {
        path: "register",
        component: () => import("@/pages/register.vue"),
      },
      {
        path: "/:pathMatch(.*)*",
        component: () => import("@/pages/[...error].vue"),
      },
    ],
  },
];
