<template>
  <div>
    <!-- 상단 필터 및 검색 영역 -->
    <div class="d-flex justify-space-between mb-4">
      <!-- 상태 필터 -->
      <VBtnToggle
        v-model="selectedStatus"
        color="primary"
        mandatory
        density="compact"
        variant="outlined"
      >
        <VBtn value="all">ALL</VBtn>
        <VBtn value="waiting">대기중</VBtn>
        <VBtn value="approved">승인</VBtn>
        <VBtn value="pending">보류</VBtn>
        <VBtn value="denied">거절</VBtn>
      </VBtnToggle>

      <!-- 검색 및 뷰 전환 -->
      <div class="d-flex align-center gap-4">
        <!-- 검색 영역 -->
        <div class="d-flex align-center gap-2">
          <VSelect
            v-model="selectedSecretary"
            :items="secretaryOptions"
            variant="outlined"
            density="compact"
            hide-details
            style="min-width: 150px"
          />
          <VTextField
            v-model="searchQuery"
            label="검색어"
            variant="outlined"
            density="compact"
            hide-details
            style="min-width: 200px"
          />
          <VBtn color="primary" variant="outlined"> 검색 </VBtn>
        </div>

        <!-- 뷰 전환 버튼 -->
        <div class="d-flex align-center gap-1">
          <VBtn
            :color="viewMode === 'card' ? 'primary' : 'secondary'"
            variant="text"
            size="small"
            icon="ri-grid-line"
            @click="viewMode = 'card'"
          />
          <VBtn
            :color="viewMode === 'list' ? 'primary' : 'secondary'"
            variant="text"
            size="small"
            icon="ri-list-check"
            @click="viewMode = 'list'"
          />
        </div>
      </div>
    </div>

    <!-- 메인 콘텐츠 영역 -->
    <div v-if="viewMode === 'card'" class="d-flex flex-wrap gap-4">
      <!-- 카드형 뷰 -->
      <VCard
        v-for="request in filteredRequests"
        :key="request.id"
        class="request-card"
        style="flex: 1 1 0; min-width: 300px; min-height: 130px"
      >
        <VCardText class="pa-3">
          <div class="d-flex justify-space-between align-start mb-2">
            <div class="flex-grow-1">
              <div class="text-h5 font-weight-medium mb-1">
                {{ request.secretaryName }}
              </div>
              <div class="text-body-2 text-medium-emphasis">
                {{ request.team }} / {{ request.requester }}
              </div>
              <div class="text-body-2 text-medium-emphasis mt-1">
                {{ request.message }}
              </div>
            </div>
            <VBtn
              :color="getStatusColor(request.status)"
              size="small"
              variant="tonal"
              class="text-caption"
            >
              {{ getStatusText(request.status) }}
            </VBtn>
          </div>

          <div class="d-flex justify-space-between align-center mt-2">
            <div class="text-caption text-medium-emphasis">
              요청일자 {{ formatDate(request.requestDate) }}
            </div>
            <VBtn
              variant="text"
              size="small"
              color="primary"
              @click="openRequestModal(request)"
            >
              요청 정보
            </VBtn>
          </div>
        </VCardText>
      </VCard>
    </div>

    <!-- 목록형 뷰 -->
    <CommonTable
      v-else
      :data="filteredRequests"
      :columns="tableColumns"
      :page="currentPage"
      :items-per-page="itemsPerPage"
      :total-items="filteredRequests.length"
      :actions="['view']"
      :action-labels="{ view: '요청 정보' }"
      :action-colors="{ view: 'primary' }"
      @action="handleTableAction"
    >
      <template #cell-status="{ value }">
        <VBtn
          :color="getStatusColor(value)"
          size="small"
          variant="tonal"
          class="text-caption"
        >
          {{ getStatusText(value) }}
        </VBtn>
      </template>
    </CommonTable>

    <!-- 요청 정보 모달 -->
    <VDialog v-model="showRequestModal" max-width="500">
      <VCard>
        <VCardTitle class="d-flex justify-space-between align-center">
          요청 정보
          <VBtn
            icon="ri-close-line"
            variant="text"
            @click="showRequestModal = false"
          />
        </VCardTitle>

        <VCardText>
          <div v-if="selectedRequest" class="d-flex flex-column gap-4">
            <!-- 상태 배지 -->
            <div class="d-flex justify-center">
              <VBtn
                :color="getStatusColor(selectedRequest.status)"
                size="small"
                variant="tonal"
                class="text-caption"
              >
                {{ getStatusText(selectedRequest.status) }}
              </VBtn>
            </div>

            <!-- 요청 정보 -->
            <div class="d-flex flex-column gap-3">
              <div>
                <div class="text-body-2 font-weight-medium mb-1">비서명</div>
                <div class="text-body-1">
                  {{ selectedRequest.secretaryName }}
                </div>
              </div>

              <div>
                <div class="text-body-2 font-weight-medium mb-1">요청팀</div>
                <div class="text-body-1">{{ selectedRequest.team }}</div>
              </div>

              <div>
                <div class="text-body-2 font-weight-medium mb-1">요청자</div>
                <div class="text-body-1">{{ selectedRequest.requester }}</div>
              </div>

              <div>
                <div class="text-body-2 font-weight-medium mb-1">
                  요청 메시지
                </div>
                <div class="text-body-1">{{ selectedRequest.message }}</div>
              </div>

              <div>
                <div class="text-body-2 font-weight-medium mb-1">요청 일자</div>
                <div class="text-body-1">
                  {{ formatDate(selectedRequest.requestDate) }}
                </div>
              </div>
            </div>

            <!-- 처리 상태 -->
            <div>
              <div class="text-body-2 font-weight-medium mb-2">처리</div>
              <VSelect
                v-model="selectedRequest.status"
                :items="statusOptions"
                variant="outlined"
                density="compact"
                hide-details
              />
            </div>

            <!-- 메시지 -->
            <div>
              <div class="text-body-2 font-weight-medium mb-2">Message</div>
              <VTextarea
                v-model="selectedRequest.responseMessage"
                variant="outlined"
                rows="3"
                placeholder="처리 메시지를 입력하세요"
                hide-details
              />
            </div>

            <!-- 담당자 -->
            <div>
              <div class="text-body-2 font-weight-medium mb-1">담당자</div>
              <div class="text-body-1">{{ selectedRequest.assignee }}</div>
            </div>
          </div>
        </VCardText>

        <VCardActions class="d-flex justify-center">
          <VBtn
            color="primary"
            size="large"
            @click="saveRequest"
            :loading="isSaving"
          >
            Save
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import CommonTable from '@/components/CommonTable.vue';

// 상태 관리
const selectedStatus = ref('all');
const selectedSecretary = ref('비서명');
const searchQuery = ref('');
const viewMode = ref('card');
const showRequestModal = ref(false);
const selectedRequest = ref(null);
const isSaving = ref(false);

// 테이블 관련 상태
const currentPage = ref(1);
const itemsPerPage = ref(10);

// 테이블 컬럼 정의
const tableColumns = ref([
  { key: 'secretaryName', label: '비서명', width: '15%' },
  { key: 'team', label: '요청팀', width: '15%' },
  { key: 'requester', label: '요청자', width: '10%' },
  { key: 'message', label: '요청 메시지', width: '25%' },
  { key: 'status', label: 'Status', width: '10%' },
  { key: 'requestDate', label: '요청 일자 (Request date)', width: '15%' },
]);

// 옵션 데이터

const secretaryOptions = ref([
  '비서명',
  '신중한 똑쟁이',
  '진지한 똑쟁이',
  '글잘쓰는 지은이',
  'STT특화',
]);

const statusOptions = ref([
  { title: '대기중', value: 'waiting' },
  { title: '승인', value: 'approved' },
  { title: '보류', value: 'pending' },
  { title: '거절', value: 'denied' },
]);

// 요청 데이터
const requests = ref([
  {
    id: 1,
    secretaryName: '신중한 똑쟁이',
    team: 'AI솔루션팀',
    requester: '최지은',
    message: 'xx업무에 팀원 모두가 활용하려고 함.',
    status: 'waiting',
    requestDate: '2025-05-12 10:21',
    responseMessage: '해당 비서는 부서단위에서 사용할 수 없습니다.',
    assignee: '김종성',
  },
  {
    id: 2,
    secretaryName: '진지한 똑쟁이',
    team: 'AI솔루션팀',
    requester: '최지은',
    message: 'xx업무에 팀원 모두가 활용하려고 함.',
    status: 'approved',
    requestDate: '2025-05-12 10:21',
    responseMessage: '승인되었습니다.',
    assignee: '김종성',
  },
  {
    id: 3,
    secretaryName: '신중한 똑쟁이',
    team: 'AI솔루션팀',
    requester: '최지은',
    message: 'xx업무에 팀원 모두가 활용하려고 함.',
    status: 'denied',
    requestDate: '2025-05-12 10:21',
    responseMessage: '해당 비서는 부서단위에서 사용할 수 없습니다.',
    assignee: '김종성',
  },
  {
    id: 4,
    secretaryName: '글잘쓰는 지은이',
    team: 'AI솔루션팀',
    requester: '최지은',
    message: 'xx업무에 팀원 모두가 활용하려고 함.',
    status: 'waiting',
    requestDate: '2025-05-12 10:21',
    responseMessage: '',
    assignee: '김종성',
  },
  {
    id: 5,
    secretaryName: 'STT특화',
    team: 'AI솔루션팀',
    requester: '최지은',
    message: 'xx업무에 팀원 모두가 활용하려고 함.',
    status: 'waiting',
    requestDate: '2025-05-12 10:21',
    responseMessage: '',
    assignee: '김종성',
  },
  {
    id: 6,
    secretaryName: '신중한 똑쟁이',
    team: 'AI솔루션팀',
    requester: '최지은',
    message: 'xx업무에 팀원 모두가 활용하려고 함.',
    status: 'approved',
    requestDate: '2025-05-12 10:21',
    responseMessage: '승인되었습니다.',
    assignee: '김종성',
  },
  {
    id: 7,
    secretaryName: '신중한 똑쟁이',
    team: 'AI솔루션팀',
    requester: '최지은',
    message: 'xx업무에 팀원 모두가 활용하려고 함.',
    status: 'waiting',
    requestDate: '2025-05-12 10:21',
    responseMessage: '',
    assignee: '김종성',
  },
  {
    id: 8,
    secretaryName: '신중한 똑쟁이',
    team: 'AI솔루션팀',
    requester: '최지은',
    message: 'xx업무에 팀원 모두가 활용하려고 함.',
    status: 'waiting',
    requestDate: '2025-05-12 10:21',
    responseMessage: '',
    assignee: '김종성',
  },
  {
    id: 9,
    secretaryName: '신중한 똑쟁이',
    team: 'AI솔루션팀',
    requester: '최지은',
    message: 'xx업무에 팀원 모두가 활용하려고 함.',
    status: 'waiting',
    requestDate: '2025-05-12 10:21',
    responseMessage: '',
    assignee: '김종성',
  },
]);

// 필터링된 요청 목록
const filteredRequests = computed(() => {
  let filtered = requests.value;

  // 상태 필터
  if (selectedStatus.value !== 'all') {
    filtered = filtered.filter(
      request => request.status === selectedStatus.value
    );
  }

  // 비서 필터
  if (selectedSecretary.value && selectedSecretary.value !== '비서명') {
    filtered = filtered.filter(
      request => request.secretaryName === selectedSecretary.value
    );
  }

  // 검색 필터
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      request =>
        request.secretaryName.toLowerCase().includes(query) ||
        request.requester.toLowerCase().includes(query) ||
        request.team.toLowerCase().includes(query)
    );
  }

  return filtered;
});

// 유틸리티 함수들
const getStatusColor = status => {
  const colors = {
    waiting: 'success',
    approved: 'primary',
    pending: 'warning',
    denied: 'error',
  };
  return colors[status] || 'grey';
};

const getStatusText = status => {
  const texts = {
    waiting: 'Waiting',
    approved: 'Approved',
    pending: '보류',
    denied: 'Denied',
  };
  return texts[status] || status;
};

const formatDate = date => {
  return date;
};

const openRequestModal = request => {
  selectedRequest.value = { ...request };
  showRequestModal.value = true;
};

const saveRequest = async () => {
  if (!selectedRequest.value) return;

  isSaving.value = true;

  try {
    // TODO: API 호출하여 요청 상태 업데이트
    console.log('Saving request:', selectedRequest.value);

    // 임시로 성공 메시지 표시
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 로컬 데이터 업데이트
    const index = requests.value.findIndex(
      r => r.id === selectedRequest.value.id
    );
    if (index !== -1) {
      requests.value[index] = { ...selectedRequest.value };
    }

    showRequestModal.value = false;
    console.log('Request saved successfully');
  } catch (error) {
    console.error('Failed to save request:', error);
  } finally {
    isSaving.value = false;
  }
};

// 테이블 액션 핸들러
const handleTableAction = ({ action, item }) => {
  if (action === 'view') {
    openRequestModal(item);
  }
};
</script>

<style scoped>
.request-card {
  transition: all 0.3s ease;
}

.request-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
</style>
