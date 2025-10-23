document.addEventListener('DOMContentLoaded', () => {
  const cartIcon = document.getElementById('cartIcon');
  const cartPanel = document.getElementById('cartPanel');
  const cartItemsContainer = document.getElementById('cartItems');
  const cartCount = document.getElementById('cartCount');
  let cart = {};

  cartIcon.addEventListener('click', () => {
    cartPanel.classList.toggle('active');
  });

  document.querySelectorAll('.card').forEach(card => {
    const name = card.querySelector('h3').textContent;
    const priceText = card.querySelector('.price').textContent.replace(/[^\d]/g, '');
    const price = parseInt(priceText);
    const addBtn = card.querySelector('.add-to-cart');
    const plusBtn = card.querySelector('.plus');
    const minusBtn = card.querySelector('.minus');
    const quantity = card.querySelector('.quantity');

    addBtn.addEventListener('click', () => {
      if (!cart[name]) cart[name] = { count: 0, price };
      cart[name].count++;
      updateCart();
      quantity.textContent = cart[name].count;
    });

    plusBtn.addEventListener('click', () => {
      if (!cart[name]) cart[name] = { count: 0, price };
      cart[name].count++;
      updateCart();
      quantity.textContent = cart[name].count;
    });

    minusBtn.addEventListener('click', () => {
      if (cart[name]) {
        cart[name].count--;
        if (cart[name].count <= 0) delete cart[name];
        updateCart();
        quantity.textContent = cart[name] ? cart[name].count : 0;
      }
    });
  });

  function updateCart() {
    cartItemsContainer.innerHTML = '';
    let totalItems = 0;

    for (let item in cart) {
      const div = document.createElement('div');
      div.className = 'cart-item';
      div.innerHTML = `
        <span>${item}</span>
        <div>
          <button onclick="changeCount('${item}', -1)">−</button>
          <span>${cart[item].count}</span>
          <button onclick="changeCount('${item}', 1)">+</button>
        </div>
      `;
      cartItemsContainer.appendChild(div);
      totalItems += cart[item].count;
    }

    cartCount.textContent = totalItems;
  }

  function changeCount(item, delta) {
    if (!cart[item]) return;
    cart[item].count += delta;
    if (cart[item].count <= 0) delete cart[item];
    updateCart();
  }

    window.changeCount = function(item, delta) {
    if (!cart[item]) return;
    cart[item].count += delta;
    if (cart[item].count <= 0) delete cart[item];
    updateCart();
  };
});

  const cards = document.querySelectorAll('.card');

  window.addEventListener('scroll', () => {
    const triggerBottom = window.innerHeight * 0.85;

    cards.forEach(card => {
      const cardTop = card.getBoundingClientRect().top;

      if (cardTop < triggerBottom) {
        card.classList.add('show');
      } else {
        card.classList.remove('show');
      }
    });
  })
