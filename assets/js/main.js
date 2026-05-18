/*──────────────────────────────────────────────────────────────────────────────
  Page Loader
──────────────────────────────────────────────────────────────────────────────*/
(function () {
  let done = false;
  function hide() {
    if (done) return; done = true;
    const el = document.getElementById('page-loader');
    if (!el) return;
    el.classList.add('loader-fade');
    setTimeout(() => el.remove(), 600);
  }
  Promise.all([
    document.fonts.ready,
    new Promise(res => document.readyState === 'complete' ? res() : window.addEventListener('load', res, { once: true }))
  ]).then(hide);
  setTimeout(hide, 4000);
}());

/*──────────────────────────────────────────────────────────────────────────────
  Shared utilities — module-scope so meal-builder.js can call them directly
──────────────────────────────────────────────────────────────────────────────*/
const CART_KEY = 'pizzaCart';

function makeId(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function getCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || { items: [] }; }
  catch { return { items: [] }; }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  refreshCartBadge();
}

function refreshCartBadge() {
  const n = getCart().items.reduce((s, i) => s + i.quantity, 0);
  $('#cart-count').text(`Cart (${n})`);
}

// Singleton — DOM element and Bootstrap instance created once
let _toast = null;
function showToast(msg) {
  if (!_toast) {
    $('body').append(`
      <div id="cart-toast"
        class="toast align-items-center text-white bg-danger border-0 position-fixed bottom-0 end-0 m-4"
        role="alert" aria-live="assertive" aria-atomic="true" style="z-index:9999">
        <div class="d-flex">
          <div class="toast-body font-alt fw-semibold fs-6"></div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto"
            data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
      </div>`);
    _toast = new bootstrap.Toast(document.getElementById('cart-toast'), { delay: 2500 });
  }
  document.querySelector('#cart-toast .toast-body').textContent = msg;
  _toast.show();
}

function addToCartStorage(product, qty) {
  const cart = getCart();
  const hit  = cart.items.find(i => i.id === product.id);
  if (hit) hit.quantity += qty;
  else cart.items.push({ id: product.id, name: product.name, price: product.price, image: product.image, quantity: qty });
  saveCart(cart);
  showToast(`${qty} × ${product.name} added to cart`);
}

/*──────────────────────────────────────────────────────────────────────────────
  DOM-ready
──────────────────────────────────────────────────────────────────────────────*/
$(function () {
  const $ = window.$;
  const cashSymbol = '£';

  // Stamp IDs onto products once (products.js has no id field)
  if (typeof manualProductData !== 'undefined') {
    Object.values(manualProductData).forEach(list =>
      list.forEach(p => { p.id = p.id || makeId(p.name); })
    );
  }

  /*── Scroll-reveal via IntersectionObserver ──────────────────────*/
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('visible');
      revealObs.unobserve(e.target);
    });
  }, { rootMargin: '0px 0px -50px 0px', threshold: 0.05 });

  function observe(root) {
    (root || document).querySelectorAll('.fade-in-up:not(.visible)').forEach(el => revealObs.observe(el));
  }
  observe();

  /*── Promo modal ──────────────────────────────────────────────────*/
  $('#phoneOrderBtn').on('click', () => {
    const el = document.getElementById('promoModal');
    if (el) bootstrap.Modal.getOrCreateInstance(el).show();
  });

  /*── Menu view toggle ─────────────────────────────────────────────*/
  const $menu        = $('#dynamic-menu');
  const $viewToggle  = $('#view-toggle');
  const $toggleIcon  = $('#toggle-icon');
  let isListView     = localStorage.getItem('menuView') !== 'grid';

  function syncToggle() {
    $toggleIcon.toggleClass('bi-grid', isListView).toggleClass('bi-list', !isListView);
    $viewToggle.attr('title', isListView ? 'Switch to Grid View' : 'Switch to List View');
  }

  if ($viewToggle.length) {
    syncToggle();
    $viewToggle.on('click', () => {
      isListView = !isListView;
      localStorage.setItem('menuView', isListView ? 'list' : 'grid');
      syncToggle();
      renderMenu();
    });
  }

  /*── Product card (grid) ──────────────────────────────────────────*/
  function productCard(p, i) {
    const $col = $('<div>').addClass('col-12 col-sm-6 col-lg-4 fade-in-up').css('--delay', `${i * 60}ms`);
    $col.html(`
      <div class="card h-100">
        <img src="${p.image}" alt="${p.name}" loading="lazy" class="card-img-top"
          style="height:11rem;object-fit:cover;border-radius:0.875rem 0.875rem 0 0"/>
        <div class="card-body d-flex flex-column justify-content-between p-3">
          <h3 class="font-alt card-title fs-5 text-danger fw-semibold text-truncate mb-2"
            title="${p.name}">${p.name}</h3>
          <p class="font-alt card-text text-muted small line-clamp-3">${p.description}</p>
          <div class="font-alt d-flex justify-content-between align-items-center mt-3">
            <span class="fw-bold text-danger">from ${cashSymbol}${p.price}</span>
            <button class="btn btn-sm btn-outline-danger" aria-label="View ${p.name}">VIEW</button>
          </div>
        </div>
      </div>`);
    $col.on('click', () => openModal(p));
    return $col;
  }

  /*── Product list item ────────────────────────────────────────────*/
  function productListItem(p, i) {
    const $li = $('<li>')
      .addClass('list-group-item d-flex flex-column flex-sm-row align-items-start justify-content-between gap-3 py-3 fade-in-up')
      .css('--delay', `${i * 50}ms`);
    $li.html(`
      <div class="d-flex align-items-start gap-3 flex-grow-1" style="min-width:0">
        <img src="${p.image}" alt="${p.name}" loading="lazy" width="80" height="80"
          class="rounded" style="object-fit:cover;flex-shrink:0"/>
        <div class="text-start" style="min-width:0">
          <h3 class="font-alt fs-6 fw-semibold text-danger mb-1">${p.name}</h3>
          <p class="small mb-0 font-alt text-description">${p.description}</p>
        </div>
      </div>
      <div class="d-flex flex-column align-items-end justify-content-center text-end mt-2 mt-sm-0"
        style="width:130px;flex-shrink:0">
        <span class="fw-bold font-alt text-danger mb-1">from ${cashSymbol}${p.price}</span>
        <button class="btn btn-sm btn-outline-danger mt-1" aria-label="View ${p.name}">VIEW</button>
      </div>`);
    $li.on('click', () => openModal(p));
    return $li;
  }

  /*── Render menu ──────────────────────────────────────────────────*/
  function renderMenu() {
    if (!$menu.length) return;
    $menu.empty();
    Object.entries(manualProductData).forEach(([cat, products]) => {
      if (cat.toLowerCase() === 'toppings') return;
      const $sec = $('<section>').addClass('section-special border-sliding-line p-4 mb-5');
      $sec.append($('<h3>').addClass('font-display text-danger mb-4').text(cat));
      if (isListView) {
        const $ul = $('<ul>').addClass('list-group list-group-flush');
        products.forEach((p, i) => $ul.append(productListItem(p, i)));
        $sec.append($ul);
      } else {
        const $row = $('<div>').addClass('row g-4');
        products.forEach((p, i) => $row.append(productCard(p, i)));
        $sec.append($row);
      }
      $menu.append($sec);
    });
    observe($menu[0]);
  }

  /*── Product modal ────────────────────────────────────────────────*/
  function openModal(p) {
    const $m = $('#productModal');
    if (!$m.length) return;
    $('#productModalLabel').text(p.name);
    $('#modal-product-image').attr({ src: p.image, alt: p.name });
    $('#modal-product-description').text(p.description);
    $('#modal-product-ingredients').empty().append(
      (p.ingredients || '').split(',').map(s =>
        $('<li>').addClass('bg-danger bg-opacity-10 text-danger rounded px-2 py-1 text-nowrap').text(s.trim())
      )
    );
    $('#modal-product-calories').text(p.calories || '–');
    $('#modal-product-sugar').text(p.sugar    || '–');
    $('#modal-product-protein').text(p.protein  || '–');
    $('#modal-product-fat').text(p.fat      || '–');
    $('#modal-product-price').text(`${cashSymbol}${p.price}`);

    const $qty = $('#modal-quantity-input').val(0);
    $m.find('.btn-increment').off('click').on('click', () => { const v = +$qty.val(); if (v < 99) $qty.val(v + 1); });
    $m.find('.btn-decrement').off('click').on('click', () => { const v = +$qty.val(); if (v > 0) $qty.val(v - 1); });
    $('#modal-add-to-cart-btn').off('click').on('click', () => {
      const qty = +$qty.val();
      if (qty > 0) { addToCartStorage(p, qty); bootstrap.Modal.getOrCreateInstance($m[0]).hide(); }
      else showToast('Please select at least 1 item first.');
    });
    bootstrap.Modal.getOrCreateInstance($m[0]).show();
  }

  /*── Cart page ────────────────────────────────────────────────────*/
  const $cartWrap    = $('#cart-items-container');
  const $cartSummary = $('#cart-summary');

  function cartTotals() {
    const sub = getCart().items.reduce((s, i) => s + parseFloat(i.price) * i.quantity, 0);
    const del = sub >= 25 ? 0 : 2.99;
    $('#cart-subtotal').text(`${cashSymbol}${sub.toFixed(2)}`);
    $('#cart-delivery').text(del === 0 ? 'FREE' : `${cashSymbol}${del.toFixed(2)}`);
    $('#cart-total').text(`${cashSymbol}${(sub + del).toFixed(2)}`);
    $('#delivery-note').text(del === 0
      ? '🎉 You qualify for free delivery!'
      : `Add ${cashSymbol}${(25 - sub).toFixed(2)} more for free delivery`
    );
  }

  function renderCart() {
    if (!$cartWrap.length) return;
    const cart = getCart();

    if (!cart.items.length) {
      $cartSummary.addClass('d-none');
      $cartWrap.html(`
        <div class="text-center py-5">
          <i class="bi bi-cart-x" style="font-size:5rem;color:#dee2e6;display:block;margin-bottom:1.5rem"></i>
          <h3 class="font-alt text-danger mb-2">Your cart is empty</h3>
          <p class="text-muted mb-4" style="font-family:var(--font-alt);font-size:0.82rem">
            Looks like you haven't added anything yet.
          </p>
          <a href="menu.html" class="btn btn-danger btn-lg font-alt btn-pulse px-5">Browse Menu</a>
        </div>`);
      return;
    }

    $cartSummary.removeClass('d-none');
    const $ul = $('<ul>').addClass('list-group list-group-flush');

    cart.items.forEach((item, idx) => {
      const lineTotal  = parseFloat(item.price) * item.quantity;
      const extrasHtml = (item.extraGroups && item.extraGroups.length)
        ? item.extraGroups.map(g =>
            `<div class="cart-extra-group"><span class="cart-extra-label">${g.label}:</span>${
              g.items.map(x => `<span class="cart-extra-tag">${x}</span>`).join('')
            }</div>`
          ).join('')
        : '';

      $ul.append(
        $('<li>')
          .addClass('list-group-item d-flex align-items-start gap-3 py-3 px-0 fade-in-up')
          .css('--delay', `${idx * 60}ms`)
          .attr('data-id', item.id)
          .html(`
            <img src="${item.image}" alt="${item.name}" width="88" height="88"
              class="rounded" style="object-fit:cover;flex-shrink:0"/>
            <div class="flex-grow-1" style="min-width:0">
              <h5 class="font-alt text-danger fw-semibold mb-1 text-truncate">${item.name}</h5>
              ${extrasHtml}
              <p class="text-muted mb-2 mt-1" style="font-family:var(--font-alt);font-size:0.78rem">
                ${cashSymbol}${parseFloat(item.price).toFixed(2)} each
              </p>
              <div class="quantity-selector d-inline-flex">
                <button class="cart-dec btn btn-outline-danger btn-sm" aria-label="Decrease">−</button>
                <input type="text" value="${item.quantity}" readonly class="cart-qty-input"/>
                <button class="cart-inc btn btn-outline-danger btn-sm" aria-label="Increase">+</button>
              </div>
            </div>
            <div class="text-end flex-shrink-0">
              <p class="font-alt fw-bold text-danger mb-2 fs-6 item-total">${cashSymbol}${lineTotal.toFixed(2)}</p>
              <button class="btn btn-sm btn-outline-danger cart-remove" aria-label="Remove ${item.name}">
                <i class="bi bi-trash3"></i>
              </button>
            </div>`)
      );
    });

    $cartWrap.empty().append($ul);
    cartTotals();
    observe($cartWrap[0]);

    // Single delegated handler — no full rebuild on qty change
    $ul.on('click', '.cart-inc, .cart-dec, .cart-remove', function () {
      const $li  = $(this).closest('[data-id]');
      const id   = $li.data('id');
      const cart = getCart();
      const item = cart.items.find(i => i.id === id);
      if (!item) return;

      if ($(this).hasClass('cart-remove')) {
        cart.items = cart.items.filter(i => i.id !== id);
        saveCart(cart);
        $li.remove();
        if (!cart.items.length) { renderCart(); return; }
      } else {
        item.quantity += $(this).hasClass('cart-inc') ? 1 : -1;
        if (item.quantity <= 0) {
          cart.items = cart.items.filter(i => i.id !== id);
          saveCart(cart);
          $li.remove();
          if (!cart.items.length) { renderCart(); return; }
        } else {
          saveCart(cart);
          $li.find('.cart-qty-input').val(item.quantity);
          $li.find('.item-total').text(`${cashSymbol}${(parseFloat(item.price) * item.quantity).toFixed(2)}`);
        }
      }
      cartTotals();
    });
  }

  /*── Init ─────────────────────────────────────────────────────────*/
  refreshCartBadge();
  if ($menu.length) renderMenu();
  renderCart();
});
