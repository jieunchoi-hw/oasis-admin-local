<script setup>
const statistics = [
  {
    title: '인증 요청',
    stats: '1,234',
    icon: 'ri-shield-user-line',
    color: 'primary',
  },
  {
    title: '채팅 메시지',
    stats: '2,345',
    icon: 'ri-message-2-line',
    color: 'success',
  },
  {
    title: 'RAG 활용 쿼리',
    stats: '520',
    icon: 'ri-database-2-line',
    color: 'warning',
  },
  {
    title: '활성 사용자',
    stats: '123',
    icon: 'ri-user-smile-line',
    color: 'info',
  },
];

const moreList = [
  {
    title: 'Share',
    value: 'Share',
  },
  {
    title: 'Refresh',
    value: 'Refresh',
  },
  {
    title: 'Update',
    value: 'Update',
  },
];
</script>

<template>
  <VCard title="OASIS 주요 지표">
    <template #subtitle>
      <p class="text-body-1 mb-0">오늘 기준 주요 서비스 현황입니다.</p>
    </template>

    <template #append>
      <MoreBtn :menu-list="moreList" />
    </template>

    <VCardText class="pt-10">
      <VRow>
        <VCol
          v-for="item in statistics"
          :key="item.title"
          cols="12"
          sm="6"
          md="3"
        >
          <div class="d-flex align-center gap-x-3">
            <VAvatar :color="item.color" rounded size="40" class="elevation-2">
              <VIcon size="24" :icon="item.icon" />
            </VAvatar>

            <div class="d-flex flex-column">
              <div class="text-body-1">
                {{ item.title }}
              </div>
              <h5 class="text-h5">
                {{ item.stats }}
              </h5>
            </div>
          </div>
        </VCol>
      </VRow>
    </VCardText>
  </VCard>
</template>
