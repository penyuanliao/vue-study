import { defineStore } from "pinia";
import { computed, ref } from "vue";

interface IAuthentication {
  username: string;
  password: string;
}
export interface IProfile {
  name: string;
  email?: string | null;
}

export const useAccountStore = defineStore("account", () => {
  // 定義資料
  // 登入用認證碼
  const token = ref("123456");
  const profile = ref<IProfile>({
    name: "Guest",
    email: null,
  });
  // 計算屬性
  const isExpired = computed(() => !!token);
  // 方法
  const authentication = ({ username, password }: IAuthentication) => {
    if (username && password) {
      token.value = "token";
      profile.value.name = username;
      profile.value.email = `${username}@gmail.com`;
      return true;
    }
    return false;
  };
  const isAuthenticated = () => {
    return !!token.value;
  };
  // 返回資料
  return { token, profile, isAuthenticated, isExpired, authentication };
});
