# vue-study
關於vue相關應用學習

## 安裝使用pnpm
```
pnpm init

```
### 產生pnpm-workspace.yaml檔案
```
# linux, macos
echo "packages:
  - 'packages/*'
  - 'web/*'" > pnpm-workspace.yaml

# windows (PowerShell)
@"
packages:
  - 'packages/*'
  - 'web'
"@ | Out-File -Encoding utf8 pnpm-workspace.yaml

```
### 初始化專案
```
pnpm create vite@latest

cd web
pnpm i
pnpm dev run

```
如果想要在外層package.json增加執行專案可以使用`--filter` 專案名稱`kepler`


````
pnpm i -D typescript --filter utils

````
安裝插件
````
pnpm add "@mono/ui@workspace:*" -r
pnpm add "@mono/utils@workspace:*" -r
````
