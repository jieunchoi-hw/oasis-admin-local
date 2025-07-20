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
  VSwitch,
} from "vuetify/components";

const props = defineProps({
  visible: { type: Boolean, required: true },
  mode: { type: String, required: true }, // 'add' | 'edit'
  llm: { type: Object, default: null },
  levels: { type: Array, required: true },
  providers: { type: Array, required: true },
  statuses: { type: Array, required: true },
});
const emit = defineEmits(["confirm", "close"]);

const form = ref({
  name: "",
  level: props.levels[0],
  provider: "",
  credential: "",
  control: false,
  status: "",
});

watch(
  () => props.visible,
  (val) => {
    if (val) {
      if (props.mode === "edit" && props.llm) {
        form.value = { ...props.llm };
      } else {
        form.value = {
          name: "",
          level: props.levels[0],
          provider: "",
          credential: "",
          control: false,
          status: "",
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
  <VDialog v-model="dialogProxy" max-width="500">
    <VCard>
      <VCardTitle class="d-flex align-center justify-space-between">
        <span class="font-weight-bold">
          {{ mode === "add" ? "LLM 추가" : `${form.name} 수정` }}
        </span>
        <VBtn icon @click="$emit('close')" color="black" variant="plain">
          <VIcon icon="ri-close-line" />
        </VBtn>
      </VCardTitle>
      <VCardText>
        <VTextField v-model="form.name" label="이름" class="mb-3" />
        <VSelect
          v-model="form.level"
          :items="levels"
          label="Level"
          class="mb-3"
        />
        <VSelect
          v-model="form.provider"
          :items="providers"
          label="Provider"
          class="mb-3"
        />
        <VTextField v-model="form.credential" label="Credential" class="mb-3" />
        <VSelect
          v-model="form.status"
          :items="statuses"
          label="Status"
          class="mb-3"
        />
        <div class="d-flex align-center">
          <VSwitch v-model="form.control" label="Control" color="primary" />
          <span class="text-caption text-medium-emphasis"
            >Private Level에서만 사용 가능</span
          >
        </div>
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
