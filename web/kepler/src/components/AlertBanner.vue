<script setup lang="ts">
import { icon, type IconTypes } from "@mono/ui";
import { ref, watch } from "vue";
interface AlertBannerProps {
  visible?: boolean; // 控制顯示/隱藏
  title?: string; // 標題
  message?: string; // 提示訊息
  // 樣式
  variant: string;
  // 自動關閉時間(milliseconds)
  timer?: number;
}
// const props = defineProps({
//   // 控制顯示/隱藏
//   visible: {
//     type: Boolean,
//     default: false,
//   },
//   // 標題
//   title: String,
//   // 提示訊息
//   message: String,
//   // 樣式
//   variant: {
//     type: String,
//     default: "success",
//   },
//   // 自動關閉時間(milliseconds)
//   timer: Number,
// });
const props = defineProps<AlertBannerProps>();
const { timer, visible, message, title } = props;
console.log(props);
const show = defineModel<boolean>();
const auto = ref(0);

const emit = defineEmits(["close"]);

const waitClosed = (milliseconds: number) => {
  clearTimeout(auto.value);
  auto.value = setTimeout(() => {
    closeHandle();
    show.value = false;
  }, milliseconds);
};
// 監聽Props值是否異動
watch(
  () => visible,
  (newVisible) => {
    show.value = newVisible;
  }
);
// 監聽值異動是否需要自動關閉
watch(
  () => show.value,
  (bool) => {
    if (bool && timer) waitClosed(timer);
  }
);

const closeHandle = () => {
  emit("close");
  show.value = false;
};
interface IInfo {
  bgColor: string;
  textColor: string;
  variant: IconTypes;
}
const type: Record<string, IInfo> = {
  success: {
    bgColor: "bg-emerald-500",
    textColor: "text-emerald-500 dark:text-emerald-400",
    variant: "success",
  },
  info: {
    bgColor: "bg-blue-500",
    textColor: "text-blue-500 dark:text-blue-400",
    variant: "info",
  },
  warning: {
    bgColor: "bg-yellow-500",
    textColor: "text-yellow-500 dark:text-yellow-400",
    variant: "info",
  },
  error: {
    bgColor: "bg-red-500",
    textColor: "text-red-500 dark:text-red-400",
    variant: "info",
  },
};
</script>

<template>
  <!-- 加入到指定層級 -->
  <teleport to="body">
    <transition name="slide-down" mode="out-in">
      <div v-if="show" class="alert-container absolute top-0 w-full">
        <div class="flex justify-center p-4">
          <div
            class="flex w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-md dark:bg-gray-800"
          >
            <div :class="type[props.variant].bgColor" class="flex w-12 items-center justify-center">
              <icon :variant="type[props.variant].variant" />
            </div>

            <div class="-mx-3 px-4 py-2">
              <div class="mx-3">
                <span :class="type[props.variant].textColor" class="font-semibold">{{
                  title
                }}</span>
                <p class="text-sm text-gray-600 dark:text-gray-200">{{ message }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<style scoped lang="postcss">
/*
.slide-down-enter-active {
  transition: all 0.3s ease-out;
}
.slide-down-leave-active {
  transition: all 0.5s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-down-enter-from,
.slide-down-leave-to {
  transform: scale(0);
  opacity: 0;
}
*/
.slide-down-enter-active {
  animation: bounce-in 0.3s;
}
.slide-down-leave-active {
  animation: bounce-in 0.5s reverse;
}

@keyframes bounce-in {
  0% {
    transform: scale(0.5);
  }
  50% {
    transform: scale(1.25);
  }
  100% {
    transform: scale(1);
  }
}
</style>
