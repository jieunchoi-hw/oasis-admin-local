<template>
  <!-- eslint-disable vue/no-v-html -->

  <div class="auth-wrapper d-flex">
    <!-- Left Column - Registration Form -->
    <div class="auth-form-section d-flex align-center justify-center pa-4">
      <div class="auth-form-content">
        <div class="justify-center mb-6">
          <RouterLink to="/" class="d-flex align-center gap-3">
            <!-- eslint-disable vue/no-v-html -->
            <img src="/logo.png" alt="logo" class="me-2" style="height: 40px" />
            <img
              src="/logo_full.png"
              alt="logo"
              style="height: 32px; object-fit: contain"
            />
          </RouterLink>
        </div>

        <div class="pt-2 mb-6">
          <h4 class="text-h4 mb-1">Adventure starts here 🚀</h4>
          <p class="mb-0">Make your app management easy and fun!</p>
        </div>

        <VForm @submit.prevent="() => {}">
          <VRow>
            <!-- Username -->
            <VCol cols="12">
              <VTextField
                v-model="form.username"
                label="Username"
                placeholder="Johndoe"
              />
            </VCol>
            <!-- email -->
            <VCol cols="12">
              <VTextField
                v-model="form.email"
                label="Email"
                placeholder="johndoe@email.com"
                type="email"
              />
            </VCol>

            <!-- password -->
            <VCol cols="12">
              <VTextField
                v-model="form.password"
                label="Password"
                placeholder="••••••••••••"
                :type="isPasswordVisible ? 'text' : 'password'"
                autocomplete="password"
                :append-inner-icon="
                  isPasswordVisible ? 'ri-eye-off-line' : 'ri-eye-line'
                "
                @click:append-inner="isPasswordVisible = !isPasswordVisible"
              />
              <div class="d-flex align-center my-6">
                <VCheckbox
                  id="privacy-policy"
                  v-model="form.privacyPolicies"
                  inline
                />
                <VLabel for="privacy-policy" style="opacity: 1">
                  <span class="me-1">I agree to</span>
                  <a href="javascript:void(0)" class="text-primary"
                    >privacy policy & terms</a
                  >
                </VLabel>
              </div>

              <VBtn block type="submit" to="/"> Sign up </VBtn>
            </VCol>

            <!-- login instead -->
            <VCol cols="12" class="text-center text-base">
              <span>Already have an account?</span>
              <RouterLink class="text-primary ms-2" to="login">
                Sign in instead
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
      </div>
    </div>

    <!-- Right Column - Video Background -->
    <div class="auth-video-section">
      <video
        class="login-bg-video"
        src="@/assets/video/background_video.mp4"
        autoplay
        muted
        loop
        playsinline
      ></video>
    </div>
  </div>
</template>

<script setup>
import { useTheme } from 'vuetify';
import AuthProvider from '@/views/pages/authentication/AuthProvider.vue';
import authV1MaskDark from '@images/pages/auth-v1-mask-dark.png';
import authV1MaskLight from '@images/pages/auth-v1-mask-light.png';
import authV1Tree2 from '@images/pages/auth-v1-tree-2.png';
import authV1Tree from '@images/pages/auth-v1-tree.png';

const form = ref({
  username: '',
  email: '',
  password: '',
  privacyPolicies: false,
});

const vuetifyTheme = useTheme();

const authThemeMask = computed(() => {
  return vuetifyTheme.global.name.value === 'light'
    ? authV1MaskLight
    : authV1MaskDark;
});

const isPasswordVisible = ref(false);
</script>

<style lang="scss">
@use '@core/scss/template/pages/page-auth';

// Two-column layout styles
.auth-wrapper {
  min-height: 100vh;
  width: 100%;
}

.auth-form-section {
  width: 30%;
  background: white;
  position: relative;
  z-index: 2;
}

.auth-form-content {
  width: 100%;
  max-width: 320px;
}

.auth-video-section {
  width: 80%;
  position: relative;
  overflow: hidden;
}

// 로그인 배경 비디오 스타일
.login-bg-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
}

// Responsive design
@media (max-width: 960px) {
  .auth-wrapper {
    flex-direction: column;
  }

  .auth-form-section {
    width: 100%;
    min-height: 100vh;
  }

  .auth-video-section {
    display: none;
  }
}
</style>
