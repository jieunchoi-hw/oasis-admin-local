<template>
  <div class="text-body-2 text-medium-emphasis mb-4">
    ■ 회사 이름과 로고를 변경할 수 있다.
  </div>
  <div class="form-container">
    <VForm @submit.prevent="saveTenantInfo" class="centered-form">
      <!-- Tenant Name Section -->
      <div class="mb-6">
        <VLabel class="text-body-1 font-weight-medium mb-2">Tenant명</VLabel>
        <VTextField
          v-model="tenantInfo.name"
          placeholder="테넌트명을 입력하세요"
          variant="outlined"
          rounded="lg"
          hide-details
        />
      </div>

      <!-- Tenant Logo Section -->
      <div class="mb-6">
        <VLabel class="text-body-1 font-weight-medium mb-2">Tenant 로고</VLabel>
        <div class="logo-upload-area">
          <VFileInput
            v-model="selectedLogo"
            accept="image/*"
            :show-size="false"
            hide-details
            class="d-none"
            ref="fileInput"
            @change="handleLogoChange"
          />

          <div class="logo-display-area" @click="triggerFileInput">
            <div
              v-if="!tenantInfo.logo && !previewLogo"
              class="logo-placeholder"
            >
              <VIcon icon="ri-image-add-line" size="48" color="grey" />
              <div class="text-body-2 text-grey mt-2">로고를 업로드하세요</div>
            </div>

            <div v-else class="logo-preview">
              <VImg
                :src="previewLogo || tenantInfo.logo"
                alt="Tenant Logo"
                max-width="200"
                max-height="100"
                contain
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Save Button -->
      <div class="d-flex justify-center w-100">
        <VBtn
          type="submit"
          color="primary"
          rounded="lg"
          :loading="isSaving"
          :disabled="!tenantInfo.name"
          class="w-100"
        >
          Save
        </VBtn>
      </div>
    </VForm>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';

const fileInput = ref(null);
const selectedLogo = ref(null);
const previewLogo = ref(null);
const isSaving = ref(false);

const tenantInfo = reactive({
  name: '한화시스템',
  logo: null,
});

const triggerFileInput = () => {
  fileInput.value.$el.querySelector('input').click();
};

const handleLogoChange = file => {
  if (file) {
    const reader = new FileReader();
    reader.onload = e => {
      previewLogo.value = e.target.result;
    };
    reader.readAsDataURL(file);
  } else {
    previewLogo.value = null;
  }
};

const saveTenantInfo = async () => {
  isSaving.value = true;

  try {
    // TODO: API 호출하여 테넌트 정보 저장
    console.log('Saving tenant info:', tenantInfo);

    // 임시로 성공 메시지 표시
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 성공 후 preview 제거하고 실제 로고로 설정
    if (previewLogo.value) {
      tenantInfo.logo = previewLogo.value;
      previewLogo.value = null;
    }

    // 성공 알림 (실제 구현시에는 스토어나 알림 시스템 사용)
    console.log('Tenant info saved successfully');
  } catch (error) {
    console.error('Failed to save tenant info:', error);
  } finally {
    isSaving.value = false;
  }
};

onMounted(() => {
  // TODO: 기존 테넌트 정보 로드
  console.log('Loading tenant info...');
});
</script>

<style scoped>
.form-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  padding: 0 20px;
}

.centered-form {
  width: 100%;
  max-width: 500px;
}

.logo-upload-area {
  position: relative;
}

.logo-display-area {
  border: 2px dashed #e0e0e0;
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  min-height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-display-area:hover {
  border-color: #1976d2;
  background-color: #f5f5f5;
}

.logo-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.logo-preview {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}
</style>
