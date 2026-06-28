/* =========================
   NOVA SPORT - Main Script
========================= */

// 全域狀態
let discount = 0;
let selectedShipping = 0;
let cart = [];

let pendingProduct = null;
let pendingSelectedSize = '';
let currentLanguage = localStorage.getItem('nova_language') || 'zh';

const translations = {
    zh: {
        navHome: '首頁',
        navAbout: '關於我們',
        navContact: '聯絡我們',
        navProducts: '產品',
        navFaq: '常見問題',
        navCart: '購物車',

        heroTitle: 'NOVA SPORT DESIGN',
        heroSubtitle: '專為高強度排球訓練與熱血汗水設計。極致排汗、流暢剪裁，助您統治整個球場。',
        heroBtn: '立即探索系列',

        aboutHeading: '關於 NOVA',
        aboutTitle: '源自對球場的熱愛與執著',
        aboutP1: '我們公司成立於香港，團隊成員皆由本地資深排球員與運動愛好者組成。我們深知在進行排球訓練時，普通的運動衫常常會因汗水黏身或剪裁限制了擺臂的角度。',
        aboutP2: '因此，我們創立了 NOVA Sport Design，致力於研發最適合排球高強度訓練的專業 Tee。精選高規格排汗布料，配合亞洲運動員身型剪裁，確保衣服防磨且高彈性。',

        productsHeading: '專業運動服飾',
        filterAll: '全部產品',
        filterVolleyball: '排球訓練服',
        filterGeneral: '日常運動服',
        sizeGuide: '📐 查看官方 T-Shirt 尺碼對照表',

        tagVolleyball: '排球專屬',
        tagGeneral: '全能運動',
        productSkyX: 'NOVA Sky-X traing Tee',
        productEveryday: 'Everyday Core 高透氣運動 T-Shirt',
        productBakugo: 'NOVA Bakugo Tee',
        productShoto: 'NOVA shoto Tee',
        addToCart: '加入購物車',

        faqHeading: '常見問題',
        faqQ1: 'Q1. 香港本地運費如何計算？',
        faqA1: '全店滿 HK$500 即享免運費優惠。未滿額收取 HK$30 運費，使用順豐速運送達。',
        faqQ2: 'Q2. 支援哪些付款方式？',
        faqA2: '我們支援 PayMe、轉數快 (FPS)、AlipayHK 和微信支付 HK。',

        sizeTableTitle: '尺寸表',
        chooseSize: '請選擇尺碼',
        confirmAddCart: '確認加入購物車',

        cartTitle: '購物車',
        cartEmpty: '購物車目前是空的',
        subtotal: '小計',
        shipping: '運費',
        discount: '優惠',
        total: '總計',
        clearCart: '清空購物車',
        goCheckout: '前往結帳',

        freeShipping: '免運費',
        invalidSize: '請先選擇尺碼！',
        sizeLabel: '尺碼',

        
        musicBtn: '♫ 音樂',
        musicPlaying: '♫ 播放中',
        sizeLabel: '尺碼',

        contactHeading: '聯絡我們',
        contactSubtitle: '如果你想查詢團體訂製、產品細節、尺碼建議或合作事宜，歡迎透過以下方式聯絡 NOVA SPORTSWEAR DESIGN。',
        contactInfoTitle: '聯絡資料',
        brandNameLabel: '品牌名稱',
        serviceHoursLabel: '服務時間',
        serviceHoursText: '星期一至星期六 11:00 - 20:00',
        contactFormTitle: '查詢表格',
        contactNameLabel: '姓名',
        contactEmailLabel: '電郵',
        contactPhoneLabel: '電話（選填）',
        contactTopicLabel: '查詢類別',
        contactTopicPlaceholder: '請選擇查詢類別',
        topicProduct: '產品查詢',
        topicTeamOrder: '團體訂製',
        topicSizeAdvice: '尺碼建議',
        topicCollab: '合作洽談',
        topicOther: '其他',
        contactMessageLabel: '訊息內容',
        contactMessagePlaceholder: '請輸入你的查詢內容',
        contactSubmitBtn: '提交查詢',
        contactNote: '此頁面目前為前端示範版本，提交後會顯示確認訊息。',

        checkoutHeroTitle: '安全結帳',
        regionPlaceholder: '請選擇地區',
        regionHKIsland: '香港島',
        regionKowloon: '九龍',
        regionNT: '新界',
        districtFirstChooseRegion: '請先選擇地區',
        districtPlaceholder: '請選擇區域',
        addressDetailPlaceholder: '請輸入大廈 / 街道 / 樓層 / 單位',
        paymentPlaceholder: '請選擇付款方式',
        paymentFPS: '轉數快 FPS',
        paymentWeChatPayHK: '微信支付 HK',

        checkoutHeroSubtitle: '請填寫你的聯絡及送貨資料，完成訂單確認。',
        customerInfoTitle: '顧客資料',
        customerNameLabel: '姓名',
        customerPhoneLabel: '電話',
        customerEmailLabel: '電郵',
        regionLabel: '地區',
        districtLabel: '區域',
        otherDistrictLabel: '其他區域',
        addressDetailLabel: '詳細地址',
        paymentMethodLabel: '付款方式',
        remarkLabel: '備註（選填）',
        confirmOrderBtn: '確認訂單',
        orderSummaryTitle: '訂單摘要',
        checkoutItemCountEmpty: '共 0 件商品',
        promoPlaceholder: '輸入優惠碼',
        applyPromoBtn: '套用',
        backToShopping: '← 返回繼續購物',

        thankyouTitle: '付款成功！',
        thankyouSubtitle: '多謝你支持 NOVA SPORT。',
        thankyouLoading: '正在載入訂單資料...',
        redirectText: ' 秒後將自動返回主頁...',
        backHomeNow: '立即返回主頁',
        
        bgmVolumeLabel: '音樂音量',
        cartCheckoutEmpty: '購物車目前是空的，請先加入商品再結帳。',


    },

    en: {
        navHome: 'Home',
        navAbout: 'About',
        navContact: 'Contact',
        navProducts: 'Products',
        navFaq: 'FAQ',
        navCart: 'Cart',

        heroTitle: 'NOVA SPORT DESIGN',
        heroSubtitle: 'Designed for high-intensity volleyball training and unstoppable energy. Fast-drying fabric and smooth athletic cutting help you dominate the court.',
        heroBtn: 'Explore Collection',

        aboutHeading: 'About NOVA',
        aboutTitle: 'Born from passion for the court',
        aboutP1: 'Founded in Hong Kong, our team is made up of local volleyball players and sports lovers. We understand that ordinary sports shirts can stick to the body or restrict arm movement during intense training.',
        aboutP2: 'That is why we created NOVA Sport Design. We focus on professional training tees made with high-performance moisture-wicking fabric and athletic cutting designed for Asian athletes.',

        productsHeading: 'Professional Sportswear',
        filterAll: 'All Products',
        filterVolleyball: 'Volleyball Training',
        filterGeneral: 'Everyday Sportswear',
        sizeGuide: '📐 View Official T-Shirt Size Guide',

        tagVolleyball: 'Volleyball',
        tagGeneral: 'All-Round Sports',
        productSkyX: 'NOVA Sky-X Training Tee',
        productEveryday: 'Everyday Core Breathable Sports T-Shirt',
        productBakugo: 'NOVA Bakugo Tee',
        productShoto: 'NOVA Shoto Tee',
        addToCart: 'Add to Cart',

        faqHeading: 'Frequently Asked Questions',
        faqQ1: 'Q1. How is local delivery calculated in Hong Kong?',
        faqA1: 'Free shipping is available for orders over HK$500. Orders below this amount will be charged HK$30 shipping via SF Express.',
        faqQ2: 'Q2. What payment methods are supported?',
        faqA2: 'We support PayMe, FPS, AlipayHK and WeChat Pay HK.',

        sizeTableTitle: 'Size Chart',
        chooseSize: 'Please Select Size',
        confirmAddCart: 'Confirm and Add to Cart',

        cartTitle: 'Cart',
        cartEmpty: 'Your cart is currently empty',
        subtotal: 'Subtotal',
        shipping: 'Shipping',
        discount: 'Discount',
        total: 'Total',
        clearCart: 'Clear Cart',
        goCheckout: 'Checkout',

        freeShipping: 'Free Shipping',
        invalidSize: 'Please select a size first!',
        sizeLabel: 'Size',

        
        musicBtn: '♫ Music',
        musicPlaying: '♫ Playing',
        sizeLabel: 'Size',

        contactHeading: 'Contact Us',
        contactSubtitle: 'For team orders, product details, size advice or collaboration enquiries, please contact NOVA SPORTSWEAR DESIGN through the methods below.',
        contactInfoTitle: 'Contact Information',
        brandNameLabel: 'Brand Name',
        serviceHoursLabel: 'Service Hours',
        serviceHoursText: 'Monday to Saturday 11:00 - 20:00',
        contactFormTitle: 'Enquiry Form',
        contactNameLabel: 'Name',
        contactEmailLabel: 'Email',
        contactPhoneLabel: 'Phone Optional',
        contactTopicLabel: 'Enquiry Type',
        contactTopicPlaceholder: 'Please select an enquiry type',
        topicProduct: 'Product Enquiry',
        topicTeamOrder: 'Team Custom Order',
        topicSizeAdvice: 'Size Advice',
        topicCollab: 'Collaboration',
        topicOther: 'Other',
        contactMessageLabel: 'Message',
        contactMessagePlaceholder: 'Please enter your enquiry message',
        contactSubmitBtn: 'Submit Enquiry',
        contactNote: 'This page is currently a front-end demo. A confirmation message will be shown after submission.',

        checkoutHeroTitle: 'Secure Checkout',
        checkoutHeroSubtitle: 'Please fill in your contact and delivery information to confirm your order.',
        regionPlaceholder: 'Please select a region',
        regionHKIsland: 'Hong Kong Island',
        regionKowloon: 'Kowloon',
        regionNT: 'New Territories',
        districtFirstChooseRegion: 'Please select a region first',
        districtPlaceholder: 'Please select a district',
        addressDetailPlaceholder: 'Please enter building / street / floor / unit',
        paymentPlaceholder: 'Please select a payment method',
        paymentFPS: 'FPS',
        paymentWeChatPayHK: 'WeChat Pay HK',
        customerInfoTitle: 'Customer Information',
        customerNameLabel: 'Name',
        customerPhoneLabel: 'Phone',
        customerEmailLabel: 'Email',
        regionLabel: 'Region',
        districtLabel: 'District',
        otherDistrictLabel: 'Other District',
        addressDetailLabel: 'Detailed Address',
        paymentMethodLabel: 'Payment Method',
        remarkLabel: 'Remarks Optional',
        confirmOrderBtn: 'Confirm Order',
        orderSummaryTitle: 'Order Summary',
        checkoutItemCountEmpty: '0 items',
        promoPlaceholder: 'Enter promo code',
        applyPromoBtn: 'Apply',
        backToShopping: '← Back to Shopping',

        thankyouTitle: 'Payment Successful!',
        thankyouSubtitle: 'Thank you for supporting NOVA SPORT.',
        thankyouLoading: 'Loading order information...',
        redirectText: ' seconds until returning to homepage...',
        backHomeNow: 'Return Home Now',
        bgmVolumeLabel: 'Music Volume',
        cartCheckoutEmpty: 'Your cart is empty. Please add items before checkout.',

    }
};

function t(key) {
    return translations[currentLanguage][key] || translations.zh[key] || key;
}

function applyLanguage() {
    document.documentElement.lang = currentLanguage === 'zh' ? 'zh-Hant-HK' : 'en';

    // 一般文字翻譯：label / h1 / p / button / option
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');

        if (translations[currentLanguage][key]) {
            element.innerText = translations[currentLanguage][key];
        }
    });

    // placeholder 翻譯：input / textarea
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');

        if (translations[currentLanguage][key]) {
            element.setAttribute('placeholder', translations[currentLanguage][key]);
        }
    });

    const languageLabel = document.getElementById('languageLabel');

    if (languageLabel) {
        languageLabel.innerText = currentLanguage === 'zh' ? 'EN' : '中文';
    }

    // 如果 checkout 頁已經選咗 region，切換語言時重新渲染 district 顯示文字
    const regionSelect = document.getElementById('region');
    const districtSelect = document.getElementById('district');

    if (regionSelect && districtSelect && regionSelect.value !== '') {
        updateDistrictOptions();
    }

    updateCartUI();
}


function toggleLanguage() {
    currentLanguage = currentLanguage === 'zh' ? 'en' : 'zh';
    localStorage.setItem('nova_language', currentLanguage);
    applyLanguage();
}


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
function saveCartState() {
    localStorage.setItem('nova_cart', JSON.stringify(cart));
    localStorage.setItem('nova_discount', JSON.stringify(discount));
}

function loadCartState() {
    const savedCart = JSON.parse(localStorage.getItem('nova_cart')) || [];
    const savedDiscount = JSON.parse(localStorage.getItem('nova_discount')) || 0;

    cart = savedCart;
    discount = savedDiscount;
}

// 切換尺寸選擇視窗的顯示與隱藏
function toggleModal(open) {
    // 取得尺寸選擇視窗元素
    const modal = document.getElementById('sizeModal');
    // 若視窗存在，依據參數 open 切換 'open' class
    if (modal) modal.classList.toggle('open', open);
}

let bgmStarted = false;

function getSavedBgmVolume() {
    const savedVolume = localStorage.getItem('nova_bgm_volume');
    const volumeNumber = savedVolume !== null ? Number(savedVolume) : 18;

    const safeVolume = Math.min(Math.max(volumeNumber, 0), 100);

    return safeVolume / 100;
}

function updateBgmVolume(value) {
    const volumeNumber = Math.min(Math.max(Number(value) || 0, 0), 100);

    localStorage.setItem('nova_bgm_volume', String(volumeNumber));

    const audio = document.getElementById('bgmAudio');
    const volumeText = document.getElementById('bgmVolumeValue');

    if (audio) {
        audio.volume = volumeNumber / 100;
    }

    if (volumeText) {
        volumeText.innerText = `${volumeNumber}%`;
    }
}

function initBgmVolume() {
    const savedVolume = localStorage.getItem('nova_bgm_volume');
    const initialVolume = savedVolume !== null ? Number(savedVolume) : 18;

    const safeVolume = Math.min(Math.max(initialVolume, 0), 100);

    const slider = document.getElementById('bgmVolumeSlider');

    if (slider) {
        slider.value = safeVolume;
    }

    updateBgmVolume(safeVolume);
}

function toggleBgm() {
    const audio = document.getElementById('bgmAudio');
    const btn = document.getElementById('musicToggleBtn');

    if (!audio || !btn) return;

    audio.volume = getSavedBgmVolume();

    if (audio.paused) {
        audio.play()
            .then(() => {
                bgmStarted = true;
                btn.classList.add('playing');
                btn.innerText = t('musicPlaying');
            })
            .catch(() => {
                alert('瀏覽器需要你先點擊一次頁面，才可以播放音樂。');
            });
    } else {
        audio.pause();
        btn.classList.remove('playing');
        btn.innerText = t('musicBtn');
    }
}

/* 顧客第一次點擊網站時，自動嘗試播放一次背景音樂 */
document.addEventListener('click', function startBgmOnce() {
    const audio = document.getElementById('bgmAudio');
    const btn = document.getElementById('musicToggleBtn');

    if (!audio || !btn || bgmStarted) return;

    audio.volume = getSavedBgmVolume();

    audio.play()
        .then(() => {
            bgmStarted = true;
            btn.classList.add('playing');
            btn.innerText = t('musicPlaying');
        })
        .catch(() => {
            // 如果瀏覽器阻止播放，保留按鈕俾用戶自己撳
        });
}, { once: true });

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
function openSizePicker(name, price, sizes) {
    const modal = document.getElementById('sizePickerModal');
    const optionsContainer = document.getElementById('sizePickerOptions');

    if (!modal || !optionsContainer) return;

    pendingProduct = { name, price, sizes };
    pendingSelectedSize = '';

    optionsContainer.innerHTML = '';

    sizes.forEach(size => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'option-btn';
        btn.innerText = size;
        btn.onclick = function () {
            pendingSelectedSize = size;
            optionsContainer.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
        };
        optionsContainer.appendChild(btn);
    });

    modal.classList.add('open');
}
function closeSizePicker() {
    const modal = document.getElementById('sizePickerModal');
    if (modal) modal.classList.remove('open');

    pendingProduct = null;
    pendingSelectedSize = '';
}
function confirmSizeSelection() {
    if (!pendingProduct) return;

    if (pendingSelectedSize === '') {
        alert(t('invalidSize'))
        return;
    }

    addToCart(pendingProduct.name, pendingProduct.price, '-', pendingSelectedSize);
    closeSizePicker();
}

function openImage(src) {
    const lightbox = document.getElementById('imageLightbox');
    const lightboxImg = document.getElementById('lightboxImg');

    if (!lightbox || !lightboxImg) return;

    lightboxImg.src = src;
    lightbox.classList.add('show');
}

function closeImage() {
    const lightbox = document.getElementById('imageLightbox');
    const lightboxImg = document.getElementById('lightboxImg');

    if (!lightbox || !lightboxImg) return;

    lightbox.classList.remove('show');
    lightboxImg.src = '';
}
/* =========================
   購物車
========================= */
// 將商品加入購物車，包含顏色與尺碼選項（預設值為 '-'）
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

    saveCartState();
    updateCartUI();
    toggleCart(true);
}

// 修改購物車內特定商品的數量
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

    saveCartState();
    updateCartUI();
}

// 套用優惠碼並更新折扣金額
function applyPromo() {
    const input = document.getElementById('promoCodeInput');
    const msg = document.getElementById('promoMessage');

    if (!input || !msg) return;

    const code = input.value.trim().toUpperCase();

    if (code === 'NOVA2026') {
        discount = 20;
        msg.innerText = '✅ 優惠碼已套用 -HK$20';
        msg.className = 'promo-message promo-success';
    } else if (code === 'NOVA400') {
        discount = 40;
        msg.innerText = '✅ 優惠碼已套用 -HK$40';
        msg.className = 'promo-message promo-success';
    } else if (code === '') {
        discount = 0;
        msg.innerText = '';
        msg.className = 'promo-message';
    } else {
        discount = 0;
        msg.innerText = '❌ 無效優惠碼';
        msg.className = 'promo-message promo-error';
    }

    // ✅ 同步更新到 localStorage，俾 pay.html 摘要讀取
    localStorage.setItem('nova_discount', JSON.stringify(discount));

    // ✅ 更新購物車 UI（如果有）
    updateCartUI();

    // ✅ 重新渲染 checkout summary
    renderCheckoutPage();
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
    cart = [];
    discount = 0;

    localStorage.removeItem('nova_cart');
    localStorage.removeItem('nova_discount');

    updateCartUI();
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
    const drawerCheckoutBtn = document.getElementById('drawerCheckoutBtn');

    // 計算購物車內所有商品的總數量
    let totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    // 更新所有數量標記的文字
    countBadges.forEach(badge => {
        if (badge) badge.innerText = totalQty;
    });

    // 檢查購物車是否為空
    if (cart.length === 0) {
    if (drawerCheckoutBtn) drawerCheckoutBtn.disabled = true;

    if (container) {
        container.innerHTML = `<p style="text-align: center; color: #999; margin-top: 2rem;">${t('cartEmpty')}</p>`;
    }

    if (subtotalText) subtotalText.innerText = 'HK$ 0';
    if (shippingText) shippingText.innerText = 'HK$ 0';
    if (discountText) discountText.innerText = '-HK$ 0';
    if (totalText) totalText.innerText = 'HK$ 0';

    return;
}
if (drawerCheckoutBtn) drawerCheckoutBtn.disabled = false;

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
                    <div class="cart-item-meta">${t('sizeLabel')}: ${item.size}</div>
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
        shippingText.innerText = shipping === 0 ? t('freeShipping') : `HK$ ${shipping}`;

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

function initScrollAnimations() {
    const animatedElements = document.querySelectorAll(
        'section, .about-text, .about-photo-card, .product-card, .faq-item, .checkout-card, .thankyou-card'
    );

    if (animatedElements.length === 0) return;

    animatedElements.forEach((element, index) => {
        element.classList.add('reveal');
        element.style.transitionDelay = `0s`;
    });

    if (!('IntersectionObserver' in window)) {
        animatedElements.forEach(element => {
            element.classList.add('show');
        });
        return;
    }

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15
    });

    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

/* =========================
   Checkout Page
========================= */


function hasCartItems(items) {
    return Array.isArray(items) && items.some(item => item.qty > 0);
}


function goCheckout() {
    loadCartState();

    if (!hasCartItems(cart)) {
        alert(t('cartCheckoutEmpty'));
        toggleCart(true);
        return;
    }

    saveCartState();
    window.location.href = 'pay.html';
}

function guardCheckoutPage() {
    const checkoutForm = document.getElementById('checkoutForm');

    // 如果唔係 pay.html，就唔做任何事
    if (!checkoutForm) return false;

    const savedCart = JSON.parse(localStorage.getItem('nova_cart')) || [];

    if (!hasCartItems(savedCart)) {
        alert(t('cartCheckoutEmpty'));
        window.location.href = 'index.html#products';
        return true;
    }

    return false;
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
const districtNameTranslations = {
    en: {
        '中西區': 'Central and Western',
        '灣仔': 'Wan Chai',
        '東區': 'Eastern',
        '南區': 'Southern',
        '油尖旺': 'Yau Tsim Mong',
        '深水埗': 'Sham Shui Po',
        '九龍城': 'Kowloon City',
        '黃大仙': 'Wong Tai Sin',
        '觀塘': 'Kwun Tong',
        '葵青': 'Kwai Tsing',
        '荃灣': 'Tsuen Wan',
        '屯門': 'Tuen Mun',
        '元朗': 'Yuen Long',
        '北區': 'North',
        '大埔': 'Tai Po',
        '沙田': 'Sha Tin',
        '西貢': 'Sai Kung',
        '離島': 'Islands',
        '其他': 'Other'
    },
    zh: {}
};

function getDistrictDisplayName(district) {
    if (currentLanguage === 'en') {
        return districtNameTranslations.en[district] || district;
    }

    return district;
}
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
    districtSelect.innerHTML = `<option value="">${t('districtPlaceholder')}</option>`;

    // 預設隱藏「其他地區」輸入框並清空其內容
    if (otherDistrictGroup) otherDistrictGroup.style.display = 'none';
    if (otherDistrict) otherDistrict.value = '';

    // 若找不到對應的區域資料則中止執行
    if (!districtMap[selectedRegion]) return;

    // 根據所選區域，動態產生對應的行政區選項
    districtMap[selectedRegion].forEach(district => {
        const option = document.createElement('option');
        option.value = district;
        option.textContent = getDistrictDisplayName(district);
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
// 提交訂單 → 跳 thankyou.html
async function submitOrder(event) {
    if (event && event.preventDefault) event.preventDefault();

    // ✅ 取得表單欄位
    const name = document.getElementById('customerName');
    const phone = document.getElementById('customerPhone');
    const email = document.getElementById('customerEmail');
    const region = document.getElementById('region');
    const district = document.getElementById('district');
    const otherDistrict = document.getElementById('otherDistrict');
    const addressDetail = document.getElementById('customerAddressDetail');
    const paymentMethod = document.getElementById('paymentMethod');
    const remark = document.getElementById('remark');

    // ✅ 如果任何主要欄位搵唔到，顯示錯誤，方便 debug
    if (!name || !phone || !email || !region || !district || !addressDetail || !paymentMethod) {
        alert('表單欄位載入錯誤，請檢查 HTML id。');
        return false;
    }

    // ✅ 必填檢查
    if (
        name.value.trim() === '' ||
        phone.value.trim() === '' ||
        email.value.trim() === '' ||
        region.value.trim() === '' ||
        district.value.trim() === '' ||
        addressDetail.value.trim() === '' ||
        paymentMethod.value.trim() === ''
    ) {
        alert('請完整填寫所有必填資料。');
        return false;
    }

    // ✅ 如果選擇「其他」，用 otherDistrict；否則用 district
    const finalDistrict =
        district.value === '其他' && otherDistrict && otherDistrict.value.trim() !== ''
            ? otherDistrict.value.trim()
            : district.value;

    // ✅ 從 localStorage 讀取購物車資料與折扣
    const savedCart = JSON.parse(localStorage.getItem('nova_cart')) || [];
    const savedDiscount = JSON.parse(localStorage.getItem('nova_discount')) || 0;

    let subtotal = 0;
    let totalQty = 0;

    savedCart.forEach(item => {
        subtotal += item.price * item.qty;
        totalQty += item.qty;
    });

    // ✅ 計算運費
    let shipping = subtotal >= 400 ? 0 : 30;

    // ✅ 計算總價
    let total = subtotal + shipping - savedDiscount;
    if (total < 0) total = 0;

    // ✅ 建立訂單資料
    const orderInfo = {
        name: name.value.trim(),
        phone: phone.value.trim(),
        email: email.value.trim(),
        address: `${region.value} ${finalDistrict} ${addressDetail.value.trim()}`,
        paymentMethod: paymentMethod.value.trim(),
        remark: remark ? remark.value.trim() : '',
        cart: savedCart,
        totalQty: totalQty,
        subtotal: subtotal,
        shipping: shipping,
        discount: savedDiscount,
        total: total
    };

    // ✅ 儲存最後訂單，thankyou.html 會讀取呢個
    localStorage.setItem('nova_last_order', JSON.stringify(orderInfo));

    // ✅ 清空購物車資料
    cart = [];
    localStorage.removeItem('nova_cart');
    localStorage.removeItem('nova_discount');

    // ✅ 嘗試匯出 Excel；失敗都照樣跳 thankyou
    try {
        await exportOrderToExcel(orderInfo);
    } catch (e) {
        console.error('Excel export failed:', e);
    }

    // ✅ 跳轉到 thank you page
    window.location.href = 'thankyou.html';

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

    loadCartState();
    initBgmVolume();
    if (guardCheckoutPage()) return;
    initScrollAnimations();
    // 渲染結帳頁面內容
    renderCheckoutPage();
    // 渲染感謝頁面內容
    renderThankYouPage();
    // 根據選擇的付款方式顯示對應提示
    showPaymentHint();
    // 更新購物車介面顯示
    updateCartUI();
    applyLanguage()
});