import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
  type RouterHistory,
} from "vue-router";

const history: RouterHistory = createWebHistory(import.meta.env.BASE_URL);

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "home",
    component: () => import("@/views/HomeView.vue"),
    /**
     * @param {boolean} requiresAuth 需要驗證使用者是否登入
     * @param {boolean} isAdmin 管理者使用(選項)
     */
    meta: { requiresAuth: true, isAdmin: false },
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/LoginView.vue"),
  },
];
const router = createRouter({ history, routes });

router.beforeEach((to) => {
  const { requiresAuth, isAdmin } = to.meta;
  console.log("[Router]頁面是否檢查登入:", requiresAuth);
  console.log("[Router]頁面是否檢查管理者:", isAdmin);
  // if (requiresAuth )
});

export { router as default };
