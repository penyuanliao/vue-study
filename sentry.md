# Sentry 
是一套處理追蹤錯誤訊息系統

## Server安裝

```
# 自行部署的版本
git clone https://github.com/getsentry/self-hosted.git

cd ./self-hosted

./install

# 後續需要調整conifg 認證需要RSF

```
## Client安裝

Sentry 可以直接綁在main.ts
```ts

import * as Sentry from '@sentry/vue';

Sentry.init({
    // 這邊是vue.app
    app,
    // 服務的API
    dsn: "",
    // 啟動的服務
    integration: [
        // 追蹤Router路徑
        Sentry.browserTracingIntegration({ router }),
        // 錄製Canvas畫面
        Sentry.replayCanvasIntegration(),
        // 錄製畫面Dom
        Sentry.replayIntegration({
            // 文字屏蔽
            maskAllText: false,
            // 影片屏蔽
            blockAllMedia: false
        }),
        // 分析CPU Profile
        Sentry.browserProfilingIntegration(),
        // 紀錄使用者事件
        Sentry.breadcrumbsIntegration({
            console: true,
            dom: true,
            fetch: true,
            history: true,
            xhr: true
        })
    ],
    // 送出前修改參數
    beforeSend(event, hint) {
        event.transaction = useInitStore().getModel;
        // 設定null為忽略該事件
        return event;
    },
    // 處理每個初始化訊息
    initialScope: (scope) => {
        // scope.setTags({ 'key': 'value' });
        return scope;
    },
    // 這邊錯誤率0 ~ 1 是指錯誤 0.1 就是10%機率會回報
    tracesSampleRate: 1.0, //  Capture 100% of the transactions
    // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
    tracePropagationTargets: ['localhost', /^https:\/\/yourserver\.io\/api/],
    // Session Replay
    replaysSessionSampleRate: 1.0, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
    replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
    profilesSampleRate: 1.0
});

// 如果要紀錄Pinia
const pinia = createPinia();
pinia.use(Sentry.createSentryPiniaPlugin({
    attachPiniaState: true,
    addBreadcrumbs: true
}));

```

**maxBreadcrumbs: 100**

控制應捕獲的麵包屑總量預設為**100**,
 > 設定大小會影響到Payload大小超過會被丟棄


## 自訂事件

```ts
import * as Sentry from '@sentry/vue';
// 參數定義: 事件名稱, 訊息等級
Sentry.captureMessage('Something went wrong', 'debug');
```

## 自訂標籤
```ts
import * as Sentry from '@sentry/vue';
Sentry.setTags('key', 'value');
```
## 自訂User標籤
```ts
import * as Sentry from '@sentry/vue';
Sentry.setUser({ email: 'test@example.com' }); // 自定義
// 沒有設定會是預設的ip_address
```
## 自訂麵包屑(Breadcrumbs)

```ts
import * as Sentry from '@sentry/vue';

enum BreadcrumbTypes {
    'navigation' = 'navigation',
    'error' = 'error',
    'debug' = 'debug',
    'info' = 'info',
    'query' = 'query',
    'default' = 'default',
    'http' = 'http',
}

Sentry.addBreadcrumb({
    type: '圖案標籤',
    category: "定義標籤",
    message: '訊息的內容',
    level: "info",
    timestamp: 1616168092.546,
    data: {
        // navigation 需要顯示的資料
        'from': '/login',
        'to': '/dashboard',
        // http 需要顯示的資料
        'url': 'https://example.com',
        'method': 'GET',
        'status_code': 200,
        'reason': 'OK'
    }
});

```
# 自訂定義 Custom Integrations

Example A Created Function
```ts

const integration = {
    name: 'CustomIntegration',
    setupOnce() {
        // SETP1.初始化
    },
    setup(client) {
        // SETP2.客端初始化
    },
    afterAllSetup(client) {
        // SETP3. 1 + 2 都初始化
    },
    preprocessEvent(event, hint, client) {
        // SETP4. 前置作業在processEvent之前
        // 不能回傳修改值，只能重製新的事件
        event.extra = {
            ...event.extra,
            tag: 'awesome'
        }
    },
    processEvent(event, hint, client) {
        // SETP.5 送出前最後確認，回傳null則取消事件
        return event;
    }
}
export default integration

```
