<script setup>
import { ref, watch } from "vue";
import {
  VDialog,
  VCard,
  VCardTitle,
  VCardText,
  VCardActions,
  VTextField,
  VSelect,
  VBtn,
  VIcon,
} from "vuetify/components";

const props = defineProps({
  visible: { type: Boolean, required: true },
  mode: { type: String, required: true }, // 'add' | 'edit'
  user: { type: Object, default: null },
  roles: { type: Array, required: true },
});
const emit = defineEmits(["confirm", "close"]);

const form = ref({
  name: "",
  email: "",
  role: props.roles[0],
  description: "",
});

watch(
  () => props.visible,
  (val) => {
    if (val) {
      if (props.mode === "edit" && props.user) {
        form.value = { ...props.user };
      } else {
        form.value = {
          name: "",
          email: "",
          role: props.roles[0],
          description: "",
        };
      }
    }
  }
);

function handleConfirm() {
  emit("confirm", { ...form.value });
}

// v-model proxy for dialog
const dialogProxy = ref(props.visible);
watch(
  () => props.visible,
  (val) => {
    dialogProxy.value = val;
  }
);
watch(dialogProxy, (val) => {
  if (!val) emit("close");
});
</script>
<template>
  <VDialog v-model="dialogProxy" max-width="400">
    <VCard>
      <VCardTitle class="d-flex align-center justify-space-between">
        <span class="font-weight-bold">
          {{ mode === "add" ? "System Admin 추가" : `${form.name} 수정` }}
        </span>
        <VBtn icon @click="$emit('close')" color="black" variant="plain">
          <VIcon icon="ri-close-line" />
        </VBtn>
      </VCardTitle>
      <VCardText>
        <VTextField v-model="form.name" label="이름" class="mb-2" />
        <VTextField
          v-if="mode === 'add'"
          v-model="form.email"
          label="이메일"
          class="mb-2"
        />
        <VSelect v-model="form.role" :items="roles" label="권한" class="mb-2" />
        <VTextField
          v-if="mode === 'edit'"
          v-model="form.description"
          label="Description"
        />
      </VCardText>
      <VCardActions class="justify-end">
        <VBtn color="black" @click="handleConfirm">{{
          mode === "add" ? "Confirm" : "Save"
        }}</VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>
<style scoped></style>
