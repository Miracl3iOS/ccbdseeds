/* ДЕФОЛТНЫЕ ДАННЫЕ.
   Всё редактируемое (баннеры/отзывы) в демо сохраняется в localStorage.
   Для продакшена лучше подключить БД (Supabase/Firebase/свой backend). */

window.DEFAULT_BANNERS = [
  {
    id: "b1",
    type: "image",
    src: "./assets/banner-1.jpg",
    href: "#/seeds?filter=autoflower",
    title: "Свежие новинки"
  },
  {
    id: "b2",
    type: "video",
    src: "./assets/banner-2.mp4",
    href: "#/blog",
    title: "Видео-баннер"
  },
  {
    id: "b3",
    type: "image",
    src: "./assets/banner-3.jpg",
    href: "#/warranty",
    title: "Гарантия"
  }
];

window.CATEGORIES = [
  { id:"autoflower", name:"Автоцветущие", icon:"spark" },
  { id:"photo", name:"Фотопериодные", icon:"sun" },
  { id:"cbd_indica", name:"КБД‑Индика", icon:"leaf" },
  { id:"cbd_sativa", name:"КБД‑Сатива", icon:"wind" },
  { id:"indoor", name:"Индор", icon:"home" },
  { id:"outdoor", name:"Аутдор", icon:"mountain" },
  { id:"newbies", name:"Для новичков", icon:"cap" },
  { id:"pros", name:"Для опытных", icon:"bolt" }
];

window.DEFAULT_PRODUCTS = [
  {
    id: "P-1001",
    name: "Caramelo CBD",
    tags: ["cbd_indica", "photo", "indoor", "newbies"],
    cbd: "7–14%",
    flowering: "55–60 дней",
    genetics: "Caramelo x Carmen",
    effect: "Лечебный",
    flavor: "Сладкий, Цитрус",
    souvenirsInPack: 3,
    priceEUR: 3,
    images: [
      "./assets/p1-1.jpg",
      "./assets/p1-2.jpg",
      "./assets/p1-3.jpg"
    ],
    description: "Сорт с мягким терапевтическим эффектом и ярким сладко‑цитрусовым профилем. Отлично подходит для спокойных вечерних сессий и поддерживающего режима."
  },
  {
    id: "P-1002",
    name: "Neon Sativa CBD",
    tags: ["cbd_sativa", "photo", "outdoor", "pros"],
    cbd: "10–16%",
    flowering: "60–65 дней",
    genetics: "Lemon Haze x CBD Line",
    effect: "Тонус, ясность",
    flavor: "Лимон, Хвоя",
    souvenirsInPack: 5,
    priceEUR: 5,
    images: [
      "./assets/p2-1.jpg",
      "./assets/p2-2.jpg"
    ],
    description: "Бодрящий профиль, более «дневное» настроение, аккуратный и чистый аромат. Хорош для опытных, кто любит чёткую структуру и стабильность."
  },
  {
    id: "P-1003",
    name: "Pocket Auto CBD",
    tags: ["autoflower", "cbd_indica", "indoor", "newbies"],
    cbd: "8–13%",
    flowering: "70–75 дней (цикл)",
    genetics: "Auto x CBD Selection",
    effect: "Расслабление",
    flavor: "Сливочный, Травяной",
    souvenirsInPack: 3,
    priceEUR: 3,
    images: [
      "./assets/p3-1.jpg",
      "./assets/p3-2.jpg",
      "./assets/p3-3.jpg"
    ],
    description: "Компактный автоцвет с ровным темпом и понятным уходом. Идеален для новичков и небольших пространств."
  }
];

/* Куда вести «Заказать» (замени на свой @username) */
window.TELEGRAM_USERNAME = "your_telegram";
