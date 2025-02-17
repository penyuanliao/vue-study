# TailwindCSS

#如何使用Theme 

目前設計有兩種方式

#1 使用toggle tag 在css 上增加 dark
````
@import "tailwindcss";
@custom-variant dark (&:where(.dark, .dark *));
````
在html class 增加dark屬性, 並且在元件上面寫關鍵字`dark:`切換屬性
```html
<html class="dark">
  <body>
    <div class="bg-white dark:bg-black">
      <!-- ... -->
    </div>
  </body>
</html>
```
