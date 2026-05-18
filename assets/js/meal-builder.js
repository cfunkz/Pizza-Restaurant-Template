/*──────────────────────────────────────────────────────────────────────────────
  Meal Builder
  Relies on module-scope globals from main.js:
    CART_KEY, makeId, getCart, saveCart, showToast, refreshCartBadge
──────────────────────────────────────────────────────────────────────────────*/
$(function () {
  const cashSymbol = '£';
  const PIZZA_CATS = ['Classic Pizzas', 'Specialty Pizzas', 'Veggie Pizzas', 'Meat Lovers'];

  function fmt(p) { return `${cashSymbol}${parseFloat(p).toFixed(2)}`; }

  // Flat arrays from manualProductData (products.js loaded before this script)
  const allPizzas   = PIZZA_CATS.flatMap(cat =>
    (manualProductData[cat] || []).map(p => ({ ...p, category: cat, id: p.id || makeId(p.name) }))
  );
  const allToppings = manualProductData['Toppings'] || [];
  const allSides    = (manualProductData['Sides']  || []).map(p => ({ ...p, id: p.id || makeId(p.name) }));
  const allDrinks   = (manualProductData['Drinks'] || []).map(p => ({ ...p, id: p.id || makeId(p.name) }));

  /*── State ───────────────────────────────────────────────────────*/
  const state = {
    base:       null,  // full product object
    size:       'S',
    sizeExtra:  0,
    toppings:   {},    // { name: qty }
    sides:      {},    // { name: qty }
    drinks:     {},    // { name: qty }
  };

  /*── Pizza base grid ─────────────────────────────────────────────*/
  let activeFilter = 'all';

  function renderPizzaGrid(filter) {
    activeFilter = filter;
    const $grid  = $('#pizza-grid');
    const pizzas = filter === 'all' ? allPizzas : allPizzas.filter(p => p.category === filter);
    $grid.empty();

    pizzas.forEach(pizza => {
      const sel  = state.base && state.base.id === pizza.id;
      const $col = $('<div>').addClass('col-6 col-sm-4 col-md-3');
      $col.html(`
        <div class="pizza-base-card${sel ? ' selected' : ''}" data-id="${pizza.id}">
          <div class="check-badge">
            <i class="bi bi-check-circle-fill text-danger" style="font-size:1rem"></i>
          </div>
          <img src="${pizza.image}" alt="${pizza.name}"
            style="height:90px;width:100%;object-fit:cover;display:block"/>
          <div class="card-meta">
            <div class="font-alt text-danger text-truncate"
              style="font-size:0.7rem;font-weight:700" title="${pizza.name}">${pizza.name}</div>
            <div class="font-alt text-muted" style="font-size:0.66rem">from ${fmt(pizza.price)}</div>
          </div>
        </div>`);
      $grid.append($col);
    });

    $grid.find('.pizza-base-card').on('click', function () {
      state.base = allPizzas.find(p => p.id === $(this).data('id')) || null;
      renderPizzaGrid(activeFilter);
      renderSummary();
    });
  }

  $('#cat-filters').on('click', '.cat-btn', function () {
    const cat = $(this).data('cat');
    $('#cat-filters .cat-btn').removeClass('chosen btn-danger').addClass('btn-outline-danger');
    $(this).addClass('chosen btn-danger').removeClass('btn-outline-danger');
    renderPizzaGrid(cat);
  });

  /*── Size buttons ─────────────────────────────────────────────────*/
  $('#size-btns').on('click', '.size-btn', function () {
    state.size      = $(this).data('size');
    state.sizeExtra = parseFloat($(this).data('extra')) || 0;
    $('#size-btns .size-btn').removeClass('chosen btn-danger').addClass('btn-outline-danger');
    $(this).addClass('chosen btn-danger').removeClass('btn-outline-danger');
    renderSummary();
  });

  /*── Toppings ─────────────────────────────────────────────────────*/
  function toppingTotal() {
    return Object.values(state.toppings).reduce((a, b) => a + b, 0);
  }

  function renderToppings() {
    const $list = $('#toppings-list');
    $list.empty();
    allToppings.forEach(t => {
      const qty  = state.toppings[t.name] || 0;
      const $col = $('<div>').addClass('col-12 col-sm-6');
      $col.html(`
        <div class="topping-row">
          <div style="min-width:0;margin-right:0.5rem">
            <span class="font-alt" style="font-size:0.8rem">${t.name}</span>
            <span class="text-muted ms-1" style="font-family:var(--font-alt);font-size:0.72rem">${fmt(t.price)}</span>
          </div>
          <div class="qty-row" data-topping="${t.name}">
            <button class="qty-btn-sm t-dec" aria-label="Remove ${t.name}"
              ${qty === 0 ? 'disabled' : ''}>−</button>
            <span class="qty-display">${qty}</span>
            <button class="qty-btn-sm t-inc" aria-label="Add ${t.name}">+</button>
          </div>
        </div>`);
      $list.append($col);
    });
    syncToppingBadge();
  }

  function syncToppingBadge() {
    const n = toppingTotal();
    $('#topping-badge').text(`${n} / 6`);
    $('#toppings-list .t-inc').prop('disabled', n >= 6);
    $('#toppings-list [data-topping]').each(function () {
      const name = $(this).data('topping');
      $(this).find('.t-dec').prop('disabled', (state.toppings[name] || 0) === 0);
    });
  }

  $('#toppings-list').on('click', '.t-inc, .t-dec', function () {
    const name  = $(this).closest('[data-topping]').data('topping');
    const isInc = $(this).hasClass('t-inc');
    let qty     = state.toppings[name] || 0;

    if (isInc) {
      if (toppingTotal() >= 6) { showToast('Maximum 6 extra toppings allowed'); return; }
      qty++;
    } else {
      if (qty <= 0) return;
      qty--;
    }

    if (qty === 0) delete state.toppings[name]; else state.toppings[name] = qty;

    // Update this row inline — no full re-render
    const $row = $(this).closest('[data-topping]');
    $row.find('.qty-display').text(qty);
    $row.find('.t-dec').prop('disabled', qty === 0);
    syncToppingBadge();
    renderSummary();
  });

  /*── Sides / Drinks grids ─────────────────────────────────────────*/
  function renderMealGrid(items, $container, stateKey) {
    $container.empty();
    items.forEach(item => {
      const qty  = state[stateKey][item.name] || 0;
      const $col = $('<div>').addClass('col-6 col-md-4');
      $col.html(`
        <div class="meal-item-card${qty > 0 ? ' has-qty' : ''}">
          <img src="${item.image}" alt="${item.name}"
            style="height:80px;width:100%;object-fit:cover;display:block"/>
          <div class="p-2 text-center">
            <div class="font-alt text-danger text-truncate mb-0"
              style="font-size:0.7rem;font-weight:700" title="${item.name}">${item.name}</div>
            <div class="font-alt text-muted mb-2" style="font-size:0.66rem">${fmt(item.price)}</div>
            <div class="qty-row justify-content-center" data-item="${item.name}" data-key="${stateKey}">
              <button class="qty-btn-sm mi-dec" ${qty === 0 ? 'disabled' : ''} aria-label="Remove">−</button>
              <span class="qty-display">${qty}</span>
              <button class="qty-btn-sm mi-inc" aria-label="Add">+</button>
            </div>
          </div>
        </div>`);

      $col.find('.mi-inc, .mi-dec').on('click', function () {
        const n = $(this).closest('[data-item]').data('item');
        const k = $(this).closest('[data-key]').data('key');
        let q   = state[k][n] || 0;
        if ($(this).hasClass('mi-inc')) q++; else if (q > 0) q--;
        if (q === 0) delete state[k][n]; else state[k][n] = q;

        const $qRow = $(this).closest('[data-item]');
        $qRow.find('.qty-display').text(q);
        $qRow.find('.mi-dec').prop('disabled', q === 0);
        $qRow.closest('.meal-item-card').toggleClass('has-qty', q > 0);
        renderSummary();
      });

      $container.append($col);
    });
  }

  /*── Summary panel ────────────────────────────────────────────────*/
  function calcTotal() {
    let t = 0;
    if (state.base) t += parseFloat(state.base.price);
    t += state.sizeExtra;
    allToppings.forEach(tp => { t += (state.toppings[tp.name] || 0) * parseFloat(tp.price); });
    allSides.forEach(s  => { t += (state.sides[s.name]    || 0) * parseFloat(s.price); });
    allDrinks.forEach(d => { t += (state.drinks[d.name]   || 0) * parseFloat(d.price); });
    return t;
  }

  function renderSummary() {
    const $body = $('#summary-body');
    const total = calcTotal();

    if (!state.base) {
      $body.html(`
        <div class="text-center py-4">
          <i class="bi bi-pizza" style="font-size:2.5rem;color:#dee2e6"></i>
          <p class="text-muted mt-2 mb-0" style="font-family:var(--font-alt);font-size:0.78rem">
            Select a base pizza to begin
          </p>
        </div>`);
      $('#meal-total').text(fmt(0));
      return;
    }

    function sectionLines(entries, lookup) {
      return entries.map(([name, qty]) => {
        const item = lookup.find(x => x.name === name);
        const cost = item ? qty * parseFloat(item.price) : 0;
        return `<div class="summary-line">
          <span class="label">${qty > 1 ? qty + '× ' : ''}${name}</span>
          <span class="fw-semibold">${fmt(cost)}</span>
        </div>`;
      }).join('');
    }

    const tops   = Object.entries(state.toppings).filter(([, q]) => q > 0);
    const sides  = Object.entries(state.sides).filter(([, q]) => q > 0);
    const drinks = Object.entries(state.drinks).filter(([, q]) => q > 0);

    let html = `
      <div class="d-flex align-items-center gap-2 mb-2">
        <img src="${state.base.image}" width="40" height="40"
          class="rounded" style="object-fit:cover;flex-shrink:0"/>
        <div style="min-width:0;flex:1">
          <div class="font-alt fw-semibold text-danger text-truncate"
            style="font-size:0.78rem">${state.base.name}</div>
          <div class="summary-line" style="margin-top:1px">
            <span class="label">Size: ${state.size}</span>
            <span class="fw-semibold">${fmt(parseFloat(state.base.price) + state.sizeExtra)}</span>
          </div>
        </div>
      </div>`;

    if (tops.length)   html += `<div class="summary-section-label">Extras</div>` + sectionLines(tops, allToppings);
    if (sides.length)  html += `<div class="summary-section-label">Sides</div>`  + sectionLines(sides, allSides);
    if (drinks.length) html += `<div class="summary-section-label">Drinks</div>` + sectionLines(drinks, allDrinks);

    $body.html(html);
    $('#meal-total').text(fmt(total));
  }

  /*── Add to Cart ──────────────────────────────────────────────────*/
  $('#add-meal-btn').on('click', function () {
    if (!state.base) {
      showToast('Please select a base pizza first!');
      document.getElementById('pizza-grid').scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    const total  = calcTotal();
    const extras = [
      ...Object.entries(state.toppings).filter(([, q]) => q > 0).map(([n, q]) => (q > 1 ? `${q}× ` : '') + n),
      ...Object.entries(state.sides).filter(([, q]) => q > 0).map(([n, q]) => (q > 1 ? `${q}× ` : '') + n),
      ...Object.entries(state.drinks).filter(([, q]) => q > 0).map(([n, q]) => (q > 1 ? `${q}× ` : '') + n),
    ];
    const itemName = `${state.base.name} (${state.size})` +
      (extras.length ? ' + ' + extras.join(', ') : '');

    // saveCart calls refreshCartBadge internally
    const cart = getCart();
    cart.items.push({
      id:       'meal-' + Date.now(),
      name:     itemName,
      price:    total.toFixed(2),
      image:    state.base.image,
      quantity: 1,
    });
    saveCart(cart);

    showToast(`Meal added to cart! (${fmt(total)})`);

    // Reset state
    state.base = null; state.size = 'S'; state.sizeExtra = 0;
    state.toppings = {}; state.sides = {}; state.drinks = {};

    renderPizzaGrid(activeFilter);
    renderToppings();
    renderMealGrid(allSides,  $('#sides-grid'),  'sides');
    renderMealGrid(allDrinks, $('#drinks-grid'), 'drinks');
    $('#size-btns .size-btn').removeClass('chosen btn-danger').addClass('btn-outline-danger');
    $('#size-btns .size-btn').first().addClass('chosen btn-danger').removeClass('btn-outline-danger');
    renderSummary();
  });

  /*── Init ─────────────────────────────────────────────────────────*/
  renderPizzaGrid('all');
  renderToppings();
  renderMealGrid(allSides,  $('#sides-grid'),  'sides');
  renderMealGrid(allDrinks, $('#drinks-grid'), 'drinks');
  renderSummary();
});
