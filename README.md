# БЦ Раменки — отчёт о ходе работ (PWA)

Загрузите содержимое этой папки в корень репозитория GitHub Pages (или в папку, из которой публикуется сайт).
Все пути относительные — работает и по адресу `https://username.github.io/repository-name/`.

```
index.html                  приложение
manifest.webmanifest        PWA: имя «БЦ Раменки», standalone, иконки
sw.js                       service worker (обновление версий, офлайн)
favicon.ico
assets/icons/               apple-touch-icon 180, favicon 16/32, icon 192/512, maskable 192/512, белый знак для заставки
```

При каждой новой публикации меняйте `VERSION` в `sw.js` (и при желании `app-version` в `index.html`) —
установленное приложение получит новую версию при следующем открытии.
