/* =========================
   NOVA SPORT - Main Script
========================= */

// 全域狀態
let discount = 0;
let selectedShipping = 0;
let cart = [];

/* =========================
   基本 UI：購物車 / 彈窗
========================= */
function toggleCart(open) {
    const drawer = document.getElementById('cartDrawer');
    const overlay = document.getElementById('cartOverlay');

    if (drawer) drawer.classList.toggle('open', open);
    if (overlay) overlay.style.display = open ? 'block' : 'none';
}

function toggleModal(open) {
    const modal = document.getElementById('sizeModal');
    if (modal) modal.classList.toggle('open', open);
}

/* =========================
   商品規格選擇
========================= */
function selectVariant(button, value) {
    const parent = button.parentElement;
    if (!parent) return;

    parent.querySelectorAll('.option-btn').forEach(btn => btn.classList.remove('selected'));
    button.classList.add('selected');
}

function addWithVariants(cardId, baseName, price) {
    const card = document.getElementById(cardId);
    if (!card) return;

    const activeColorBtn = card.querySelector('.color-group .option-btn.selected');
    const activeSizeBtn = card.querySelector('.size-group .option-btn.selected');

    if (!activeColorBtn || !activeSizeBtn) {
        alert('請先選擇顏色和尺碼！');
        return;
    }

    const selectedColor = activeColorBtn.innerText;
    const selectedSize = activeSizeBtn.innerText;

    addToCart(baseName, price, selectedColor, selectedSize);
}

/* =========================
   購物車
========================= */
function addToCart(name, price, color = '-', size = '-') {
    const existingItem = cart.find(item =>
        item.name === name &&
        item.color === color &&
        item.size === size
    );

    if (existingItem) {
        existingItem.qty += 1;
    } else {
        cart.push({
            name: name,
            price: price,
            color: color,
            size: size,
            qty: 1
        });
    }

    updateCartUI();
    toggleCart(true);
}

function changeQty(name, color, size, amount) {
    const item = cart.find(item =>
        item.name === name &&
        item.color === color &&
        item.size === size
    );

    if (!item) return;

    item.qty += amount;

    if (item.qty <= 0) {
        cart = cart.filter(i =>
            !(i.name === name && i.color === color && i.size === size)
        );
    }

    updateCartUI();
}

function applyPromo() {
    const codeInput = document.getElementById('promoCodeInput');
    if (!codeInput) return;

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

function updateCartUI() {
    const container = document.getElementById('cartItemsContainer');
    const countBadges = document.querySelectorAll('#cart-count, #mobile-cart-count');
    const subtotalText = document.getElementById('cartSubtotal');
    const shippingText = document.getElementById('cartShipping');
    const discountText = document.getElementById('cartDiscount');
    const totalText = document.getElementById('cartTotalAmount');

    let totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    countBadges.forEach(badge => {
        if (badge) badge.innerText = totalQty;
    });

    if (cart.length === 0) {
        if (container) {
            container.innerHTML = `<p style="text-align: center; color: #999; margin-top: 2rem;">購物車目前是空的</p>`;
        }
        if (subtotalText) subtotalText.innerText = 'HK$ 0';
        if (shippingText) shippingText.innerText = 'HK$ 0';
        if (discountText) discountText.innerText = '-HK$ 0';
        if (totalText) totalText.innerText = 'HK$ 0';
        return;
    }

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

    if (container) container.innerHTML = html;

    let shipping = subtotal >= 500 ? 0 : 30;
    let total = subtotal + shipping - discount;
    if (total < 0) total = 0;

    if (subtotalText) subtotalText.innerText = `HK$ ${subtotal}`;
    if (shippingText) shippingText.innerText = shipping === 0 ? '免運費' : `HK$ ${shipping}`;
    if (discountText) discountText.innerText = `-HK$ ${discount}`;
    if (totalText) totalText.innerText = `HK$ ${total}`;
}

/* =========================
   商品篩選 / FAQ
========================= */
function filterProducts(category, button) {
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    if (button) button.classList.add('active');

    document.querySelectorAll('.product-card').forEach(card => {
        if (category === 'all' || card.getAttribute('data-category') === category) {
            card.classList.remove('hidden');
        } else {
            card.classList.add('hidden');
        }
    });
}

function toggleFaq(element) {
    if (!element || !element.parentElement) return;
    element.parentElement.classList.toggle('active');
}

/* =========================
   Checkout Page
========================= */

// 去結帳頁：把購物車存入 localStorage
function goCheckout() {
    localStorage.setItem('nova_cart', JSON.stringify(cart));
    localStorage.setItem('nova_discount', JSON.stringify(discount));
    window.location.href = 'pay.html';
}

// 顯示付款提示
function showPaymentHint() {
    const paymentMethod = document.getElementById('paymentMethod');
    const hintBox = document.getElementById('paymentHintBox');
    const hintTitle = document.getElementById('paymentHintTitle');
    const hintText = document.getElementById('paymentHintText');

    if (!paymentMethod || !hintBox || !hintTitle || !hintText) return;

    const method = paymentMethod.value;

    if (method === '') {
        hintBox.style.display = 'none';
        return;
    }

    hintBox.style.display = 'block';

    if (method === 'PayMe') {
        hintTitle.innerText = 'PayMe 付款提示';
        hintText.innerText = '請於提交訂單後使用 PayMe 完成轉帳，並保留付款截圖作確認用途。';
    } else if (method === 'FPS') {
        hintTitle.innerText = 'FPS 付款提示';
        hintText.innerText = '請使用轉數快 FPS 完成付款，付款後請保留交易參考編號以便核對。';
    } else if (method === 'AlipayHK') {
        hintTitle.innerText = 'AlipayHK 付款提示';
        hintText.innerText = '請於提交訂單後使用 AlipayHK 完成付款，並保留付款截圖作確認用途。';
    } else if (method === 'WeChatPayHK') {
        hintTitle.innerText = '微信支付 HK 付款提示';
        hintText.innerText = '請於提交訂單後使用微信支付 HK 完成付款，並保留付款截圖作確認用途。';
    }
}

// 渲染 pay.html 訂單摘要
function renderCheckoutPage() {
    const checkoutItems = document.getElementById('checkoutItems');
    if (!checkoutItems) return;

    const savedCart = JSON.parse(localStorage.getItem('nova_cart')) || [];
    const savedDiscount = JSON.parse(localStorage.getItem('nova_discount')) || 0;

    const subtotalEl = document.getElementById('checkoutSubtotal');
    const shippingEl = document.getElementById('checkoutShipping');
    const discountEl = document.getElementById('checkoutDiscount');
    const totalEl = document.getElementById('checkoutTotal');
    const itemCountEl = document.getElementById('checkoutItemCount');

    if (savedCart.length === 0) {
        checkoutItems.innerHTML = '<p class="empty-checkout">目前沒有商品，請先加入購物車。</p>';
        if (subtotalEl) subtotalEl.innerText = 'HK$ 0';
        if (shippingEl) shippingEl.innerText = 'HK$ 0';
        if (discountEl) discountEl.innerText = '-HK$ 0';
        if (totalEl) totalEl.innerText = 'HK$ 0';
        if (itemCountEl) itemCountEl.innerText = '共 0 件商品';
        return;
    }

    let html = '';
    let subtotal = 0;
    let totalQty = 0;

    savedCart.forEach(item => {
        const itemTotal = item.price * item.qty;
        subtotal += itemTotal;
        totalQty += item.qty;

        html += `
            <div class="checkout-item">
                <div class="checkout-item-info">
                    <h4>${item.name}</h4>
                    <div class="checkout-item-meta">規格: ${item.color} / ${item.size}</div>
                    <div class="checkout-item-meta">數量: ${item.qty}</div>
                </div>
                <div class="checkout-item-price">HK$ ${itemTotal}</div>
            </div>
        `;
    });

    checkoutItems.innerHTML = html;

    let shipping = subtotal >= 400 ? 0 : 30;
    let total = subtotal + shipping - savedDiscount;
    if (total < 0) total = 0;

    if (itemCountEl) itemCountEl.innerText = `共 ${totalQty} 件商品`;
    if (subtotalEl) subtotalEl.innerText = `HK$ ${subtotal}`;
    if (shippingEl) shippingEl.innerText = shipping === 0 ? '免運費' : `HK$ ${shipping}`;
    if (discountEl) discountEl.innerText = `-HK$ ${savedDiscount}`;
    if (totalEl) totalEl.innerText = `HK$ ${total}`;
}

// 提交訂單 → 跳 thankyou.html
async function submitOrder() {
    const name = document.getElementById('customerName');
    const phone = document.getElementById('customerPhone');
    const email = document.getElementById('customerEmail');
    const address = document.getElementById('customerAddress');
    const paymentMethod = document.getElementById('paymentMethod');
    const remark = document.getElementById('remark');

    if (
        name.value.trim() === '' ||
        phone.value.trim() === '' ||
        email.value.trim() === '' ||
        address.value.trim() === '' ||
        paymentMethod.value.trim() === ''
    ) {
        alert('請完整填寫所有必填資料。');
        return false;
    }

    const savedCart = JSON.parse(localStorage.getItem('nova_cart')) || [];
    const savedDiscount = JSON.parse(localStorage.getItem('nova_discount')) || 0;

    let subtotal = 0;
    let totalQty = 0;

    savedCart.forEach(item => {
        subtotal += item.price * item.qty;
        totalQty += item.qty;
    });

    let shipping = subtotal >= 400 ? 0 : 30;
    let total = subtotal + shipping - savedDiscount;
    if (total < 0) total = 0;

    const orderInfo = {
        orderId: 'NOVA-' + Date.now(),
        orderDateTime: new Date().toLocaleString('zh-HK', { hour12: false }),
        customerName: name.value.trim(),
        phone: phone.value.trim(),
        email: email.value.trim(),
        address: address.value.trim(),
        paymentMethod: paymentMethod.value.trim(),
        receiptLinkOrNo: '',
        paymentStatus: 'Pending',
        remark: remark ? remark.value.trim() : '',
        items: savedCart, // ✅ 一定要 items
        totalQty: totalQty,
        discount: savedDiscount,
        shipping: shipping,
        total: total
    };

    try {
        await fetch('https://script.google.com/macros/s/AKfycbxbY6TXI0DG5z7cnE8vgy3SdDFxIHHVttKG_0x48mffSz-qgIcS8Ij1wLX2ny8NtNu-/exec', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderInfo)
        });
    } catch (err) {
        console.error(err);
        alert('寫入 Google Sheets 失敗');
    }

    localStorage.setItem('nova_last_order', JSON.stringify(orderInfo));

    cart = [];
    localStorage.removeItem('nova_cart');
    localStorage.removeItem('nova_discount');

    window.location.href = 'thankyou.html';
    return false;
}

/* =========================
   Thank You Page
========================= */
function renderThankYouPage() {
    const thankyouBox = document.getElementById('thankyouOrderInfo');
    if (!thankyouBox) return;

    const lastOrder = JSON.parse(localStorage.getItem('nova_last_order'));

    if (!lastOrder) {
        thankyouBox.innerHTML = '<p>找不到訂單資料。</p>';
        setTimeout(function () {
            window.location.href = 'index.html';
        }, 3000);
        return;
    }

    let itemsHtml = '';
    lastOrder.cart.forEach(item => {
        itemsHtml += `
            <div class="thankyou-line">
                <span>${item.name} × ${item.qty}</span>
                <span>HK$ ${item.price * item.qty}</span>
            </div>
        `;
    });

    thankyouBox.innerHTML = `
        <h3>訂單資料</h3>
        <div class="thankyou-line"><span>姓名</span><span>${lastOrder.name}</span></div>
        <div class="thankyou-line"><span>電話</span><span>${lastOrder.phone}</span></div>
        <div class="thankyou-line"><span>電郵</span><span>${lastOrder.email}</span></div>
        <div class="thankyou-line"><span>付款方式</span><span>${lastOrder.paymentMethod}</span></div>
        <div class="thankyou-line"><span>商品總數</span><span>${lastOrder.totalQty} 件</span></div>
        <hr style="margin: 12px 0; border: none; border-top: 1px solid #ddd;">
        ${itemsHtml}
        <hr style="margin: 12px 0; border: none; border-top: 1px solid #ddd;">
        <div class="thankyou-line"><span>小計</span><span>HK$ ${lastOrder.subtotal}</span></div>
        <div class="thankyou-line"><span>運費</span><span>${lastOrder.shipping === 0 ? '免運費' : 'HK$ ' + lastOrder.shipping}</span></div>
        <div class="thankyou-line"><span>優惠</span><span>-HK$ ${lastOrder.discount}</span></div>
        <div class="thankyou-line" style="font-weight:bold; font-size:1.05rem;">
            <span>總計</span>
            <span>HK$ ${lastOrder.total}</span>
        </div>
    `;

    setTimeout(function () {
        localStorage.removeItem('nova_last_order');
        window.location.href = 'index.html';
    }, 5000);
}

/* =========================
   頁面初始化
========================= */
document.addEventListener('DOMContentLoaded', function () {
    renderCheckoutPage();
    renderThankYouPage();
    showPaymentHint();
    updateCartUI();
});