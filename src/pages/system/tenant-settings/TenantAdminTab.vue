<template>
  <div>
    <div class="mb-4 text-body-2 text-medium-emphasis">
      ■ Tenant Admin/Operator를 지정하거나 삭제한다.
    </div>
    <!-- 필터/검색 영역 -->
    <div class="d-flex align-center mb-4 gap-2">
      <VSpacer />
      <VSelect
        v-model="selectedColumn"
        :items="filterColumns"
        item-title="label"
        item-value="key"
        style="max-width: 140px"
        density="compact"
      />
      <VTextField
        v-model="searchValue"
        label="사용자 검색"
        clearable
        density="compact"
        style="max-width: 200px"
        @keyup.enter="page = 1"
      />
      <VBtn variant="outlined" color="primary" @click="page = 1">검색</VBtn>
      <VBtn color="primary" @click="openAddDialog" style="min-width: 120px"
        >+ New</VBtn
      >
    </div>
    <!-- 공통 테이블 -->
    <CommonTable
      :data="filteredAdmins"
      :columns="columns"
      :page="page"
      :itemsPerPage="itemsPerPage"
      :totalItems="totalItems"
      :actions="['edit', 'delete']"
      @edit="openEditDialog"
      @delete="handleDelete"
      @page-change="handlePageChange"
    />
    <!-- 추가/수정 다이얼로그 -->
    <CommonModal
      :visible="dialogAdd"
      mode="add"
      title="Tenant Admin 추가"
      :form="modalForm"
      :fields="modalFields"
      @confirm="handleAddConfirm"
      @close="dialogAdd = false"
      @update:form="handleFormUpdate"
    >
      <template #default="{ form, updateForm }">
        <VTextField
          v-model="form.name"
          label="이름"
          class="mb-3"
          @update:model-value="(val) => updateForm('name', val)"
        />
        <VTextField
          v-model="form.userId"
          label="ID"
          class="mb-3"
          @update:model-value="(val) => updateForm('userId', val)"
        />
        <VTextField
          v-model="form.email"
          label="이메일"
          class="mb-3"
          @update:model-value="(val) => updateForm('email', val)"
        />
        <VSelect
          v-model="form.role"
          :items="roles"
          label="권한"
          class="mb-3"
          @update:model-value="(val) => updateForm('role', val)"
        />
      </template>
    </CommonModal>
    <CommonModal
      :visible="dialogEdit"
      mode="edit"
      :title="`${modalForm.name} 수정`"
      :form="modalForm"
      :fields="modalFields"
      @confirm="handleEditConfirm"
      @close="dialogEdit = false"
      @update:form="handleFormUpdate"
    >
      <template #default="{ form, updateForm }">
        <VTextField
          v-model="form.name"
          label="이름"
          class="mb-3"
          @update:model-value="(val) => updateForm('name', val)"
        />
        <VTextField
          v-model="form.userId"
          label="ID"
          class="mb-3"
          @update:model-value="(val) => updateForm('userId', val)"
        />
        <VTextField
          v-model="form.email"
          label="이메일"
          class="mb-3"
          @update:model-value="(val) => updateForm('email', val)"
        />
        <VSelect
          v-model="form.role"
          :items="roles"
          label="권한"
          class="mb-3"
          @update:model-value="(val) => updateForm('role', val)"
        />
      </template>
    </CommonModal>
  </div>
</template>
<script setup>
import { ref, computed } from "vue";
import CommonTable from "../../../components/CommonTable.vue";
import CommonModal from "../../../components/CommonModal.vue";
import { VBtn, VSelect, VTextField, VSpacer } from "vuetify/components";

// ... 기존 system-tenant-settings.vue에서 이 탭에 해당하는 상태/함수만 복사 ...
// (필요한 상태/props/emit 등은 실제 분리 시 추가로 조정)
</script>
