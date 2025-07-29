<template>
  <div class="d-flex align-center justify-space-between mb-4">
    <div class="d-flex align-center">
      <h2 class="text-h4 font-weight-bold mr-4">Workspace 설정</h2>
      <VTooltip text="Member를 추가합니다." location="top">
        <template #activator="{ props }">
          <VBtn v-bind="props" variant="outlined" @click="openAddUserModal">
            + Member
          </VBtn>
        </template>
      </VTooltip>
    </div>
  </div>
  <div class="mb-4 text-body-1 text-medium-emphasis">
    현재 Workspace에서 사용할 Resource를 배정한다.
  </div>
  <VTabs v-model="tab" class="mb-4">
    <VTab
      min-width="100"
      v-for="item in tabItems"
      :key="item.value"
      :value="item.value"
    >
      {{ item.title }}
    </VTab>
  </VTabs>
  <VCardText>
    <VWindow v-model="tab" class="disable-tab-transition">
      <VWindowItem
        v-for="item in tabItems"
        :key="item.value"
        :value="item.value"
      >
        <RouterView />
      </VWindowItem>
    </VWindow>
  </VCardText>

  <!-- 사용자 추가 모달 -->
  <VDialog v-model="showAddUserModal" max-width="500px">
    <VCard>
      <VCardTitle class="d-flex align-center justify-space-between">
        <span class="font-weight-bold">Add Member</span>
        <VBtn icon @click="closeAddUserModal" color="black" variant="plain">
          <VIcon icon="ri-close-line" />
        </VBtn>
      </VCardTitle>

      <VCardText>
        <VForm ref="addUserForm" v-model="isFormValid">
          <VTextField
            v-model="newUser.name"
            label="이름"
            placeholder="사용자 이름을 입력하세요"
            variant="outlined"
            :rules="nameRules"
            required
            class="mb-4"
          />

          <VTextField
            v-model="newUser.email"
            label="이메일"
            placeholder="example@company.com"
            variant="outlined"
            :rules="emailRules"
            required
            class="mb-4"
          />
        </VForm>
      </VCardText>

      <VCardActions>
        <VSpacer />

        <VBtn
          color="primary"
          @click="addUser"
          :loading="isAddingUser"
          :disabled="!isFormValid"
        >
          Confirm
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useWorkspaceUsersStore } from '@/stores/workspaceUsers';

const router = useRouter();
const route = useRoute();
const workspaceUsersStore = useWorkspaceUsersStore();

const tabItems = [
  { title: 'Workspace 사용자 관리', value: 'users' },
  { title: 'LLM 배정', value: 'llm-assignment' },
  { title: 'MCP 서버 배정', value: 'mcp-assignment' },
  { title: '비서 배정', value: 'secretary-assignment' },
];

// 현재 라우트의 마지막 부분에서 탭 값을 추출
const tab = ref(route.path.split('/').pop() || 'users');

// 탭이 변경되면 라우터 업데이트
watch(tab, newValue => {
  router.push(`/workspace/settings/${newValue}`);
});

// 라우터가 변경되면 탭 업데이트
watch(
  () => route.path,
  newValue => {
    const currentTab = newValue.split('/').pop();
    if (tab.value !== currentTab) {
      tab.value = currentTab;
    }
  }
);

// 모달 관련 상태
const showAddUserModal = ref(false);
const isAddingUser = ref(false);
const addUserForm = ref(null);
const isFormValid = ref(false);

// 새 사용자 데이터
const newUser = ref({
  name: '',
  email: '',
});

// 폼 검증 규칙
const nameRules = [
  v => !!v || '이름을 입력해주세요',
  v => v.length >= 2 || '이름은 2자 이상이어야 합니다',
];

const emailRules = [
  v => !!v || '이메일을 입력해주세요',
  v => /.+@.+\..+/.test(v) || '올바른 이메일 형식을 입력해주세요',
];

// 모달 열기
const openAddUserModal = () => {
  showAddUserModal.value = true;
  resetNewUserForm();
};

// 모달 닫기
const closeAddUserModal = () => {
  showAddUserModal.value = false;
  resetNewUserForm();
};

// 새 사용자 폼 초기화
const resetNewUserForm = () => {
  newUser.value = {
    name: '',
    email: '',
  };
  if (addUserForm.value) {
    addUserForm.value.reset();
  }
};

// 사용자 추가
const addUser = async () => {
  if (!isFormValid.value) {
    return;
  }

  try {
    isAddingUser.value = true;

    // 새 사용자 추가
    const addedUser = workspaceUsersStore.addUser({
      name: newUser.value.name,
      email: newUser.value.email,
    });

    console.log('새 사용자가 추가되었습니다:', addedUser);

    // 모달 닫기
    closeAddUserModal();

    // 성공 메시지 표시 (선택사항)
    // showSuccessMessage('사용자가 성공적으로 추가되었습니다.');
  } catch (error) {
    console.error('사용자 추가 실패:', error);
    // 에러 메시지 표시 (선택사항)
    // showErrorMessage('사용자 추가에 실패했습니다.');
  } finally {
    isAddingUser.value = false;
  }
};
</script>
