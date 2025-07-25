<script setup>
import aviato from '@images/logos/aviato.png';
import bitbank from '@images/logos/bitbank.png';
import zipcar from '@images/logos/zipcar.png';
import openaiLogo from '@/assets/images/logos/openai.png';
import awsLogo from '@/assets/images/logos/aws.png';
import aoaiLogo from '@/assets/images/logos/aoai.png';
const earnings = [
  {
    avatar: openaiLogo,
    title: 'OpenAI',
    subtitle: 'LLM Provider',
    amount: '1,000',
    progress: 'primary',
  },
  {
    avatar: awsLogo,
    title: 'Azure',
    subtitle: 'LLM Provider',
    amount: '500',
    progress: 'info',
  },
  {
    avatar: aoaiLogo,
    title: 'Local LLM',
    subtitle: 'LLM Provider',
    amount: '200',
    progress: 'secondary',
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
  <VCard>
    <VCardItem>
      <VCardTitle>LLM별 사용량</VCardTitle>

      <template #append>
        <div class="me-n3">
          <MoreBtn :menu-list="moreList" />
        </div>
      </template>
    </VCardItem>

    <VCardText>
      <div class="d-flex align-center">
        <h3 class="text-h3">총 1,700회</h3>
        <VIcon size="24" icon="ri-arrow-up-s-line" color="success" />
        <div class="text-success">최근 10% 증가</div>
      </div>
      <div class="text-body-1 mb-12">최근 1주일 기준</div>

      <VList class="card-list">
        <VListItem v-for="earning in earnings" :key="earning.title">
          <template #prepend>
            <VAvatar rounded :image="earning.avatar" variant="tonal" />
          </template>

          <VListItemTitle class="font-weight-medium">
            {{ earning.title }}
          </VListItemTitle>
          <VListItemSubtitle class="text-body-1">
            {{ earning.subtitle }}
          </VListItemSubtitle>

          <template #append>
            <div>
              <h6 class="text-h6 mb-2">
                {{ earning.amount }}
              </h6>
              <VProgressLinear
                :color="earning.progress"
                model-value="80"
                rounded-bar
                rounded
              />
            </div>
          </template>
        </VListItem>
      </VList>
    </VCardText>
  </VCard>
</template>

<style lang="scss" scoped>
.card-list {
  --v-card-list-gap: 1.5rem;
}
</style>
