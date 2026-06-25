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
// 切換購物車側邊欄的顯示與隱藏
function toggleCart(open) {
    // 取得購物車側邊欄元素
    const drawer = document.getElementById('cartDrawer');
    // 取得背景遮罩元素
    const overlay = document.getElementById('cartOverlay');

    // 若側邊欄存在，依據參數 open 切換 'open' class
    if (drawer) drawer.classList.toggle('open', open);
    // 若遮罩存在，依據參數 open 切換顯示狀態
    if (overlay) overlay.style.display = open ? 'block' : 'none';
}

// 切換尺寸選擇視窗的顯示與隱藏
function toggleModal(open) {
    // 取得尺寸選擇視窗元素
    const modal = document.getElementById('sizeModal');
    // 若視窗存在，依據參數 open 切換 'open' class
    if (modal) modal.classList.toggle('open', open);
}

/* =========================
   商品規格選擇
========================= */
// 選擇規格選項功能
function selectVariant(button, value) {
    // 獲取按鈕的父元素
    const parent = button.parentElement;
    // 如果父元素不存在則終止函數
    if (!parent) return;

    // 將該容器內所有選項按鈕的 'selected' class 移除
    parent.querySelectorAll('.option-btn').forEach(btn => btn.classList.remove('selected'));
    // 為當前點擊的按鈕加上 'selected' class
    button.classList.add('selected');
}

// 加入含有規格的商品至購物車
function addWithVariants(cardId, baseName, price) {
    const card = document.getElementById(cardId);
    if (!card) return;

    const activeSizeBtn = card.querySelector('.size-group .option-btn.selected');

    if (!activeSizeBtn) {
        alert('請先選擇尺碼！');
        return;
    }

    const selectedSize = activeSizeBtn.innerText;
    addToCart(baseName, price, '-', selectedSize);
}


/* =========================
   購物車
========================= */
// 將商品加入購物車，包含顏色與尺碼選項（預設值為 '-'）
function addToCart(name, price, color = '-', size = '-') {
    // 檢查購物車內是否已有相同名稱、顏色與尺碼的商品
    const existingItem = cart.find(item =>
        item.name === name &&
        item.color === color &&
        item.size === size
    );

    // 如果商品已存在，則將該商品的數量加 1
    if (existingItem) {
        existingItem.qty += 1;
    } else {
        // 如果商品不存在，則建立新物件並推入購物車陣列
        cart.push({
            name: name,
            price: price,
            color: color,
            size: size,
            qty: 1
        });
    }

    // 更新購物車顯示介面
    updateCartUI();
    // 打開購物車側邊欄
    toggleCart(true);
}

// 修改購物車內特定商品的數量
function changeQty(name, color, size, amount) {
    // 在購物車陣列中尋找符合名稱、顏色及尺碼的商品
    const item = cart.find(item =>
        item.name === name &&
        item.color === color &&
        item.size === size
    );

    // 若找不到該商品則直接返回
    if (!item) return;

    // 將商品的數量加上指定的變動量 (amount)
    item.qty += amount;

    // 若商品數量小於或等於 0，則將其從購物車陣列中移除
    if (item.qty <= 0) {
        cart = cart.filter(i =>
            !(i.name === name && i.color === color && i.size === size)
        );
    }

    // 更新購物車顯示介面
    updateCartUI();
}

// 套用優惠碼並更新折扣金額
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
        // 彈出成功提示
        alert('成功套用優惠碼！全單立減 HK$ 40');
    } else if (code === '') {
        // 若輸入為空，折扣歸零
        discount = 0;
        msg.innerText = '';

    // ❌ 無效 → 顯示錯誤
    } else {
        // 若優惠碼無效，彈出提示並將折扣設為 0
        alert('無效的優惠碼，請重新輸入。');
        discount = 0;
        msg.innerText = '❌ 無效優惠碼';
        msg.className = 'promo-message promo-error';
    }

    // 更新購物車顯示介面
    updateCartUI();
}


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
    // 清空購物車陣列 (將購物車重置為空)
    cart = [];
    
    // 將優惠折扣重置為 0
    discount = 0;
    
    // 呼叫函式更新購物車顯示介面
    updateCartUI();
    
    // 關閉購物車側邊欄 (傳入 false 表示隱藏)
    toggleCart(false);
}

function updateCartUI() {
    // 取得顯示購物車項目的容器元素
    const container = document.getElementById('cartItemsContainer');
    // 取得所有顯示購物車數量的標記 (電腦版與手機版)
    const countBadges = document.querySelectorAll('#cart-count, #mobile-cart-count');
    // 取得小計文字區塊
    const subtotalText = document.getElementById('cartSubtotal');
    // 取得運費文字區塊
    const shippingText = document.getElementById('cartShipping');
    // 取得折扣文字區塊
    const discountText = document.getElementById('cartDiscount');
    // 取得總金額文字區塊
    const totalText = document.getElementById('cartTotalAmount');

    // 計算購物車內所有商品的總數量
    let totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    // 更新所有數量標記的文字
    countBadges.forEach(badge => {
        if (badge) badge.innerText = totalQty;
    });

    // 檢查購物車是否為空
    if (cart.length === 0) {
        // 若購物車為空，在容器內顯示提示訊息
        if (container) {
            container.innerHTML = `<p style="text-align: center; color: #999; margin-top: 2rem;">購物車目前是空的</p>`;
        }
        // 將金額相關的所有顯示歸零
        if (subtotalText) subtotalText.innerText = 'HK$ 0';
        if (shippingText) shippingText.innerText = 'HK$ 0';
        if (discountText) discountText.innerText = '-HK$ 0';
        if (totalText) totalText.innerText = 'HK$ 0';
        // 結束函式執行
        return;
    }

 // 初始化用來儲存購物車 HTML 字串的變數
    let html = '';
    // 初始化小計金額為 0
    let subtotal = 0;

    // 遍歷購物車內的每一項商品進行處理
    cart.forEach(item => {
        // 計算該項商品的總價 (單價 * 數量)
        const itemTotal = item.price * item.qty;
        // 將該項商品的總價累加到小計中
        subtotal += itemTotal;

        // 組裝商品的 HTML 結構字串
        html += `
            <div class="cart-item">
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <div class="cart-item-meta">SIZE: ${item.color}  ${item.size}</div>
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
    // 移除所有篩選按鈕上的 'active' 樣式類別
// ✅ 取得所有分類按鈕，並移除「active」樣式（取消選中效果）
    document.querySelectorAll('.filter-btn').forEach(btn => 
        btn.classList.remove('active')
    );
    // ✅ 如果有點擊的按鈕，為該按鈕加上「active」樣式（顯示目前選擇）
    if (button) button.classList.add('active');

    // ✅ 取得所有產品卡片，逐一進行檢查
    document.querySelectorAll('.product-card').forEach(card => {
        // 如果類別為 'all' 或者卡片的 data-category 屬性符合所選類別，則移除 'hidden' 類別以顯示卡片
        if (category === 'all' || card.getAttribute('data-category') === category) {
            // ✅ 顯示商品（移除 hidden 類別
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
    // 將購物車陣列轉換為 JSON 字串並存入 localStorage，以便在結帳頁面讀取
    localStorage.setItem('nova_cart', JSON.stringify(cart));
    
    // 將折扣金額轉換為 JSON 字串並存入 localStorage
    localStorage.setItem('nova_discount', JSON.stringify(discount));
    
    // 跳轉頁面至結帳頁面 (pay.html)
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
    // 取得提示內容文字元素
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
    if (method === '') {
        hintBox.style.display = 'none';
        return;
    }



    // 顯示提示區塊
    hintBox.style.display = 'block';

    // 根據不同的付款方式設定對應的標題與提示文字
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

    // 如果購物車為空，顯示提示並將所有金額歸零
    if (savedCart.length === 0) {
        checkoutItems.innerHTML = '<p class="empty-checkout">目前沒有商品，請先加入購物車。</p>';
        if (subtotalEl) subtotalEl.innerText = 'HK$ 0';
        if (shippingEl) shippingEl.innerText = 'HK$ 0';
        if (discountEl) discountEl.innerText = '-HK$ 0';
        if (totalEl) totalEl.innerText = 'HK$ 0';
        if (itemCountEl) itemCountEl.innerText = '共 0 件商品';
        return;
    }

    // 初始化 HTML 字串、小計金額與總數量
    let html = '';
    let subtotal = 0;
    let totalQty = 0;

    // 遍歷已儲存的購物車商品並產生結帳清單 HTML
    savedCart.forEach(item => {
        const itemTotal = item.price * item.qty;
        subtotal += itemTotal;
        totalQty += item.qty;

        html += `
            <div class="checkout-item">
                <div class="checkout-item-info">
                    <h4>${item.name}</h4>
                    <div class="checkout-item-meta">SIZE: ${item.color}  ${item.size}</div>
                    <div class="checkout-item-meta">數量: ${item.qty}</div>
                </div>
                <div class="checkout-item-price">HK$ ${itemTotal}</div>
            </div>
        `;
    });

    // 將產生的商品列表寫入頁面容器
    checkoutItems.innerHTML = html;

    // 計算運費：滿 400 元免運，否則運費為 30 元
    let shipping = subtotal >= 400 ? 0 : 30;
    // 計算最終總金額
    let total = subtotal + shipping - savedDiscount;
    // 確保總金額不小於 0
    if (total < 0) total = 0;

    // 更新頁面上的總數量及各項金額顯示
    if (itemCountEl) itemCountEl.innerText = `共 ${totalQty} 件商品`;
    if (subtotalEl) subtotalEl.innerText = `HK$ ${subtotal}`;
    if (shippingEl) shippingEl.innerText = shipping === 0 ? '免運費' : `HK$ ${shipping}`;
    if (discountEl) discountEl.innerText = `-HK$ ${savedDiscount}`;
    if (totalEl) totalEl.innerText = `HK$ ${total}`;
}
// 定義地區與行政區的對應關係
const districtMap = {
    '香港島': ['中西區', '灣仔', '東區', '南區', '其他'],
    '九龍': ['油尖旺', '深水埗', '九龍城', '黃大仙', '觀塘', '其他'],
    '新界': ['葵青', '荃灣', '屯門', '元朗', '北區', '大埔', '沙田', '西貢', '離島', '其他']
};

function updateDistrictOptions() {
    // 取得區域、行政區、其他地區輸入框及其容器的元素
    const regionSelect = document.getElementById('region');
    const districtSelect = document.getElementById('district');
    const otherDistrictGroup = document.getElementById('otherDistrictGroup');
    const otherDistrict = document.getElementById('otherDistrict');

    // 若基礎選單不存在則中止執行
    if (!regionSelect || !districtSelect) return;

    // 取得所選區域的值，並清空行政區選單
    const selectedRegion = regionSelect.value;
    districtSelect.innerHTML = '<option value="">請選擇區域</option>';

    // 預設隱藏「其他地區」輸入框並清空其內容
    if (otherDistrictGroup) otherDistrictGroup.style.display = 'none';
    if (otherDistrict) otherDistrict.value = '';

    // 若找不到對應的區域資料則中止執行
    if (!districtMap[selectedRegion]) return;

    // 根據所選區域，動態產生對應的行政區選項
    districtMap[selectedRegion].forEach(district => {
        const option = document.createElement('option');
        option.value = district;
        option.textContent = district;
        districtSelect.appendChild(option);
    });

    // 設定行政區選單的變更事件，監聽使用者選擇
    districtSelect.onchange = function () {
        // 如果選擇「其他」，顯示手動輸入框，否則隱藏並清空輸入框
        if (districtSelect.value === '其他') {
            if (otherDistrictGroup) otherDistrictGroup.style.display = 'block';
        } else {
            if (otherDistrictGroup) otherDistrictGroup.style.display = 'none';
            if (otherDistrict) otherDistrict.value = '';
        }
    };
}
// 提交訂單 → 跳 thankyou.html
async function submitOrder(event) {
    // 若事件存在且有預設行為，則取消它 (防止表單自動刷新頁面)
    if (event && event.preventDefault) event.preventDefault();
    
    // 取得所有客戶資訊輸入欄位元素
    const name = document.getElementById('customerName');
    const phone = document.getElementById('customerPhone');
    const email = document.getElementById('customerEmail');
    const address = document.getElementById('customerAddress');
    const paymentMethod = document.getElementById('paymentMethod');
    const remark = document.getElementById('remark');

    // 若必要欄位遺失，則中止執行
    if (!name || !phone || !email || !address || !paymentMethod) return false;

    // 檢查必填欄位是否為空，若有空值則顯示提醒並中止執行
    if (
        name.value.trim() === '' ||       // 姓名為空
        phone.value.trim() === '' ||      // 電話為空
        email.value.trim() === '' ||      // 電郵為空
        address.value.trim() === '' ||    // 地址為空
        paymentMethod.value.trim() === '' // 未選付款方式
    ) {
        // 顯示提示
        alert('請完整填寫所有必填資料。');
        return false;
        // 停止提交
    }

    // 從 localStorage 讀取已儲存的購物車資料與折扣
    const savedCart = JSON.parse(localStorage.getItem('nova_cart')) || [];
    // ✅ 讀取優惠金額（如果冇就當 0）
    const savedDiscount = JSON.parse(localStorage.getItem('nova_discount')) || 0;

    // 初始化小計與總數量
    let subtotal = 0;
    let totalQty = 0;

    // ✅ 初始化小計（總價）同總數量
    savedCart.forEach(item => {
        // ✅ 價錢 = 單價 × 數量
        subtotal += item.price * item.qty;
        // ✅ 計算總件數
        totalQty += item.qty;
    });

    // ✅ 計算運費（滿 $400 免運，否則 $30））
    let shipping = subtotal >= 400 ? 0 : 30;
    // ✅ 計算最終總價（小計 + 運費 - 折扣）
    let total = subtotal + shipping - savedDiscount;
    // 確保總金額不小於 0
    if (total < 0) total = 0;

    // 建立訂單資訊物件，整合所有客戶輸入及計算後的數據
    const orderInfo = {
        name: name.value.trim(),
        phone: phone.value.trim(),
        email: email.value.trim(),
        address: `${region.value} ${district.value} ${addressDetail.value.trim()}`,
        paymentMethod: paymentMethod.value.trim(),
        remark: remark ? remark.value.trim() : '',
        cart: savedCart,
        totalQty: totalQty,
        subtotal: subtotal,
        shipping: shipping,
        discount: savedDiscount,
        total: total
    };

    // 將訂單資訊存入 localStorage 作為最後一筆訂單紀錄
    localStorage.setItem('nova_last_order', JSON.stringify(orderInfo));

    // 清空記憶體中的購物車狀態，並刪除 localStorage 的購物車與折扣資料
    cart = [];
    localStorage.removeItem('nova_cart');
    localStorage.removeItem('nova_discount');

    // 執行匯出 Excel 檔案的非同步操作
    try {
        await exportOrderToExcel(orderInfo);
    } catch (e) {
        // 若匯出失敗則在控制台記錄錯誤
        console.error('Excel export failed:', e);
    }

    // 跳轉至感謝頁面
    window.location.href = 'thankyou.html';
    // 回傳 false 確保表單不會額外送出
    return false;
}


// 將訂單匯出或附加到客戶端的 Excel 活頁簿中
// 若網站根目錄存在 `orders_template.xlsx`，則會嘗試讀取並附加內容；否則會建立新的活頁簿
async function exportOrderToExcel(order) {
    // 嘗試讀取已存在的範本檔案
    let wb;
    try {
        const resp = await fetch('orders_template.xlsx');
        if (resp && resp.ok) {
            const ab = await resp.arrayBuffer();
            wb = XLSX.read(ab, { type: 'array' });
        }
    } catch (e) {
        // 若讀取失敗 (例如檔案不存在)，則忽略錯誤並將 wb 設為 null 以便後續建立新活頁簿
        wb = null;
    }

    // 定義工作表名稱
    const sheetName = 'Orders';

    // 建立要插入的一行資料
    // 使用時間戳記生成唯一訂單編號
    const orderId = 'ORD' + Date.now();
    // 獲取當前日期時間
    const date = new Date().toLocaleString();
    // 將購物車商品轉換為易於閱讀的字串格式
    const itemsStr = (order.cart || []).map(i => `${i.name} (${i.color}/${i.size}) x${i.qty} @${i.price}`).join('; ');
    // 建立包含所有訂單欄位的陣列
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

    // 定義 Excel 的標題欄位
    const header = ['OrderID', 'Date', 'Name', 'Phone', 'Email', 'Address', 'PaymentMethod', 'Remark', 'Items', 'TotalQty', 'Subtotal', 'Shipping', 'Discount', 'Total'];

    // 如果沒有讀取到舊的活頁簿，則建立一個新的
    if (!wb) {
        wb = XLSX.utils.book_new();
        const wsData = [header, row];
        const ws = XLSX.utils.aoa_to_sheet(wsData);
        XLSX.utils.book_append_sheet(wb, ws, sheetName);
    } else {
        // 如果已載入舊的活頁簿，則尋找 'Orders' 工作表
        let ws = wb.Sheets[sheetName];
        if (!ws) {
            // 如果找不到該工作表，則建立一個並寫入標題與資料
            const wsData = [header, row];
            ws = XLSX.utils.aoa_to_sheet(wsData);
            XLSX.utils.book_append_sheet(wb, ws, sheetName);
        } else {
            // 如果工作表存在，將其轉換為二維陣列，附加新行後再寫回
            const aoa = XLSX.utils.sheet_to_json(ws, { header: 1 });
            // 如果工作表是空的，確保加入標題行
            if (aoa.length === 0) aoa.push(header);
            aoa.push(row);
            const newWs = XLSX.utils.aoa_to_sheet(aoa);
            wb.Sheets[sheetName] = newWs;
        }
    }

    // 觸發瀏覽器下載更新後的 Excel 檔案
    try {
        XLSX.writeFile(wb, 'orders_template.xlsx');
    } catch (e) {
        // 部分瀏覽器可能不支援直接寫入，改用 Blob 物件方式處理下載
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
    // 取得用於顯示訂單資料的容器元素
    const thankyouBox = document.getElementById('thankyouOrderInfo');
    // 若容器不存在則中止執行
    if (!thankyouBox) return;

    // 從 localStorage 讀取最後一筆訂單資料
    const lastOrder = JSON.parse(localStorage.getItem('nova_last_order'));

    // 如果沒有訂單資料，顯示提示訊息並在 3 秒後自動返回主頁
    if (!lastOrder) {
        thankyouBox.innerHTML = '<p>找不到訂單資料。</p>';
        setTimeout(function () {
            window.location.href = 'index.html';
        }, 3000);
        return;
    }

    // 初始化商品項目 HTML 字串
    let itemsHtml = '';
    // 遍歷訂單中的商品清單並產生 HTML
    lastOrder.cart.forEach(item => {
        itemsHtml += `
            <div class="thankyou-line">
                <span>${item.name} × ${item.qty}</span>
                <span>HK$ ${item.price * item.qty}</span>
            </div>
        `;
    });

    // 將訂單詳細資料 (姓名、電話、總計等) 寫入頁面
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

    // 初始化倒數計時為 5 秒
    let countdown = 5;
    // 取得頁面上的倒數數字顯示元素
    const countdownEl = document.getElementById('countdown');

    // 若倒數顯示元素存在，初始化其文字
    if (countdownEl) {
        countdownEl.innerText = countdown;
    }

    // 設定每秒執行一次的倒數計時器
    const countdownTimer = setInterval(function () {
        countdown--;
        // 更新顯示的剩餘秒數
        if (countdownEl) {
            countdownEl.innerText = countdown;
        }

        // 當倒數結束時
        if (countdown <= 0) {
            // 清除計時器
            clearInterval(countdownTimer);
            // 移除訂單快取資料並跳轉回主頁
            localStorage.removeItem('nova_last_order');
            window.location.href = 'index.html';
        }
    }, 1000);
}

/* =========================
   頁面初始化
========================= */
// 當整個 HTML 文件載入完成後執行
document.addEventListener('DOMContentLoaded', function () {
    // 渲染結帳頁面內容
    renderCheckoutPage();
    // 渲染感謝頁面內容
    renderThankYouPage();
    // 根據選擇的付款方式顯示對應提示
    showPaymentHint();
    // 更新購物車介面顯示
    updateCartUI();
});