(() => {
  // Хранилища
  const LS = {
    admin: "ws_admin_v1",
    products: "ws_products_v1",
    banners: "ws_banners_v1",
    reviews: "ws_reviews_v1",
    authed: "ws_admin_authed"
  };

  // helpers
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const jget = (k, fallback) => {
    try { return JSON.parse(localStorage.getItem(k) || ""); } catch { return fallback; }
  };
  const jset = (k, v) => localStorage.setItem(k, JSON.stringify(v));

  // defaults
  const defaultAdmin = { pin: "1111" };
  const adminCfg = jget(LS.admin, defaultAdmin);
  if (!localStorage.getItem(LS.admin)) jset(LS.admin, adminCfg);

  if (!localStorage.getItem(LS.products)) jset(LS.products, (window.DEFAULT_PRODUCTS || []));
  if (!localStorage.getItem(LS.banners)) jset(LS.banners, (window.DEFAULT_BANNERS || []));
  if (!localStorage.getItem(LS.reviews)) jset(LS.reviews, []);

  const app = $("#adminApp");

  function render() {
    const isAuthed = localStorage.getItem(LS.authed) === "1";

    if (!isAuthed) {
      app.innerHTML = `
        <div class="card" style="padding:18px;">
          <div class="section__head" style="margin:0 0 14px;">
            <div>
              <h1 class="h1" style="margin:0;">Админка</h1>
              <div class="muted">Товары • Баннеры • Модерация отзывов</div>
            </div>
            <div class="topActions">
              <a class="btn btn--ghost" href="../"><span class="btn__glow" aria-hidden="true"></span>← На сайт</a>
            </div>
          </div>

          <form id="login" class="form" style="gap:10px;">
            <input class="field" name="pin" inputmode="numeric" autocomplete="one-time-code" placeholder="PIN" required />
            <button class="btn" type="submit"><span class="btn__glow" aria-hidden="true"></span>Войти</button>
            <div class="tiny muted">PIN хранится в localStorage (<span class="badge">${LS.admin}</span>). По умолчанию <span class="badge">1111</span>.</div>
          </form>
        </div>
      `;

      $("#login").addEventListener("submit", (e) => {
        e.preventDefault();
        const pin = new FormData(e.target).get("pin");
        if (String(pin || "").trim() === String(jget(LS.admin, defaultAdmin).pin)) {
          localStorage.setItem(LS.authed, "1");
          render();
        } else {
          alert("Неверный PIN");
        }
      });

      return;
    }

    app.innerHTML = `
      <div class="section__head" style="margin:0 0 10px;">
        <div>
          <h1 class="h1" style="margin:0;">Админка</h1>
          <div class="muted">Редактирование данных (локально, в браузере)</div>
        </div>
        <div class="topActions">
          <a class="btn btn--ghost" href="../"><span class="btn__glow" aria-hidden="true"></span>← На сайт</a>
          <button class="btn btn--ghost" id="logout"><span class="btn__glow" aria-hidden="true"></span>Выйти</button>
        </div>
      </div>

      <div class="adminTabs">
        <button class="chip is-active" data-tab="products">Товары</button>
        <button class="chip" data-tab="banners">Баннеры</button>
        <button class="chip" data-tab="reviews">Отзывы</button>
        <button class="chip" data-tab="settings">PIN</button>
      </div>

      <div id="panel"></div>
    `;

    $("#logout").addEventListener("click", () => {
      localStorage.removeItem(LS.authed);
      render();
    });

    const panel = $("#panel");

    function setTab(name) {
      $$(".chip[data-tab]").forEach(b => b.classList.toggle("is-active", b.dataset.tab === name));
      panel.innerHTML = "";
      if (name === "products") panel.appendChild(panelProducts());
      if (name === "banners") panel.appendChild(panelBanners());
      if (name === "reviews") panel.appendChild(panelReviews());
      if (name === "settings") panel.appendChild(panelSettings());
    }

    $(".adminTabs").addEventListener("click", (e) => {
      const b = e.target.closest(".chip[data-tab]");
      if (!b) return;
      setTab(b.dataset.tab);
    });

    setTab("products");
  }

  // ---------- PRODUCTS ----------
  function panelProducts() {
    const wrap = document.createElement("div");
    wrap.className = "card";
    wrap.style.padding = "16px";

    const products = jget(LS.products, []);
    wrap.innerHTML = `
      <div class="section__head" style="margin:0 0 10px;">
        <div>
          <h2 class="h2" style="margin:0;">Товары</h2>
          <div class="tiny muted">Хранение: <span class="badge">${LS.products}</span>. Цены строками: <span class="badge">3=2490</span> (семена=цена₽)</div>
        </div>
        <button class="btn btn--ghost" id="addP"><span class="btn__glow" aria-hidden="true"></span>+ Добавить</button>
      </div>

      <div class="adminGrid">
        <div class="adminList" id="list"></div>
        <div class="neo" id="form" style="padding:14px; border-radius:22px;">Выберите товар слева.</div>
      </div>
    `;

    const list = $("#list", wrap);
    const form = $("#form", wrap);

    const drawList = (activeId) => {
      list.innerHTML = "";
      products.forEach(p => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "adminPick" + (p.id === activeId ? " is-active" : "");
        btn.innerHTML = `
          <div style="font-weight:900;">${esc(p.name || "(без названия)")}</div>
          <div class="tiny muted">${esc(p.id)} • ${esc((p.tags || []).join(", "))}</div>
        `;
        btn.addEventListener("click", () => openForm(p.id));
        list.appendChild(btn);
      });
    };

    const parseOptions = (raw) => {
      return String(raw || "")
        .split("\n")
        .map(s => s.trim())
        .filter(Boolean)
        .map(line => {
          const [a, b] = line.split("=");
          const seeds = parseInt(a, 10);
          const priceRUB = parseInt(b, 10);
          return { seeds, priceRUB };
        })
        .filter(o => Number.isFinite(o.seeds) && Number.isFinite(o.priceRUB));
    };

    function openForm(id) {
      const p = products.find(x => x.id === id);
      if (!p) return;

      drawList(id);

      const imagesVal = (p.images || []).join("\n");
      const optsVal = (p.seedOptions || []).map(o => `${o.seeds}=${o.priceRUB ?? o.priceEUR ?? 0}`).join("\n");

      form.innerHTML = `
        <div style="display:flex; justify-content:space-between; gap:10px; flex-wrap:wrap; margin-bottom:10px;">
          <div>
            <div style="font-weight:900; font-size:16px;">${esc(p.name || "Товар")}</div>
            <div class="tiny muted">${esc(p.id)}</div>
          </div>
          <div class="topActions">
            <button class="btn btn--ghost" id="dup"><span class="btn__glow"></span>Дубликат</button>
            <button class="btn btn--ghost" id="del"><span class="btn__glow"></span>Удалить</button>
            <button class="btn" id="save"><span class="btn__glow"></span>Сохранить</button>
          </div>
        </div>

        <div class="adminForm">
          <label class="tiny muted">ID</label>
          <input class="field" id="f_id" value="${esc(p.id)}" />

          <label class="tiny muted">Название</label>
          <input class="field" id="f_name" value="${esc(p.name || "")}" />

          <label class="tiny muted">Категории (через запятую)</label>
          <input class="field" id="f_tags" value="${esc((p.tags || []).join(", "))}" placeholder="autoflower, feminized, regular" />

          <div class="admin2">
            <div>
              <label class="tiny muted">КБД</label>
              <input class="field" id="f_cbd" value="${esc(p.cbd || "")}" />
            </div>
            <div>
              <label class="tiny muted">Цветение</label>
              <input class="field" id="f_flow" value="${esc(p.flowering || "")}" />
            </div>
            <div>
              <label class="tiny muted">Генетика</label>
              <input class="field" id="f_gen" value="${esc(p.genetics || "")}" />
            </div>
            <div>
              <label class="tiny muted">Эффект</label>
              <input class="field" id="f_eff" value="${esc(p.effect || "")}" />
            </div>
            <div class="adminSpan2">
              <label class="tiny muted">Вкус/аромат</label>
              <input class="field" id="f_flav" value="${esc(p.flavor || "")}" />
            </div>
          </div>

          <label class="tiny muted">Фото (по одному пути на строку)</label>
          <textarea class="textarea" id="f_images" rows="4">${esc(imagesVal)}</textarea>

          <label class="tiny muted">Варианты цены (семена=цена₽)</label>
          <textarea class="textarea" id="f_opts" rows="4">${esc(optsVal)}</textarea>

          <label class="tiny muted">Описание</label>
          <textarea class="textarea" id="f_desc" rows="5">${esc(p.description || "")}</textarea>
        </div>
      `;

      $("#save", form).addEventListener("click", () => {
        const updId = $("#f_id", form).value.trim();
        if (!updId) return alert("ID обязателен");
        if (updId !== id && products.some(x => x.id === updId)) return alert("ID уже существует");

        const upd = {
          id: updId,
          name: $("#f_name", form).value.trim(),
          tags: $("#f_tags", form).value.split(",").map(s => s.trim()).filter(Boolean),
          cbd: $("#f_cbd", form).value.trim(),
          flowering: $("#f_flow", form).value.trim(),
          genetics: $("#f_gen", form).value.trim(),
          effect: $("#f_eff", form).value.trim(),
          flavor: $("#f_flav", form).value.trim(),
          images: $("#f_images", form).value.split("\n").map(s => s.trim()).filter(Boolean),
          seedOptions: parseOptions($("#f_opts", form).value),
          description: $("#f_desc", form).value.trim()
        };

        const idx = products.findIndex(x => x.id === id);
        products[idx] = { ...products[idx], ...upd };
        jset(LS.products, products);
        alert("Сохранено");
        openForm(updId);
      });

      $("#del", form).addEventListener("click", () => {
        if (!confirm("Удалить товар?")) return;
        const idx = products.findIndex(x => x.id === id);
        products.splice(idx, 1);
        jset(LS.products, products);
        form.textContent = "Удалено.";
        drawList();
      });

      $("#dup", form).addEventListener("click", () => {
        const base = products.find(x => x.id === id);
        const copy = JSON.parse(JSON.stringify(base));
        copy.id = base.id + "-copy";
        copy.name = (base.name || "") + " (копия)";
        products.unshift(copy);
        jset(LS.products, products);
        drawList(copy.id);
        openForm(copy.id);
      });
    }

    $("#addP", wrap).addEventListener("click", () => {
      const p = {
        id: "P-" + Date.now(),
        name: "Новый сорт",
        tags: ["autoflower"],
        cbd: "", flowering: "", genetics: "", effect: "", flavor: "",
        images: ["/assets/p-new-1.jpg"],
        seedOptions: [{ seeds: 1, priceRUB: 990 }],
        description: ""
      };
      products.unshift(p);
      jset(LS.products, products);
      drawList(p.id);
      openForm(p.id);
    });

    drawList();
    return wrap;
  }

  // ---------- BANNERS ----------
  function panelBanners() {
    const wrap = document.createElement("div");
    wrap.className = "card";
    wrap.style.padding = "16px";

    const banners = jget(LS.banners, []);
    wrap.innerHTML = `
      <div class="section__head" style="margin:0 0 10px;">
        <div>
          <h2 class="h2" style="margin:0;">Баннеры</h2>
          <div class="tiny muted">Хранение: <span class="badge">${LS.banners}</span></div>
        </div>
        <button class="btn btn--ghost" id="addB"><span class="btn__glow"></span>+ Добавить</button>
      </div>
      <div class="adminList" id="list"></div>
    `;

    const list = $("#list", wrap);

    function draw() {
      list.innerHTML = "";
      banners.forEach((b, i) => {
        const row = document.createElement("div");
        row.className = "adminRow";
        row.innerHTML = `
          <div>
            <div class="tiny muted">src</div>
            <input class="field" data-i="${i}" value="${esc(b.src || "")}" />
          </div>
          <div style="display:flex; gap:8px; flex-wrap:wrap; justify-content:flex-end;">
            <button class="btn btn--ghost" data-act="up" data-i="${i}">↑</button>
            <button class="btn btn--ghost" data-act="down" data-i="${i}">↓</button>
            <button class="btn btn--ghost" data-act="del" data-i="${i}">Удалить</button>
          </div>
        `;
        list.appendChild(row);
      });
    }

    wrap.addEventListener("input", (e) => {
      const inp = e.target.closest("input[data-i]");
      if (!inp) return;
      const i = Number(inp.dataset.i);
      banners[i].src = inp.value.trim();
      jset(LS.banners, banners);
    });

    wrap.addEventListener("click", (e) => {
      const b = e.target.closest("button[data-act],#addB");
      if (!b) return;

      if (b.id === "addB") {
        banners.push({ id: "b" + Date.now(), type: "image", src: "/assets/banner-new.jpg" });
        jset(LS.banners, banners);
        draw();
        return;
      }

      const i = Number(b.dataset.i);
      const act = b.dataset.act;
      if (act === "del") banners.splice(i, 1);
      if (act === "up" && i > 0) [banners[i - 1], banners[i]] = [banners[i], banners[i - 1]];
      if (act === "down" && i < banners.length - 1) [banners[i + 1], banners[i]] = [banners[i], banners[i + 1]];
      jset(LS.banners, banners);
      draw();
    });

    draw();
    return wrap;
  }

  // ---------- REVIEWS ----------
  function panelReviews() {
    const wrap = document.createElement("div");
    wrap.className = "card";
    wrap.style.padding = "16px";

    const reviews = jget(LS.reviews, []);
    wrap.innerHTML = `
      <div class="section__head" style="margin:0 0 10px;">
        <div>
          <h2 class="h2" style="margin:0;">Отзывы</h2>
          <div class="tiny muted">pending → approved/rejected • <span class="badge">${LS.reviews}</span></div>
        </div>
      </div>
      <div class="adminList" id="list"></div>
    `;

    const list = $("#list", wrap);

    function draw() {
      list.innerHTML = "";
      if (!reviews.length) {
        list.innerHTML = `<div class="muted">Отзывов пока нет.</div>`;
        return;
      }

      reviews
        .slice()
        .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
        .forEach((r) => {
          const row = document.createElement("div");
          row.className = "adminRow";
          row.innerHTML = `
            <div>
              <div style="font-weight:900;">${esc(r.productName || r.productId || "")}
                <span class="badge" style="margin-left:8px;">${esc(r.status || "pending")}</span>
              </div>
              <div class="tiny muted">${new Date(r.createdAt || Date.now()).toLocaleString("ru-RU")} • ${Number(r.rating || 5)}/5</div>
              <div style="margin-top:8px;">${esc(r.text || "")}</div>
            </div>
            <div style="display:flex; gap:8px; flex-wrap:wrap; justify-content:flex-end;">
              ${(r.status !== "approved") ? `<button class="btn btn--ghost" data-act="approve" data-id="${esc(r.id)}">Одобрить</button>` : ""}
              ${(r.status !== "rejected") ? `<button class="btn btn--ghost" data-act="reject" data-id="${esc(r.id)}">Отклонить</button>` : ""}
              <button class="btn btn--ghost" data-act="del" data-id="${esc(r.id)}">Удалить</button>
            </div>
          `;
          list.appendChild(row);
        });
    }

    wrap.addEventListener("click", (e) => {
      const b = e.target.closest("button[data-act]");
      if (!b) return;
      const id = b.dataset.id;
      const act = b.dataset.act;

      const idx = reviews.findIndex(x => String(x.id) === String(id));
      if (idx === -1) return;

      if (act === "approve") reviews[idx].status = "approved";
      if (act === "reject") reviews[idx].status = "rejected";
      if (act === "del") reviews.splice(idx, 1);

      jset(LS.reviews, reviews);
      draw();
    });

    draw();
    return wrap;
  }

  // ---------- SETTINGS ----------
  function panelSettings() {
    const wrap = document.createElement("div");
    wrap.className = "card";
    wrap.style.padding = "16px";

    wrap.innerHTML = `
      <div class="section__head" style="margin:0 0 10px;">
        <div>
          <h2 class="h2" style="margin:0;">PIN</h2>
          <div class="tiny muted">Хранение: <span class="badge">${LS.admin}</span></div>
        </div>
      </div>
      <div class="form" style="gap:10px;">
        <input class="field" id="pin" inputmode="numeric" placeholder="Новый PIN" />
        <button class="btn" id="save"><span class="btn__glow"></span>Сохранить PIN</button>
      </div>
    `;

    $("#save", wrap).addEventListener("click", () => {
      const v = $("#pin", wrap).value.trim();
      if (!v) return alert("Введите PIN");
      jset(LS.admin, { pin: v });
      alert("PIN сохранён");
    });

    return wrap;
  }

  render();
})();