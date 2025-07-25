<script setup>
import NavItems from '@/layouts/components/NavItems.vue';
import VerticalNavLayout from '@layouts/components/VerticalNavLayout.vue';
import { useDisplay } from 'vuetify';
import { useRouter } from 'vue-router';

// Components
import Footer from '@/layouts/components/Footer.vue';
import NavbarThemeSwitcher from '@/layouts/components/NavbarThemeSwitcher.vue';
import UserProfile from '@/layouts/components/UserProfile.vue';

// 계정 데이터
const accounts = ref([
  {
    id: 1,
    name: 'choijieun',
    type: 'System',
    bgColor: '#2196F3',
  },
  {
    id: 2,
    name: '한화시스템',
    type: 'Tenant',
    bgColor: '#4CAF50',
  },
  {
    id: 3,
    name: 'AI솔루션팀',
    type: 'Workspace',
    bgColor: '#FFC107',
  },
]);

const currentAccount = ref(accounts.value[0]);
const isAccountMenuOpen = ref(false);
const router = useRouter();
const switchAccount = account => {
  currentAccount.value = account;
  isAccountMenuOpen.value = false;
  
  // 계정 타입에 따라 다른 대시보드 경로로 이동
  if (account.type === 'System') {
    router.push('/dashboard');
  } else if (account.type === 'Tenant') {
    router.push('/tenant/dashboard');
  } else if (account.type === 'Workspace') {
    router.push('/workspace/dashboard');
  } else {
    router.push('/dashboard'); // 기본 경로
  }
};

const display = useDisplay();
const isNavCollapsed = ref(false);
function handleLargeScreenClick() {
  isNavCollapsed.value = !isNavCollapsed.value;
}
</script>

<template>
  <VerticalNavLayout :is-nav-collapsed="isNavCollapsed">
    <!-- 👉 navbar -->
    <template #navbar="{ toggleVerticalOverlayNavActive }">
      <div class="d-flex h-100 align-center">
        <!-- 👉 Vertical nav toggle in overlay mode -->
        <IconBtn
          class="ms-n3"
          @click="
            display.lgAndUp.value
              ? handleLargeScreenClick()
              : toggleVerticalOverlayNavActive(true)
          "
        >
          <VIcon icon="ri-menu-line" />
        </IconBtn>

        <!-- 👉 Search -->
        <div
          class="d-flex align-center cursor-pointer"
          style="user-select: none"
        >
          <!-- 👉 Search Trigger button -->
          <IconBtn>
            <VIcon icon="ri-search-line" />
          </IconBtn>

          <span class="d-none d-md-flex align-center text-disabled">
            <span class="me-3">Search</span>
            <span class="meta-key">&#8984;K</span>
          </span>
        </div>

        <VSpacer />

        <IconBtn>
          <VIcon icon="ri-notification-line" />
        </IconBtn>

        <NavbarThemeSwitcher class="me-2" />

        <!-- 👉 Account Switcher -->
        <VMenu
          v-model="isAccountMenuOpen"
          :close-on-content-click="false"
          location="bottom center"
          offset="5px"
        >
          <template #activator="{ props }">
            <VBtn v-bind="props" variant="text" class="me-2" size="small">
              <VChip
                :style="{
                  backgroundColor: currentAccount.bgColor,
                  color: 'white',
                }"
                size="small"
                class="font-weight-medium"
              >
                {{ currentAccount.type }}
              </VChip>
              <span class="ml-2">{{ currentAccount.name }}</span>
              <VIcon icon="ri-arrow-down-s-line" size="16" class="ms-1" />
            </VBtn>
          </template>

          <VCard>
            <VCardText class="pa-2">
              <VList density="compact" class="pa-0">
                <VListItem
                  v-for="account in accounts"
                  :key="account.id"
                  :active="currentAccount.id === account.id"
                  @click="switchAccount(account)"
                  class="mb-1"
                  density="compact"
                >
                  <template #prepend>
                    <VChip
                      :style="{
                        backgroundColor: account.bgColor,
                        color: 'white',
                      }"
                      size="small"
                      class="font-weight-medium"
                    >
                      {{ account.type }}
                    </VChip>
                  </template>
                  <VListItemTitle class="text-body-2 ml-2">
                    {{ account.name }}
                  </VListItemTitle>
                </VListItem>
              </VList>
            </VCardText>
          </VCard>
        </VMenu>

        <UserProfile />
      </div>
    </template>

    <template #vertical-nav-header="{ toggleIsOverlayNavActive }">
      <RouterLink to="/" class="app-logo app-title-wrapper">
        <!-- eslint-disable vue/no-v-html -->
        <img src="/logo.png" alt="logo" class="d-flex" style="height: 30px" />
        <!-- eslint-enable -->

        <img
          src="/logo_full.png"
          alt="logo"
          style="height: 22px; object-fit: contain"
        />
      </RouterLink>

      <IconBtn
        class="d-block d-lg-none"
        @click="toggleIsOverlayNavActive(false)"
      >
        <VIcon icon="ri-close-line" />
      </IconBtn>
    </template>

    <template #vertical-nav-content>
      <NavItems :current-account-type="currentAccount.type" />
    </template>

    <!-- 👉 Pages -->
    <slot />

    <!-- 👉 Footer -->
    <template #footer>
      <Footer />
    </template>
  </VerticalNavLayout>
</template>

<style lang="scss" scoped>
.meta-key {
  border: thin solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 6px;
  block-size: 1.5625rem;
  line-height: 1.3125rem;
  padding-block: 0.125rem;
  padding-inline: 0.25rem;
}

.app-logo {
  display: flex;
  align-items: center;
  column-gap: 0.75rem;

  .app-logo-title {
    font-size: 1.25rem;
    font-weight: 500;
    line-height: 1.75rem;
    text-transform: uppercase;
  }
}
</style>
