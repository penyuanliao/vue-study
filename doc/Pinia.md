#Pinia

## Template
```ts
import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useSampleStore = defineStore("sample", () => {
  // 定義資料
  const count = ref(0);
  // 計算屬性
  const doubleCount = computed(() => count.value * 2);
  // 方法
  const increment = () => ++count.value;
  // 返回資料
  return { count, doubleCount, increment };
});
/*
// 使用方式
import { useSampleStore } from "@/stores/sample";
// 取得Store
const sample = useSampleStore();
console.log(`取得資料: ${sample.count}`);
console.log(`計算資料: ${sample.doubleCount}`);
console.log(`使用方法:${sample.increment()}`);
*/

```
