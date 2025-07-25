<script setup>
import { useTheme } from 'vuetify';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import AuthProvider from '@/views/pages/authentication/AuthProvider.vue';
import authV1MaskDark from '@images/pages/auth-v1-mask-dark.png';
import authV1MaskLight from '@images/pages/auth-v1-mask-light.png';
import authV1Tree2 from '@images/pages/oasisImg.png';
import authV1Tree from '@images/pages/oasisImg2.png';

const form = ref({
  email: '',
  password: '',
  remember: false,
});

const router = useRouter();
const userStore = useUserStore();

const vuetifyTheme = useTheme();

const authThemeMask = computed(() => {
  return vuetifyTheme.global.name.value === 'light'
    ? authV1MaskLight
    : authV1MaskDark;
});

const isPasswordVisible = ref(false);

// 로그인 처리 함수
const handleLogin = () => {
  // 데모 목적으로 이메일이 'admin@example.com'이면 'admin' 권한, 그 외는 'system' 권한을 부여
  const role = form.value.email === 'admin@example.com' ? 'admin' : 'system';
  
  // 사용자 정보 저장
  userStore.setUser({
    email: form.value.email,
    role: role,
  });
  
  // 권한에 따라 리다이렉션
  if (role === 'system') {
    router.push('/system/dashboard');
  } else {
    router.push('/dashboard');
  }
};
</script>

<template>
  <!-- eslint-disable vue/no-v-html -->

  <div class="auth-wrapper d-flex align-center justify-center pa-4">
    <!-- 배경 비디오 -->
    <video
      class="login-bg-video"
      src="@/assets/video/background_video.mp4"
      autoplay
      muted
      loop
      playsinline
    ></video>

    <VCard class="auth-card pa-4 pt-7" max-width="448">
      <VCardItem class="d-flex align-center justify-center">
        <!-- eslint-disable vue/no-v-html -->

        <img src="/logo.png" alt="logo" class="me-2" style="height: 40px" />
        <img src="/logo_full.png" alt="logo" style="height: 40px" />
      </VCardItem>

      <VCardText class="pt-2">
        <h4 class="text-h4 mb-1">Welcome to OASIS! 👋🏻</h4>
        <p class="mb-0">
          Please sign-in to your account and start the adventure
        </p>
      </VCardText>

      <VCardText>
        <VForm @submit.prevent="() => {}">
          <VRow>
            <!-- email -->
            <VCol cols="12">
              <VTextField v-model="form.email" label="Email" type="email" />
            </VCol>

            <!-- password -->
            <VCol cols="12">
              <VTextField
                v-model="form.password"
                label="Password"
                placeholder="············"
                :type="isPasswordVisible ? 'text' : 'password'"
                autocomplete="password"
                :append-inner-icon="
                  isPasswordVisible ? 'ri-eye-off-line' : 'ri-eye-line'
                "
                @click:append-inner="isPasswordVisible = !isPasswordVisible"
              />

              <!-- remember me checkbox -->
              <div
                class="d-flex align-center justify-space-between flex-wrap my-6"
              >
                <VCheckbox
                  v-model="form.remember"
                  label="Remember me"
                  density="comfortable"
                />

                <a class="text-primary" href="javascript:void(0)">
                  Forgot Password?
                </a>
              </div>

              <!-- login button -->
              <VBtn block type="submit" @click="handleLogin"> Login </VBtn>
            </VCol>

            <!-- create account -->
            <VCol cols="12" class="text-center text-base">
              <span>New on our platform?</span>
              <RouterLink class="text-primary ms-2" to="/register">
                Create an account
              </RouterLink>
            </VCol>

            <VCol cols="12" class="d-flex align-center">
              <VDivider />
              <span class="mx-4">or</span>
              <VDivider />
            </VCol>

            <!-- auth providers -->
            <VCol cols="12" class="text-center">
              <AuthProvider />
            </VCol>
          </VRow>
        </VForm>
      </VCardText>
    </VCard>
    <!-- <VImg
      :src="authV1Tree2"
      class="auth-footer-end-tree d-none d-md-block"
      :width="200"
    />

    <VImg
      class="auth-footer-start-tree d-none d-md-block"
      :src="authV1Tree"
      :width="180"
    /> -->

    <!-- bg img -->
    <!-- <VImg class="auth-footer-mask d-none d-md-block" :src="authThemeMask" /> -->
  </div>
</template>

<style lang="scss">
@use '@core/scss/template/pages/page-auth';

// 로그인 배경 비디오 스타일
.login-bg-video {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  object-fit: cover;
  z-index: 0;
  pointer-events: none;
}

.auth-wrapper {
  position: relative;
  z-index: 1;
}

.checkbox-remember {
  .v-selection-control {
    min-height: 40px;

    .v-selection-control__input {
      min-width: 20px;
      min-height: 20px;
    }

    .v-label {
      font-size: 13px;
      line-height: 1.4;
    }
  }
}
</style>
