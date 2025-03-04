import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
  type RouterHistory,
} from "vue-router";
import { useAccountStore } from "@/stores/account.ts";
import About from "@/views/AboutView.vue";
const history: RouterHistory = createWebHistory(import.meta.env.BASE_URL);
// 測試
/*

import { defineAsyncComponent } from "vue";
import { ErrorComponent, LoadingBase } from "@mono/ui";
const asyncComponent = () => {
  return defineAsyncComponent({
    // 物件
    // loader: () => testLoadingFailed(),
    loader: () => import("@/views/ContactView.vue"),
    // 載入中顯示
    loadingComponent: LoadingBase,
    // 載入失敗顯示
    errorComponent: ErrorComponent,
    // 延遲時間
    delay: 100,
    // 超時
    // timeout: 3000,
  });
};
const testLoadingFailed = () => {
  return new Promise<any>((_, reject) => {
    setTimeout(() => {
      reject(new Error("強制模擬載入失敗！"));
    }, 10000);
  });
};
*/
const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "Home",
    component: () => import("@/views/HomeView.vue"),
    /**
     * @param {boolean} requiresAuth 需要驗證使用者是否登入
     * @param {boolean} isAdmin 管理者使用(選項)
     */
    meta: { requiresAuth: true, isAdmin: false },
    children: [
      {
        // Home頁面裡的RouterView
        path: "/about",
        name: "About",
        // 靜態導入
        component: About,
      },
      {
        // Home頁面裡的RouterView
        path: "/about/profile",
        name: "Profile",
        // 動態導入
        component: () => import("@/components/Profile.vue"),
      },
      {
        path: "/contact",
        name: "Contact",
        component: () => import("@/views/ContactView.vue"),
      },
    ],
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/LoginView.vue"),
  },
  {
    // 過濾網站無效路徑
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("@/views/NotFound.vue"),
  },
];
const router = createRouter({ history, routes });

router.beforeEach((to) => {
  const { requiresAuth, isAdmin } = to.meta;
  const userStore = useAccountStore();
  const isAuthenticated = userStore.isAuthenticated();
  console.log("[Router]頁面是否檢查登入:", requiresAuth);
  console.log("[Router]頁面是否檢查管理者:", isAdmin);
  console.log("[Router]頁面是否isAuthenticated:", isAuthenticated, to.fullPath);
  // 檢查需要驗證登入
  if (requiresAuth && !isAuthenticated) {
    return { name: "Login", replace: true };
  }
  // 檢查登入頁面
  if (to.name === "login" && isAuthenticated) {
    return { name: "Home", replace: true };
  }
});

export { router as default };
