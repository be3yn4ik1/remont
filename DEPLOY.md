# Публикация сайта РемонтПрофи

Сайт статический (HTML/CSS/JS + `/img`) — его можно бесплатно разместить за пару минут
и дать заказчику ссылку, **не открывая его для поисковиков**.

## Сейчас репозиторий в режиме «скрытый стенд»
Поисковики сайт не увидят, потому что включены три уровня защиты:
1. `<meta name="robots" content="noindex, nofollow">` в `index.html`;
2. `X-Robots-Tag: noindex` в файле `_headers` (Netlify/Cloudflare Pages);
3. `robots.txt` → `Disallow: /`.

Ссылку можно спокойно отправлять — индексации не будет.

---

## Вариант 1. Cloudflare Pages (рекомендую, бесплатно)
1. Зайти на https://dash.cloudflare.com → **Workers & Pages** → **Create** → **Pages**.
2. **Connect to Git** → выбрать репозиторий `be3yn4ik1/remont`, ветку `claude/bold-maxwell-wrsbhf`.
   Build command — пусто, Output directory — `/` (корень).
3. Получите ссылку вида `https://remont-xxxx.pages.dev` — её и отправляете заказчику.

## Вариант 2. Netlify (бесплатно, ещё проще)
- Быстро без Git: https://app.netlify.com/drop — перетащить папку проекта (или распакованный zip).
- Или **Add new site → Import from Git** → репозиторий, ветка, publish directory `/`.
- Ссылка вида `https://random-name.netlify.app`.

## Вариант 3. GitHub Pages
Подойдёт, но публичные Pages индексируются — обязательно оставить `noindex` (он уже стоит).
Settings → Pages → Source: ветка `claude/bold-maxwell-wrsbhf`, папка `/root`.

---

## Хотите, чтобы ссылку видел ТОЛЬКО заказчик (пароль)
`noindex` прячет от поисковиков, но любой человек со ссылкой откроет сайт.
Если нужен доступ по паролю:
- **Cloudflare Access** (бесплатно до 50 пользователей): Zero Trust → Access → Application → защитить домен Pages паролем/почтой.
- **Netlify**: Site settings → Access control → Password protection (на платном тарифе).

---

## Когда выходим в прод (открываем индексацию)
1. `index.html` — вернуть `<meta name="robots" content="index, follow">`.
2. `_headers` — удалить строку `X-Robots-Tag: noindex, nofollow`.
3. `robots.txt` — заменить на «версию для запуска» (раскомментировать `Allow: /` + `Sitemap:`).
4. Привязать домен `remount-chameleon.ru` к хостингу (DNS), проверить `canonical`.
5. Добавить сайт в Яндекс.Вебмастер и Google Search Console, отправить `sitemap.xml`.

## Важно про форму и квиз
Хостинг статический — серверной отправки заявок на почту нет.
Сейчас квиз и форма показывают экран «успех» (демо). Чтобы заявки реально приходили:
- подключить эндпоинт в `assets/js/quiz.js` (переменная `RQ_ENDPOINT`), напр. форму
  Formspree/Getform или собственный обработчик;
- либо разворачивать на WordPress с приложенным плагином `repairquiz.php` (там отправка через `wp_mail`).
