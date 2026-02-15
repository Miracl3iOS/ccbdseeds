/* ДЕФОЛТНЫЕ ДАННЫЕ.
   Всё редактируемое (баннеры/отзывы) в демо сохраняется в localStorage.
   Для продакшена лучше подключить БД (Supabase/Firebase/свой backend). */

window.DEFAULT_BANNERS = [
  { id: "b1", type: "image", src: "./assets/banner-1.jpg" },
  { id: "b2", type: "image", src: "./assets/banner-2.jpg" },
  { id: "b3", type: "image", src: "./assets/banner-3.jpg" }
];

/* Категории (оставили только 4) */
window.CATEGORIES = [
  { id:"autoflower", name:"Автоцветущие", icon:"spark" },
  { id:"feminized", name:"Феминизированные", icon:"sun" },
  { id:"regular", name:"Регулярные", icon:"leaf" }
];

/* Товары — как пример (замени на реальные).
   seedOptions — варианты выбора количества семян и соответствующая цена (EUR). */
window.DEFAULT_PRODUCTS = [
  {
    id: "P-A-001",
    name: "Banana Cream",
    tags: ["autoflower"],
    cbd: "—",
    flowering: "—",
    genetics: "—",
    effect: "—",
    flavor: "—",
    images: [
      "./assets/p1-1.jpg",
      "./assets/p1-2.jpg",
      "./assets/p1-3.jpg"
    ],
    seedOptions: [
      { seeds: 1, priceRUB: 990 },
      { seeds: 3, priceRUB: 2490 },
      { seeds: 5, priceRUB: 3790 }
    ],
    description: "Описание сорта — добавь сюда информацию о генетике, вкусе, эффекте и рекомендациях по выращиванию."
  },
  {
    id: "P-A-002",
    name: "Orange Cream",
    tags: ["autoflower"],
    cbd: "—",
    flowering: "—",
    genetics: "—",
    effect: "—",
    flavor: "—",
    images: [
      "./assets/p2-1.jpg",
      "./assets/p2-2.jpg",
      "./assets/p2-3.jpg"
    ],
    seedOptions: [
      { seeds: 1, priceRUB: 990 },
      { seeds: 3, priceRUB: 2490 },
      { seeds: 5, priceRUB: 3790 }
    ],
    description: "Описание сорта — добавь сюда информацию о генетике, вкусе, эффекте и рекомендациях по выращиванию."
  },
  {
    id: "P-A-003",
    name: "Purple x Limeskunk",
    tags: ["autoflower"],
    cbd: "—",
    flowering: "—",
    genetics: "—",
    effect: "—",
    flavor: "—",
    images: [
      "./assets/p3-1.jpg",
      "./assets/p3-2.jpg",
      "./assets/p3-3.jpg"
    ],
    seedOptions: [
      { seeds: 1, priceRUB: 990 },
      { seeds: 3, priceRUB: 2490 },
      { seeds: 5, priceRUB: 3790 }
    ],
    description: "Описание сорта — добавь сюда информацию о генетике, вкусе, эффекте и рекомендациях по выращиванию."
  },
  {
    id: "P-A-004",
    name: "Gelato x Lemon OG",
    tags: ["autoflower"],
    cbd: "—",
    flowering: "—",
    genetics: "—",
    effect: "—",
    flavor: "—",
    images: [
      "./assets/p4-1.jpg",
      "./assets/p4-2.jpg",
      "./assets/p4-3.jpg"
    ],
    seedOptions: [
      { seeds: 1, priceRUB: 990 },
      { seeds: 3, priceRUB: 2490 },
      { seeds: 5, priceRUB: 3790 }
    ],
    description: "Описание сорта — добавь сюда информацию о генетике, вкусе, эффекте и рекомендациях по выращиванию."
  },
  {
    id: "P-A-005",
    name: "Odin Haze x Northlight",
    tags: ["autoflower"],
    cbd: "—",
    flowering: "—",
    genetics: "—",
    effect: "—",
    flavor: "—",
    images: [
      "./assets/p5-1.jpg",
      "./assets/p5-2.jpg",
      "./assets/p5-3.jpg"
    ],
    seedOptions: [
      { seeds: 1, priceRUB: 990 },
      { seeds: 3, priceRUB: 2490 },
      { seeds: 5, priceRUB: 3790 }
    ],
    description: "Описание сорта — добавь сюда информацию о генетике, вкусе, эффекте и рекомендациях по выращиванию."
  },
  {
    id: "P-R-001",
    name: "Mazar I Sharif",
    tags: ["regular"],
    cbd: "—",
    flowering: "—",
    genetics: "—",
    effect: "—",
    flavor: "—",
    images: [
      "./assets/p6-1.jpg",
      "./assets/p6-2.jpg",
      "./assets/p6-3.jpg"
    ],
    seedOptions: [
      { seeds: 1, priceRUB: 990 },
      { seeds: 3, priceRUB: 2490 },
      { seeds: 5, priceRUB: 3790 }
    ],
    description: "Описание сорта — добавь сюда информацию о генетике, вкусе, эффекте и рекомендациях по выращиванию."
  },
  {
    id: "P-R-002",
    name: "Panjshir",
    tags: ["regular"],
    cbd: "—",
    flowering: "—",
    genetics: "—",
    effect: "—",
    flavor: "—",
    images: [
      "./assets/p7-1.jpg",
      "./assets/p7-2.jpg",
      "./assets/p7-3.jpg"
    ],
    seedOptions: [
      { seeds: 1, priceRUB: 990 },
      { seeds: 3, priceRUB: 2490 },
      { seeds: 5, priceRUB: 3790 }
    ],
    description: "Описание сорта — добавь сюда информацию о генетике, вкусе, эффекте и рекомендациях по выращиванию."
  },
  {
    id: "P-R-003",
    name: "Badkashan",
    tags: ["regular"],
    cbd: "—",
    flowering: "—",
    genetics: "—",
    effect: "—",
    flavor: "—",
    images: [
      "./assets/p8-1.jpg",
      "./assets/p8-2.jpg",
      "./assets/p8-3.jpg"
    ],
    seedOptions: [
      { seeds: 1, priceRUB: 990 },
      { seeds: 3, priceRUB: 2490 },
      { seeds: 5, priceRUB: 3790 }
    ],
    description: "Описание сорта — добавь сюда информацию о генетике, вкусе, эффекте и рекомендациях по выращиванию."
  }
];

/* Куда вести «Заказать» (замени на свой @username) */
window.TELEGRAM_USERNAME = "your_telegram";
