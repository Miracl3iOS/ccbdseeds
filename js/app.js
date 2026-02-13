/* WeedSeeds — демо шаблон: неоморфный чёрно‑зелёный UI + баннеры (фото/видео), категории, товары, отзывы с модерацией.
   Хранение: localStorage (демо).
*/
(() => {
  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));
  const app = document.getElementById("app");
  const topbar = document.getElementById("topbar");

  const LS = {
    banners: "ws_banners_v1",
    reviews: "ws_reviews_v1",
    admin: "ws_admin_v1"
  };

  const state = {
    banners: [],
    products: [],
    activeSlide: 0,
    carouselTimer: null,
    drawerOpen: false,
    searchOpen: false
  };

  const icons = {
    search: () => svg(`<path d="M11 18a7 7 0 1 1 0-14 7 7 0 0 1 0 14Zm0-2a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z"/><path d="M20 20l-3.2-3.2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>`, {viewBox:"0 0 24 24"}),
    arrowL: () => svg(`<path d="M14 6l-6 6 6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`, {viewBox:"0 0 24 24"}),
    arrowR: () => svg(`<path d="M10 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`, {viewBox:"0 0 24 24"}),
    x: () => svg(`<path d="M18 6L6 18M6 6l12 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>`, {viewBox:"0 0 24 24"}),
    tg: () => svg(`<path d="M21.6 4.3 3.2 11.7c-1.3.5-1.3 1.2-.2 1.5l4.7 1.5 1.8 5.5c.2.6.3.6.7.2l2.7-2.6 5.6 4.1c1 .6 1.8.3 2-1l3.2-15.2c.3-1.5-.6-2.1-1.9-1.4Zm-2.9 4.1-8.8 8c-.3.3-.6.2-.4-.2l7.2-9.3c.4-.5 1-.8 1.6-.5.6.3.7.8.4 1.2Z"/>`, {viewBox:"0 0 24 24"}),
    spark: () => svg(`<path d="M12 2l1.6 6.2L20 10l-6.4 1.8L12 18l-1.6-6.2L4 10l6.4-1.8L12 2Z" fill="currentColor"/>`, {viewBox:"0 0 24 24"}),
    sun: () => svg(`<path d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 2v2M12 20v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2 12h2M20 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>`, {viewBox:"0 0 24 24"}),
    leaf: () => svg(`<path d="M20 3c-7 0-12 4-12 11 0 3 2 7 7 7 7 0 9-11 5-18Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M8 14c3-1 6-4 8-8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>`, {viewBox:"0 0 24 24"}),
    wind: () => svg(`<path d="M4 8h10a2 2 0 1 0-2-2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M4 12h14a2 2 0 1 1-2 2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M4 16h7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>`, {viewBox:"0 0 24 24"}),
    home: () => svg(`<path d="M4 10.5 12 3l8 7.5V21a1 1 0 0 1-1 1h-5v-7H10v7H5a1 1 0 0 1-1-1V10.5Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>`, {viewBox:"0 0 24 24"}),
    mountain: () => svg(`<path d="M3 20l7-12 4 7 2-3 5 8H3Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>`, {viewBox:"0 0 24 24"}),
    cap: () => svg(`<path d="M12 3 2 8l10 5 10-5-10-5Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M6 10v6c0 1 3 3 6 3s6-2 6-3v-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>`, {viewBox:"0 0 24 24"}),
    bolt: () => svg(`<path d="M13 2 3 14h7l-1 8 10-12h-7l1-8Z" fill="currentColor"/>`, {viewBox:"0 0 24 24"})
  };

  function svg(inner, attrs={}){
    const el = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    el.setAttribute("xmlns","http://www.w3.org/2000/svg");
    el.setAttribute("viewBox", attrs.viewBox || "0 0 24 24");
    el.setAttribute("fill", attrs.fill || "currentColor");
    el.innerHTML = inner;
    return el;
  }

  function safeParse(json, fallback){
    try{ return JSON.parse(json); }catch(e){ return fallback; }
  }

  function loadData(){
    const b = localStorage.getItem(LS.banners);
    state.banners = b ? safeParse(b, window.DEFAULT_BANNERS) : window.DEFAULT_BANNERS;

    // товары — пока из дефолта (легко заменить на API)
    state.products = window.DEFAULT_PRODUCTS;

    // reviews storage:
    const r = localStorage.getItem(LS.reviews);
    if(!r) localStorage.setItem(LS.reviews, JSON.stringify([]));

    // admin pin demo
    const a = localStorage.getItem(LS.admin);
    if(!a) localStorage.setItem(LS.admin, JSON.stringify({ pin: "1111" })); // поменяй
  }

  function saveBanners(){
    localStorage.setItem(LS.banners, JSON.stringify(state.banners));
  }

  function getReviews(){
    return safeParse(localStorage.getItem(LS.reviews) || "[]", []);
  }
  function saveReviews(list){
    localStorage.setItem(LS.reviews, JSON.stringify(list));
  }

  function setActiveNav(){
    const path = getRoute().path;
    $$(".nav__link", topbar).forEach(a => {
      const to = a.getAttribute("href");
      a.classList.toggle("is-active", to === `#/${path}`);
    });
  }

  function renderTopbar(){
    const items = [
      { path:"seeds", label:"Семена" },
      { path:"faq", label:"FAQ" },
      { path:"payment", label:"Оплата" },
      { path:"blog", label:"Блог" },
      { path:"warranty", label:"Гарантия" },
      { path:"about", label:"О нас" }
    ];

    const wrap = document.createElement("div");
    wrap.className = "topbar__inner";

    // mobile burger (на ПК скрыт через CSS)
    const burger = document.createElement("button");
    burger.className = "burger";
    burger.setAttribute("aria-label","Открыть меню");
    burger.innerHTML = `<span></span><span></span><span></span>`;
    burger.addEventListener("click", () => openDrawer(items));
    wrap.appendChild(burger);

    // logo placeholder
    const brand = document.createElement("a");
    brand.className = "brand";
    brand.href = "#/";
    brand.innerHTML = `
      <div class="brand__mark" title="logo.png — положи в /assets и поменяй фон" style="background-image:url('./assets/logo.png'); background-size:cover; background-position:center;">
        <!-- если logo.png нет — останется неоновая «плашка» -->
      </div>
      <div class="brand__text">
        <div class="brand__name">WEED SEEDS</div>
        <div class="brand__tag">CBD семена</div>
      </div>
    `;
    wrap.appendChild(brand);

    // nav (на мобиле скрыт)
    const nav = document.createElement("nav");
    nav.className = "nav";
    nav.setAttribute("aria-label","Навигация");
    nav.innerHTML = `<a class="nav__link" href="#/">Главная</a>` + items.map(i => `<a class="nav__link" href="#/${i.path}">${i.label}</a>`).join("");
    wrap.appendChild(nav);

    // search
    const search = document.createElement("div");
    search.className = "search";
    search.innerHTML = `
      <input class="search__input" type="search" placeholder="Поиск" aria-label="Поиск по товарам" />
      <div class="search__icon" aria-hidden="true"></div>
      <div class="search__results" role="listbox" aria-label="Результаты поиска"></div>
    `;
    $(".search__icon", search).appendChild(icons.search());
    wrap.appendChild(search);

    // results logic
    const input = $(".search__input", search);
    const panel = $(".search__results", search);

    const closeSearch = () => { panel.classList.remove("is-open"); state.searchOpen = false; };
    const openSearch = () => { panel.classList.add("is-open"); state.searchOpen = true; };

    input.addEventListener("input", () => {
      const q = input.value.trim().toLowerCase();
      if(!q){ closeSearch(); return; }
      const found = state.products
        .filter(p => (p.name + " " + p.id).toLowerCase().includes(q))
        .slice(0, 6);
      panel.innerHTML = found.length
        ? found.map(p => `<div class="search__item" role="option" data-id="${p.id}">
            <strong>${escapeHtml(p.name)}</strong>
            <span>${p.id}</span>
          </div>`).join("")
        : `<div class="search__item" role="option"><span class="muted">Ничего не найдено</span></div>`;
      openSearch();
    });

    panel.addEventListener("click", (e) => {
      const item = e.target.closest(".search__item");
      if(!item) return;
      const id = item.getAttribute("data-id");
      if(id){
        location.hash = `#/product/${encodeURIComponent(id)}`;
        input.value = "";
        closeSearch();
      }
    });

    document.addEventListener("click", (e) => {
      if(!state.searchOpen) return;
      if(!search.contains(e.target)) closeSearch();
    });

    topbar.innerHTML = "";
    topbar.appendChild(wrap);

    // Drawer root
    if(!$("#drawer")){
      const drawer = document.createElement("div");
      drawer.id = "drawer";
      drawer.className = "drawer";
      drawer.innerHTML = `
        <div class="drawer__backdrop" data-close="1"></div>
        <div class="drawer__panel">
          <div class="drawer__head">
            <div class="brand brand--sm">
              <div class="brand__mark" style="background-image:url('./assets/logo.png'); background-size:cover; background-position:center;"></div>
              <div class="brand__text">
                <div class="brand__name">WEED SEEDS</div>
                <div class="brand__tag">Меню</div>
              </div>
            </div>
            <button class="xbtn" aria-label="Закрыть меню" data-close="1"></button>
          </div>
          <div class="drawer__links"></div>
          <div class="tiny muted" style="margin-top:14px;">Подсветка активного пункта — кислотно‑зелёная.</div>
        </div>
      `;
      $(".xbtn", drawer).appendChild(icons.x());
      drawer.addEventListener("click", (e) => {
        const close = e.target.closest("[data-close='1']");
        if(close) closeDrawer();
      });
      document.body.appendChild(drawer);
    }

    setActiveNav();
  }

  function openDrawer(items){
    const drawer = $("#drawer");
    const links = $(".drawer__links", drawer);
    links.innerHTML = `
      <a href="#/" class="nav__link ${getRoute().path===''?'is-active':''}">Главная</a>
      ${items.map(i => `<a href="#/${i.path}" class="nav__link ${getRoute().path===i.path?'is-active':''}">${i.label}</a>`).join("")}
    `;
    drawer.classList.add("is-open");
    state.drawerOpen = true;
  }
  function closeDrawer(){
    const drawer = $("#drawer");
    drawer.classList.remove("is-open");
    state.drawerOpen = false;
  }

  function escapeHtml(s){
    return s.replace(/[&<>"']/g, (m) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  }

  function getRoute(){
    const raw = location.hash.replace(/^#\/?/, "");
    const [pathPart, qs] = raw.split("?");
    const parts = (pathPart || "").split("/").filter(Boolean);
    const path = parts[0] || "";
    const param = parts[1] || "";
    const query = Object.fromEntries(new URLSearchParams(qs || "").entries());
    return { raw, path, parts, param, query };
  }

  function stopCarousel(){
    if(state.carouselTimer){
      clearInterval(state.carouselTimer);
      state.carouselTimer = null;
    }
  }
  function startCarousel(nextFn){
    stopCarousel();
    state.carouselTimer = setInterval(nextFn, 6500);
  }

  function renderCarousel(){
    const wrap = document.createElement("section");
    wrap.className = "section";

    const outer = document.createElement("div");
    outer.className = "carousel card";
    outer.innerHTML = `
      <div class="carousel__frame"></div>
      <div class="carousel__controls">
        <div class="dots" aria-label="Переключатели баннера"></div>
        <div style="display:flex; gap:10px;">
          <button class="arrow" aria-label="Назад"></button>
          <button class="arrow" aria-label="Вперёд"></button>
        </div>
      </div>
    `;

    const frame = $(".carousel__frame", outer);
    const dots = $(".dots", outer);
    const [btnPrev, btnNext] = $$(".arrow", outer);
    btnPrev.appendChild(icons.arrowL());
    btnNext.appendChild(icons.arrowR());

    function go(i){
      state.activeSlide = (i + state.banners.length) % state.banners.length;
      $$(".slide", frame).forEach((s, idx) => s.classList.toggle("is-active", idx === state.activeSlide));
      $$(".dot", dots).forEach((d, idx) => d.classList.toggle("is-active", idx === state.activeSlide));
      // autoplay video only on active slide (muted)
      $$(".slide video", frame).forEach((v, idx) => {
        if(idx === state.activeSlide){
          v.play().catch(()=>{});
        }else{
          v.pause();
        }
      });
    }

    state.banners.forEach((b, idx) => {
      const slide = document.createElement("a");
      slide.className = "slide";
      slide.href = b.href || "#/seeds";
      slide.setAttribute("aria-label", b.title || "Баннер");
      slide.innerHTML = `
        ${b.type === "video"
          ? `<video class="slide__media" src="${b.src}" muted playsinline loop></video>`
          : `<img class="slide__media" src="${b.src}" alt="${escapeHtml(b.title||'Баннер')}" />`
        }
        <div class="slide__veil"></div>
        <div class="slide__content">
          <h2 class="slide__title">${escapeHtml(b.title || "Баннер")}</h2>
          <p class="slide__sub">Клик ведёт на нужную страницу. Баннеры (фото/видео) добавляются в админке.</p>
          <span class="btn">
            <span class="btn__glow" aria-hidden="true"></span>
            Открыть
            <span aria-hidden="true">→</span>
          </span>
        </div>
      `;
      frame.appendChild(slide);

      const dot = document.createElement("button");
      dot.className = "dot";
      dot.setAttribute("aria-label", `Баннер ${idx+1}`);
      dot.addEventListener("click", () => { go(idx); startCarousel(()=>go(state.activeSlide+1)); });
      dots.appendChild(dot);
    });

    btnPrev.addEventListener("click", () => { go(state.activeSlide-1); startCarousel(()=>go(state.activeSlide+1)); });
    btnNext.addEventListener("click", () => { go(state.activeSlide+1); startCarousel(()=>go(state.activeSlide+1)); });

    // swipe
    let sx=0, sy=0, moved=false;
    frame.addEventListener("touchstart", (e)=>{ const t=e.touches[0]; sx=t.clientX; sy=t.clientY; moved=false; }, {passive:true});
    frame.addEventListener("touchmove", (e)=>{ moved=true; }, {passive:true});
    frame.addEventListener("touchend", (e)=>{
      if(!moved) return;
      const t=e.changedTouches[0];
      const dx=t.clientX - sx;
      const dy=t.clientY - sy;
      if(Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)){
        if(dx>0) go(state.activeSlide-1); else go(state.activeSlide+1);
        startCarousel(()=>go(state.activeSlide+1));
      }
    });

    // init
    setTimeout(() => {
      go(0);
      startCarousel(()=>go(state.activeSlide+1));
    }, 0);

    wrap.appendChild(outer);
    return wrap;
  }

  function renderCategories(){
    const s = document.createElement("section");
    s.className = "section";

    const head = document.createElement("div");
    head.className = "section__head";
    head.innerHTML = `
      <div>
        <h2 class="h2">Выбор по категориям</h2>
        <div class="muted tiny">Квадратные блоки • неоморфный стиль • лого внутри блока (иконка)</div>
      </div>
      <a class="btn btn--ghost" href="#/seeds">
        <span class="btn__glow" aria-hidden="true"></span>
        Все семена
      </a>
    `;
    s.appendChild(head);

    const grid = document.createElement("div");
    grid.className = "grid grid--cats";
    window.CATEGORIES.forEach(c => {
      const el = document.createElement("a");
      el.className = "cat neo";
      el.href = `#/seeds?filter=${encodeURIComponent(c.id)}`;
      el.innerHTML = `
        <div class="cat__icon" title="Место для логотипа категории"></div>
        <div class="cat__name">${escapeHtml(c.name)}</div>
      `;
      const ic = icons[c.icon] ? icons[c.icon]() : icons.leaf();
      $(".cat__icon", el).appendChild(ic);
      grid.appendChild(el);
    });
    s.appendChild(grid);
    return s;
  }

  function productCard(p, opts={badge:"Избранное"}){
    const el = document.createElement("a");
    el.className = "product card";
    el.href = `#/product/${encodeURIComponent(p.id)}`;
    el.innerHTML = `
      <div class="product__top">
        <div>
          <div class="badge">${escapeHtml(opts.badge || "Популярное")}</div>
          <div class="product__title">${escapeHtml(p.name)}</div>
          <div class="product__meta">${escapeHtml(p.id)} • CBD ${escapeHtml(p.cbd)} • ${escapeHtml(p.flowering)}</div>
        </div>
        <div class="badge" style="border-color: rgba(255,255,255,.10); background: rgba(255,255,255,.04); color: rgba(233,243,238,.88);">€ ${p.priceEUR}</div>
      </div>
      <div class="product__thumb">
        <img src="${p.images[0]}" alt="${escapeHtml(p.name)}" />
      </div>
      <div class="tiny muted" style="margin-top:10px;">Клик → карточка товара с фото‑галереей 4:3 и отзывами.</div>
    `;
    return el;
  }

  function renderPopular(){
    const s = document.createElement("section");
    s.className = "section";

    const head = document.createElement("div");
    head.className = "section__head";
    head.innerHTML = `
      <div>
        <h2 class="h2">Популярные сорта</h2>
        <div class="muted tiny">3 примера товара (избранное). Можно заменить на реальные.</div>
      </div>
    `;
    s.appendChild(head);

    const grid = document.createElement("div");
    grid.className = "grid grid--products";
    state.products.slice(0,3).forEach(p => grid.appendChild(productCard(p, {badge:"Избранное"})));
    s.appendChild(grid);

    return s;
  }

  function renderHome(){
    const page = document.createElement("div");
    page.className = "page";

    const hero = document.createElement("section");
    hero.className = "section";
    hero.innerHTML = `
      <div class="section__head">
        <div>
          <h1 class="h1">Афганские семена от BESTSEED </h1>
          <div class="muted">качественные семена каннабиса </div>
        </div>
      </div>
    `;
    page.appendChild(hero);
    page.appendChild(renderCarousel());
    page.appendChild(renderCategories());
    page.appendChild(renderPopular());

    const note = document.createElement("section");
    note.className = "section";
    note.innerHTML = `
      <div class="notice neo">
        <strong>Быстрый старт:</strong> положи <span class="badge">logo.png</span> в <span class="badge">/assets</span>, замени баннеры в <span class="badge">/assets</span>
        и/или добавь свои через <a href="#/admin" class="link">админку</a>.
      </div>
    `;
    page.appendChild(note);

    return page;
  }

  function renderTextPage(title, paragraphs){
    const page = document.createElement("div");
    page.className = "page";
    page.innerHTML = `
      <div class="section__head">
        <div>
          <h1 class="h1">${escapeHtml(title)}</h1>
          <div class="muted">Заглушка — контент можно заменить на ваш.</div>
        </div>
      </div>
      <div class="card" style="padding:16px; line-height:1.7;">
        ${paragraphs.map(p => `<p style="margin:0 0 10px; color: rgba(233,243,238,.88);">${escapeHtml(p)}</p>`).join("")}
      </div>
    `;
    return page;
  }

  function renderSeeds(){
    const route = getRoute();
    const active = route.query.filter || "all";

    const page = document.createElement("div");
    page.className = "page";
    page.innerHTML = `
      <div class="section__head">
        <div>
          <h1 class="h1">Семена</h1>
          <div class="muted">Фильтры по категориям + карточки товаров.</div>
        </div>
      </div>
    `;

    const chips = document.createElement("div");
    chips.className = "chips";
    const allChip = mkChip("Все", "all", active, () => setFilter("all"));
    chips.appendChild(allChip);

    window.CATEGORIES.forEach(c => chips.appendChild(mkChip(c.name, c.id, active, () => setFilter(c.id))));
    page.appendChild(chips);

    const grid = document.createElement("div");
    grid.className = "grid grid--products";
    const list = (active === "all") ? state.products : state.products.filter(p => p.tags.includes(active));
    list.forEach(p => grid.appendChild(productCard(p, {badge:"Товар"})));

    page.appendChild(document.createElement("div")).style.height = "14px";
    page.appendChild(grid);

    function setFilter(id){
      const url = id === "all" ? "#/seeds" : `#/seeds?filter=${encodeURIComponent(id)}`;
      location.hash = url;
    }

    return page;
  }

  function mkChip(label, id, active, onClick){
    const b = document.createElement("button");
    b.className = "chip" + (active === id ? " is-active" : "");
    b.textContent = label;
    b.addEventListener("click", onClick);
    return b;
  }

  function renderProduct(id){
    const p = state.products.find(x => x.id === id);
    if(!p){
      return renderTextPage("Товар не найден", ["Проверьте ссылку или вернитесь в каталог."]);
    }

    const page = document.createElement("div");
    page.className = "page";

    const head = document.createElement("div");
    head.className = "section__head";
    head.innerHTML = `
      <div>
        <h1 class="h1">${escapeHtml(p.name)}</h1>
        <div class="muted">${escapeHtml(p.id)} • Фото 4:3 • Умная адаптация под телефон и ПК</div>
      </div>
      <a class="btn btn--ghost" href="#/seeds">
        <span class="btn__glow" aria-hidden="true"></span>
        ← Назад
      </a>
    `;
    page.appendChild(head);

    const wrap = document.createElement("div");
    wrap.className = "pwrap";

    // gallery
    const g = document.createElement("div");
    g.className = "gallery card";
    g.innerHTML = `
      <div class="gallery__main"><img alt="${escapeHtml(p.name)}"/></div>
      <div class="gallery__nav" aria-label="Миниатюры"></div>
      <div class="tiny muted" style="margin-top:10px;">Свайп по фото на телефоне тоже работает.</div>
    `;
    const mainImg = $(".gallery__main img", g);
    const nav = $(".gallery__nav", g);

    let active = 0;
    function setImg(i){
      active = (i + p.images.length) % p.images.length;
      mainImg.src = p.images[active];
      $$(".thumb", nav).forEach((t, idx) => t.classList.toggle("is-active", idx === active));
    }

    p.images.forEach((src, idx) => {
      const t = document.createElement("button");
      t.className = "thumb" + (idx===0 ? " is-active" : "");
      t.setAttribute("aria-label", `Фото ${idx+1}`);
      t.innerHTML = `<img src="${src}" alt="${escapeHtml(p.name)} фото ${idx+1}">`;
      t.addEventListener("click", () => setImg(idx));
      nav.appendChild(t);
    });
    setImg(0);

    // swipe on main
    let sx=0, sy=0, moved=false;
    $(".gallery__main", g).addEventListener("touchstart", (e)=>{ const t=e.touches[0]; sx=t.clientX; sy=t.clientY; moved=false; }, {passive:true});
    $(".gallery__main", g).addEventListener("touchmove", ()=>{ moved=true; }, {passive:true});
    $(".gallery__main", g).addEventListener("touchend", (e)=>{
      if(!moved) return;
      const t=e.changedTouches[0];
      const dx=t.clientX - sx;
      const dy=t.clientY - sy;
      if(Math.abs(dx) > 35 && Math.abs(dx) > Math.abs(dy)){
        if(dx>0) setImg(active-1); else setImg(active+1);
      }
    });

    // specs + order
    const right = document.createElement("div");
    right.className = "card specs";
    right.innerHTML = `
      <div class="spec"><span>КБД</span><strong>${escapeHtml(p.cbd)}</strong></div>
      <div class="spec"><span>Цветение</span><strong>${escapeHtml(p.flowering)}</strong></div>
      <div class="spec"><span>Генетика</span><strong>${escapeHtml(p.genetics)}</strong></div>
      <div class="spec"><span>Эффект</span><strong>${escapeHtml(p.effect)}</strong></div>
      <div class="spec"><span>Вкус и аромат</span><strong>${escapeHtml(p.flavor)}</strong></div>

      <div class="order">
        <div class="order__row">
          <div>
            <div class="tiny muted">Сувениров в упаковке</div>
            <div class="badge" style="display:inline-block; margin-top:6px;">${p.souvenirsInPack} шт.</div>
          </div>
          <div class="order__price">€ ${p.priceEUR}</div>
        </div>

        <select class="select" aria-label="Количество упаковок">
          ${[1,2,3,4,5].map(n => `<option value="${n}">${n} уп.</option>`).join("")}
        </select>

        <button class="btn" style="width:100%; margin-top:10px;" id="orderBtn">
          <span class="btn__glow" aria-hidden="true"></span>
          <span style="display:inline-grid; place-items:center; width:18px; height:18px;">${icons.tg().outerHTML}</span>
          Заказать в Telegram
        </button>

        <div class="tiny muted" style="margin-top:10px;">Кнопка открывает Telegram с готовым текстом (ID товара).</div>
      </div>
    `;

    wrap.appendChild(g);
    wrap.appendChild(right);
    page.appendChild(wrap);

    const desc = document.createElement("section");
    desc.className = "desc card";
    desc.innerHTML = `
      <h2 class="h2" style="margin:0 0 10px;">Описание сорта</h2>
      <p>${escapeHtml(p.description)}</p>
    `;
    page.appendChild(desc);

    page.appendChild(renderReviewsSection(p.id, p.name));

    // order button
    $("#orderBtn", right).addEventListener("click", () => {
      const qty = $(".select", right).value;
      const msg = `Здравствуйте! Хочу заказать: ${p.name} (${p.id}). Кол-во упаковок: ${qty}. Цена: €${p.priceEUR} за уп.`;
      const url = `https://t.me/${encodeURIComponent(window.TELEGRAM_USERNAME)}?text=${encodeURIComponent(msg)}`;
      window.open(url, "_blank", "noopener,noreferrer");
    });

    return page;
  }

  function renderReviewsSection(productId, productName){
    const wrap = document.createElement("section");
    wrap.className = "reviews card";

    const all = getReviews();
    const approved = all.filter(r => r.productId === productId && r.status === "approved");

    wrap.innerHTML = `
      <div class="section__head" style="margin:0 0 10px;">
        <div>
          <h2 class="h2">Отзывы</h2>
          <div class="muted tiny">Публикация после модерации. В демо модерация — в <a class="link" href="#/admin">админке</a>.</div>
        </div>
      </div>

      <div id="reviewsList"></div>

      <div class="notice" style="margin-top:12px;">
        Отправляя отзыв, вы соглашаетесь, что он появится только после проверки.
      </div>

      <form class="form" id="reviewForm">
        <input class="field" name="name" placeholder="Имя" required maxlength="40" />
        <textarea class="field" name="text" placeholder="Ваш отзыв" required maxlength="600"></textarea>
        <button class="btn" type="submit">
          <span class="btn__glow" aria-hidden="true"></span>
          Отправить на модерацию
        </button>
      </form>
    `;

    const list = $("#reviewsList", wrap);
    if(approved.length === 0){
      list.innerHTML = `<div class="muted">Пока нет опубликованных отзывов.</div>`;
    }else{
      list.innerHTML = approved
        .sort((a,b)=>b.createdAt - a.createdAt)
        .map(r => `
          <div class="review">
            <div class="review__top">
              <div class="review__name">${escapeHtml(r.name)}</div>
              <div class="review__date">${new Date(r.createdAt).toLocaleDateString("ru-RU")}</div>
            </div>
            <p class="review__text">${escapeHtml(r.text)}</p>
          </div>
        `).join("");
    }

    $("#reviewForm", wrap).addEventListener("submit", (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const name = (fd.get("name") || "").toString().trim();
      const text = (fd.get("text") || "").toString().trim();
      if(!name || !text) return;

      const reviews = getReviews();
      reviews.push({
        id: "R-" + Math.random().toString(16).slice(2),
        productId,
        productName,
        name,
        text,
        status: "pending",
        createdAt: Date.now()
      });
      saveReviews(reviews);
      e.target.reset();
      alert("Спасибо! Отзыв отправлен на модерацию.");
    });

    return wrap;
  }

  function renderAdmin(){
    const page = document.createElement("div");
    page.className = "page admin";

    const adminCfg = safeParse(localStorage.getItem(LS.admin) || "{}", {pin:"1111"});
    const pin = prompt("Демо‑вход. PIN:", "");
    if(pin !== adminCfg.pin){
      return renderTextPage("Доступ закрыт", ["Неверный PIN. Измени PIN в localStorage (ключ ws_admin_v1) или в app.js."]);
    }

    // banners
    const bCard = document.createElement("div");
    bCard.className = "card";
    bCard.style.padding = "16px";
    bCard.innerHTML = `
      <div class="section__head" style="margin:0 0 10px;">
        <div>
          <h1 class="h1" style="margin:0;">Админка (демо)</h1>
          <div class="muted">Баннеры (фото/видео) + модерация отзывов. Всё хранится в localStorage.</div>
        </div>
        <a class="btn btn--ghost" href="#/">
          <span class="btn__glow" aria-hidden="true"></span>
          ← На сайт
        </a>
      </div>

      <h2 class="h2" style="margin:0 0 10px;">Баннеры</h2>
      <div class="tiny muted" style="margin-bottom:10px;">Можно добавлять ссылку на файл (jpg/png/mp4/webm) и ссылку перехода (href).</div>

      <form class="form" id="bannerForm">
        <select class="field" name="type" aria-label="Тип баннера">
          <option value="image">Фото</option>
          <option value="video">Видео</option>
        </select>
        <input class="field" name="src" placeholder="src (например: ./assets/my.jpg или https://...)" required />
        <input class="field" name="href" placeholder="href (например: #/seeds?filter=autoflower)" required />
        <input class="field" name="title" placeholder="Заголовок баннера" required maxlength="60" />
        <button class="btn" type="submit">
          <span class="btn__glow" aria-hidden="true"></span>
          Добавить баннер
        </button>
      </form>

      <div style="height:14px;"></div>

      <table class="table" aria-label="Список баннеров">
        <thead><tr><th>ID</th><th>Тип</th><th>src</th><th>href</th><th></th></tr></thead>
        <tbody id="bRows"></tbody>
      </table>
    `;

    const bRows = $("#bRows", bCard);
    function drawBanners(){
      bRows.innerHTML = state.banners.map(b => `
        <tr class="row">
          <td>${escapeHtml(b.id)}</td>
          <td><span class="badge">${escapeHtml(b.type)}</span></td>
          <td class="tiny muted" style="max-width:280px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${escapeHtml(b.src)}</td>
          <td class="tiny muted" style="max-width:240px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${escapeHtml(b.href)}</td>
          <td style="text-align:right;">
            <button class="btn btn--ghost" data-del="${escapeHtml(b.id)}">Удалить</button>
          </td>
        </tr>
      `).join("");
    }
    drawBanners();

    $("#bannerForm", bCard).addEventListener("submit", (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const type = fd.get("type");
      const src = fd.get("src").toString().trim();
      const href = fd.get("href").toString().trim();
      const title = fd.get("title").toString().trim();
      const id = "b" + Math.random().toString(16).slice(2, 7);
      state.banners.unshift({ id, type, src, href, title });
      saveBanners();
      e.target.reset();
      drawBanners();
      alert("Баннер добавлен. Вернись на главную, чтобы увидеть.");
    });

    bRows.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-del]");
      if(!btn) return;
      const id = btn.getAttribute("data-del");
      if(!confirm("Удалить баннер " + id + "?")) return;
      state.banners = state.banners.filter(x => x.id !== id);
      saveBanners();
      drawBanners();
    });

    // reviews moderation
    const rCard = document.createElement("div");
    rCard.className = "card";
    rCard.style.padding = "16px";
    rCard.innerHTML = `
      <h2 class="h2" style="margin:0 0 10px;">Отзывы на модерации</h2>
      <div class="tiny muted" style="margin-bottom:10px;">Одобрить → отзыв появится в карточке товара.</div>
      <table class="table" aria-label="Отзывы">
        <thead><tr><th>Товар</th><th>Имя</th><th>Текст</th><th>Статус</th><th></th></tr></thead>
        <tbody id="rRows"></tbody>
      </table>
    `;

    const rRows = $("#rRows", rCard);
    function drawReviews(){
      const reviews = getReviews().sort((a,b)=>b.createdAt-a.createdAt);
      if(reviews.length === 0){
        rRows.innerHTML = `<tr><td colspan="5" class="muted">Пока нет отзывов.</td></tr>`;
        return;
      }
      rRows.innerHTML = reviews.map(r => `
        <tr class="row">
          <td>
            <div style="font-weight:800;">${escapeHtml(r.productName || r.productId)}</div>
            <div class="tiny muted">${escapeHtml(r.productId)}</div>
          </td>
          <td>${escapeHtml(r.name)}</td>
          <td class="tiny muted" style="max-width:360px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${escapeHtml(r.text)}</td>
          <td><span class="badge" style="background:${r.status==='approved'?'rgba(57,255,20,.08)':'rgba(255,255,255,.04)'}; border-color:${r.status==='approved'?'rgba(57,255,20,.18)':'rgba(255,255,255,.10)'};">${escapeHtml(r.status)}</span></td>
          <td style="text-align:right; display:flex; gap:10px; justify-content:flex-end;">
            ${r.status!=='approved' ? `<button class="btn" data-approve="${escapeHtml(r.id)}"><span class="btn__glow"></span>Одобрить</button>` : ``}
            <button class="btn btn--ghost" data-reject="${escapeHtml(r.id)}">Удалить</button>
          </td>
        </tr>
      `).join("");
    }
    drawReviews();

    rRows.addEventListener("click", (e) => {
      const a = e.target.closest("[data-approve]");
      const d = e.target.closest("[data-reject]");
      let reviews = getReviews();
      if(a){
        const id = a.getAttribute("data-approve");
        reviews = reviews.map(r => r.id===id ? {...r, status:"approved"} : r);
        saveReviews(reviews);
        drawReviews();
        alert("Одобрено.");
      }
      if(d){
        const id = d.getAttribute("data-reject");
        if(!confirm("Удалить отзыв?")) return;
        reviews = reviews.filter(r => r.id !== id);
        saveReviews(reviews);
        drawReviews();
      }
    });

    page.appendChild(bCard);
    page.appendChild(rCard);

    const hint = document.createElement("div");
    hint.className = "notice neo";
    hint.innerHTML = `
      <strong>Про продакшен:</strong> localStorage — только демо. Для реального магазина подключи API/БД и авторизацию.
      Я могу помочь мигрировать на Supabase/Firebase/Node+Postgres.
    `;
    page.appendChild(hint);

    return page;
  }

  function route(){
    stopCarousel();
    if(state.drawerOpen) closeDrawer();

    const r = getRoute();
    let view;

    if(r.path === "") view = renderHome();
    else if(r.path === "seeds") view = renderSeeds();
    else if(r.path === "faq") view = renderTextPage("FAQ", [
      "Сюда добавь ответы: доставка, гарантия, способы оплаты, вопросы по сортам и т.д.",
      "Подчёркивание/подсветка пунктов меню делается автоматически при переходе."
    ]);
    else if(r.path === "payment") view = renderTextPage("Оплата", [
      "Опиши варианты оплаты и доставки. Здесь можно добавить таблицу/карточки."
    ]);
    else if(r.path === "blog") view = renderTextPage("Блог", [
      "Раздел под статьи. Можно подключить CMS (например, Strapi/Contentful)."
    ]);
    else if(r.path === "warranty") view = renderTextPage("Гарантия", [
      "Правила гарантии, условия замены, сроки рассмотрения обращений."
    ]);
    else if(r.path === "about") view = renderTextPage("О нас", [
      "История, миссия, контакты, ссылки на соцсети."
    ]);
    else if(r.path === "product") view = renderProduct(decodeURIComponent(r.param));
    else if(r.path === "admin") view = renderAdmin();
    else view = renderTextPage("Страница не найдена", ["Вернитесь на главную или в каталог."]);

    app.innerHTML = "";
    app.appendChild(view);
    setActiveNav();
    app.focus({preventScroll:true});
    window.scrollTo({top:0, behavior:"smooth"});
  }

  function init(){
    loadData();
    renderTopbar();
    document.getElementById("year").textContent = new Date().getFullYear();
    window.addEventListener("hashchange", route);
    route();
  }

  init();
})();
