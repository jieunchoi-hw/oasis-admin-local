<script setup>
const salesByCountries = [
  {
    abbr: 'SP',
    amount: '120',
    country: 'SharePoint',
    change: '+10%',
    sales: '120',
    color: 'primary',
  },
  {
    abbr: 'OD',
    amount: '80',
    country: 'OneDrive',
    change: '+5%',
    sales: '80',
    color: 'info',
  },
  {
    abbr: 'DOC',
    amount: '30',
    country: '문서 파일',
    change: '+2%',
    sales: '30',
    color: 'secondary',
  },
];

const moreList = [
  {
    title: 'Yesterday',
    value: 'Yesterday',
  },
  {
    title: 'Last Week',
    value: 'Last Week',
  },
  {
    title: 'Last Month',
    value: 'Last Month',
  },
];
</script>

<template>
  <VCard>
    <VCardItem>
      <VCardTitle>문서 소스별 쿼리</VCardTitle>

      <template #append>
        <div class="me-n3 pa-0">
          <MoreBtn :menu-list="moreList" />
        </div>
      </template>
    </VCardItem>

    <VCardText>
      <VList class="card-list">
        <VListItem v-for="data in salesByCountries" :key="data.country">
          <template #prepend>
            <VAvatar :color="data.color" variant="tonal" size="40">
              {{ data.abbr }}
            </VAvatar>
          </template>

          <VListItemTitle class="mb-1 d-flex align-center">
            <h6 class="text-h6">
              {{ data.amount }}
            </h6>
            <VIcon
              size="24"
              :color="data.change.charAt(0) === '+' ? 'success' : 'error'"
              class="mx-1"
            >
              {{
                data.change.charAt(0) === '+'
                  ? 'ri-arrow-up-s-line'
                  : 'ri-arrow-down-s-line'
              }}
            </VIcon>
            <div
              :class="`${data.change.charAt(0) === '+' ? 'text-success' : 'text-error'}`"
              class="text-body-1"
            >
              {{ data.change.slice(1) }}
            </div>
          </VListItemTitle>

          <VListItemSubtitle class="text-body-1 me-2">
            {{ data.country }}
          </VListItemSubtitle>

          <template #append>
            <div>
              <h6 class="text-h6 mb-1">
                {{ data.sales }}
              </h6>
              <div class="text-body-2 text-disabled text-end">쿼리 수</div>
            </div>
          </template>
        </VListItem>
      </VList>
    </VCardText>
  </VCard>
</template>

<style lang="scss" scoped>
.card-list {
  --v-card-list-gap: 0.875rem;
}
</style>
