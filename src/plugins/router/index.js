import { createRouter, createWebHistory } from 'vue-router';
import { routes } from './routes';
import { useUserStore } from '@/stores/user';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// 라우터 가드 추가
router.beforeEach((to, from, next) => {
  const userStore = useUserStore();
  
  // 홈 페이지 또는 대시보드 경로로 접근시
  if (to.path === '/' || to.path === '/dashboard') {
    // 사용자 권한이 'system'인 경우
    if (userStore.role === 'system') {
      return next('/system/dashboard'); // 시스템 대시보드로 리다이렉션
    }
    // 다른 권한인 경우, 해당 권한에 맞는 경로로 리다이렉션할 수 있음
    // 예: if (userStore.role === 'admin') return next('/admin/dashboard');
  }
  
  next(); // 다른 경로는 그대로 진행
});

export default function (app) {
  app.use(router);
}
export { router };
