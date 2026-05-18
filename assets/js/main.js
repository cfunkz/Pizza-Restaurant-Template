/*──────────────────────────────────────────────────────────────────────────────
  Module-scope utilities
  Declared here (not inside $(function)) so any page script loaded after
  main.js can call showToast(), refreshCartBadge(), getCart(), etc. directly.
──────────────────────────────────────────────────────────────────────────────*/
const CART_KEY = 'pizzaCart';

function makeId(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
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
  const total = getCart().items.reduce((s, i) => s + i.quantity, 0);
  $('#cart-count').text(`Cart (${total})`);
}

function showToast(msg) {
  if (!$('#cart-toast').length) {
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
  }
  $('#cart-toast .toast-body').text(msg);
  new bootstrap.Toast($('#cart-toast')[0], { delay: 2500 }).show();
}

function addToCartStorage(product, qty) {
  const cart     = getCart();
  const existing = cart.items.find(i => i.id === product.id);
  if (existing) {
    existing.quantity += qty;
  } else {
    cart.items.push({
      id:       product.id,
      name:     product.name,
      price:    product.price,
      image:    product.image,
      quantity: qty,
    });
  }
  saveCart(cart);
  showToast(`${qty} × ${product.name} added to cart`);
}

/*──────────────────────────────────────────────────────────────────────────────
  DOM-ready: menu rendering, cart page, scroll animations, modals
──────────────────────────────────────────────────────────────────────────────*/
$(function () {
  const cashSymbol = '£';
  const $win       = $(window);

  let isListView        = localStorage.getItem('menuView') !== 'grid';
  let selectedProductId = localStorage.getItem('selectedProductId') || null;

  /*── Augment products with IDs (only when products.js is loaded) ──*/
  if (typeof manualProductData !== 'undefined') {
    Object.values(manualProductData).forEach(list =>
      list.forEach(p => { if (!p.id) p.id = makeId(p.name); })
    );
  }

  /*── Scroll animations ────────────────────────────────────────────*/
  let ticking = false;

  function animateOnScroll() {
    const winBottom = $win.scrollTop() + $win.height();
    $('.fade-in-up:not(.visible)').each(function () {
      if ($(this).offset().top < winBottom - 50) $(this).addClass('visible');
    });
  }

  $win.on('scroll resize', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => { animateOnScroll(); ticking = false; });
      ticking = true;
    }
  });

  animateOnScroll();

  /*── Promo modal ──────────────────────────────────────────────────*/
  $('#phoneOrderBtn').on('click', () => {
    const el = document.getElementById('promoModal');
    if (el) bootstrap.Modal.getOrCreateInstance(el).show();
  });

  /*── Menu view toggle ─────────────────────────────────────────────*/
  const $menu       = $('#dynamic-menu');
  const $viewToggle = $('#view-toggle');
  const $toggleIcon = $('#toggle-icon');

  function syncToggleIcon() {
    if (isListView) {
      $toggleIcon.removeClass('bi-list').addClass('bi-grid');
      $viewToggle.attr('title', 'Switch to Grid View');
    } else {
      $toggleIcon.removeClass('bi-grid').addClass('bi-list');
      $viewToggle.attr('title', 'Switch to List View');
    }
  }

  if ($viewToggle.length) {
    syncToggleIcon();
    $viewToggle.on('click', () => {
      isListView = !isListView;
      localStorage.setItem('menuView', isListView ? 'list' : 'grid');
      syncToggleIcon();
      renderMenu();
    });
  }

  /*── Product card (grid view) ─────────────────────────────────────*/
  function createProductCard(product, idx) {
    const $col = $('<div>')
      .addClass('col-12 col-sm-6 col-lg-4 fade-in-up')
      .css('--delay', `${idx * 60}ms`);

    $col.html(`
      <div class="card h-100 ${selectedProductId === product.id ? 'selected-thumb' : ''}">
        <img src="${product.image}" alt="${product.name}" loading="lazy" class="card-img-top"
          style="height:11rem;object-fit:cover;border-radius:0.875rem 0.875rem 0 0"/>
        <div class="card-body d-flex flex-column justify-content-between p-3">
          <h3 class="font-alt card-title fs-5 text-danger fw-semibold text-truncate mb-2"
            title="${product.name}">${product.name}</h3>
          <p class="font-alt card-text text-muted small line-clamp-3">${product.description}</p>
          <div class="font-alt d-flex justify-content-between align-items-center mt-3">
            <span class="fw-bold text-danger">from ${cashSymbol}${product.price}</span>
            <button type="button" class="btn btn-sm btn-outline-danger details-btn"
              aria-label="View details of ${product.name}">VIEW</button>
          </div>
        </div>
      </div>`);

    $col.find('.card, .details-btn').on('click', function (e) {
      e.stopPropagation();
      localStorage.setItem('selectedProductId', product.id);
      selectedProductId = product.id;
      renderMenu();
      openModal(product);
    });

    return $col;
  }

  /*── Product list item (list view) ───────────────────────────────*/
  function createListItem(product, idx) {
    const $li = $('<li>')
      .addClass('list-group-item d-flex flex-column flex-sm-row align-items-start justify-content-between gap-3 py-3 fade-in-up')
      .css('--delay', `${idx * 50}ms`);

    if (selectedProductId === product.id) $li.addClass('selected-thumb');

    $li.html(`
      <div class="d-flex align-items-start gap-3 flex-grow-1" style="min-width:0">
        <img src="${product.image}" alt="${product.name}" loading="lazy"
          width="80" height="80" class="rounded" style="object-fit:cover;flex-shrink:0"/>
        <div class="text-start" style="min-width:0">
          <h3 class="font-alt fs-6 fw-semibold text-danger mb-1">${product.name}</h3>
          <p class="small mb-0 font-alt text-description">${product.description}</p>
        </div>
      </div>
      <div class="d-flex flex-column align-items-end justify-content-center text-end mt-2 mt-sm-0"
        style="width:130px;flex-shrink:0">
        <span class="fw-bold font-alt text-danger mb-1">from ${cashSymbol}${product.price}</span>
        <button type="button" class="btn btn-sm btn-outline-danger mt-1 details-btn"
          aria-label="View ${product.name}">VIEW</button>
      </div>`);

    $li.on('click', function (e) {
      if ($(e.target).closest('.details-btn').length) return;
      localStorage.setItem('selectedProductId', product.id);
      selectedProductId = product.id;
      renderMenu();
      openModal(product);
    });

    $li.find('.details-btn').on('click', function (e) {
      e.stopPropagation();
      localStorage.setItem('selectedProductId', product.id);
      selectedProductId = product.id;
      renderMenu();
      openModal(product);
    });

    return $li;
  }

  /*── Render full menu ─────────────────────────────────────────────*/
  function renderMenu() {
    if (!$menu.length) return;
    $menu.empty();

    Object.entries(manualProductData).forEach(([category, products]) => {
      if (category.toLowerCase() === 'toppings') return;

      const $section = $('<section>').addClass('section-special border-sliding-line p-4 mb-5');
      $section.append($('<h3>').addClass('font-display text-danger mb-4').text(category));

      if (!isListView) {
        const $row = $('<div>').addClass('row g-4');
        products.forEach((p, i) => $row.append(createProductCard(p, i)));
        $section.append($row);
      } else {
        const $ul = $('<ul>').addClass('list-group list-group-flush');
        products.forEach((p, i) => $ul.append(createListItem(p, i)));
        $section.append($ul);
      }

      $menu.append($section);
    });

    setTimeout(animateOnScroll, 16);
  }

  /*── Product modal ────────────────────────────────────────────────*/
  function openModal(product) {
    const $modal = $('#productModal');
    if (!$modal.length) return;

    $('#productModalLabel').text(product.name);
    $('#modal-product-image').attr({ src: product.image, alt: product.name });
    $('#modal-product-description').text(product.description);

    $('#modal-product-ingredients').empty().append(
      (product.ingredients || '').split(',').map(s =>
        $('<li>').addClass('bg-danger bg-opacity-10 text-danger rounded px-2 py-1 text-nowrap').text(s.trim())
      )
    );

    $('#modal-product-calories').text(product.calories || '–');
    $('#modal-product-sugar').text(product.sugar    || '–');
    $('#modal-product-protein').text(product.protein  || '–');
    $('#modal-product-fat').text(product.fat      || '–');
    $('#modal-product-price').text(`${cashSymbol}${product.price}`);

    const $qty = $('#modal-quantity-input').val(0);

    $('#productModal .btn-increment').off().on('click', () => {
      const v = parseInt($qty.val(), 10);
      if (v < 99) $qty.val(v + 1);
    });
    $('#productModal .btn-decrement').off().on('click', () => {
      const v = parseInt($qty.val(), 10);
      if (v > 0) $qty.val(v - 1);
    });
    $('#modal-add-to-cart-btn').off().on('click', () => {
      const qty = parseInt($qty.val(), 10);
      if (qty > 0) {
        addToCartStorage(product, qty);
        bootstrap.Modal.getOrCreateInstance($modal[0]).hide();
      } else {
        showToast('Please select at least 1 item first.');
      }
    });

    bootstrap.Modal.getOrCreateInstance($modal[0]).show();
  }

  /*── Cart page ────────────────────────────────────────────────────*/
  function renderCartPage() {
    const $container = $('#cart-items-container');
    const $summary   = $('#cart-summary');
    if (!$container.length) return;

    const cart = getCart();

    if (!cart.items.length) {
      $container.html(`
        <div class="text-center py-5 fade-in-up visible">
          <i class="bi bi-cart-x" style="font-size:5rem;color:#dee2e6;display:block;margin-bottom:1.5rem"></i>
          <h3 class="font-alt text-danger mb-2">Your cart is empty</h3>
          <p class="text-muted mb-4" style="font-family:var(--font-alt);font-size:0.82rem">
            Looks like you haven't added anything yet.
          </p>
          <a href="menu.html" class="btn btn-danger btn-lg font-alt btn-pulse px-5">
            Browse Menu
          </a>
        </div>`);
      if ($summary.length) $summary.addClass('d-none');
      return;
    }

    if ($summary.length) $summary.removeClass('d-none');

    let subtotal = 0;
    const $ul = $('<ul>').addClass('list-group list-group-flush');

    cart.items.forEach((item, idx) => {
      const itemTotal = parseFloat(item.price) * item.quantity;
      subtotal += itemTotal;

      const $li = $('<li>')
        .addClass('list-group-item d-flex align-items-center gap-3 py-3 px-0 fade-in-up')
        .css('--delay', `${idx * 60}ms`);

      $li.html(`
        <img src="${item.image}" alt="${item.name}" width="88" height="88"
          class="rounded" style="object-fit:cover;flex-shrink:0"/>
        <div class="flex-grow-1" style="min-width:0">
          <h5 class="font-alt text-danger fw-semibold mb-1 text-truncate">${item.name}</h5>
          <p class="text-muted mb-2" style="font-family:var(--font-alt);font-size:0.78rem">
            ${cashSymbol}${parseFloat(item.price).toFixed(2)} each
          </p>
          <div class="quantity-selector d-inline-flex" data-id="${item.id}">
            <button class="cart-decrement btn btn-outline-danger btn-sm" aria-label="Decrease">−</button>
            <input type="text" value="${item.quantity}" readonly class="cart-qty-input"/>
            <button class="cart-increment btn btn-outline-danger btn-sm" aria-label="Increase">+</button>
          </div>
        </div>
        <div class="text-end flex-shrink-0">
          <p class="font-alt fw-bold text-danger mb-2 fs-6">${cashSymbol}${itemTotal.toFixed(2)}</p>
          <button class="btn btn-sm btn-outline-danger remove-item-btn" data-id="${item.id}"
            aria-label="Remove ${item.name}">
            <i class="bi bi-trash3"></i>
          </button>
        </div>`);

      $ul.append($li);
    });

    $container.empty().append($ul);

    $ul.find('.cart-decrement').on('click', function () {
      updateCartQty($(this).closest('[data-id]').data('id'), -1);
    });
    $ul.find('.cart-increment').on('click', function () {
      updateCartQty($(this).closest('[data-id]').data('id'), 1);
    });
    $ul.find('.remove-item-btn').on('click', function () {
      removeCartItem($(this).data('id'));
    });

    const delivery = subtotal >= 25 ? 0 : 2.99;
    const total    = subtotal + delivery;
    $('#cart-subtotal').text(`${cashSymbol}${subtotal.toFixed(2)}`);
    $('#cart-delivery').text(delivery === 0 ? 'FREE' : `${cashSymbol}${delivery.toFixed(2)}`);
    $('#cart-total').text(`${cashSymbol}${total.toFixed(2)}`);
    $('#delivery-note').text(
      delivery === 0
        ? '🎉 You qualify for free delivery!'
        : `Add ${cashSymbol}${(25 - subtotal).toFixed(2)} more for free delivery`
    );

    setTimeout(animateOnScroll, 16);
  }

  function updateCartQty(id, delta) {
    const cart = getCart();
    const item  = cart.items.find(i => i.id === id);
    if (!item) return;
    item.quantity += delta;
    if (item.quantity <= 0) cart.items = cart.items.filter(i => i.id !== id);
    saveCart(cart);
    renderCartPage();
  }

  function removeCartItem(id) {
    const cart = getCart();
    cart.items = cart.items.filter(i => i.id !== id);
    saveCart(cart);
    renderCartPage();
  }

  /*── Init ─────────────────────────────────────────────────────────*/
  refreshCartBadge();
  if ($menu.length) renderMenu();
  renderCartPage();
});
