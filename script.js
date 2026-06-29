/* =========================
   NOVA SPORT - Main Script
========================= */

// 全域狀態
// 折扣金額全域計費變數：用來記錄目前套用的優惠碼所扣減的總金額，初始預設值為 0
let discount = 0;
// 運費金額全域計費變數：用來記錄系統根據購物車滿額免運規則核算後的實付運費，初始預設值為 0
let selectedShipping = 0;
// 購物車動態商品陣列容器：用來即時累積、存放顧客點選的所有商品物件（包含識別碼、名稱、尺寸、單價、數量），初始預設為空陣列
let cart = [];

// 暫存商品物件容器：當顧客點擊商品但尚未在彈窗內確認尺寸時，用來臨時掛載該商品的完整欄位資訊，初始預設為空 (null)
let pendingProduct = null;
// 暫存已選尺寸字串容器：用來臨時抓取、存放顧客在彈窗內目前點選的規格尺寸（如：M、XL），初始預設為空字串
let pendingSelectedSize = '';
// 多國語言當前語系狀態變數：初始時優先從瀏覽器本地快取 (localStorage) 中讀取歷史紀錄值，若無紀錄則預設採用 'zh'（繁體中文）
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
        
        paymentHintDefaultTitle: '付款提示',

        paymeHintTitle: 'PayMe 付款提示',
        paymeHintText: '請於提交訂單後使用 PayMe 完成轉帳，並保留付款截圖作確認用途。',

        fpsHintTitle: 'FPS 付款提示',
        fpsHintText: '請使用轉數快 FPS 完成付款，付款後請保留交易參考編號以便核對。',

        alipayHintTitle: 'AlipayHK 付款提示',
        alipayHintText: '請於提交訂單後使用 AlipayHK 完成付款，並保留付款截圖作確認用途。',

        wechatHintTitle: '微信支付 HK 付款提示',
        wechatHintText: '請於提交訂單後使用微信支付 HK 完成付款，並保留付款截圖作確認用途。',

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
        paymentHintDefaultTitle: 'Payment Hint',

        paymeHintTitle: 'PayMe Payment Hint',
        paymeHintText: 'After submitting your order, please complete the transfer with PayMe and keep a payment screenshot for confirmation.',

        fpsHintTitle: 'FPS Payment Hint',
        fpsHintText: 'Please complete the payment using FPS and keep the transaction reference number for checking.',

        alipayHintTitle: 'AlipayHK Payment Hint',
        alipayHintText: 'After submitting your order, please complete the payment with AlipayHK and keep a payment screenshot for confirmation.',

        wechatHintTitle: 'WeChat Pay HK Payment Hint',
        wechatHintText: 'After submitting your order, please complete the payment with WeChat Pay HK and keep a payment screenshot for confirmation.',
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

// 多國語言文字翻譯轉換函式：依據傳入的鍵名 (key)，回傳當前語系對應的翻譯文字
function t(key) {
    // 優先回傳當前選擇語系的文字，若無則降級回傳簡體/繁體中文文字，若皆無則直接吐回原本的鍵名
    return translations[currentLanguage][key] || translations.zh[key] || key;
}

// 執行全網頁多國語言即時重繪渲染的核心函式
function applyLanguage() {
    // 動態變更網頁最外層 HTML 根節點的 lang 屬性，優化 SEO 與瀏覽器語系自動判定（中文設為 zh-Hant-HK，英文設為 en）
    document.documentElement.lang = currentLanguage === 'zh' ? 'zh-Hant-HK' : 'en';

    // 一般文字翻譯：選取網頁中所有帶有 data-i18n 屬性的標籤（如 label / h1 / p / button / option），執行遍歷替換
    document.querySelectorAll('[data-i18n]').forEach(element => {
        // 讀取該標籤身上 data-i18n 屬性所綁定的翻譯字典鍵名
        const key = element.getAttribute('data-i18n');

        // 如果多國語言字典中存在該語系對應的鍵名，則將標籤內部的文字 (innerText) 複寫替換為翻譯後的核心文字
        if (translations[currentLanguage][key]) {
            element.innerText = translations[currentLanguage][key];
        }
    });

    // placeholder 提示文字翻譯：選取網頁中所有帶有 data-i18n-placeholder 屬性的欄位標籤（如 input / textarea），執行遍歷替換
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        // 讀取該標籤身上 data-i18n-placeholder 屬性所綁定的提示文字字典鍵名
        const key = element.getAttribute('data-i18n-placeholder');

        // 如果多國語言字典中存在該語系對應的鍵名，則透過 setAttribute 動態更新輸入框的 placeholder 提示屬性
        if (translations[currentLanguage][key]) {
            element.setAttribute('placeholder', translations[currentLanguage][key]);
        }
    });

    // 抓取頁首導覽列上用來供顧客切換語系的按鈕文字節點
    const languageLabel = document.getElementById('languageLabel');

    // 如果網頁中存在該切換按鈕，則根據反向邏輯即時切換按鈕文字（目前是中文就提示「EN」按鈕，目前是英文就提示「中文」按鈕）
    if (languageLabel) {
        languageLabel.innerText = currentLanguage === 'zh' ? 'EN' : '中文';
    }

// 如果 checkout 頁已經選咗 region，切換語言時重新渲染 district 顯示文字
    // 抓取結帳表單中的「送貨地區（大行政區）」下拉選單節點
    const regionSelect = document.getElementById('region');
    // 抓取結帳表單中的「送貨區域（分區細項）」下拉選單節點
    const districtSelect = document.getElementById('district');

    // 驗證兩個選單皆存在於當前頁面，且顧客已經點選了特定地區（非空值）
    if (regionSelect && districtSelect && regionSelect.value !== '') {
        // 強制重新執行行政區細項的重繪函式，確保切換語系時分區中文名（如：旺角）與英文名（如：Mong Kok）能即時同步翻譯
        updateDistrictOptions();
    }

    // 呼叫全站購物車介面刷新函式，確保購物車側邊欄或結帳摘要內的商品名稱、計費標籤同步切換語系
    updateCartUI();
// 正式閉合整個應用語言渲染的 applyLanguage 函式
}


// 供頁首或頁尾切換語言按鈕點擊時觸發的核心交互函式
function toggleLanguage() {
    // 執行語系狀態的反向切換：如果目前是 'zh'（中文）就轉為 'en'（英文），反之亦然
    currentLanguage = currentLanguage === 'zh' ? 'en' : 'zh';
    // 將最新切換完成的語系代碼，即時同步寫入瀏覽器的本地快取，以便顧客下次到訪時能自動記住語系設定
    localStorage.setItem('nova_language', currentLanguage);
    // 重新呼叫全網頁多國語言渲染重繪函式，順暢地將全站文字刷新為新語系
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
// 將目前購物車商品列表與優惠碼折扣狀態同步寫入瀏覽器本地快取 (localStorage) 的唯讀持久化函式
function saveCartState() {
    // 將購物車陣列序列化為 JSON 字串，並以 'nova_cart' 為鍵名寫入本地快取
    localStorage.setItem('nova_cart', JSON.stringify(cart));
    // 將當前的折扣數值序列化為 JSON 字串，並以 'nova_discount' 為鍵名寫入本地快取
    localStorage.setItem('nova_discount', JSON.stringify(discount));
}

// 網頁初始化時，從瀏覽器本地快取自動載入歷史購物車與折扣狀態的恢復函式
function loadCartState() {
    // 讀取本地快取中的購物車 JSON 字串並還原成陣列，若無快取則回傳空陣列（[]）
    const savedCart = JSON.parse(localStorage.getItem('nova_cart')) || [];
    // 讀取本地快取中的折扣 JSON 字串並還原成數值，若無快取則預設回傳 0
    const savedDiscount = JSON.parse(localStorage.getItem('nova_discount')) || 0;

    // 將讀取出來的歷史數據重新指派給全域的購物車變數容器
    cart = savedCart;
    // 將讀取出來的歷史數據重新指派給全域的折扣變數容器
    discount = savedDiscount;
}

// 切換尺寸選擇視窗的顯示與隱藏
function toggleModal(open) {
    // 取得尺寸選擇視窗元素
    const modal = document.getElementById('sizeModal');
    // 若視窗存在，依據參數 open 切換 'open' class
    if (modal) modal.classList.toggle('open', open);
}

// 設定布林值變數，用來標記背景音樂是否已經正式啟動播放，初始預設為未啟動（false）
let bgmStarted = false;


// 將當前景頁面背景音樂的播放進度與播放狀態同步寫入本地快取的記憶函式，用以支援跨頁面續播
function saveBgmState() {
    // 抓取網頁內部的原生音訊 DOM 節點
    const audio = document.getElementById('bgmAudio');

    // 如果當前頁面不存在背景音樂音訊標籤，則直接中斷執行防錯
    if (!audio) return;

    // 將目前音訊精確到毫秒的播放進度秒數，轉為字串並以 'nova_bgm_time' 寫入快取
    localStorage.setItem('nova_bgm_time', String(audio.currentTime || 0));
    // 判斷目前音訊是否處於暫停狀態，轉為字串以 'nova_bgm_paused' 為鍵名寫入快取記憶
    localStorage.setItem('nova_bgm_paused', audio.paused ? 'true' : 'false');
}


// 從本地快取中安全獲取並換算出標準音訊 volume 範圍（0.0 至 1.0）的控制函式
function getSavedBgmVolume() {
    // 從快取中抓取使用者上次調整的歷史音量數值
    const savedVolume = localStorage.getItem('nova_bgm_volume');
    // 如果快取不為空則轉為數字類型，否則採用品牌預設的溫和音量 18%
    const volumeNumber = savedVolume !== null ? Number(savedVolume) : 18;

    // 呼叫數學公式進行極值邊界防護：強制將音量限制在 0 到 100 的安全範圍內，防止異常爆音
    const safeVolume = Math.min(Math.max(volumeNumber, 0), 100);

    // 將 0-100 的百分比網頁數值除以 100，換算出原生 audio 標籤所需的 0.0 - 1.0 浮點數音量值並回傳
    return safeVolume / 100;
}

// 當使用者拖曳音量滑桿欄位時即時觸發的音量變更與更新函式
function updateBgmVolume(value) {
    // 將拖曳獲取的數值轉為數字，並透過夾擠公式強制限制在 0-100 的合法數值區間內
    const volumeNumber = Math.min(Math.max(Number(value) || 0, 0), 100);

    // 將最新調整好的 0-100 音量數值即時寫入本地快取記憶中
    localStorage.setItem('nova_bgm_volume', String(volumeNumber));

    // 抓取網頁中的原生音訊節點
    const audio = document.getElementById('bgmAudio');
    // 抓取網頁中用來印出百分比數字（如：18%）的文字顯示節點
    const volumeText = document.getElementById('bgmVolumeValue');

    // 如果音訊標籤存在，將換算後的 0.0-1.0 浮點數音量賦予給音訊的 volume 屬性完成硬體音量變更
    if (audio) {
        audio.volume = volumeNumber / 100;
    }

    // 如果數字提示標籤存在，利用樣式字串即時更新畫面上印出的百分比文字內容
    if (volumeText) {
        volumeText.innerText = `${volumeNumber}%`;
    }
}

// 網頁載入時自動初始化滑桿位置與音訊預設音量的配置函式
function initBgmVolume() {
    // 從本地快取中提取歷史音量設定
    const savedVolume = localStorage.getItem('nova_bgm_volume');
    // 若無歷史快取則採用全站初始的預設值 18
    const initialVolume = savedVolume !== null ? Number(savedVolume) : 18;

    // 透過極值邊界夾擠公式確保初始化數值絕對安全合規
    const safeVolume = Math.min(Math.max(initialVolume, 0), 100);

    // 抓取網頁上的 HTML5 原生 Range 範圍滑桿欄位節點
    const slider = document.getElementById('bgmVolumeSlider');

    // 如果滑桿存在於當前網頁中，則將滑桿的滑塊控制指針強制定位到對應的歷史數值位置上
    if (slider) {
        slider.value = safeVolume;
    }

    // 呼叫更新函式，讓音樂標籤的硬體音量與畫面的百分比數字同步刷新
    updateBgmVolume(safeVolume);
}

// 供顧客點擊音樂懸浮按鈕時，切換播放與暫停狀態的核心互動控制函式
function toggleBgm() {
    // 抓取音訊標籤節點
    const audio = document.getElementById('bgmAudio');
    // 取得音樂控制按鈕節點
    const btn = document.getElementById('musicToggleBtn');

    // 如果節點不全則直接返回中斷執行，防止報錯
    if (!audio || !btn) return;

    // 播放前，先從快取換算並同步使用者上次設定的最新音量值
    audio.volume = getSavedBgmVolume();

    // 狀態分支一：如果目前音樂處於暫停狀態，則執行播放流程
    if (audio.paused) {
        // 呼叫原生 HTML5 的非同步 .play() 音訊播放方法
        audio.play()
            // 當瀏覽器核准並成功啟動音訊播放時執行的 Promise 成功回調流程
            .then(() => {
                // 將全域標記變數切換為已播放狀態
                bgmStarted = true;
                // 為音樂按鈕注入炫酷的外圍雷達光圈呼吸擴散動畫類別 (.playing)
                btn.classList.add('playing');
                // 利用多國語言字典方法，動態重繪更新按鈕內部印出的中/英文字態文字為播放中
                btn.innerText = t('musicPlaying');

                // 更新本地快取，將暫停狀態註記複寫並標註為開啟（'false'）
                localStorage.setItem('nova_bgm_paused', 'false');
                // 呼叫儲存進度方法，確保秒數與狀態完成同步
                saveBgmState();
            })
            // 當因為瀏覽器安全策略（阻斷網頁音訊未交互自動播放機制）導致啟動失敗時的 Promise 捕獲回調
            .catch(() => {
                // 跳出友善的防錯視窗，提示顧客需與網頁產生至少一次點擊互動才能允許解鎖播放音訊
                alert('瀏覽器需要你先點擊一次頁面，才可以播放音樂。');
            });
    // 狀態分支二：如果目前音樂正在播放，則執行暫停流程
    } else {
        // 呼叫原生暫停方法
        audio.pause();
        // 立即移除按鈕外圍的雷達發光呼吸擴散動畫類別，使其回歸普通按鈕外觀
        btn.classList.remove('playing');
        // 利用多國語言字典方法，將按鈕文字刷新重置回普通的初始音樂標籤文字
        btn.innerText = t('musicBtn');

        // 更新本地快取，將暫停狀態註記複寫並標註為已暫停（'true'）
        localStorage.setItem('nova_bgm_paused', 'true');
        // 呼叫儲存進度方法，同步目前的歷史秒數與狀態
        saveBgmState();
    }
}
// 網頁重整或跨頁跳轉後，自動讀取快取並在背景無縫恢復續播歷史進度的初始化監聽函式
function initBgmResume() {
    // 抓取音訊標籤節點
    const audio = document.getElementById('bgmAudio');
    // 取得音樂控制按鈕節點
    const btn = document.getElementById('musicToggleBtn');

    // 如果節點不完整則直接中斷防錯
    if (!audio || !btn) return;

    // 恢復前，先從快取還原並指派使用者上次設定的最新音量值
    audio.volume = getSavedBgmVolume();

    // 從本地快取讀取上次跨頁離開前記錄的精確音軌播放秒數，若無則歸零
    const savedTime = Number(localStorage.getItem('nova_bgm_time')) || 0;
    // 從本地快取讀取上次離開前的暫停狀態布林字串
    const wasPaused = localStorage.getItem('nova_bgm_paused') === 'true';

    // 針對音訊監聽「中繼資料已加載完成 (loadedmetadata)」的核心原生事件，確保音樂總長度等欄位就緒後才執行進度跳轉
    audio.addEventListener('loadedmetadata', function () {
        // 防錯判定：如果歷史秒數大於零，且小於這首音樂的總長度秒數，則代表進度條完全合法可用
        if (savedTime > 0 && savedTime < audio.duration) {
            // 強制將背景音軌的當前時間 (currentTime) 座標指針，直接一鍵跳轉到歷史快取的秒數位置，完美達成無縫續播
            audio.currentTime = savedTime;
        }

               // 狀態分支：如果快取歷史顯示顧客上次離開前，音樂是處於播放狀態（並非已暫停狀態）
        if (!wasPaused) {
            // 嘗試自動呼叫原生 HTML5 的非同步 .play() 方法，在網頁初始化時自動重啟播放
            audio.play()
                // 當瀏覽器安全策略允許並成功啟動跨頁面自動背景音樂續播時執行的流程
                .then(() => {
                    // 將全域標記變數切換為已開啟播放狀態
                    bgmStarted = true;
                    // 同步為音樂控制按鈕重新注入炫酷的外圍雷達光圈呼吸擴散動畫類別 (.playing)
                    btn.classList.add('playing');
                    // 利用多國語言字典方法，動態重繪更新按鈕內部印出的文字內容為播放中
                    btn.innerText = t('musicPlaying');
                })
                // 當因為瀏覽器安全策略（阻斷網頁音訊未交互自動播放機制）導致自動播放失敗時的 Promise 捕獲回調
                .catch(() => {
                    // 瀏覽器阻止自動播放時，保留按鈕俾用戶自己撳
                    // 立即移除按鈕外圍的雷達發光呼吸擴散動畫類別，使其回歸普通按鈕外觀
                    btn.classList.remove('playing');
                    // 利用多國語言字典方法，將按鈕文字刷新重置回普通的初始音樂標籤文字，方便顧客手動點擊解鎖
                    btn.innerText = t('musicBtn');
                });
        }
    // 正式閉合針對 loadedmetadata 中繼資料加載事件的原生事件監聽回調函式與大括號
    });

    // 針對音訊監聽「播放進度異動 (timeupdate)」的原生事件，只要音樂在動，每秒就會高頻觸發數十次進行計時同步
    audio.addEventListener('timeupdate', function () {
        // 即時將目前最新的精確秒數進度字串，高頻刷新並寫入本地快取，防止網頁無故崩潰或閃退時進度遺失
        localStorage.setItem('nova_bgm_time', String(audio.currentTime || 0));
    });

    // 針對全域視窗監聽「網頁準備跳轉或關閉卸載 (beforeunload)」的原生事件，在離開前做最後一次狀態存檔
    window.addEventListener('beforeunload', saveBgmState);
// 正式閉合整個自動讀取快取並在背景無縫恢復續播歷史進度的 initBgmResume 初始化函式
}


/* 顧客第一次點擊網站時，自動嘗試播放一次背景音樂 */
// 針對整個 HTML 網頁文件監聽滑鼠點擊或觸控點按事件，用以解除瀏覽器防未交互爆音的安全限制
document.addEventListener('click', function startBgmOnce() {
    // 抓取網頁內部的原生音訊 DOM 節點
    const audio = document.getElementById('bgmAudio');
    // 取得音樂控制按鈕節點
    const btn = document.getElementById('musicToggleBtn');

    // 防錯判定：如果音樂節點不存在、或音樂在網頁初始化時其實就已經順利續播啟動成功了，則立即中斷執行
    if (!audio || !btn || bgmStarted) return;

    // 自動抓取並指派顧客上次歷史儲存的預設音量大小
    audio.volume = getSavedBgmVolume();

    // 呼叫原生 HTML5 的非同步 .play() 方法，藉由這次顧客點擊網頁的交互順暢通電啟動音訊
    audio.play()
        // 當解鎖成功、音樂正式亮起並開始播放時執行的 Promise 成功回調流程
        .then(() => {
            // 將全域標記變數切換為已開啟播放狀態，避免後續重複執行點擊觸發
            bgmStarted = true;
            // 為音樂控制按鈕注入外圍雷達光圈呼吸擴散動畫類別 (.playing)
            btn.classList.add('playing');
            // 利用多國語言字典方法，動態重繪更新按鈕內部印出的中/英文字態文字為播放中
            btn.innerText = t('musicPlaying');
        })
        // 當因為瀏覽器安全策略導致啟動失敗時的 Promise 捕獲回調
        .catch(() => {
            // 如果瀏覽器阻止播放，保留按鈕俾用戶自己撳
            // 保持空白不作為，靜靜讓按鈕維持原樣，回歸並留給顧客後續自行去手動點擊音樂按鈕觸發
        });
// 關鍵效能優化：設定 { once: true } 參數，確保這個「解鎖點擊監聽器」在全網頁只會被觸發執行唯一的一次，執行完畢後會被瀏覽器自動從記憶體中完全銷毀
}, { once: true });

/* =========================
   商品規格選擇
========================= */
// 選擇規格選項功能
// 處理多個選項按鈕（如不同顏色或一般按鈕群組）的選取狀態切換函式
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
// 當顧客點擊購買按鈕時，動態開啟規格挑選彈窗並渲染多個尺碼按鈕的控制函式
function openSizePicker(name, price, sizes) {
    // 抓取購物規格挑選彈窗的遮罩外層節點
    const modal = document.getElementById('sizePickerModal');
    // 抓取用來動態塞入多個尺碼按鈕的空白 HTML 容器節點
    const optionsContainer = document.getElementById('sizePickerOptions');

    // 如果頁面中找不到這兩個關鍵節點則立即中斷執行，防止拋出 null 報錯
    if (!modal || !optionsContainer) return;

    // 將目前選購商品的名稱、價格、可選尺碼陣列以物件格式掛載到全域的暫存商品容器中
    pendingProduct = { name, price, sizes };
    // 預設重置清空目前已選尺寸的字串快取
    pendingSelectedSize = '';

    // 一鍵清空上一次動態塞入的舊商品按鈕結構，防止內容重複重疊
    optionsContainer.innerHTML = '';

    // 遍遍历該商品傳入的所有可選尺碼陣列（如：['S', 'M', 'L']）
    sizes.forEach(size => {
        // 在記憶體中建立一個全新的 HTML 原生 <button> 按鈕節點
        const btn = document.createElement('button');
        // 設定按鈕的類型屬性為普通按鈕，防止在表單內誤觸發同步提交行為
        btn.type = 'button';
        // 設定按鈕的 class 類別名稱，套用預設的膠囊按鈕外觀樣式
        btn.className = 'option-btn';
        // 將目前的尺碼文字（如：M）直接寫入按鈕內部的文字輪廓中
        btn.innerText = size;
        // 綁定該尺碼按鈕的專屬點擊監聽事件
        btn.onclick = function () {
            // 當顧客點選此尺碼時，即時將當前尺寸字串儲存到全域暫存變數中
            pendingSelectedSize = size;
            // 先清除當前容器內所有尺碼按鈕的 selected 選中高亮橘色外框類別
            optionsContainer.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
            // 為當前被顧客點擊點選的這個按鈕單補上 selected 選中高亮樣式類別
            btn.classList.add('selected');
        };
        // 將這個在記憶體中配置、綁定好事件的全新尺碼按鈕，正式塞入畫面的空白按鈕容器中
        optionsContainer.appendChild(btn);
    });

    // 為規格彈窗主容器注入 open 類別，使其觸發 CSS 的淡入兼 3D 跳出動畫正式現形
    modal.classList.add('open');
}
// 關閉尺寸規格選取彈窗並清空暫存數據的控制函式
function closeSizePicker() {
    // 抓取規格挑選彈窗節點
    const modal = document.getElementById('sizePickerModal');
    // 如果彈窗存在，立即移除 open 類別使其從畫面中隱藏
    if (modal) modal.classList.remove('open');

    // 徹底重置並還原全域的暫存商品與尺寸快取容器，歸零釋放記憶體空間
    pendingProduct = null;
    pendingSelectedSize = '';
}
// 顧客在規格彈窗中點擊「確認加入購物車」提交按鈕時執行的核心檢驗函式
function confirmSizeSelection() {
    // 防錯機制：如果因為極端錯誤導致沒有暫存的商品資訊，則直接中斷不執行
    if (!pendingProduct) return;

    // 如果全域暫存尺寸字串依舊為空，代表顧客尚未點選任何一個尺碼按鈕
    if (pendingSelectedSize === '') {
        // 調用多國語言字典方法，彈出友善的防錯警告提示視窗（請選擇尺碼）
        alert(t('invalidSize'))
        return;
    }

    // 通過規格選取驗證後，正式呼叫底層購物車數據推入函式，傳入名稱、單價、預設顏色槓以及選好的特定尺碼
    addToCart(pendingProduct.name, pendingProduct.price, '-', pendingSelectedSize);
    // 順暢關閉規格挑選彈窗並重置快取暫存
    closeSizePicker();
// 正式閉合 confirmSizeSelection 提交驗證函式的結束大括號
}

// 點擊服飾商品封面圖時，觸發滿版高清圖片燈箱彈窗的控制函式
function openImage(src) {
    // 抓取全螢幕大圖燈箱的遮罩外層節點
    const lightbox = document.getElementById('imageLightbox');
    // 抓取燈箱內嵌用來呈現高清產品圖的 <img> 標籤節點
    const lightboxImg = document.getElementById('lightboxImg');

    // 進行節點安全性驗證，防範 null 崩潰報錯
    if (!lightbox || !lightboxImg) return;

    // 將顧客點擊的圖片網址來源 (src)，直接寫入燈箱 <img> 標籤的 src 屬性上，啟動高清大圖下載
    lightboxImg.src = src;
    // 為燈箱外殼容器注入 show 類別，使其觸發 CSS 的全域變暗聚焦與大圖縮放動畫
    lightbox.classList.add('show');
}

// 點擊外圍或右上方關閉按鈕時，隱藏全螢幕大圖燈箱的控制函式
function closeImage() {
    // 抓取全螢幕大圖燈箱外殼節點
    const lightbox = document.getElementById('imageLightbox');
    // 抓取大圖燈箱內嵌的 <img> 標籤節點
    const lightboxImg = document.getElementById('lightboxImg');

    // 進行節點安全性驗證
    if (!lightbox || !lightboxImg) return;

    // 立即移除 show 類別，平滑隱藏滿版深色遮罩與大圖
    lightbox.classList.remove('show');
    // 關鍵：將 <img> 的 src 圖片網址路徑完全清空歸零，防止下一次打開其它圖片時畫面產生短暫的舊圖殘影閃爍
    lightboxImg.src = '';
}
/* =========================
   購物車
========================= */
// 將商品加入購物車，包含顏色與尺碼選項（預設值為 '-'）
// 將指定規格的商品推入全域購物車陣列的底層數據核心運算函式
function addToCart(name, price, color = '-', size = '-') {
    // 運用陣列高階語法 .find()，精確搜尋現有的購物車中是否已經存在一模一樣（名稱、顏色、尺寸完全相同）的商品卡片
    const existingItem = cart.find(item =>
        item.name === name &&
        item.color === color &&
        item.size === size
    );

    // 狀態分支一：如果找到了完全相同的商品卡片
    if (existingItem) {
        // 直接在該規格商品的既有數據物件上，將累計選購數量 (qty) 自動加 1 件，不重覆新增卡片
        existingItem.qty += 1;
    // 狀態分支二：如果購物車中完全沒有這款相同規格的商品，則視為全新獨立品項
    } else {
        // 使用陣列 .push() 方法，為全域 cart 容器尾端塞入一個全新的獨立規格商品結構物件
        cart.push({
            name: name,     // 寫入商品名稱
            price: price,   // 寫入商品單價
            color: color,   // 寫入商品選定顏色（預設為無選取槓）
            size: size,     // 寫入商品選定尺碼
            qty: 1          // 初始選購數量設定為 1 件
        });
    }

    // 呼叫快取儲存函式，將最新異動後的購物車陣列即時寫入本地持久化快取
    saveCartState();
    // 呼叫全站購物車 UI 重繪刷新函式，讓畫面上印出的商品清單、小計、總金額、 badge 件數立刻同步刷新
    updateCartUI();
    // 核心流暢交互：商品推入成功後，自動呼叫切換函式將右側滑入式購物車抽屜側邊欄優雅展開，給顧客強烈而明確的加入反饋
    toggleCart(true);
}

// 修改購物車內特定商品的數量
// 顧客在側邊欄購物車內點擊商品卡片上的「+」或「-」按鈕時即時觸發的數量調整函式
function changeQty(name, color, size, amount) {
    // 運用陣列 .find() 語法，精確定位目前正在被操作增減數量的特定規格商品卡片物件
    const item = cart.find(item =>
        item.name === name &&
        item.color === color &&
        item.size === size
    );

    // 安全防護：如果購物車內找不到該商品（理論上不應該發生），則立即中斷回傳，防止程式碼崩潰
    if (!item) return;

    // 將目前卡片的既有數量 (qty) 與點擊傳入的變動幅度值（+1 或 -1）進行算術加總
    item.qty += amount;

    // 狀態分支：如果顧客連續點擊「-」導致該規格商品的累計選購件數降到 0 件或以下時，代表顧客想移除此商品
    if (item.qty <= 0) {
        // 運用陣列高階過濾器 .filter() 方法，將符合「名稱、顏色、尺寸完全相同」的這張卡片從 cart 陣列中強行剔除淘汰，其餘商品保留
        cart = cart.filter(i =>
            !(i.name === name && i.color === color && i.size === size)
        );
    }

    // 將數量調整（或移除商品）後的最新購物車狀態同步寫入本地快取持久化
    saveCartState();
    // 立即重新渲染重繪全網頁購物車的卡片元件、小計、免運門檻與折扣
    updateCartUI();
}

// 套用優惠碼並更新折扣金額
// 當顧客在結帳側邊欄或結帳獨立頁面點擊「套用優惠碼」按鈕時觸發的折扣驗證函式
function applyPromo() {
    // 抓取網頁中供顧客輸入英文優惠碼的文字 input 欄位節點
    const input = document.getElementById('promoCodeInput');
    // 抓取用來在輸入框下方印出綠色成功文字、或紅色失敗報錯說明的提示訊息容器節點
    const msg = document.getElementById('promoMessage');

    // 安全防護：如果網頁中找不到輸入框或訊息提示容器，則立即中斷執行防報錯
    if (!input || !msg) return;

    // 獲取顧客輸入的代碼文字，使用 .trim() 剔除兩端多餘空格，並用 .toUpperCase() 強制將字母統一轉換為大寫
    const code = input.value.trim().toUpperCase();

    // 狀態分支一：若顧客輸入的是 'NOVA2026'
    if (code === 'NOVA2026') {
        // 設定全域折扣金額為 20 元
        discount = 20;
        // 在輸入框下方動態印出對應的綠色成功套用提示文字
        msg.innerText = '✅ 優惠碼已套用 -HK$20';
        // 同步更改該文字的 class 類別名稱，使其套用 CSS 的綠色字體樣式
        msg.className = 'promo-message promo-success';
    // 狀態分支二：若顧客輸入的是 'NOVA400'
    } else if (code === 'NOVA400') {
        // 設定全域折扣金額為 40 元
        discount = 40;
        // 印出對應的綠色成功套用提示文字
        msg.innerText = '✅ 優惠碼已套用 -HK$40';
        // 套用 CSS 的綠色字體樣式
        msg.className = 'promo-message promo-success';
    // 狀態分支三：若顧客將欄位內容清空刪除
    } else if (code === '') {
        // 折扣金額歸零
        discount = 0;
        // 清空下方提示框的文字內文
        msg.innerText = '';
        // 還原為預設的普通樣式類別
        msg.className = 'promo-message';
    // 狀態分支四：若輸入任何非上述預設好的錯誤或無效優惠券代碼
    } else {
        // 折扣金額強制歸零
        discount = 0;
        // 在輸入框下方動態印出紅色失敗報錯說明文字
        msg.innerText = '❌ 無效優惠碼';
        // 同步更改 class 類別名稱，使其套用 CSS 的紅色字體樣式
        msg.className = 'promo-message promo-error';
    }

    // ✅ 同步更新到 localStorage，俾 pay.html 摘要讀取
    // 將最新算出的折扣數字序列化為 JSON 字串，即時同步寫入本地快取，以便結帳獨立網頁能跨頁讀取
    localStorage.setItem('nova_discount', JSON.stringify(discount));

    // ✅ 更新購物車 UI（如果有）
    // 即時刷新右側滑入式購物車側邊欄的金額試算明細與數字
    updateCartUI();

    // ✅ 重新渲染 checkout summary
    // 即時刷新獨立結帳頁面（pay.html）右側卡片的最新訂單計費摘要與實付總計金額
    renderCheckoutPage();
}



// ✅ 當頁面載入後先執行（避免報錯）
// 監聽全網頁文件主體 HTML 骨架與節點完全載入就緒的原生 DOMContentLoaded 事件
document.addEventListener('DOMContentLoaded', function () {

    // 抓取網頁內部的優惠代碼文字 input 輸入欄位節點
    const promoInput = document.getElementById('promoCodeInput');

    // ✅ 確保輸入框存在先做
    // 進行節點安全性驗證，確保目前頁面有這個欄位時才執行後續事件監聽綁定
    if (promoInput) {

        // ✅ 當用戶打字時觸發
        // 為優惠碼輸入框綁定原生的 input 即時監聽事件，顧客每打一個字、或按刪除鍵時皆會即時觸發
        promoInput.addEventListener('input', function () {

            // 抓取文字下方的提示訊息說明容器節點
            const msg = document.getElementById('promoMessage');

            // ✅ 如果輸入框變空 → 清除提示
            // 顧客如果透過倒退鍵把輸入框內的優惠碼全部刪除清空
            if (this.value === '') {
                // 立即在打字的當下將原本的「無效優惠碼」等紅色或綠色提示文字全部擦除，提供乾淨優雅的 UI 體驗
                msg.innerText = '';
            }
        });
    }
});
// 點擊「清空購物車」按鈕時執行的一鍵格式化與還原核心重置函式
function clearCart() {
    // 將全域購物車動態商品陣列完全清空還原為空陣列
    cart = [];
    // 將全域的促銷折扣減免數值強制清零歸 0
    discount = 0;

    // 徹底從瀏覽器的本地快取記憶體中將歷史商品卡片資料庫完整銷毀刪除
    localStorage.removeItem('nova_cart');
    // 徹底從瀏覽器的本地快取記憶體中將歷史折扣數值完整銷毀刪除
    localStorage.removeItem('nova_discount');

    // 立即呼叫介面重繪重新計算更新函式，讓畫面的金額數字全部一秒歸零
    updateCartUI();
    // 順暢呼叫切換函式，將右側購物車抽屜側邊欄自動向右滑出隱藏關閉
    toggleCart(false);
}

// 負責重繪、核算、並將最新數據刷新到右側購物車側邊欄介面的核心渲染函式
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
    // 抓取購物車側邊欄最底部的「前往結帳」提交按鈕節點
    const drawerCheckoutBtn = document.getElementById('drawerCheckoutBtn');

    // 計算購物車內所有商品的總數量
    // 運用陣列高階降維方法 .reduce()，精確走訪每件商品並將選購件數 (qty) 加總累加
    let totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    // 更新所有數量標記的文字
    // 遍歷電腦端與手機端選單上的購物車小紅點泡泡，將最新件數刷新印出
    countBadges.forEach(badge => {
        // 進行節點防護驗證後，替換其內部顯示的數字內容
        if (badge) badge.innerText = totalQty;
    });

    // 檢查購物車是否為空
    // 狀態分支：如果購物車陣列長度為 0，代表目前裡面空空如也，沒有選購任何一件服飾
    if (cart.length === 0) {
    // 立即將側邊欄底部的「前往結帳」按鈕切換為 disabled=true 禁用狀態，防範空車點擊破壞流程
    if (drawerCheckoutBtn) drawerCheckoutBtn.disabled = true;

    // 如果頁面中存在購物車商品累積容器節點
    if (container) {
        // 利用多國語言字典方法動態翻譯，並在容器內改為寫入、渲染出大字居中的「購物車目前是空的」專屬樣式中文提示
        container.innerHTML = `<p style="text-align: center; color: #999; margin-top: 2rem;">${t('cartEmpty')}</p>`;
    }

    // 將下方計費面板的所有小計、運費、優惠及實付應付金額通通強制刷新重置為 0 元狀態
    if (subtotalText) subtotalText.innerText = 'HK$ 0';
    if (shippingText) shippingText.innerText = 'HK$ 0';
    if (discountText) discountText.innerText = '-HK$ 0';
    if (totalText) totalText.innerText = 'HK$ 0';

    // 執行早期返回 (Early Return)，直接中斷跳出函式，避免執行後續多餘的循環拼接程式碼
    return;
}
// 反向狀態分支：若購物車內不為空、有至少一件服飾存在，則立即解鎖「前往結帳」按鈕使其恢復可點擊狀態
if (drawerCheckoutBtn) drawerCheckoutBtn.disabled = false;

 // 初始化用來儲存購物車 HTML 字串的變數
    // 預先建立一個空的字串容器，準備用來組裝拼接多個商品卡片的 HTML 結構
    let html = '';
    // 初始化小計金額為 0
    // 預先宣告小計金額全域容器為 0，準備計算當前購物車內所有衣服的累積總價
    let subtotal = 0;

    // 遍歷購物車內的每一項商品進行處理
    // 遍歷 cart 陣列內的每件規格衣服物件，準備將它們逐一建構成實體卡片渲染到畫面上
    cart.forEach(item => {
        // 計算該項商品的總價 (單價 * 數量)
        // 將該件服飾的單價金額乘以當前的選購累積數量，算出此單品品項的加總金額
        const itemTotal = item.price * item.qty;
        // 將該項商品的總價累加到小計中
        // 將算出的品項總價，即時累加到本次重繪的小計金額計費變數內部
        subtotal += itemTotal;

        // 組裝商品的 HTML 結構字串
        // 運用 JavaScript 特有的反引號模板字串語法，將衣服名稱、尺寸規格、金額及加減數量按鈕組裝拼接進 html 容器中
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
    // 正式結束 cart.forEach 商品卡片字串拼接迴圈
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

// 初始化全網頁滾動時動態淡入上浮顯現高級特效的核心配置函式
function initScrollAnimations() {
    // 選取全站所有需要套用滾動顯現特效的核心版面區塊與元件節點（包含區塊、故事卡片、商品、問答及表單外殼）
    const animatedElements = document.querySelectorAll(
        'section, .about-text, .about-photo-card, .product-card, .faq-item, .checkout-card, .thankyou-card'
    );

    // 安全防護早期返回：如果當前網頁頁面中找不到任何需要加載動畫的元件，則立即中斷不執行
    if (animatedElements.length === 0) return;

    // 遍歷所有篩選出來的版面節點，為其注入初始化的隱藏狀態
    animatedElements.forEach((element, index) => {
        // 為元件強制補上帶有透明度為 0 且位移 34px 的 .reveal 預設隱藏控制樣式類別
        element.classList.add('reveal');
        // 設定初始的動畫延遲時間為 0 秒，確保元件滾動進入視窗時能立即產生流暢的視覺反饋
        element.style.transitionDelay = `0s`;
    });

    // 降級防錯機制：如果顧客使用的屬於極老舊的瀏覽器、內部不支援現代網頁核心的 IntersectionObserver API
    if (!('IntersectionObserver' in window)) {
        // 遍歷所有節點，直接為其強行補上完全不透明且座標復位的 .show 顯現樣式類別，確保內容完整展示不卡死白畫面
        animatedElements.forEach(element => {
            element.classList.add('show');
        });
        // 跳出中斷函式，結束降級防護
        return;
    }

    // 建立一個高階的原生網頁視窗交叉點狀態監聽器物件 (IntersectionObserver)
    const observer = new IntersectionObserver(function (entries) {
        // 遍歷所有目前觸發視窗座標異動狀態的追蹤元件陣列
        entries.forEach(entry => {
            // 當判定條件成立：該元件目前已經正式滾動進入顧客的手機或電腦螢幕可視區域範圍內
            if (entry.isIntersecting) {
                // 立即為該曝光的實體元件節點注入 .show 樣式類別，平滑觸發 CSS 0.75 秒的淡入兼上浮高級入場動效
                entry.target.classList.add('show');
                // 核心性能與記憶體優化：一旦該元件順利完成入場顯現後，立即呼叫解綁方法徹底將其從監聽器中銷毀剔除，防止重複觸發浪費記憶體
                observer.unobserve(entry.target);
            }
        });
    }, {
        // 設定交叉觸發的嚴格閥值比率：當元件高度有 15% (0.15) 跨入瀏覽器視窗時，才正式啟動淡入入場
        threshold: 0.15
    });

    // 啟動全網頁自動監聽流程
    animatedElements.forEach(element => {
        // 將遍歷出來的每一個版面、商品、卡片節點，逐一推入建構好的監聽器物件中進行全時曝光監控
        observer.observe(element);
    });
// 正式閉合整個 initScrollAnimations 動態滾動動畫函式的結束大括號
}

/* =========================
   Checkout Page
========================= */


// 核心驗證函式：精確檢驗傳入的資料是否為合法的陣列，且內含至少一件選購數量大於 0 的商品
function hasCartItems(items) {
    // 運用 Array.isArray 確保資料格式正確，並搭配 .some() 高階語法快速判定是否有任一卡片的數量大於 0
    return Array.isArray(items) && items.some(item => item.qty > 0);
}


// 顧客點擊購物車抽屜內「前往結帳」按鈕時觸發的過渡導引與狀態判定函式
function goCheckout() {
    // 跳轉前，強制重新從本地快取同步最新的購物車與折扣數據庫狀態
    loadCartState();

    // 安全防護分支：如果透過全域方法判定目前購物車其實空空如也、不含任何有效商品
    if (!hasCartItems(cart)) {
        // 調用多國語言字典方法，彈出友善的防錯警告視窗（例如：購物車目前是空的，無法前往結帳）
        alert(t('cartCheckoutEmpty'));
        // 核心交互補正：強行展開購物車側邊欄抽屜，明確引導顧客查看當前狀態
        toggleCart(true);
        // 執行早期返回，強行阻斷後續的跳轉流程
        return;
    }

    // 通過有貨驗證後，將目前的狀態最新持久化寫入本地快取中
    saveCartState();
    // 透過網頁網址控制項，將顧客無縫跳轉移送至實體的 pay.html 安全結帳獨立網頁中
    window.location.href = 'pay.html';
}

// 專門部署在獨立結帳頁面（pay.html）頂層、用來封鎖防止直接輸入網址進行惡意繞過的核心安全守衛函式
function guardCheckoutPage() {
    // 抓取結帳頁面專屬的表單實體節點
    const checkoutForm = document.getElementById('checkoutForm');

    // 如果唔係 pay.html，就唔做任何事
    // 如果當前瀏覽的頁面不存在結帳表單（代表顧客可能在首頁或聯絡頁），立即返回 false 安全跳出，不執行攔截
    if (!checkoutForm) return false;

    // 若確認位於結帳頁，立即強制抓取並還原目前硬碟快取中的購物車 JSON 資料
    const savedCart = JSON.parse(localStorage.getItem('nova_cart')) || [];

    // 極限安全攔截：如果顧客企圖直接在網址列打上 /pay.html，而快取內顯示他根本沒有選購任何商品
    if (!hasCartItems(savedCart)) {
        // 自動跳出多國語言警告彈窗，提示購物車為空
        alert(t('cartCheckoutEmpty'));
        // 強制拉回重新定向跳轉到 index.html 的產品列表錨點位置，強行阻斷空白訂單的錯誤提交
        window.location.href = 'index.html#products';
        // 回傳 true，代表安全攔截程序已正式啟動並執行完畢
        return true;
    }

    // 若快取內確認有商品，則回傳 false 放行，讓結帳頁面順暢加載渲染
    return false;
}




// 顯示付款提示
// 當結帳頁面的「付款方式」下拉選單切換時即時觸發、用來即時印出轉數快/PayMe 帳戶資料的提示函式
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

        // 將提示框小標題文字重置還原為預設的多國語言預設標題（付款提示）
        hintTitle.innerText = t('paymentHintDefaultTitle');

        // 將內文容器的文字內容清空擦除
        hintText.innerText = '';

        // ✅ 停止執行（唔再往下做）
        return;
    }
    // 顯示提示區塊
    // 反向狀態分支：若顧客確實點選了特定金流支付方式，立即將提示框的行內樣式切換為 block 顯現
    hintBox.style.display = 'block';
    // 根據不同的付款方式設定對應的標題與提示文字
    // 分支判定：若顧客點選的是 PayMe 管道
    if (method === 'PayMe') {
        // 調用多國語言字典方法，將標題複寫更新為 PayMe 專屬標題
        hintTitle.innerText = t('paymeHintTitle');
        // 同步將內文更新為 PayMe 官方收款電話或點擊付款的提示文字
        hintText.innerText = t('paymeHintText');
    // 分支判定：若顧客點選的是轉數快 FPS 管道
    } else if (method === 'FPS') {
        // 更新標題為轉數快專屬標題
        hintTitle.innerText = t('fpsHintTitle');
        // 同步注入轉數快識別碼 (FPS ID) 與收款公司登記名稱等資訊
        hintText.innerText = t('fpsHintText');
    // 分支判定：若顧客點選的是支付寶 AlipayHK 管道
    } else if (method === 'AlipayHK') {
        // 更新標題為支付寶專屬標題
        hintTitle.innerText = t('alipayHintTitle');
        // 同步注入支付寶轉帳流程指引
        hintText.innerText = t('alipayHintText');
    // 分支判定：若顧客點選的是微信支付 WeChatPayHK 管道
    } else if (method === 'WeChatPayHK') {
        // 更新標題為微信支付專屬標題
        hintTitle.innerText = t('wechatHintTitle');
        // 同步注入微信支付轉帳與上傳收據等說明
        hintText.innerText = t('wechatHintText');
    }
    // 正式閉合整個 showPaymentHint 支付提示動態切換函式
}
// 渲染 pay.html 訂單摘要
// 負責在顧客進入獨立結帳頁面（pay.html）時，動態渲染右側購物車明細與計算加總金額的核心函式
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
// 建立香港本地三大核心地域與底下劃分之官方行政分區細項的對應關聯字典陣列
const districtMap = {
    '香港島': ['中西區', '灣仔', '東區', '南區', '其他'],
    '九龍': ['油尖旺', '深水埗', '九龍城', '黃大仙', '觀塘', '其他'],
    '新界': ['葵青', '荃灣', '屯門', '元朗', '北區', '大埔', '沙田', '西貢', '離島', '其他']
};
// 專門儲存香港各個行政區域中英文字串對照的多國語言核心對照字典
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

// 根據當前語系自動抓取並轉換行政分區顯示字串名稱的轉換過渡函式
function getDistrictDisplayName(district) {
    // 判斷當前系統選擇的語系是否為英文模式
    if (currentLanguage === 'en') {
        // 從英文翻譯字典中讀取對應的英文地名（如：Tsuen Wan），若無則降級吐回原始中文
        return districtNameTranslations.en[district] || district;
    }

    // 若當前是中文模式，則直接返回原本的繁體中文地名
    return district;
}
// 當顧客變更大地區下拉選單時，負責即時重繪、清洗並動態填入第二級行政區選項的連動控制函式
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
    // 透過上方篩選出的大地區字串（如：九龍），走訪其底下的行政分區陣列（如：['油尖旺', '深水埗'...]）
    districtMap[selectedRegion].forEach(district => {
        // 在記憶體中建立一個全新的 HTML 原生 <option> 選項標籤節點
        const option = document.createElement('option');
        // 將該選項的內部 value 值設定為當前遍歷到的中文地名
        option.value = district;
        // 調用多國語言轉換方法，將選項畫面上印出的文字內容更替為對應語系（中文或英文名）
        option.textContent = getDistrictDisplayName(district);
        // 正式將這個組裝好的 option 選項節點塞入第二級行政區下拉選單容器中
        districtSelect.appendChild(option);
    });

    // 設定行政區選單的變更事件，監聽使用者選擇
    // 當顧客點擊更換了第二級行政分區選單時觸發的原生動態異動事件 (onchange)
    districtSelect.onchange = function () {
        // 如果選擇「其他」，顯示手動輸入框，否則隱藏並清空輸入框
        // 條件分支：如果顧客點選的行政分區項目精確等於字串「其他」
        if (districtSelect.value === '開他' || districtSelect.value === '其他') {
            // 如果頁面中存在手動輸入其他區塊的容器，立即將其行內樣式改為 block 使其現形，引導顧客打字
            if (otherDistrictGroup) otherDistrictGroup.style.display = 'block';
        // 反向條件分支：如果顧客選擇了一般的常規行政分區（如：旺角）
        } else {
            // 立即將手動輸入框容器的行內樣式改為 none 進行隱藏
            if (otherDistrictGroup) otherDistrictGroup.style.display = 'none';
            // 同時徹底將手動輸入框內部的殘留打字文字完全擦除清空，防範髒數據提交
            if (otherDistrict) otherDistrict.value = '';
        }
    };
// 正式閉合整個 updateDistrictOptions 行政分區動態生成重繪函式的結束大括號
}
// 提交訂單 → 跳 thankyou.html
// 提交訂單 → 跳 thankyou.html
// 當顧客在結帳頁面點擊最底部的提交表單按鈕時觸發的非同步高級資料庫防錯與訂單清算核心函式
async function submitOrder(event) {
    // 攔截並阻止瀏覽器自帶的表單原生同步刷新跳轉行為，全面改由全前端非同步業務邏輯控制
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
    // 開發階段防錯驗證：如果有任何一個主要控制項 id 在 HTML 中遺失或名稱不對
    if (!name || !phone || !email || !region || !district || !addressDetail || !paymentMethod) {
        // 彈出系統報錯提示視窗，協助開發工程師定位除錯，並即時中斷流程
        alert('表單欄位載入錯誤，請檢查 HTML id。');
        return false;
    }

    // ✅ 必填檢查
    // 嚴格的前端全必填欄位完整性防護驗證，利用 .trim() 阻斷只輸入空白鍵的繞過行為
    if (
        name.value.trim() === '' ||
        phone.value.trim() === '' ||
        email.value.trim() === '' ||
        region.value.trim() === '' ||
        district.value.trim() === '' ||
        addressDetail.value.trim() === '' ||
        paymentMethod.value.trim() === ''
    ) {
        // 若存在任一漏填欄位，立即中斷流程並跳出警告告知顧客
        alert('請完整填寫所有必填資料。');
        return false;
    }

    // ✅ 如果選擇「其他」，用 otherDistrict；否則用 district
    // 三元運算子精準換算：若分區點選了「其他」且顧客有在自訂輸入框打字，則採用自訂字串，否則採用下拉選單的原始值
    const finalDistrict =
        district.value === '其他' && otherDistrict && otherDistrict.value.trim() !== ''
            ? otherDistrict.value.trim()
            : district.value;

    // ✅ 從 localStorage 讀取購物車資料與折扣
    // 從系統硬碟快取中提取本次正式要結帳核算的歷史衣服陣列以及套用成功的優惠券金額
    const savedCart = JSON.parse(localStorage.getItem('nova_cart')) || [];
    const savedDiscount = JSON.parse(localStorage.getItem('nova_discount')) || 0;

    // 初始化小計與總件數為 0
    let subtotal = 0;
    let totalQty = 0;

    // 走訪提取出的有貨服飾陣列，精確重複雙重清算商品加總金額與選購件數
    savedCart.forEach(item => {
        subtotal += item.price * item.qty;
        totalQty += item.qty;
    });

    // ✅ 計算運費
    // 運用三元運算子嚴格執行品牌滿 400 元即享香港本地免運費，否則酌收 30 元物流手續費的規則
    let shipping = subtotal >= 400 ? 0 : 30;

    // ✅ 計算總價
    // 將小計加上運費，再扣除折扣金額，算出顧客最終要實付的加總金額
    let total = subtotal + shipping - savedDiscount;
    // 安全防護：若優惠券扣減幅度過大，強制將實付金額鎖定在 0 元邊界，絕對不允許產生負數計費
    if (total < 0) total = 0;

    // ✅ 建立訂單資料
    // 將完整的顧客個資、拼接完成的送貨地址、付款方式、選填備註與商品試算清單，完整打包封裝成單一的 JSON 物件結構
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
    // 將這個包裝好的最終成功訂單 JSON 結構序列化，以 'nova_last_order' 為鍵名寫入本地快取，供感謝頁讀取渲染
    localStorage.setItem('nova_last_order', JSON.stringify(orderInfo));

    // ✅ 清空購物車資料
    // 正式將記憶體內全域的動態購物車變數容器歸零還原為空陣列
    cart = [];
    // 徹底從快取中清除已買完單的舊商品快取字串庫，防止顧客重複返回結帳
    localStorage.removeItem('nova_cart');
    // 同步從快取中銷毀本次已套用套用完畢的優惠券折扣記憶
    localStorage.removeItem('nova_discount');

    // ✅ 嘗試匯出 Excel；失敗都照樣跳 thankyou
    // 進入高級的異常防護捕獲區塊
    try {
        // 利用 await 關鍵字，非同步等待內建的 Excel 自動化二進位製表與下載函式執行完畢
        await exportOrderToExcel(orderInfo);
    } catch (e) {
        // 若因為阻擋彈窗或硬體環境引發導出失敗，利用主控台控制台印出系統追蹤日誌，但不干擾與中斷使用者體驗
        console.error('Excel export failed:', e);
    }

    // ✅ 跳轉到 thank you page
    // 透過控制網址，順暢且成功地將完成付款的顧客重定向移送至 thankyou.html 感謝確認網頁中
    window.location.href = 'thankyou.html';

    // 返回 false 確保瀏覽器的原生動作被完全截斷銷毀
    return false;
}


// 將訂單匯出或附加到客戶端的 Excel 活頁簿中
// 若網站根目錄存在 `orders_template.xlsx`，則會嘗試讀取並附加內容；否則會建立新的活頁簿
// 透過 SheetJS 外部套件，在全前端將顧客個資與衣服清單動態編譯並導出為實體 Excel 活頁簿的核心非同步函式
async function exportOrderToExcel(order) {
    // 嘗試讀取已存在的範本檔案
    // 預先宣告一個用來掛載 Excel 活頁簿資料結構的變數
    let wb;
    // 進入異常防護捕獲區塊，嘗試嗅探讀取伺服器或目錄根目錄是否存在既有的 orders_template.xlsx 舊數據範本
    try {
        // 利用非同步 fetch API 發送請求讀取同目錄下的 Excel 活頁簿二進位檔案
        const resp = await fetch('orders_template.xlsx');
        // 判定請求成功且狀態碼為正常（200-299 區間）
        if (resp && resp.ok) {
            // 將響應內容轉換為標準的原生二進位陣列緩衝區 (ArrayBuffer)
            const ab = await resp.arrayBuffer();
            // 呼叫 SheetJS 的 XLSX.read 方法，將二進位緩衝流解析為網頁可操控的活頁簿 JSON 物件結構
            wb = XLSX.read(ab, { type: 'array' });
        }
    } catch (e) {
        // 若讀取失敗 (例如檔案不存在)，則忽略錯誤並將 wb 設為 null 以便後續建立新活頁簿
        // 若找不到該歷史檔案或爆出跨網域錯誤，直接捕獲並將活頁簿歸空，確保系統不崩潰並自動轉入新建文件流程
        wb = null;
    }

    // 定義工作表名稱
    // 設定 Excel 活頁簿內部的第一張工作表 (Sheet) 的標籤名稱為 'Orders'
    const sheetName = 'Orders';

    // 建立要插入的一行資料
    // 使用時間戳記生成唯一訂單編號
    // 自動獲取目前高精度到毫秒級的時間戳記 (Timestamp)，拼接品牌代碼生成獨一無二的全球唯一訂單流水號
    const orderId = 'ORD' + Date.now();
    // 獲取當前日期時間
    // 自動獲取目前的客戶端本地日期與時間字串，作為訂單創建的時間戳記欄位
    const date = new Date().toLocaleString();
    // 將購物車商品轉換為易於閱讀的字串格式
    // 運用陣列高階映射語法 .map() 與 .join()，將選購的所有衣服、尺寸、數量與單價精確揉合拼接為單一的高級分號字串
    const itemsStr = (order.cart || []).map(i => `${i.name} (${i.color}/${i.size}) x${i.qty} @${i.price}`).join('; ');
    // 建立包含所有訂單欄位的陣列
    // 精確依照活頁簿規定的欄位順序，將所有變數數值組裝成一個標準的單行二維陣列數據行
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
    // 宣告 Excel 表格最頂端第一行固定要顯示的英文字段標題行
    const header = ['OrderID', 'Date', 'Name', 'Phone', 'Email', 'Address', 'PaymentMethod', 'Remark', 'Items', 'TotalQty', 'Subtotal', 'Shipping', 'Discount', 'Total'];

    // 如果沒有讀取到舊的活頁簿，則建立一個新的
    if (!wb) {
        // 呼交 SheetJS 全新配置一個空白的 Excel 活頁簿物件模型
        wb = XLSX.utils.book_new();
        // 將標題行與數據資料行包覆合併成一個完整的二維嵌套陣列
        const wsData = [header, row];
        // 呼叫 SheetJS 核心演算法 aoa_to_sheet (Array of Arrays)，將二維數據陣列無縫重繪轉換為 Excel 實體工作表物件
        const ws = XLSX.utils.aoa_to_sheet(wsData);
        // 將這張建立好的工作表，正式塞入活頁簿模型中並命名為 'Orders'
        XLSX.utils.book_append_sheet(wb, ws, sheetName);
    } else {
        // 如果已載入舊的活頁簿，則尋找 'Orders' 工作表
        // 若前面成功讀取到了舊的範本檔案，則嘗試從現有的 Sheet 陣列列表中抽取名為 'Orders' 的既有工作表物件
        let ws = wb.Sheets[sheetName];
        if (!ws) {
            // 如果找不到該工作表，則建立一個並寫入標題與資料
            // 若舊檔案內沒這張表，同樣呼叫 aoa_to_sheet 方法新建表格並將其塞入既有的舊活頁簿內部
            const wsData = [header, row];
            ws = XLSX.utils.aoa_to_sheet(wsData);
            XLSX.utils.book_append_sheet(wb, ws, sheetName);
        } else {
            // 如果工作表存在，將其轉換為二維陣列，附加新行後再寫回
            // 核心：若工作表完美存在，先呼叫 SheetJS 的 sheet_to_json 並設定 header:1，將現有的 Excel 格子逆向解析還原為網頁二維陣列
            const aoa = XLSX.utils.sheet_to_json(ws, { header: 1 });
            // 如果工作表是空的，確保加入標題行
            // 防錯機制：若解析出的二維陣列長度為 0 顯示為空表，優先將英文字段標題行推入頂端
            if (aoa.length === 0) aoa.push(header);
            // 運用陣列 .push() 方法，直接將本次新交易的顧客訂單數據行追加塞入到陣列的最末端（尾端追加）
            aoa.push(row);
            // 將全新追加整合完畢的完整二維陣列，重新呼叫 aoa_to_sheet 重建編譯成全新的實體工作表物件
            const newWs = XLSX.utils.aoa_to_sheet(aoa);
            // 一鍵將舊工作表物件完全複寫替換為追加新訂單後的全新工作表
            wb.Sheets[sheetName] = newWs;
        }
    }

    // 觸發瀏覽器下載更新後的 Excel 檔案
    try {
        // 優先呼叫標準的 XLSX.writeFile 方法，直接命令瀏覽器向顧客電腦發送名為 orders_template.xlsx 的實體檔案下載請求
        XLSX.writeFile(wb, 'orders_template.xlsx');
    } catch (e) {
        // 部分瀏覽器可能不支援直接寫入，改用 Blob 物件方式處理下載
        // 高級降級相容機制：若部分行動端瀏覽器（如 iOS Chrome）阻擋了 writeFile 的直寫行為，則手動將活頁簿改為二進位陣列數據流形式導出
        const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        // 利用二進位陣列數據流，在前端記憶體中手工封裝、捏造一個標準的 application/octet-stream 八位元任意二進位流 Blob 大型二進位物件
        const blob = new Blob([wbout], { type: 'application/octet-stream' });
        // 呼叫 URL.createObjectURL 為這個記憶體中的 Blob 物件動態分配一個唯一的本地瀏覽器網址來源
        const url = URL.createObjectURL(blob);
        // 在 DOM 文件流中虛擬建立一個完全透明、不可見的 <a> 標籤節點
        const a = document.createElement('a');
        // 將剛剛換算出的 Blob 本地唯一網址，指派給 <a> 標籤的 href 屬性
        a.href = url;
        // 設定強制的實體檔案下載名稱為 orders_template.xlsx
        a.download = 'orders_template.xlsx';
        // 正式將這個隱形 <a> 標籤短暫推入嵌入到網頁 body 實體內容的尾端
        document.body.appendChild(a);
        // 指令自動執行一次程式模擬的點擊事件 (click)，完美引導調起瀏覽器的下載儲存框
        a.click();
        // 下載觸發後，立即將該隱形 <a> 標籤從網頁主體內容中徹底銷毀拔除，釋放排版空間
        a.remove();
        // 呼叫 revokeObjectURL 徹底釋放銷毀該 Blob 對象所佔用的瀏覽器虛擬主機記憶體空間，完美防範效能漏失
        URL.revokeObjectURL(url);
    }
}

/* =========================
   Thank You Page
========================= */
// 訂單完成感謝頁面（thankyou.html）專屬的訂單數據讀取與動態 DOM 拼接重繪核心函式
function renderThankYouPage() {
    // 取得用於顯示訂單資料的容器元素
    // 抓取感謝頁面中用來動態印出付款明細與流水號的灰色區塊卡片容器節點
    const thankyouBox = document.getElementById('thankyouOrderInfo');
    // 若容器不存在則中止執行
    // 節點防護：若當前不在感謝確認頁、找不到該容器，則立即早期中斷，防止 null 拋出報錯
    if (!thankyouBox) return;

    // 從 localStorage 讀取最後一筆訂單資料
    // 從系統硬碟快取中提取剛才結帳成功、由前一頁打包寫入的唯一成功訂單 JSON 字串，並反序列化還原為物件
    const lastOrder = JSON.parse(localStorage.getItem('nova_last_order'));

    // 如果沒有訂單資料，顯示提示訊息並在 3 秒後自動返回主頁
    // 安全攔截判定：若顧客直接在網址列惡意鍵入 /thankyou.html，導致快取內根本找不到任何成功訂單物件
    if (!lastOrder) {
        // 立即在畫面上印出找不到訂單的錯誤中文通知
        thankyouBox.innerHTML = '<p>找不到訂單資料。</p>';
        // 啟動計時器方法，強制在 3 秒（3000 毫秒）的冷卻時間後，將顧客網址重新定向跳轉移送回 index.html 門戶首頁
        setTimeout(function () {
            window.location.href = 'index.html';
        }, 3000);
        // 執行返回中斷流程
        return;
    }

    // 初始化商品項目 HTML 字串
    // 預先建立一個空的字串容器，準備用來組裝拼接本次結帳成功的商品卡片 HTML 明細清單
    let itemsHtml = '';
    // 遍歷訂單中的商品清單並產生 HTML
    // 走訪該成功訂單物件內部的購物車商品陣列，動態換算每項單品的加總計費
    lastOrder.cart.forEach(item => {
        // 使用反引號模板字串，逐行組裝衣服品名、數量、與單項小計金額，累加拼接進字串容器中
        itemsHtml += `
            <div class="thankyou-line">
                <span>${item.name} × ${item.qty}</span>
                <span>HK$ ${item.price * item.qty}</span>
            </div>
        `;
    });

// 將訂單詳細資料 (姓名、電話、總計等) 寫入頁面
    // 運用 JavaScript 的反引號模板字串語法，將剛剛組裝好的衣服明細、顧客個資、小計、運費、優惠及最終實付金額，一鍵渲染複寫到網頁容器中
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
    // 建立一個以 1000 毫秒（1 秒）為週期、持續高頻回圈執行的定時器物件 (setInterval)
    const countdownTimer = setInterval(function () {
        // 每過一秒，將倒數變數數字遞減 1
        countdown--;
        // 更新顯示的剩餘秒數
        if (countdownEl) {
            countdownEl.innerText = countdown;
        }

        // 當倒數結束時
        // 條件分支：當數字減到 0 或以下，代表倒數計時圓滿結束
        if (countdown <= 0) {
            // 清除計時器
            // 立即停用並銷毀目前的定時器物件，防止其在背景無故重複執行，釋放 CPU 記憶體效能
            clearInterval(countdownTimer);
            // 移除訂單快取資料並跳轉回主頁
            // 安全防範：徹底從快取中清除這筆已展示過完畢的歷史訂單，防範顧客誤操作刷新頁面引發重複扣款誤會
            localStorage.removeItem('nova_last_order');
            // 透過控制網址控制項，將顧客無縫導流移送返回 index.html 門戶首頁
            window.location.href = 'index.html';
        }
    }, 1000);
// 正式閉合整個 renderThankYouPage 感謝頁面核心渲染函式的結束大括號
}

/* =========================
   頁面初始化
========================= */
// 當整個 HTML 文件載入完成後執行
// 全站的總指揮部：全時監聽目前網頁 HTML 骨架與所有標籤節點完全就緒的原生 DOMContentLoaded 事件
document.addEventListener('DOMContentLoaded', function () {

    // 1. 優先恢復快取中的歷史購物車與折扣狀態
    loadCartState();
    // 2. 初始化背景音樂音量滑桿位置與預設硬體音量
    initBgmVolume();
    // 3. 自動讀取快取並在背景恢復音軌的續播進度秒數
    initBgmResume();
    // 4. 安全攔截哨兵：若在結帳頁且購物車為空，立即彈窗攔截並早期返回，阻斷後續多餘的初始化加載
    if (guardCheckoutPage()) return;
    // 5. 動態綁定全站所有版面與元件的滾動 IntersectionObserver 高級淡入上浮監聽
    initScrollAnimations();
    // 渲染結帳頁面內容
    // 6. 安全放行後，如果是結帳頁面則動態刷新右側訂單摘要與運費
    renderCheckoutPage();
    // 渲染感謝頁面內容
    // 7. 如果是感謝確認頁面，則動態重繪顧客資料卡片與明細、並點燃 5 秒倒數器
    renderThankYouPage();
    
    // 更新購物車介面顯示
    // 8. 即時更新全站頁首的購物車 badge 商品累計件數提示小紅點
    updateCartUI();
    // 根據選擇的付款方式顯示對應提示
    // 9. 檢查並根據目前選取的行動支付管道，即時印出轉數快/PayMe 官方收款帳號
    showPaymentHint();
    // 10. 全站收尾：執行多國語言重繪渲染，將網頁的 lang 與所有 data-i18n 標籤轉換為當前快取語系
    applyLanguage()
// 正式閉合整個 DOM 總初始化監聽回調函式與大括號
});
