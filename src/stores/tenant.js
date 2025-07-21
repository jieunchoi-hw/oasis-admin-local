import { defineStore } from "pinia";

export const useTenantStore = defineStore("tenant", {
  state: () => ({
    tenantId: 1, // 기본값(최초 진입시 1번)
  }),
  actions: {
    setTenantId(id) {
      this.tenantId = id;
    },
  },
});
