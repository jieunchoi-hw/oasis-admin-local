<template>
  <VCard class="overflow-visible">
    <div class="d-flex position-relative">
      <VCardText>
        <h6 class="text-base font-weight-semibold mb-4">
          {{ props.title }}
        </h6>
        <div class="d-flex align-center flex-wrap mb-4">
          <h5 class="text-h5 font-weight-semibold me-2">
            {{ props.stats }}
          </h5>
          <span
            class="text-caption"
            :class="isPositive ? 'text-success' : 'text-error'"
          >
            {{ isPositive ? `+${props.change}` : props.change }}%
          </span>
        </div>

        <VChip v-if="props.subtitle" size="small" :color="props.color">
          {{ props.subtitle }}
        </VChip>
      </VCardText>

      <VSpacer />

      <div class="illustrator-img">
        <VImg v-if="props.image" :src="props.image" :width="110" />
      </div>
    </div>
  </VCard>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    required: true,
  },
  stats: {
    type: String,
    required: true,
  },
  change: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: false,
    default: 'primary',
  },
});

const isPositive = controlledComputed(
  () => props.change,
  () => Math.sign(props.change) === 1
);
</script>

<style lang="scss">
.illustrator-img {
  position: absolute;
  inset-block-end: 0;
  inset-inline-end: 5%;
}
</style>
