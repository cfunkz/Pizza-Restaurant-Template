$(function () {
  // Global Variables
  const $win = $(window);
  const $promoModal = $('#promoModal');
  const $cartCount = $('#cart-count');
  const $menu = $('#dynamic-menu');
  const $viewToggle = $('#view-toggle');
  const $toggleIcon = $('#toggle-icon');
  const cashSymbol = '£';

  // Load from localStorage or default to true (list)
  let isListView = localStorage.getItem('menuView') === 'grid' ? false : true;
  let cartCount = 0;

  // Load saved selected product id or category from localStorage
  let selectedProductId = localStorage.getItem('selectedProductId') || null;

  // Set toggle icon and title based on saved view
  if (isListView) {
    $toggleIcon.removeClass('bi-list').addClass('bi-grid');
    $viewToggle.attr('title', 'Switch to Grid View');
  } else {
    $toggleIcon.removeClass('bi-grid').addClass('bi-list');
    $viewToggle.attr('title', 'Switch to List View');
  }

  // ========== Promo Modal Trigger ==========
  $('#phoneOrderBtn').on('click', () => $promoModal.modal('show'));

  // ========== Fade-in Scroll Animation ==========
  const $anims = $('.fade-in-up');
  let ticking = false;

  function animateOnScroll() {
    const winTop = $win.scrollTop();
    const winBottom = winTop + $win.height();

    $anims.each(function () {
      const $el = $(this);
      if ($el.offset().top < winBottom - 50) {
        $el.addClass('visible');
      }
    });
  }

  $win.on('scroll resize', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        animateOnScroll();
        ticking = false;
      });
      ticking = true;
    }
  });

  animateOnScroll(); // Trigger once on load

  // ========== Cart ==========
  function updateCartCount(quantity) {
    cartCount += quantity;
    $cartCount.text(`Cart (${cartCount})`);
  }

  function addToCart(product, quantity) {
    updateCartCount(quantity);
    alert(`Added ${quantity} x ${product.name} to cart.`);
  }

  // ========== Product Views ==========
  function createProductCard(product) {
    const $col = $('<div>').addClass('col-12 col-sm-6 col-lg-4');
    const cardHtml = `
      <div class="card h-100 ${selectedProductId === product.id ? 'selected-thumb' : ''}">
        <img src="${product.image}" alt="${product.name}" loading="lazy" class="card-img-top rounded-top" style="height: 11rem; object-fit: cover;" />
        <div class="card-body d-flex flex-column justify-content-between p-3">
          <h3 class="font-alt card-title fs-5 text-danger fw-semibold text-truncate mb-2" title="${product.name}">${product.name}</h3>
          <p class="font-alt card-text text-muted small line-clamp-3">${product.description}</p>
          <div class="font-alt d-flex justify-content-between align-items-center mt-3">
            <span class="fw-bold text-danger">from ${cashSymbol}${product.price}</span>
            <button type="button" class="btn btn-sm btn-outline-danger details-btn" aria-label="View details of ${product.name}">VIEW</button>
          </div>
        </div>
      </div>`;
    $col.html(cardHtml);

    // Save selected product to localStorage on click
    $col.find('.card, .details-btn').on('click', function (e) {
      e.stopPropagation();
      localStorage.setItem('selectedProductId', product.id);
      selectedProductId = product.id;
      renderMenu(); // re-render so highlight updates
      openModal(product);
    });

    return $col;
  }
  function createListItem(product) {
    const $li = $('<li>').addClass('list-group-item d-flex flex-column flex-sm-row align-items-start justify-content-between gap-3 py-3');
    if (selectedProductId === product.id) {
      $li.addClass('selected-thumb'); // Highlight selected item
    }

    const listHtml = `
      <div class="d-flex align-items-start gap-3 flex-grow-1" style="min-width: 0;">
        <img src="${product.image}" alt="${product.name}" loading="lazy" width="80" height="80" class="rounded" style="object-fit: cover;" />
        <div class="text-start" style="min-width: 0;">
          <h3 class="font-alt fs-6 fw-semibold text-danger mb-1">${product.name}</h3>
          <p class="small mb-0 font-alt text-description">${product.description}</p>
        </div>
      </div>
      <div class="d-flex flex-column align-items-end justify-content-center text-end mt-2 mt-sm-0" style="width: 120px; flex-shrink: 0;">
        <span class="fw-bold font-alt text-danger mb-2">from £${product.price}</span>
      </div>`;

    $li.html(listHtml);

    $li.find('.details-btn').on('click', e => {
      e.stopPropagation();
      localStorage.setItem('selectedProductId', product.id);
      selectedProductId = product.id;
      renderMenu();
      openModal(product);
    });

    $li.on('click', () => {
      localStorage.setItem('selectedProductId', product.id);
      selectedProductId = product.id;
      renderMenu();
      openModal(product);
    });

    return $li;
  }

  function renderMenu() {
    $menu.empty();

    Object.entries(manualProductData).forEach(([category, products]) => {
      if (category.toLowerCase() === 'toppings') return;

      const $section = $('<section class="section-special border-sliding-line p-4">').addClass('mb-5');
      const $header = $('<h3>').addClass('font-display text-danger mb-4').text(category);
      $section.append($header);

      if (!isListView) {
        const $row = $('<div>').addClass('row g-4');
        products.forEach(p => $row.append(createProductCard(p)));
        $section.append($row);
      } else {
        const $ul = $('<ul>').addClass('list-group list-group-flush');
        products.forEach(p => $ul.append(createListItem(p)));
        $section.append($ul);
      }

      $menu.append($section);
    });
  }

  // ========== Modal ==========
  function openModal(product) {
    const $modal = $('#productModal');
    $('#productModalLabel').text(product.name);
    $('#modal-product-image').attr({ src: product.image, alt: product.name });
    $('#modal-product-description').text(product.description);
    $('#modal-product-ingredients').empty().append(
      product.ingredients.split(',').map(i =>
        $('<li>')
          .addClass('bg-danger bg-opacity-10 text-danger rounded px-2 py-1 text-nowrap')
          .text(i.trim())
      )
    );

    $('#modal-product-calories').text(product.calories);
    $('#modal-product-sugar').text(product.sugar);
    $('#modal-product-protein').text(product.protein);
    $('#modal-product-fat').text(product.fat);
    $('#modal-product-price').text(`${cashSymbol}${product.price}`);

    const $qtyInput = $('#modal-quantity-input').val(0);
    const $addBtn = $('#modal-add-to-cart-btn');

    $('#productModal .btn-increment').off().on('click', () => {
      let val = parseInt($qtyInput.val(), 10);
      if (val < 99) $qtyInput.val(val + 1);
    });

    $('#productModal .btn-decrement').off().on('click', () => {
      let val = parseInt($qtyInput.val(), 10);
      if (val > 0) $qtyInput.val(val - 1);
    });

    $addBtn.off().on('click', () => {
      const quantity = parseInt($qtyInput.val(), 10);
      if (quantity > 0) {
        addToCart(product, quantity);
        bootstrap.Modal.getInstance($modal[0]).hide();
      } else {
        alert('Please select a quantity greater than zero.');
      }
    });

    new bootstrap.Modal($modal[0]).show();
  }

  // ========== View Toggle ==========
  $viewToggle.on('click', () => {
    isListView = !isListView;
    localStorage.setItem('menuView', isListView ? 'list' : 'grid'); // Save to localStorage

    $toggleIcon.toggleClass('bi-list bi-grid');
    $viewToggle.attr('title', isListView ? 'Switch to Grid View' : 'Switch to List View');
    renderMenu();
  });

  // Initial Render
  renderMenu();
});

