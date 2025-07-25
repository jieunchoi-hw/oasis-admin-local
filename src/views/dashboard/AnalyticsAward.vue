<script setup>
import success from '@images/misc/success.png';
</script>

<template>
  <VCard class="position-relative">
    <VCardText>
      <div class="mb-2">
        <h5 class="text-h5">OASIS Platform 현황</h5>
        <div class="text-body-1">오늘 인증 요청: <b>1,234건</b></div>
      </div>
      <h4 class="text-h4 text-primary">성공률 98.7%</h4>
      <div class="text-body-1 mb-2">목표 대비 92% 달성</div>
      <VBtn size="small"> View Details </VBtn>
    </VCardText>

    <!-- Trophy -->
    <VImg :src="success" class="success" />
  </VCard>
</template>

<style lang="scss">
.v-card .success {
  position: absolute;
  inline-size: 5.188rem;
  inset-block-end: 2.25rem;
  inset-inline-end: 2.25rem;
}
</style>
