let discount = 0;
    let selectedShipping = 0; // 預設順豐自取 $0（或透過計費邏輯調整）

    // 2.1 購物車開關
    function toggleCart(open) {
        const drawer = document.getElementById('cartDrawer');
        if(drawer) drawer.classList.toggle('open', open);
    }

    // 2.2 彈窗開關
    function toggleModal(open) {
        const modal = document.getElementById('sizeModal');
        if(modal) modal.classList.toggle('open', open);
    }

    // 2.3 商品規格選擇切換
    function selectVariant(button, value) {
        const parent = button.parentElement;
        parent.querySelectorAll('.option-btn').forEach(btn => btn.classList.remove('selected'));
        button.classList.add('selected');
    }

    // 2.4 帶有顏色/尺碼規格的加入購物車功能
    function addWithVariants(cardId, baseName, price) {
        const card = document.getElementById(cardId);
        const activeColorBtn = card.querySelector('.color-group .option-btn.selected');
        const activeSizeBtn = card.querySelector('.size-group .option-btn.selected');
        
        if (!activeColorBtn || !activeSizeBtn) {
            alert('請先選擇顏色和尺碼！');
            return;
        }
        
        const selectedColor = activeColorBtn.innerText;
        const selectedSize = activeSizeBtn.innerText;
        
        // 將規格與商品名稱進行完美綁定
        addToCart(baseName, price, selectedColor, selectedSize);
    }

    // 2.5 核心：加入購物車數據陣列
    let cart = [];
    function addToCart(name, price, color = '-', size = '-') {
        // 檢查購物車內是否已經存在完全相同規格的服飾
        const existingItem = cart.find(item => item.name === name && item.color === color && item.size === size);
        if (existingItem) {
            existingItem.qty += 1;
        } else {
            cart.push({ name: name, price: price, color: color, size: size, qty: 1 });
        }
        updateCartUI();
        toggleCart(true); // 自動為顧客打開購物車側邊欄
    }

    // 2.6 修改購物車商品數量
    function changeQty(name, color, size, amount) {
        const item = cart.find(item => item.name === name && item.color === color && item.size === size);
        if (item) {
            item.qty += amount;
            if (item.qty <= 0) {
                cart = cart.filter(i => !(i.name === name && i.color === color && i.size === size));
            }
            updateCartUI();
        }
    }

    // 2.7 港幣電商級優惠碼促銷系統
    function applyPromo() {
        const codeInput = document.getElementById('promoCodeInput');
        if(!codeInput) return;
        const code = codeInput.value.trim().toUpperCase();
        
        if (code === 'NOVA400') {
            discount = 40;
            alert('成功套用優惠碼！全單立減 HK$ 40');
        } else if (code === '') {
            discount = 0;
        } else {
            alert('無效的優惠碼，請重新輸入。');
            discount = 0;
        }
        updateCartUI();
    }

    // 2.8 實時動態渲染高級購物車小計與順豐運費
    function updateCartUI() {
        const container = document.getElementById('cartItemsContainer');
        const countBadges = document.querySelectorAll('#cart-count, #mobile-cart-count');
        const subtotalText = document.getElementById('cartSubtotal');
        const shippingText = document.getElementById('cartShipping');
        const discountText = document.getElementById('cartDiscount');
        const totalText = document.getElementById('cartTotalAmount');
        
        // 1. 更新購物車右上角的商品總件數紅點
        let totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
        countBadges.forEach(badge => { if(badge) badge.innerText = totalQty; });

        // 2. 如果購物車清空，還原基本金流顯示
        if (cart.length === 0) {
            if(container) container.innerHTML = `<p style="text-align: center; color: #999; margin-top: 2rem;">購物車目前是空的</p>`;
            if(subtotalText) subtotalText.innerText = 'HK$ 0';
            if(shippingText) shippingText.innerText = 'HK$ 0';
            if(discountText) discountText.innerText = '-HK$ 0';
            if(totalText) totalText.innerText = 'HK$ 0';
            return;
        }

        // 3. 遍歷並動態渲染購物車內的每一件排球服飾規格
        let html = '';
        let subtotal = 0;

        cart.forEach(item => {
            const itemTotal = item.price * item.qty;
            subtotal += itemTotal;
            html += `
                <div class="cart-item">
                    <div class="cart-item-details">
                        <h4>${item.name}</h4>
                        <div class="cart-item-meta">規格: ${item.color} / ${item.size}</div>
                        <p style="color: #ff5722; font-weight: bold;">HK$ ${item.price}</p>
                        <div class="cart-item-qty">
                            <button class="qty-btn" onclick="changeQty('${item.name}', '${item.color}', '${item.size}', -1)">-</button>
                            <span style="font-weight:600; padding: 0 4px;">${item.qty}</span>
                            <button class="qty-btn" onclick="changeQty('${item.name}', '${item.color}', '${item.size}', 1)">+</button>
                        </div>
                    </div>
                    <div style="font-weight: 600; color: #1a1a1a;">HK$ ${itemTotal}</div>
                </div>
            `;
        });

        if(container) container.innerHTML = html;

        // 4. 物流計費邏輯：香港本地滿 HK$400 免運費，未滿額收取 HK$30 順豐快遞費
        let shipping = subtotal >= 400 ? 0 : 30;
        let total = subtotal + shipping - discount;
        if (total < 0) total = 0;

        // 5. 將最終計算數據實時反饋至前端畫面
        if(subtotalText) subtotalText.innerText = `HK$ ${subtotal}`;
        if(shippingText) shippingText.innerText = shipping === 0 ? '免運費' : `HK$ ${shipping}`;
        if(discountText) discountText.innerText = `-HK$ ${discount}`;
        if(totalText) totalText.innerText = `HK$ ${total}`;
    }

    // 3. 商品分類前台切換篩選
    function filterProducts(category, button) {
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        document.querySelectorAll('.product-card').forEach(card => {
            if (category === 'all' || card.getAttribute('data-category') === category) {
                card.classList.remove('hidden');
            } else {
                card.classList.add('hidden');
            }
        });
    }

    // 4. FAQ 折疊面板開關
    function toggleFaq(element) {
        element.parentElement.classList.toggle('active');
    }