<script setup>
import { computed, ref, watch } from "vue";
import {
  VTable,
  VBtn,
  VPagination,
  VRow,
  VCol,
  VCard,
} from "vuetify/components";

const props = defineProps({
  data: { type: Array, required: true },
  columns: { type: Array, required: true }, // [{ key: 'name', label: '이름', width: 'auto' }]
  page: { type: Number, required: true },
  itemsPerPage: { type: Number, required: true },
  totalItems: { type: Number, required: true },
  actions: { type: Array, default: () => [] }, // ['edit', 'delete']
  actionLabels: {
    type: Object,
    default: () => ({ edit: "수정", delete: "삭제" }),
  },
  actionColors: {
    type: Object,
    default: () => ({ edit: "primary", delete: "error" }),
  },
});
const emit = defineEmits(["edit", "delete", "page-change", "action"]);

const pagedData = computed(() => {
  const start = (props.page - 1) * props.itemsPerPage;
  return props.data.slice(start, start + props.itemsPerPage);
});

// 페이지네이션 v-model을 위한 프록시
const pageProxy = ref(props.page);
watch(
  () => props.page,
  (val) => {
    pageProxy.value = val;
  }
);
watch(pageProxy, (val) => {
  if (val !== props.page) emit("page-change", val);
});

function handleAction(action, item) {
  emit("action", { action, item });
  if (action === "edit") emit("edit", item);
  if (action === "delete") emit("delete", item);
}
</script>

<template>
  <VRow>
    <VCol cols="12">
      <VCard rounded="lg" elevation="1">
        <VTable density="comfortable">
          <thead>
            <tr>
              <th
                v-for="column in columns"
                :key="column.key"
                :style="{ width: column.width || 'auto' }"
              >
                {{ column.label }}
              </th>
              <th v-if="actions.length > 0">관리</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in pagedData" :key="item.id">
              <td v-for="column in columns" :key="column.key">
                <!-- Slot을 통한 커스텀 렌더링 -->
                <slot
                  :name="`cell-${column.key}`"
                  :item="item"
                  :value="item[column.key]"
                >
                  {{ item[column.key] }}
                </slot>
              </td>
              <td v-if="actions.length > 0">
                <VBtn
                  v-for="action in actions"
                  :key="action"
                  size="small"
                  variant="tonal"
                  :color="actionColors[action]"
                  :class="{ 'ml-2': action !== actions[0] }"
                  @click="handleAction(action, item)"
                >
                  {{ actionLabels[action] }}
                </VBtn>
              </td>
            </tr>
          </tbody>
        </VTable>
      </VCard>
    </VCol>
  </VRow>

  <VPagination
    v-model="pageProxy"
    class="mt-4"
    :length="Math.ceil(totalItems / itemsPerPage)"
    size="small"
    @update:modelValue="(val) => $emit('page-change', val)"
  />
</template>

<style scoped></style>
