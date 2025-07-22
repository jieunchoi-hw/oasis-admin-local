<script setup>
import { ref, watch } from 'vue';
import {
  VDialog,
  VCard,
  VCardTitle,
  VCardText,
  VCardActions,
  VBtn,
  VIcon,
} from 'vuetify/components';

const props = defineProps({
  visible: { type: Boolean, required: true },
  mode: { type: String, required: true }, // 'add' | 'edit'
  title: { type: String, required: true },
  form: { type: Object, required: true },
  fields: { type: Array, required: true }, // [{ key: 'name', label: '이름', type: 'text', required: true }]
  maxWidth: { type: String, default: '500' },
});
const emit = defineEmits(['confirm', 'close', 'update:form']);

// v-model proxy for dialog
const dialogProxy = ref(props.visible);
watch(
  () => props.visible,
  val => {
    dialogProxy.value = val;
  }
);
watch(dialogProxy, val => {
  if (!val) emit('close');
});

function handleConfirm() {
  emit('confirm', { ...props.form });
}

function updateForm(key, value) {
  const updatedForm = { ...props.form, [key]: value };
  emit('update:form', updatedForm);
}
</script>

<template>
  <VDialog v-model="dialogProxy" :max-width="maxWidth">
    <VCard>
      <VCardTitle class="d-flex align-center justify-space-between">
        <span class="font-weight-bold">{{ title }}</span>
        <VBtn icon @click="$emit('close')" color="black" variant="plain">
          <VIcon icon="ri-close-line" />
        </VBtn>
      </VCardTitle>
      <VCardText>
        <!-- Slot을 통한 커스텀 폼 필드 -->
        <slot :form="form" :update-form="updateForm" :fields="fields" />
      </VCardText>
      <VCardActions class="justify-end">
        <VBtn color="black" @click="handleConfirm">
          {{ mode === 'add' ? 'Confirm' : 'Save' }}
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<style scoped></style>
