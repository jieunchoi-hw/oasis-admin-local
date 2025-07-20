<script setup>
import { computed, ref, watch } from "vue";
import { VTable, VBtn, VPagination } from "vuetify/components";

const props = defineProps({
  users: { type: Array, required: true },
  page: { type: Number, required: true },
  itemsPerPage: { type: Number, required: true },
  totalItems: { type: Number, required: true },
});
const emit = defineEmits(["edit", "delete", "page-change"]);

const pagedUsers = computed(() => {
  const start = (props.page - 1) * props.itemsPerPage;
  return props.users.slice(start, start + props.itemsPerPage);
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
</script>
<template>
  <VRow>
    <VCol cols="12">
      <VCard rounded="lg" elevation="1">
        <VTable density="comfortable">
          <thead>
            <tr>
              <th>이름</th>
              <th>Tenant 명</th>
              <th>이메일</th>
              <th>권한</th>
              <th>Last Updated</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in pagedUsers" :key="user.id">
              <td>{{ user.name }}</td>
              <td>{{ user.tenant }}</td>
              <td>{{ user.email }}</td>
              <td>{{ user.role }}</td>
              <td>{{ user.updated }}</td>
              <td>
                <VBtn
                  size="small"
                  variant="tonal"
                  color="primary"
                  @click="$emit('edit', user)"
                  >수정</VBtn
                >
                <VBtn
                  size="small"
                  variant="tonal"
                  color="error"
                  class="ml-2"
                  @click="$emit('delete', user)"
                  >삭제</VBtn
                >
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
