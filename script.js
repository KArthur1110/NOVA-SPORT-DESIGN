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
    // ✅ 取得輸入框同訊息框
    const input = document.getElementById('promoCodeInput');
    const msg = document.getElementById('promoMessage');

    // ✅ 處理用戶輸入（轉大寫，避免錯）
    const code = input.value.trim().toUpperCase();

    // ✅ NOVA2026 → 減 HK$20
    if (code === 'NOVA2026') {
        discount = 20;
        msg.innerText = '✅ 優惠碼已套用 -HK$20';
        msg.className = 'promo-message promo-success';

    // ✅ NOVA400 → 減 HK$40
    } else if (code === 'NOVA400') {
        discount = 40;
        msg.innerText = '✅ 優惠碼已套用 -HK$40';
        msg.className = 'promo-message promo-success';

    // ✅ 空白 → 清除提示
    } else if (code === '') {
        discount = 0;
        msg.innerText = '';

    // ❌ 無效 → 顯示錯誤
    } else {
        discount = 0;
        msg.innerText = '❌ 無效優惠碼';
        msg.className = 'promo-message promo-error';
    }

    // ✅ 更新價錢
    updateCartUI();
}
``


// ✅ 當頁面載入後先執行（避免報錯）
document.addEventListener('DOMContentLoaded', function () {

    const promoInput = document.getElementById('promoCodeInput');

    // ✅ 確保輸入框存在先做
    if (promoInput) {

        // ✅ 當用戶打字時觸發
        promoInput.addEventListener('input', function () {

            const msg = document.getElementById('promoMessage');

            // ✅ 如果輸入框變空 → 清除提示
            if (this.value === '') {
                msg.innerText = '';
            }
        });
    }
});




function clearCart() {
    cart = [];
    discount = 0;
    updateCartUI();
    toggleCart(false);
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

// ✅ 如果購物車容器存在 → 將商品 HTML 放入畫面
// html = 之前用 loop 建好嘅商品內容
if (container) container.innerHTML = html;

// ✅ 計算運費：滿 HK$500 免運，否則收 HK$30
let shipping = subtotal >= 500 ? 0 : 30;

// ✅ 計算最終總價：小計 + 運費 - 優惠
let total = subtotal + shipping - discount;

// ✅ 防止總價出現負數（例如優惠大過商品價值）
if (total < 0) total = 0;

// ✅ 更新小計顯示（例如：HK$ 300）
if (subtotalText) subtotalText.innerText = `HK$ ${subtotal}`;

// ✅ 更新運費顯示
// 如果運費 = 0 → 顯示「免運費」
// 否則顯示 HK$ 價錢
if (shippingText) 
    shippingText.innerText = shipping === 0 ? '免運費' : `HK$ ${shipping}`;

// ✅ 更新優惠顯示（顯示為負數）
if (discountText) discountText.innerText = `-HK$ ${discount}`;

// ✅ 更新最終總價顯示
if (totalText) totalText.innerText = `HK$ ${total}`;
}

/* =========================
   商品篩選 / FAQ
========================= */
function filterProducts(category, button) {
    // ✅ 取得所有分類按鈕，並移除「active」樣式（取消選中效果）
    document.querySelectorAll('.filter-btn').forEach(btn => 
        btn.classList.remove('active')
    );
    // ✅ 如果有點擊的按鈕，為該按鈕加上「active」樣式（顯示目前選擇）
    if (button) button.classList.add('active');
    // ✅ 取得所有產品卡片，逐一進行檢查
    document.querySelectorAll('.product-card').forEach(card => {

        // ✅ 如果選擇「全部」或該商品的分類符合所選分類
        if (category === 'all' || card.getAttribute('data-category') === category) {

            // ✅ 顯示商品（移除 hidden 類別）
            card.classList.remove('hidden');
        } else {
            // ❌ 隱藏不符合條件的商品（加入 hidden 類別）
            card.classList.add('hidden');
        }

    });
}


function toggleFaq(element) {

    // ✅ 如果傳入的 element 不存在，
    // 或 element 沒有父元素（避免出錯），就直接停止執行
    if (!element || !element.parentElement) return;

    // ✅ 切換父元素的「active」類別
    // 如果有 active → 移除（收起）
    // 如果沒有 active → 加上（展開）
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

    // ✅ 取得「付款方式」選擇框
    const paymentMethod = document.getElementById('paymentMethod');
    // ✅ 取得提示框整體（用嚟顯示／隱藏）
    const hintBox = document.getElementById('paymentHintBox');
    // ✅ 提示標題（例如：PayMe 付款提示）
    const hintTitle = document.getElementById('paymentHintTitle');
    // ✅ 提示內容（實際說明文字）
    const hintText = document.getElementById('paymentHintText');



    // ✅ 如果任何一個元素不存在（例如 HTML 冇載入）
    // 為避免報錯，直接停止執行
    if (!paymentMethod || !hintBox || !hintTitle || !hintText) return;
    // ✅ 取得目前用戶選擇的付款方式（例如 PayMe / FPS）
    const method = paymentMethod.value;
    // ✅ 如果用戶未選擇任何付款方式（空白）
    if (method === '') {
        // ✅ 隱藏提示框（唔顯示任何付款提示）
        hintBox.style.display = 'none';
        // ✅ 停止執行（唔再往下做）
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
        // ✅ 取得「訂單商品列表」顯示區域
        const checkoutItems = document.getElementById('checkoutItems');

        // ✅ 如果該元素不存在（例如不在 checkout 頁），就停止執行（防止報錯）
        if (!checkoutItems) return;

        // ✅ 從 localStorage 讀取購物車資料（如果沒有就使用空陣列）
        const savedCart = JSON.parse(localStorage.getItem('nova_cart')) || [];

        // ✅ 讀取優惠折扣金額（如果沒有就當作 0）
        const savedDiscount = JSON.parse(localStorage.getItem('nova_discount')) || 0;

        // ✅ 取得顯示小計的元素
        const subtotalEl = document.getElementById('checkoutSubtotal');

        // ✅ 取得顯示運費的元素
        const shippingEl = document.getElementById('checkoutShipping');

        // ✅ 取得顯示折扣的元素
        const discountEl = document.getElementById('checkoutDiscount');

        // ✅ 取得顯示總價的元素
        const totalEl = document.getElementById('checkoutTotal');

        // ✅ 取得顯示商品數量的元素（例如：共 3 件商品）
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
    async function submitOrder(event) {

    // ✅ 防止表單提交時刷新頁面
    if (event && event.preventDefault) event.preventDefault();

    // ✅ 取得使用者輸入的資料
    const name = document.getElementById('customerName');       // 姓名
    const phone = document.getElementById('customerPhone');     // 電話
    const email = document.getElementById('customerEmail');     // 電郵
    const address = document.getElementById('customerAddress'); // 地址
    const paymentMethod = document.getElementById('paymentMethod'); // 付款方式
    const remark = document.getElementById('remark');           // 備註

    // ✅ 如果任何欄位元素不存在（極少發生）→ 停止
    if (!name || !phone || !email || !address || !paymentMethod) return false;

    // ✅ 檢查用戶有冇填寫所有必填欄位
    if (
        name.value.trim() === '' ||       // 姓名為空
        phone.value.trim() === '' ||      // 電話為空
        email.value.trim() === '' ||      // 電郵為空
        address.value.trim() === '' ||    // 地址為空
        paymentMethod.value.trim() === '' // 未選付款方式
    ) {
        alert('請完整填寫所有必填資料。'); // 顯示提示
        return false; // 停止提交
    }

    // ✅ 從 localStorage 讀取購物車資料（如果冇就用空陣列）
    const savedCart = JSON.parse(localStorage.getItem('nova_cart')) || [];

    // ✅ 讀取優惠金額（如果冇就當 0）
    const savedDiscount = JSON.parse(localStorage.getItem('nova_discount')) || 0;

    // ✅ 初始化小計（總價）同總數量
    let subtotal = 0;
    let totalQty = 0;

    // ✅ 計算購物車入面所有商品
    savedCart.forEach(item => {
        // ✅ 價錢 = 單價 × 數量
        subtotal += item.price * item.qty;

        // ✅ 計算總件數
        totalQty += item.qty;
    });

    // ✅ 計算運費（滿 $400 免運，否則 $30）
    let shipping = subtotal >= 400 ? 0 : 30;

    // ✅ 計算最終總價（小計 + 運費 - 折扣）
    let total = subtotal + shipping - savedDiscount;
    if (total < 0) total = 0;

    const orderInfo = {
        name: name.value.trim(),
        phone: phone.value.trim(),
        email: email.value.trim(),
        address: address.value.trim(),
        paymentMethod: paymentMethod.value.trim(),
        remark: remark ? remark.value.trim() : '',
        cart: savedCart,
        totalQty: totalQty,
        subtotal: subtotal,
        shipping: shipping,
        discount: savedDiscount,
        total: total
    };

    localStorage.setItem('nova_last_order', JSON.stringify(orderInfo));

    // 清空購物車狀態
    cart = [];
    localStorage.removeItem('nova_cart');
    localStorage.removeItem('nova_discount');

    // Export the order to an Excel file (client-side) then redirect.
    try {
        await exportOrderToExcel(orderInfo);
    } catch (e) {
        console.error('Excel export failed:', e);
    }

    window.location.href = 'thankyou.html';
    return false;
}


// Export or append the order to an Excel workbook client-side.
// If an `orders_template.xlsx` exists at the site root it will be fetched and appended to;
// otherwise a new workbook will be created using a standard header row.
async function exportOrderToExcel(order) {
    // Try to fetch existing template
    let wb;
    try {
        const resp = await fetch('orders_template.xlsx');
        if (resp && resp.ok) {
            const ab = await resp.arrayBuffer();
            wb = XLSX.read(ab, { type: 'array' });
        }
    } catch (e) {
        // ignore fetch errors and create new workbook
        wb = null;
    }

    const sheetName = 'Orders';

    // Build the row to insert
    const orderId = 'ORD' + Date.now();
    const date = new Date().toLocaleString();
    const itemsStr = (order.cart || []).map(i => `${i.name} (${i.color}/${i.size}) x${i.qty} @${i.price}`).join('; ');
    const row = [
        orderId,
        date,
        order.name,
        order.phone,
        order.email,
        order.address,
        order.paymentMethod,
        order.remark || '',
        itemsStr,
        order.totalQty,
        order.subtotal,
        order.shipping,
        order.discount,
        order.total
    ];

    const header = ['OrderID', 'Date', 'Name', 'Phone', 'Email', 'Address', 'PaymentMethod', 'Remark', 'Items', 'TotalQty', 'Subtotal', 'Shipping', 'Discount', 'Total'];

    if (!wb) {
        // create new workbook
        wb = XLSX.utils.book_new();
        const wsData = [header, row];
        const ws = XLSX.utils.aoa_to_sheet(wsData);
        XLSX.utils.book_append_sheet(wb, ws, sheetName);
    } else {
        // workbook loaded: find sheet or create
        let ws = wb.Sheets[sheetName];
        if (!ws) {
            // create sheet with header then append
            const wsData = [header, row];
            ws = XLSX.utils.aoa_to_sheet(wsData);
            XLSX.utils.book_append_sheet(wb, ws, sheetName);
        } else {
            // convert to array of arrays, append row, and write back
            const aoa = XLSX.utils.sheet_to_json(ws, { header: 1 });
            // If sheet is empty, ensure header present
            if (aoa.length === 0) aoa.push(header);
            aoa.push(row);
            const newWs = XLSX.utils.aoa_to_sheet(aoa);
            wb.Sheets[sheetName] = newWs;
        }
    }

    // Trigger browser download of updated workbook
    try {
        XLSX.writeFile(wb, 'orders_template.xlsx');
    } catch (e) {
        // Some browsers may require a blob approach
        const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([wbout], { type: 'application/octet-stream' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'orders_template.xlsx';
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    }
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

    let countdown = 5;
const countdownEl = document.getElementById('countdown');

if (countdownEl) {
    countdownEl.innerText = countdown;
}

const countdownTimer = setInterval(function () {
    countdown--;
    if (countdownEl) {
        countdownEl.innerText = countdown;
    }

    if (countdown <= 0) {
        clearInterval(countdownTimer);
        localStorage.removeItem('nova_last_order');
        window.location.href = 'index.html';
    }
}, 1000);
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