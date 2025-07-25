<script setup>
import americanBank from '@images/logos/american-bank.png';
import aws from '@images/logos/aws.png';
import citiBank from '@images/logos/citi-bank.png';
import digitalOcean from '@images/logos/digital-ocean.png';
import github from '@images/logos/github.png';
import google from '@images/logos/google.png';
import gumroad from '@images/logos/gumroad.png';
import mastercardLabel from '@images/logos/mastercard-label.png';
import slack from '@images/logos/slack.png';
import stripe from '@images/logos/stripe.png';
import openaiLogo from '@/assets/images/logos/openai.png';
import aoaiLogo from '@/assets/images/logos/aoai.png';
import awsLogo from '@/assets/images/logos/aws.png';

const deposits = [
  {
    title: 'MCP 서버',
    subtitle: '상태',
    amount: '정상',
    logo: awsLogo,
  },
  {
    title: '외부 MCP',
    subtitle: '연동 개수',
    amount: '1개',
    logo: openaiLogo,
  },
  {
    title: 'Inference 요청',
    subtitle: '오늘',
    amount: '1,700',
    logo: aoaiLogo,
  },
];

const withdraws = [
  {
    title: 'LLM Proxy',
    subtitle: '상태',
    amount: '정상',
    logo: openaiLogo,
  },
  {
    title: 'Local LLM',
    subtitle: '상태',
    amount: '정상',
    logo: aoaiLogo,
  },
];
</script>

<template>
  <VCard>
    <VRow no-gutters>
      <VCol cols="12" md="6">
        <VCardItem>
          <VCardTitle>MCP/Inference 현황</VCardTitle>

          <template #append>
            <h6 class="text-h6">
              <a href="javascript:void(0)" class="text-primary">View All</a>
            </h6>
          </template>
        </VCardItem>

        <VCardText>
          <VList class="card-list">
            <VListItem v-for="deposit in deposits" :key="deposit.logo">
              <template #prepend>
                <div class="me-4">
                  <VImg :height="30" :width="30" :src="deposit.logo" />
                </div>
              </template>

              <VListItemTitle class="font-weight-medium mb-1">
                {{ deposit.title }}
              </VListItemTitle>
              <VListItemSubtitle class="text-body-1">
                {{ deposit.subtitle }}
              </VListItemSubtitle>

              <template #append>
                <VListItemAction class="text-success font-weight-medium">
                  {{ deposit.amount }}
                </VListItemAction>
              </template>
            </VListItem>
          </VList>
        </VCardText>
      </VCol>

      <VDivider :vertical="$vuetify.display.mdAndUp" />

      <VCol cols="12" md="6">
        <VCardItem>
          <VCardTitle>LLM Proxy/Local LLM</VCardTitle>

          <template #append>
            <h6 class="text-h6">
              <a href="javascript:void(0)" class="text-primary">View All</a>
            </h6>
          </template>
        </VCardItem>

        <VCardText>
          <VList class="card-list">
            <VListItem v-for="withdraw in withdraws" :key="withdraw.logo">
              <template #prepend>
                <div class="me-4">
                  <VImg :height="30" :width="30" :src="withdraw.logo" />
                </div>
              </template>

              <VListItemTitle class="font-weight-medium mb-1">
                {{ withdraw.title }}
              </VListItemTitle>
              <VListItemSubtitle class="text-body-1">
                {{ withdraw.subtitle }}
              </VListItemSubtitle>

              <template #append>
                <VListItemAction>
                  <span class="text-error font-weight-medium">
                    {{ withdraw.amount }}
                  </span>
                </VListItemAction>
              </template>
            </VListItem>
          </VList>
        </VCardText>
      </VCol>
    </VRow>
  </VCard>
</template>

<style lang="scss" scoped>
.card-list {
  --v-card-list-gap: 1.25rem;
}
</style>
