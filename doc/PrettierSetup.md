# Prettier 安裝

```shell
pnpm add -D prettier
```
### 建立設定檔案 `.prettierrc`
```shell
echo '
{
  "semi": false,
  "singleQuote": false,
  "trailingComma": "es5",
  "tabWidth": 2,
  "printWidth": 100
}
' > .prettierrc
exit
```

# Prettier support tailwindcss
[Github](https://github.com/tailwindlabs/prettier-plugin-tailwindcss)

在`.prettierrc`
增加 "plugins": ["prettier-plugin-tailwindcss"]
```shell
awk '
/"printWidth": 100$/ {print $0 ","; next} 
/}/ {print "  \"plugins\": [\"prettier-plugin-tailwindcss\"]"} 
1' .prettierrc > .prettierrc.tmp && mv .prettierrc.tmp .prettierrc
exit
```

