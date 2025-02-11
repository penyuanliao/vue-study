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

```


