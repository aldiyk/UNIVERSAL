    document.addEventListener('DOMContentLoaded', () => {
        // === Инициализация и получение элементов ===
        const cartIcon = document.getElementById('cartIcon');
        const cartPanel = document.getElementById('cartPanel');
        const cartItemsContainer = document.getElementById('cartItems');
        const cartCount = document.getElementById('cartCount');
        const productsContainer = document.querySelector('.products');

        // НОВЫЙ ЭЛЕМЕНТ: Кнопка очистки корзины
        const clearCartButton = document.getElementById('clearCartButton');
        // Получаем элемент для отображения общей суммы (понадобится в updateCartUI)
        const totalDisplay = document.getElementById('cartTotal');

        // Переменная корзины, загружаемая из localStorage
        let cart = JSON.parse(localStorage.getItem('cart')) || {};

        // === ФУНКЦИИ УПРАВЛЕНИЯ ===

        // Функция для сохранения состояния корзины
        function saveCart() {
            localStorage.setItem('cart', JSON.stringify(cart));
        }

        // Функция для обновления отображения корзины (включая общую сумму и видимость кнопки)
        function updateCartUI() {
            cartItemsContainer.innerHTML = '';
            let totalItems = 0;
            let totalPrice = 0; // Инициализируем переменную для общей суммы

            // 1. Проверяем, пуста ли корзина
            const isCartEmpty = Object.keys(cart).length === 0;

            if (isCartEmpty) {
                // Если корзина пуста, отображаем сообщение
                const emptyMessage = document.createElement('p');
                emptyMessage.textContent = 'Ваша корзина пуста.';
                emptyMessage.style.textAlign = 'center';
                cartItemsContainer.appendChild(emptyMessage);
            }

            for (const id in cart) {
                const item = cart[id];

                // Вычисляем стоимость данного товара и добавляем к общей сумме
                const itemTotal = item.price * item.count;
                totalPrice += itemTotal;

                const div = document.createElement('div');
                div.className = 'cart-item';
                div.innerHTML = `
                    <span>${item.name} (${item.price} тенге.)</span>
                    <div class="cart-controls">
                        <button class="change-count" data-id="${id}" data-delta="1">+</button>
                        <span>${item.count}</span>
                        <button class="change-count" data-id="${id}" data-delta="-1">-</button>
                    </div>
                `;
                cartItemsContainer.appendChild(div);
                totalItems += item.count;
            }

            cartCount.textContent = totalItems;

            // 2. Логика показа/скрытия элементов
            if (clearCartButton) {
                // Если корзина не пуста, показываем кнопку и сумму
                if (!isCartEmpty) {
                    clearCartButton.classList.remove('hidden');
                    if (totalDisplay) {
                        totalDisplay.classList.remove('hidden');
                        totalDisplay.textContent = `Общая сумма: ${totalPrice.toLocaleString('ru-RU')} ₸`;
                    }
                } else { // Если корзина пуста, скрываем кнопку и сумму
                    clearCartButton.classList.add('hidden');
                    if (totalDisplay) {
                        totalDisplay.classList.add('hidden');
                    }
                }
            }

            saveCart();
        }

        // === ОБРАБОТЧИКИ СОБЫТИЙ ===

        // Обработчик событий для кнопок "Добавить в корзину"
        productsContainer.addEventListener('click', (event) => {
            if (event.target.classList.contains('add-to-cart')) {
                const card = event.target.closest('.card');
                const id = card.dataset.id;
                const name = card.querySelector('h3').textContent;
                const price = parseFloat(card.dataset.price);

                if (!cart[id]) {
                    cart[id] = { name, price, count: 0 };
                }
                cart[id].count++;
                updateCartUI();
            }
        });

        // Делегирование событий для кнопок изменения количества (+/-)
        cartItemsContainer.addEventListener('click', (event) => {
            if (event.target.classList.contains('change-count')) {
                const id = event.target.dataset.id;
                const delta = parseInt(event.target.dataset.delta);

                if (cart[id]) {
                    cart[id].count += delta;
                    if (cart[id].count <= 0) {
                        delete cart[id];
                    }
                    updateCartUI();
                }
            }
        });

        // Обработчик для кнопки "Очистить корзину"
        if (clearCartButton) {
            clearCartButton.addEventListener('click', () => {
                // Проверка на confirm, только если в корзине что-то есть
                if (Object.keys(cart).length > 0 && confirm("Вы уверены, что хотите очистить корзину?")) {
                    cart = {}; // Сброс объекта корзины
                    updateCartUI(); // Обновление интерфейса
                }
            });
        }

        // Переключатель видимости корзины
        cartIcon.addEventListener('click', () => {
            cartPanel.classList.toggle('active');
        });

        // === Инициализация (загрузка и отображение корзины при загрузке страницы) ===
        updateCartUI();
    });

    // === ЛОГИКА ДЛЯ АНИМАЦИИ ПРИ СКРОЛЛЕ ===
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
    });
