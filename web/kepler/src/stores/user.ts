import { defineStore } from "pinia";
import { computed, ref } from "vue";

interface IAuthentication {
  username: string;
  password: string;
}

export const useUserStore = defineStore("user", () => {
  // 定義資料
  const token = ref("");
  // 計算屬性
  const isLogin = computed(() => !!token);
  // 方法
  const authentication = ({ username, password }: IAuthentication) => {
    if (username && password) {
      token.value = "token";
    }
    return isLogin;
  };
  // 返回資料
  return { token, isLogin, authentication };
});
