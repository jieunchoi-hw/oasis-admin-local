import { createRouter, createWebHistory } from 'vue-router';
import { routes } from './routes';
import { useUserStore } from '@/stores/user';

// GitHub Pages 배포 시 BASE_URL을 확인하고 설정
const base = import.meta.env.BASE_URL || '/oasis-admin-local/';

const router = createRouter({
  history: createWebHistory(base),
  routes,
});

// 라우터 가드 추가
router.beforeEach((to, from, next) => {
  const userStore = useUserStore();

  // 홈 페이지 또는 대시보드 경로로 접근시
  if (to.path === '/' || to.path === '/dashboard') {
    // 저장된 계정 타입에 따라 리다이렉션
    if (userStore.currentAccountType === 'System') {
      return next('/system/dashboard'); // 시스템 대시보드로 리다이렉션
    } else if (userStore.currentAccountType === 'Tenant') {
      return next('/tenant/dashboard'); // 테넌트 대시보드로 리다이렉션
    } else if (userStore.currentAccountType === 'Workspace') {
      return next('/workspace/dashboard'); // 워크스페이스 대시보드로 리다이렉션
    }
  }

  next(); // 다른 경로는 그대로 진행
});

export default function (app) {
  app.use(router);
}
export { router };
