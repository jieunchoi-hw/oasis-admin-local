<template>
  <div class="misc-wrapper">
    <ErrorHeader
      title="Page Not Found ⚠️"
      description="We couldn't find the page you are looking for."
    />

    <!-- 👉 Image -->
    <div class="misc-avatar w-100 text-center">
      <VImg :src="bot" alt="Coming Soon" :max-width="400" class="mx-auto" />
      <VBtn to="/" class="mt-5"> Back to Home </VBtn>
    </div>

    <!-- 👉 Footer -->
    <!-- <VImg :src="tree" class="misc-footer-tree d-none d-md-block" /> -->

    <VImg :src="authThemeMask" class="misc-footer-img d-none d-md-block" />
  </div>
</template>

<script setup>
import { useTheme } from 'vuetify';
import bot from '@images/pages/bot.png';
import miscMaskDark from '@images/pages/misc-mask-dark.png';
import miscMaskLight from '@images/pages/misc-mask-light.png';
import tree from '@images/pages/tree.png';

const vuetifyTheme = useTheme();

const authThemeMask = computed(() => {
  return vuetifyTheme.global.name.value === 'light'
    ? miscMaskLight
    : miscMaskDark;
});
</script>

<style lang="scss">
@use '@core/scss/template/pages/misc.scss';

.misc-footer-tree {
  inline-size: 15.625rem;
  inset-block-end: 3.5rem;
  inset-inline-start: 0.375rem;
}
</style>
