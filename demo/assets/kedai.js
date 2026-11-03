/* WEBSITESME — Template Kedai Sendiri (demo). Config: window.KEDAI */
(function () {
  var K = window.KEDAI;
  if (!K) return;
  var WA = '601156589986';
  var STORE_KEY = 'kedai-cart-' + K.slug;

  function rm(n) { return 'RM ' + n.toFixed(2); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function waLink(text) { return 'https://wa.me/' + WA + '?text=' + encodeURIComponent(text); }

  /* simple product illustrations */
  function art(shape, c) {
    var s = { fill: c, dark: 'rgba(0,0,0,.16)', light: 'rgba(255,255,255,.45)' };
    var svg = {
      bottle: '<rect x="40" y="10" width="20" height="14" rx="3" fill="' + s.dark + '"/><rect x="43" y="22" width="14" height="10" fill="' + s.fill + '"/><rect x="28" y="30" width="44" height="62" rx="12" fill="' + s.fill + '"/><rect x="34" y="48" width="32" height="20" rx="4" fill="' + s.light + '"/>',
      jar: '<rect x="26" y="26" width="48" height="12" rx="4" fill="' + s.dark + '"/><rect x="22" y="36" width="56" height="52" rx="14" fill="' + s.fill + '"/><rect x="30" y="52" width="40" height="16" rx="4" fill="' + s.light + '"/>',
      tube: '<rect x="38" y="78" width="24" height="12" rx="3" fill="' + s.dark + '"/><path d="M30 12h40l-6 68H36z" fill="' + s.fill + '"/><rect x="38" y="34" width="24" height="22" rx="3" fill="' + s.light + '"/>',
      pack: '<path d="M22 18h56l-4 74H26z" fill="' + s.fill + '"/><path d="M22 18h56v8H22z" fill="' + s.dark + '"/><circle cx="50" cy="56" r="16" fill="' + s.light + '"/>',
      fabric: '<path d="M50 14c14 0 24 10 24 24 0 8-3 14-8 19l12 33H22l12-33c-5-5-8-11-8-19 0-14 10-24 24-24z" fill="' + s.fill + '"/><path d="M50 26c7 0 12 5 12 12s-5 13-12 13-12-6-12-13 5-12 12-12z" fill="' + s.light + '"/><path d="M34 60l-8 30h12l8-26z" fill="' + s.dark + '"/>',
      box: '<rect x="20" y="30" width="60" height="56" rx="6" fill="' + s.fill + '"/><path d="M20 30l10-14h40l10 14z" fill="' + s.dark + '"/><rect x="34" y="48" width="32" height="20" rx="4" fill="' + s.light + '"/>'
    }[shape] || '';
    return '<svg viewBox="0 0 100 100" aria-hidden="true">' + svg + '</svg>';
  }

  function vis(p, eager) {
    var a = art(p.shape, p.color);
    if (!p.img) return a;
    return '<img src="' + p.img + '" alt="' + esc(p.name) + '" width="800" height="800"' + (eager ? '' : ' loading="lazy"') + ' decoding="async" onerror="this.outerHTML=this.dataset.f" data-f=\'' + a.replace(/'/g, '&#39;') + '\'>';
  }

  var cart = {};
  try { cart = JSON.parse(localStorage.getItem(STORE_KEY) || '{}') || {}; } catch (e) { cart = {}; }
  function save() { try { localStorage.setItem(STORE_KEY, JSON.stringify(cart)); } catch (e) {} }
  function byId(id) { for (var i = 0; i < K.products.length; i++) if (K.products[i].id === id) return K.products[i]; }
  function count() { var n = 0; for (var k in cart) n += cart[k]; return n; }
  function subtotal() { var t = 0; for (var k in cart) { var p = byId(k); if (p) t += p.price * cart[k]; } return t; }

  /* ---------- render page ---------- */
  var app = document.getElementById('app');
  var cats = ['Semua'].concat(K.categories);
  var icons = {
    truck: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7h11v9H3zM14 10h4l3 3v3h-7"/><circle cx="7" cy="17.5" r="1.6"/><circle cx="17" cy="17.5" r="1.6"/></svg>',
    lock: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="10" width="16" height="11" rx="2.5"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>',
    chat: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.4 8.4 0 0 1-12.3 7.5L3 21l2-5.5A8.5 8.5 0 1 1 21 11.5z"/></svg>'
  };
  var hp = K.products;

  app.innerHTML =
    '<div class="demo-bar">Ini <b>DEMO</b> kedai oleh WEBSITESME — cuba tambah ke troli &amp; checkout. <a href="/#pakej">Bina kedai anda →</a></div>' +
    '<header class="k-header"><div class="wrap">' +
      '<a class="logo" href="#top">' + esc(K.name) + '</a>' +
      '<nav class="k-nav" aria-label="Menu"><a href="#shop">Produk</a><a href="#tentang">Tentang</a><a href="' + waLink('Hi WEBSITESME, saya nak kedai macam demo ' + K.name) + '" target="_blank" rel="noopener">Hubungi</a></nav>' +
      '<button class="cart-btn" id="cartBtn" aria-label="Buka troli"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 4h2l2.4 11h10.8l2-8H6.3"/><circle cx="9" cy="20" r="1.3"/><circle cx="17" cy="20" r="1.3"/></svg>Troli <span class="cart-count" id="cartCount">0</span></button>' +
    '</div></header>' +
    '<section class="k-hero" id="top"><div class="wrap">' +
      '<div><div class="kicker">' + esc(K.hero.kicker) + '</div><h1>' + K.hero.title + '</h1><p>' + esc(K.hero.sub) + '</p>' +
      '<div class="ctas"><a class="btn btn-primary" href="#shop">Shop Now</a><a class="btn btn-ghost" href="#tentang">Tentang Kami</a></div></div>' +
      '<div class="hero-art" aria-hidden="true">' +
        '<div class="prod p1" style="background:' + hp[0].bg + '">' + vis(hp[0], true) + '</div>' +
        '<div class="prod p2" style="background:' + hp[1].bg + '">' + vis(hp[1], true) + '</div>' +
        '<div class="prod p3" style="background:' + hp[2].bg + '">' + vis(hp[2], true) + '</div>' +
      '</div>' +
    '</div></section>' +
    '<section class="trust" aria-label="Kelebihan"><div class="wrap">' +
      K.trust.map(function (t) { return '<div><span class="ti">' + icons[t.icon] + '</span><span><b>' + esc(t.title) + '</b>' + esc(t.text) + '</span></div>'; }).join('') +
    '</div></section>' +
    '<section class="shop" id="shop"><div class="wrap">' +
      '<div class="shop-head"><h2>' + esc(K.shopTitle) + '</h2><div class="chips" role="tablist" aria-label="Kategori">' +
        cats.map(function (c, i) { return '<button class="chip' + (i === 0 ? ' on' : '') + '" role="tab" aria-selected="' + (i === 0) + '" data-cat="' + esc(c) + '">' + esc(c) + '</button>'; }).join('') +
      '</div></div><div class="grid" id="grid"></div>' +
    '</div></section>' +
    '<section class="about" id="tentang"><div class="wrap"><h2>' + esc(K.about.title) + '</h2><p>' + esc(K.about.text) + '</p></div></section>' +
    '<footer class="k-footer"><div class="wrap"><div><div class="logo">' + esc(K.name) + '</div><small>Kedai demo · produk &amp; harga contoh sahaja</small></div>' +
      '<div class="by">Website oleh <a href="/">WEBSITESME</a> · © Multirich Resources</div></div></footer>' +
    '<a class="float-wa" href="' + waLink('Hi WEBSITESME, saya tengok demo ' + K.name + ' dan nak bina kedai sendiri') + '" target="_blank" rel="noopener" aria-label="WhatsApp">' + icons.chat.replace('width="20" height="20"', 'width="26" height="26"') + '</a>' +
    '<div class="overlay" id="overlay"></div>' +
    '<aside class="drawer" id="drawer" aria-label="Troli" aria-hidden="true"><div class="d-head"><h3>Troli Anda</h3><button class="x" id="closeCart" aria-label="Tutup troli"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>' +
      '<div class="d-body" id="lines"></div>' +
      '<div class="d-foot"><div class="row"><span>Subtotal</span><span id="sub">RM 0.00</span></div><div class="row"><span>Penghantaran</span><span id="ship">' + rm(K.shipping) + '</span></div><div class="row total"><span>Jumlah</span><span id="total">RM 0.00</span></div>' +
      '<button class="btn btn-dark btn-block" id="checkoutBtn">Checkout</button></div></aside>' +
    '<div class="modal" id="modal" role="dialog" aria-modal="true" aria-label="Checkout"><div class="sheet" id="sheet"></div></div>' +
    '<div class="toast" id="toast" role="status" aria-live="polite"></div>';

  var grid = document.getElementById('grid');
  function renderGrid(cat) {
    grid.innerHTML = K.products.filter(function (p) { return cat === 'Semua' || p.cat === cat; }).map(function (p) {
      return '<article class="pcard"><div class="pimg" style="background:' + p.bg + '">' + vis(p) + (p.badge ? '<span class="badge">' + esc(p.badge) + '</span>' : '') + '</div>' +
        '<div class="pbody"><div class="pname">' + esc(p.name) + '</div><div class="pdesc">' + esc(p.desc) + '</div>' +
        '<div class="pprice"><b>' + rm(p.price) + '</b>' + (p.old ? '<s>' + rm(p.old) + '</s>' : '') + '</div>' +
        '<div class="add"><button class="btn btn-dark" data-add="' + p.id + '">Tambah ke Troli</button></div></div></article>';
    }).join('');
  }
  renderGrid('Semua');

  document.querySelector('.chips').addEventListener('click', function (e) {
    var b = e.target.closest('.chip'); if (!b) return;
    [].forEach.call(this.children, function (c) { c.classList.remove('on'); c.setAttribute('aria-selected', 'false'); });
    b.classList.add('on'); b.setAttribute('aria-selected', 'true');
    renderGrid(b.getAttribute('data-cat'));
  });

  var toastEl = document.getElementById('toast'), tt;
  function toast(msg) { toastEl.textContent = msg; toastEl.classList.add('show'); clearTimeout(tt); tt = setTimeout(function () { toastEl.classList.remove('show'); }, 1800); }

  grid.addEventListener('click', function (e) {
    var b = e.target.closest('[data-add]'); if (!b) return;
    var id = b.getAttribute('data-add');
    cart[id] = (cart[id] || 0) + 1; save(); update();
    b.textContent = '✓ Ditambah'; b.classList.add('done');
    setTimeout(function () { b.textContent = 'Tambah ke Troli'; b.classList.remove('done'); }, 1200);
    var cb = document.getElementById('cartBtn'); cb.classList.remove('bump'); void cb.offsetWidth; cb.classList.add('bump');
    toast(byId(id).name + ' masuk troli');
  });

  /* ---------- cart drawer ---------- */
  var drawer = document.getElementById('drawer'), overlay = document.getElementById('overlay'), lines = document.getElementById('lines');
  function openCart() { toastEl.classList.remove('show'); drawer.classList.add('open'); overlay.classList.add('open'); drawer.setAttribute('aria-hidden', 'false'); document.body.classList.add('lock'); }
  function closeAll() { drawer.classList.remove('open'); overlay.classList.remove('open'); drawer.setAttribute('aria-hidden', 'true'); modal.classList.remove('open'); document.body.classList.remove('lock'); }
  document.getElementById('cartBtn').addEventListener('click', openCart);
  document.getElementById('closeCart').addEventListener('click', closeAll);
  overlay.addEventListener('click', closeAll);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeAll(); });

  function update() {
    document.getElementById('cartCount').textContent = count();
    var ids = Object.keys(cart).filter(function (k) { return cart[k] > 0 && byId(k); });
    lines.innerHTML = ids.length ? ids.map(function (k) {
      var p = byId(k);
      return '<div class="line"><div class="thumb" style="background:' + p.bg + '">' + vis(p) + '</div><div class="info"><b>' + esc(p.name) + '</b><span>' + rm(p.price) + '</span>' +
        '<div class="qty"><button data-q="-1" data-id="' + k + '" aria-label="Kurang">−</button><em>' + cart[k] + '</em><button data-q="1" data-id="' + k + '" aria-label="Tambah">+</button></div></div>' +
        '<div class="lt">' + rm(p.price * cart[k]) + '</div></div>';
    }).join('') : '<div class="empty">Troli masih kosong.<br>Pilih produk kegemaran anda.</div>';
    var sub = subtotal(), ship = sub > 0 ? K.shipping : 0;
    document.getElementById('sub').textContent = rm(sub);
    document.getElementById('ship').textContent = rm(ship);
    document.getElementById('total').textContent = rm(sub + ship);
    document.getElementById('checkoutBtn').disabled = sub === 0;
    document.getElementById('checkoutBtn').style.opacity = sub === 0 ? '.45' : '1';
  }
  lines.addEventListener('click', function (e) {
    var b = e.target.closest('[data-q]'); if (!b) return;
    var id = b.getAttribute('data-id');
    cart[id] = Math.max(0, (cart[id] || 0) + parseInt(b.getAttribute('data-q'), 10));
    if (!cart[id]) delete cart[id];
    save(); update();
  });
  update();

  /* ---------- checkout (demo) ---------- */
  var modal = document.getElementById('modal'), sheet = document.getElementById('sheet');
  document.getElementById('checkoutBtn').addEventListener('click', function () {
    if (!subtotal()) return;
    var total = subtotal() + K.shipping;
    sheet.innerHTML =
      '<h3>Checkout</h3><p class="note">Demo sahaja — tiada bayaran sebenar dibuat. Dalam kedai sebenar, langkah ini sambung terus ke payment gateway.</p>' +
      '<form id="coForm"><div class="field"><label for="f1">Nama penuh</label><input id="f1" autocomplete="off" placeholder="Contoh: Siti Aminah"></div>' +
      '<div class="field"><label for="f2">No. telefon</label><input id="f2" inputmode="tel" autocomplete="off" placeholder="01x-xxx xxxx"></div>' +
      '<div class="field"><label for="f3">Alamat penghantaran</label><textarea id="f3" autocomplete="off" placeholder="No. rumah, jalan, poskod, negeri"></textarea></div>' +
      '<div class="pay" role="radiogroup" aria-label="Cara bayaran"><label><input type="radio" name="pay" checked> FPX</label><label><input type="radio" name="pay"> Kad</label></div>' +
      '<div class="sum"><span>Jumlah</span><span>' + rm(total) + '</span></div>' +
      '<div class="actions"><button type="submit" class="btn btn-dark btn-block">Bayar ' + rm(total) + '</button><button type="button" class="btn btn-ghost btn-block" id="back" style="color:var(--text)">Kembali ke troli</button></div></form>';
    drawer.classList.remove('open');
    modal.classList.add('open'); overlay.classList.add('open');
    document.getElementById('back').addEventListener('click', function () { modal.classList.remove('open'); openCart(); });
    document.getElementById('coForm').addEventListener('submit', function (e) {
      e.preventDefault();
      cart = {}; save(); update();
      sheet.innerHTML = '<div class="success"><div class="ok"><svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l4 4L19 6"/></svg></div>' +
        '<h3>Order berjaya!</h3><p>Ini cara customer anda rasa. Dalam kedai sebenar, bayaran masuk akaun anda dan order terus muncul dalam dashboard.</p></div>' +
        '<div class="actions"><a class="btn btn-wa btn-block" href="' + waLink('Hi WEBSITESME, saya dah cuba demo ' + K.name + '. Saya nak kedai macam ni!') + '" target="_blank" rel="noopener">Saya Nak Kedai Macam Ni</a>' +
        '<button type="button" class="btn btn-ghost btn-block" id="done" style="color:var(--text)">Teruskan tengok demo</button></div>';
      document.getElementById('done').addEventListener('click', closeAll);
    });
  });
})();
