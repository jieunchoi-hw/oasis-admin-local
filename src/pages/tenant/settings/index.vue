<template>
  <VCard class="mb-6">
    <VTabs v-model="tab">
      <VTab v-for="item in tabItems" :key="item.value" :value="item.value">
        {{ item.title }}
      </VTab>
    </VTabs>

    <VCardText>
      <VWindow v-model="tab" class="disable-tab-transition">
        <VWindowItem v-for="item in tabItems" :key="item.value" :value="item.value">
          <RouterView />
        </VWindowItem>
      </VWindow>
    </VCardText>
  </VCard>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();

const tabItems = [
  { title: '기본정보 관리', value: 'basic-info' },
  { title: 'Tenant Admin 사용자 관리', value: 'admin-users' },
  { title: 'LLM 사용 설정', value: 'llm-usage' },
  { title: 'MCP 서버 사용 설정', value: 'mcp-usage' },
  { title: 'Vector DB 사용 설정', value: 'vector-usage' },
  { title: '전사 비서 설정', value: 'company-secretary' },
  { title: '비서 승인 관리', value: 'secretary-approval' },
];

// 현재 라우트의 마지막 부분에서 탭 값을 추출
const tab = ref(route.path.split('/').pop() || 'basic-info');

// 탭이 변경되면 라우터 업데이트
watch(tab, (newValue) => {
  router.push(`/tenant/settings/${newValue}`);
});

// 라우터가 변경되면 탭 업데이트
watch(
  () => route.path,
  (newValue) => {
    const currentTab = newValue.split('/').pop();
    if (tab.value !== currentTab) {
      tab.value = currentTab;
    }
  }
);
</script>
