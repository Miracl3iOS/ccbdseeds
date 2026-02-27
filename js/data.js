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
    cbd: "18-24%",
    flowering: "8–9 недель",
    genetics: "Banana OG × Cookies and Cream (indica-dominant hybrid)",
    effect: "эйфория, хорошее настроение → глубокое телесное расслабление",
    flavor: "ладкий банан, сливочный десерт, лёгкие ванильно-печёночные ноты",
    images: [
      "./assets/p1-1.jpg",
      "./assets/p1-2.jpg",
      "./assets/p1-3.jpg"
    ],
    seedOptions: [
      { seeds: 10, priceRUB: 3000 },
      { seeds: 50, priceRUB: 12500 },
      { seeds: 100, priceRUB: 20000 }
    ],
    description: "Banana Cream — ароматный indica-доминантный гибрид с десертным бананово-сливочным вкусом и мощным, но приятным эффектом: сначала поднимает настроение, затем мягко расслабляет тело."
  },
  {
    id: "P-A-002",
    name: "Orange Cream",
    tags: ["autoflower"],
    cbd: "18–22%",
    flowering: "9–10 недель",
    genetics: "цитрусовые Orange-линии × Cream/десертные гибриды",
    effect: "лёгкая эйфория, бодрое настроение, затем мягкое расслабление",
    flavor: "сладкий апельсин, сливочный десерт, цитрусовая цедра",
    images: [
      "./assets/p2-1.jpg",
      "./assets/p2-2.jpg",
      "./assets/p2-3.jpg"
    ],
    seedOptions: [
      { seeds: 10, priceRUB: 3000 },
      { seeds: 50, priceRUB: 12500 },
      { seeds: 100, priceRUB: 20000 }
    ],
    description: "Orange Cream — сладкий цитрусово-десертный авто-гибрид с апельсиново-сливочным вкусом и сбалансированным эффектом: сначала поднимает настроение, потом даёт мягкое расслабление."
  },
  {
    id: "P-A-003",
    name: "Purple x Limeskunk",
    tags: ["autoflower"],
    cbd: "19–23%",
    flowering: "8–9 недель",
    genetics: "Purple indica-линии × Lime Skunk",
    effect: "подъём настроения, ясная голова, затем расслабление тела",
    flavor: "лайм, кислый цитрус, сладкие ягоды, лёгкий skunk",
    images: [
      "./assets/p3-1.jpg",
      "./assets/p3-2.jpg",
      "./assets/p3-3.jpg"
    ],
    seedOptions: [
      { seeds: 10, priceRUB: 3000 },
      { seeds: 50, priceRUB: 12500 },
      { seeds: 100, priceRUB: 20000 }
    ],
    description: "Оrple x Limeskunk — яркий цитрусово-сканковый гибрид с лаймовым ароматом и фиолетовыми оттенками, даёт бодрую эйфорию с последующим мягким расслаблением"
  },
  {
    id: "P-A-004",
    name: "Gelato x Lemon OG",
    tags: ["autoflower"],
    cbd: "22–26%",
    flowering: "8–10 недель",
    genetics: "Gelato × Lemon OG",
    effect: "сильная эйфория, креативность, затем глубокое расслабление",
    flavor: "лимонная цедра, сладкий крем, фруктовый десерт, лёгкий газ",
    images: [
      "./assets/p4-1.jpg",
      "./assets/p4-2.jpg",
      "./assets/p4-3.jpg"
    ],
    seedOptions: [
      { seeds: 10, priceRUB: 3000 },
      { seeds: 50, priceRUB: 12500 },
      { seeds: 100, priceRUB: 20000 }
    ],
    description: "Gelato x Lemon OG — мощный десертно-цитрусовый гибрид с ярким лимонно-кремовым вкусом и сильным эффектом: сначала энергичная эйфория, затем плотное расслабление."
  },
  {
    id: "P-A-005",
    name: "Odin Haze x Northlight",
    tags: ["autoflower"],
    cbd: "20–24%",
    flowering: "9–10 недель",
    genetics: "Odin Haze × Northern Lights ",
    effect: "ясная бодрящая эйфория, фокус, затем спокойное телесное расслабление",
    flavor: "пряный haze, цитрус, травы, сладковато-землистые ноты",
    images: [
      "./assets/p5-1.jpg",
      "./assets/p5-2.jpg",
      "./assets/p5-3.jpg"
    ],
    seedOptions: [
      { seeds: 10, priceRUB: 3000 },
      { seeds: 50, priceRUB: 12500 },
      { seeds: 100, priceRUB: 20000 }
    ],
    description: "Odin Haze x Northlight — сбалансированный haze-indica гибрид: даёт чистую ментальную энергию и мягкое телесное расслабление с классическим пряно-цитрусовым вкусом."
  },
  {
    id: "P-R-001",
    name: "Mazar I Sharif",
    tags: ["regular"],
    cbd: "18–22%",
    flowering: "8–9 недель",
    genetics: "чистая афганская indica-ландрейс из региона Мазари-Шариф",
    effect: "сильное телесное расслабление, спокойствие, седативный stone",
    flavor: "землистый, гашишный, пряный, сладковато-смолистый",
    images: [
      "./assets/p6-1.jpg",
      "./assets/p6-2.jpg",
      "./assets/p6-3.jpg"
    ],
    seedOptions: [
      { seeds: 10, priceRUB: 4000 }
    ],
    description: "Mazar I Sharif — классическая афганская фотопериодная indica с плотными смолистыми шишками, гашишным ароматом и мощным расслабляющим эффектом."
  },
  {
    id: "P-R-002",
    name: "Panjshir",
    tags: ["regular"],
    cbd: "16–20%",
    flowering: "8–9 недель",
    genetics: "афганская indica-ландрейс из долины Панджшер",
    effect: "глубокое телесное расслабление, спокойствие, сонливость",
    flavor: "землистый, гашишный, древесный, слегка сладкий и пряный",
    images: [
      "./assets/p7-1.jpg",
      "./assets/p7-2.jpg",
      "./assets/p7-3.jpg"
    ],
    seedOptions: [
      { seeds: 10, priceRUB: 4000 }
    ],
    description: "Panjshir — редкая афганская фотопериодная indica из горной долины, известная высокой смолистостью, классическим гашишным ароматом и мощным седативным эффектом."
  },
  {
    id: "P-R-003",
    name: "Badkashan",
    tags: ["regular"],
    cbd: "15–19%",
    flowering: "8–9 недель",
    genetics: "афганская indica-ландрейс из региона Бадахшан",
    effect: "тяжёлое телесное расслабление, антистресс, выраженный седативный stone",
    flavor: "гашишный, земляной, пряный, смолисто-сладкий",
    images: [
      "./assets/p8-1.jpg",
      "./assets/p8-2.jpg",
      "./assets/p8-3.jpg"
    ],
    seedOptions: [
      { seeds: 10, priceRUB: 4000 }
    ],
    description: "Badakhshan — горная афганская фотопериодная indica-ландрейс, ценится за плотную смолу, классический hash-аромат и глубокий расслабляющий эффект."
  }
];

/* Куда вести «Заказать» (замени на свой @username) */
window.TELEGRAM_USERNAME = "BestSeed1";
