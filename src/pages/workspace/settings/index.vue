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
  { title: 'Workspace 사용자 관리', value: 'users' },
  { title: 'LLM 배정', value: 'llm-assignment' },
  { title: 'MCP 서버 배정', value: 'mcp-assignment' },
  { title: '비서 배정', value: 'secretary-assignment' },
];

// 현재 라우트의 마지막 부분에서 탭 값을 추출
const tab = ref(route.path.split('/').pop() || 'users');

// 탭이 변경되면 라우터 업데이트
watch(tab, (newValue) => {
  router.push(`/workspace/settings/${newValue}`);
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
