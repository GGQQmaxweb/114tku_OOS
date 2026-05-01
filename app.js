class MenuItem {
  constructor(id, name, en, image, variants, counterOnly, priceNote) {
    this.id = id;
    this.name = name;
    this.en = en;
    this.image = image;
    this.variants = variants;
    this.counterOnly = counterOnly;
    this.priceNote = priceNote;
  }
}

class CartItem {
  constructor(menuItem, variant, addons, addonPrice) {
    this.cartId = Date.now() + Math.random();
    this.itemId = menuItem.id;
    this.name = menuItem.name;
    this.en = menuItem.en;
    this.image = menuItem.image;
    this.size = variant.label;
    this.basePrice = variant.price;
    this.addons = addons;
    this.addonPrice = addonPrice;
    this.price = variant.price + addonPrice;
    this.qty = 1;
  }
}

class Cart {
  constructor() {
    this.items = [];
  }

  add(item) {
    this.items.push(item);
  }

  remove(cartId) {
    const newItems = [];

    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i].cartId !== cartId) {
        newItems.push(this.items[i]);
      }
    }

    this.items = newItems;
  }

  clear() {
    this.items = [];
  }

  count() {
    let count = 0;

    for (let i = 0; i < this.items.length; i++) {
      count = count + this.items[i].qty;
    }

    return count;
  }

  total() {
    let total = 0;

    for (let i = 0; i < this.items.length; i++) {
      total = total + this.items[i].price * this.items[i].qty;
    }

    return total;
  }
}

class CoffeeOrderApp {
  constructor() {
    this.menuItems = this.createMenuItems();
    this.syrupOptions = this.createSyrupOptions();
    this.rewards = [
      "甜點折20元",
      "95折優惠",
      "免費加濃縮",
      "下次折10元",
      "升級大杯",
      "環保杯折5元",
      "買一送一券",
      "謝謝參與",
    ];

    this.cart = new Cart();

    this.selectedItem = null;
    this.selectedVariant = null;
    this.noAddon = true;
    this.syrupSelected = false;
    this.selectedSyrupId = "";
    this.extraShot = false;

    this.spinning = false;
    this.rewardText = "";

    this.menuList = document.getElementById("menuList");
    this.modalRoot = document.getElementById("modalRoot");
    this.bottomCount = document.getElementById("bottomCount");
    this.bottomTotal = document.getElementById("bottomTotal");
    this.cartBadge = document.getElementById("cartBadge");
    this.cartFloatBtn = document.getElementById("cartFloatBtn");
    this.bottomCheckoutBtn = document.getElementById("bottomCheckoutBtn");

    this.bindBaseEvents();
    this.renderMenu();
    this.updateBottomBar();
  }

  createMenuItems() {
    return [
      new MenuItem(1, "冰西西里咖啡", "Iced Lemon Coffee", "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=500", [{ label: "XL", price: 90 }], false, ""),
      new MenuItem(2, "熱可可", "Hot Cocoa", "https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=500", [{ label: "M", price: 90 }], false, ""),
      new MenuItem(3, "貝禮詩奶酒咖啡", "Baileys Coffee Latte", "https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?w=500", [{ label: "L", price: 160 }], false, ""),
      new MenuItem(4, "老闆特調", "Boss Special", "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500", [], true, ""),
      new MenuItem(5, "1+1", "1 esp & 1 flat white", "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=500", [{ label: "固定", price: 140 }], false, ""),
      new MenuItem(6, "抹茶拿鐵", "Matcha Latte", "https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=500", [{ label: "L", price: 110 }], false, ""),
      new MenuItem(7, "世界各產地黑咖啡", "Single Origin Coffee", "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500", [{ label: "M", price: 130 }], false, "$130+"),
      new MenuItem(8, "咖啡豆", "Coffee Bean", "https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=500", [], true, ""),
      new MenuItem(9, "耳掛咖啡包", "Drip Coffee Bag", "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500", [], true, ""),
      new MenuItem(10, "拿鐵咖啡", "Latte", "https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?w=500", [{ label: "M", price: 85 }, { label: "L", price: 100 }, { label: "XL", price: 130 }], false, ""),
      new MenuItem(11, "美式咖啡", "Americano", "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500", [{ label: "M", price: 60 }, { label: "L", price: 80 }, { label: "XL", price: 100 }], false, ""),
      new MenuItem(12, "卡布奇諾", "Cappuccino", "https://images.unsplash.com/photo-1534778101976-62847782c213?w=500", [{ label: "M", price: 85 }], false, ""),
      new MenuItem(13, "雙倍卡布", "Two Shot Cappu", "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=500", [{ label: "M", price: 100 }], false, ""),
      new MenuItem(14, "黑糖拿鐵", "Black Sugar Latte", "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500", [{ label: "M", price: 100 }, { label: "L", price: 115 }, { label: "XL", price: 145 }], false, ""),
      new MenuItem(15, "焦糖瑪奇朵", "Caramel Macchiato", "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=500", [{ label: "M", price: 100 }, { label: "L", price: 115 }, { label: "XL", price: 145 }], false, ""),
      new MenuItem(16, "摩卡瑪奇朵", "Mocca Macchiato", "https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?w=500", [{ label: "M", price: 100 }, { label: "L", price: 115 }, { label: "XL", price: 145 }], false, ""),
      new MenuItem(17, "義式咖啡", "Espresso", "https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=500", [{ label: "Single", price: 60 }, { label: "Double", price: 80 }, { label: "Triple", price: 100 }], false, ""),
    ];
  }

  createSyrupOptions() {
    return [
      { id: "vanilla", name: "香草", en: "Vanilla" },
      { id: "hazelnut", name: "榛果", en: "Hazelnut" },
      { id: "rose", name: "玫瑰", en: "Rose" },
      { id: "salted-caramel", name: "海洋焦糖", en: "Salted Caramel" },
      { id: "irish-cream", name: "愛爾蘭奶乳", en: "Irish Cream" },
    ];
  }

  bindBaseEvents() {
    this.cartFloatBtn.addEventListener("click", () => {
      this.openCart();
    });

    this.bottomCheckoutBtn.addEventListener("click", () => {
      this.openCheckout();
    });
  }

  renderMenu() {
    this.menuList.innerHTML = "";

    for (let i = 0; i < this.menuItems.length; i++) {
      const item = this.menuItems[i];

      const row = document.createElement("div");
      row.className = "menu-row";

      row.innerHTML = `
        <img src="${item.image}" alt="${item.name}">
        <div class="menu-info">
          <h4>${item.name}</h4>
          <p>${item.en}</p>
          <div class="variant-line">${this.getVariantText(item)}</div>
        </div>
        <button class="add-btn">＋</button>
      `;

      const addBtn = row.querySelector(".add-btn");

      addBtn.addEventListener("click", () => {
        this.openItemFlow(item);
      });

      this.menuList.appendChild(row);
    }
  }

  getVariantText(item) {
    if (item.counterOnly === true) {
      return `<span class="counter-price">價格請洽櫃台</span>`;
    }

    if (item.priceNote !== "") {
      return `<span>${item.priceNote}</span>`;
    }

    let html = "";

    for (let i = 0; i < item.variants.length; i++) {
      html = html + `<span>${item.variants[i].label} $${item.variants[i].price}</span>`;
    }

    return html;
  }

  openItemFlow(item) {
    if (item.counterOnly === true) {
      alert("此品項價格請洽櫃台，暫不支援線上加入購物車");
      return;
    }

    this.selectedItem = item;

    if (item.variants.length > 1) {
      this.selectedVariant = item.variants[0];
      this.renderSizeModal();
      return;
    }

    this.selectedVariant = item.variants[0];
    this.resetAddon();
    this.renderAddonModal();
  }

  resetAddon() {
    this.noAddon = true;
    this.syrupSelected = false;
    this.selectedSyrupId = "";
    this.extraShot = false;
  }

  closeModal() {
    this.modalRoot.innerHTML = "";
  }

  renderSizeModal() {
    let sizeHtml = "";

    for (let i = 0; i < this.selectedItem.variants.length; i++) {
      const variant = this.selectedItem.variants[i];
      let activeClass = "";

      if (variant.label === this.selectedVariant.label) {
        activeClass = "active";
      }

      sizeHtml = sizeHtml + `
        <button class="size-card ${activeClass}" data-index="${i}">
          <strong>${variant.label}</strong>
          <span>$${variant.price}</span>
        </button>
      `;
    }

    this.modalRoot.innerHTML = `
      <div class="modal-bg center">
        <div class="modal-card">
          <button class="close-btn" id="closeSize">×</button>
          <h3>選擇尺寸與價位</h3>

          <div class="selected-drink">
            <img src="${this.selectedItem.image}" alt="${this.selectedItem.name}">
            <div>
              <strong>${this.selectedItem.name}</strong>
              <span>${this.selectedItem.en}</span>
            </div>
          </div>

          <div class="size-options">${sizeHtml}</div>

          <div class="modal-btn-row">
            <button class="gray-btn" id="cancelSize">取消</button>
            <button class="orange-btn" id="nextAddon">下一步</button>
          </div>
        </div>
      </div>
    `;

    const sizeCards = this.modalRoot.querySelectorAll(".size-card");

    for (let i = 0; i < sizeCards.length; i++) {
      sizeCards[i].addEventListener("click", () => {
        this.selectedVariant = this.selectedItem.variants[i];
        this.renderSizeModal();
      });
    }

    document.getElementById("closeSize").addEventListener("click", () => this.closeModal());
    document.getElementById("cancelSize").addEventListener("click", () => this.closeModal());

    document.getElementById("nextAddon").addEventListener("click", () => {
      this.resetAddon();
      this.renderAddonModal();
    });
  }

  renderAddonModal() {
    this.modalRoot.innerHTML = `
      <div class="modal-bg center">
        <div class="modal-card">
          <button class="close-btn" id="closeAddon">×</button>
          <h3>是否加購？</h3>

          <div class="addon-summary">
            <img src="${this.selectedItem.image}" alt="${this.selectedItem.name}">
            <strong>${this.selectedItem.name} / ${this.selectedVariant.label} / $${this.selectedVariant.price}</strong>
          </div>

          <button class="addon-line" id="noAddonBtn">
            <span class="radio-dot ${this.noAddon ? "checked" : ""}"></span>
            <span>不加購</span>
          </button>

          <button class="addon-line" id="syrupBtn">
            <span class="check-box ${this.syrupSelected ? "checked" : ""}"></span>
            <span>糖漿風味</span>
            <strong>+$10</strong>
          </button>

          <div class="syrup-list">${this.getSyrupHtml()}</div>

          <div class="dash-line"></div>

          <button class="addon-line" id="extraShotBtn">
            <span class="check-box ${this.extraShot ? "checked" : ""}"></span>
            <span>多一份義式咖啡</span>
            <strong>+$20</strong>
          </button>

          <div class="addon-total">
            <span>本品項金額</span>
            <strong>$${this.getPreviewTotal()}</strong>
          </div>

          <div class="modal-btn-row">
            <button class="gray-btn" id="backAddon">返回</button>
            <button class="orange-btn" id="addCartBtn">加入購物車 🛒</button>
          </div>
        </div>
      </div>
    `;

    document.getElementById("closeAddon").addEventListener("click", () => this.closeModal());

    document.getElementById("noAddonBtn").addEventListener("click", () => {
      this.resetAddon();
      this.renderAddonModal();
    });

    document.getElementById("syrupBtn").addEventListener("click", () => {
      if (this.syrupSelected === true) {
        this.syrupSelected = false;
        this.selectedSyrupId = "";
      } else {
        this.syrupSelected = true;
        this.noAddon = false;
        this.selectedSyrupId = this.syrupOptions[0].id;
      }

      this.renderAddonModal();
    });

    const syrupBtns = this.modalRoot.querySelectorAll(".syrup-option");

    for (let i = 0; i < syrupBtns.length; i++) {
      syrupBtns[i].addEventListener("click", () => {
        this.syrupSelected = true;
        this.noAddon = false;
        this.selectedSyrupId = this.syrupOptions[i].id;
        this.renderAddonModal();
      });
    }

    document.getElementById("extraShotBtn").addEventListener("click", () => {
      this.extraShot = !this.extraShot;
      this.noAddon = false;
      this.renderAddonModal();
    });

    document.getElementById("backAddon").addEventListener("click", () => {
      if (this.selectedItem.variants.length > 1) {
        this.renderSizeModal();
      } else {
        this.closeModal();
      }
    });

    document.getElementById("addCartBtn").addEventListener("click", () => {
      this.addToCart();
    });
  }

  getSyrupHtml() {
    let html = "";

    for (let i = 0; i < this.syrupOptions.length; i++) {
      const syrup = this.syrupOptions[i];
      let checked = "";

      if (this.selectedSyrupId === syrup.id) {
        checked = "checked";
      }

      html = html + `
        <button class="syrup-option">
          <span class="check-box ${checked}"></span>
          <span>${syrup.name} (${syrup.en})</span>
        </button>
      `;
    }

    return html;
  }

  getSelectedSyrupName() {
    for (let i = 0; i < this.syrupOptions.length; i++) {
      if (this.syrupOptions[i].id === this.selectedSyrupId) {
        return this.syrupOptions[i].name + " " + this.syrupOptions[i].en;
      }
    }

    return "";
  }

  getAddonPrice() {
    let price = 0;

    if (this.syrupSelected === true) {
      price = price + 10;
    }

    if (this.extraShot === true) {
      price = price + 20;
    }

    return price;
  }

  getPreviewTotal() {
    return this.selectedVariant.price + this.getAddonPrice();
  }

  addToCart() {
    const addons = [];

    if (this.noAddon === true) {
      addons.push("不加購");
    }

    if (this.syrupSelected === true) {
      addons.push("糖漿：" + this.getSelectedSyrupName());
    }

    if (this.extraShot === true) {
      addons.push("多一份義式咖啡");
    }

    const item = new CartItem(
      this.selectedItem,
      this.selectedVariant,
      addons,
      this.getAddonPrice()
    );

    this.cart.add(item);
    this.closeModal();
    this.updateBottomBar();
  }

  updateBottomBar() {
    const count = this.cart.count();
    const total = this.cart.total();

    this.bottomCount.textContent = count;
    this.bottomTotal.textContent = "$" + total;

    if (count > 0) {
      this.cartBadge.textContent = count;
      this.cartBadge.classList.remove("hidden");
    } else {
      this.cartBadge.classList.add("hidden");
    }
  }

  openCart() {
    if (this.cart.count() === 0) {
      alert("購物車是空的，請先選擇餐點");
      return;
    }

    this.renderCartModal();
  }

  openCheckout() {
    if (this.cart.count() === 0) {
      alert("請先選擇餐點");
      return;
    }

    this.renderCheckoutModal();
  }

  getOrderListHtml(canRemove) {
    let html = "";

    for (let i = 0; i < this.cart.items.length; i++) {
      const item = this.cart.items[i];
      let addonHtml = "";

      for (let j = 0; j < item.addons.length; j++) {
        addonHtml = addonHtml + `<span>${item.addons[j]}</span>`;
      }

      let removeHtml = "";

      if (canRemove === true) {
        removeHtml = `<button class="remove-btn" data-id="${item.cartId}">移除</button>`;
      }

      html = html + `
        <div class="order-row">
          <div class="order-left">
            <img src="${item.image}" alt="${item.name}">
            <div>
              <h4>${item.name}</h4>
              <p>${item.en} / ${item.size}</p>
              <div class="addon-text">${addonHtml}</div>
            </div>
          </div>
          <div class="order-right">
            <span>x${item.qty}</span>
            <strong>$${item.price}</strong>
            ${removeHtml}
          </div>
        </div>
      `;
    }

    return html;
  }

  renderCartModal() {
    this.modalRoot.innerHTML = `
      <div class="modal-bg bottom">
        <div class="sheet-card">
          <div class="handle"></div>
          <h3>購物車內容</h3>

          <div class="order-list">${this.getOrderListHtml(true)}</div>

          <div class="total-row">
            <span>目前總額</span>
            <strong>$${this.cart.total()}</strong>
          </div>

          <div class="modal-btn-row">
            <button class="gray-btn" id="cartBack">返回</button>
            <button class="orange-btn" id="cartCheckout">我要結帳</button>
          </div>
        </div>
      </div>
    `;

    const removeBtns = this.modalRoot.querySelectorAll(".remove-btn");

    for (let i = 0; i < removeBtns.length; i++) {
      removeBtns[i].addEventListener("click", () => {
        const id = Number(removeBtns[i].dataset.id);
        this.cart.remove(id);
        this.updateBottomBar();

        if (this.cart.count() === 0) {
          this.closeModal();
        } else {
          this.renderCartModal();
        }
      });
    }

    document.getElementById("cartBack").addEventListener("click", () => this.closeModal());
    document.getElementById("cartCheckout").addEventListener("click", () => this.renderCheckoutModal());
  }

  renderCheckoutModal() {
    let hint = "";

    if (this.cart.total() > 199) {
      hint = `<p class="hint">訂單滿 $200，下一步可參加幸運轉盤</p>`;
    }

    this.modalRoot.innerHTML = `
      <div class="modal-bg bottom">
        <div class="sheet-card">
          <div class="handle"></div>
          <h3>確認您的餐點與金額</h3>
          ${hint}

          <div class="order-list">${this.getOrderListHtml(false)}</div>

          <div class="total-row">
            <span>總計</span>
            <strong>$${this.cart.total()}</strong>
          </div>

          <div class="modal-btn-row">
            <button class="gray-btn" id="checkoutBack">返回</button>
            <button class="orange-btn" id="goPay">去結帳</button>
          </div>
        </div>
      </div>
    `;

    document.getElementById("checkoutBack").addEventListener("click", () => this.closeModal());

    document.getElementById("goPay").addEventListener("click", () => {
      if (this.cart.total() > 199) {
        this.renderWheelModal();
      } else {
        this.renderPaymentModal();
      }
    });
  }

  renderWheelModal() {
    this.rewardText = "";

    this.modalRoot.innerHTML = `
      <div class="modal-bg center">
        <div class="modal-card">
          <button class="close-btn" id="closeWheel">×</button>

          <h3 class="wheel-title">✨ 幸運轉盤抽獎 ✨</h3>
          <p class="wheel-subtitle">單筆消費滿 $200，即可抽一次優惠好禮</p>

          <div class="pointer"></div>

          <div id="wheelSvgWrap" class="wheel-svg-wrap">
            ${this.getWheelSvg()}
          </div>

          <div class="qualified-box">
            <span>本次訂單金額：</span>
            <strong>$${this.cart.total()}</strong>
            <em>已符合抽獎資格</em>
          </div>

          <div id="wheelResult"></div>

          <button class="spin-btn" id="spinBtn">開始</button>
          <button class="skip-btn" id="skipWheel">稍後使用</button>
        </div>
      </div>
    `;

    document.getElementById("closeWheel").addEventListener("click", () => this.closeModal());
    document.getElementById("skipWheel").addEventListener("click", () => this.renderPaymentModal());
    document.getElementById("spinBtn").addEventListener("click", () => this.startSpin());
  }

  getWheelSvg() {
    return `
      <svg class="wheel-svg" viewBox="0 0 400 400">
        <circle cx="200" cy="200" r="192" fill="#102234" />

        <g transform="rotate(-22.5 200 200)">
          <path d="M200 200 L200 8 A192 192 0 0 1 335.8 64.2 Z" fill="#7d8bdd" />
          <path d="M200 200 L335.8 64.2 A192 192 0 0 1 392 200 Z" fill="#a7b0b5" />
          <path d="M200 200 L392 200 A192 192 0 0 1 335.8 335.8 Z" fill="#83bcb7" />
          <path d="M200 200 L335.8 335.8 A192 192 0 0 1 200 392 Z" fill="#e0c971" />
          <path d="M200 200 L200 392 A192 192 0 0 1 64.2 335.8 Z" fill="#d6a06e" />
          <path d="M200 200 L64.2 335.8 A192 192 0 0 1 8 200 Z" fill="#c47a8d" />
          <path d="M200 200 L8 200 A192 192 0 0 1 64.2 64.2 Z" fill="#8d61b7" />
          <path d="M200 200 L64.2 64.2 A192 192 0 0 1 200 8 Z" fill="#93aedf" />

          <line x1="200" y1="8" x2="200" y2="392" class="wheel-line" />
          <line x1="8" y1="200" x2="392" y2="200" class="wheel-line" />
          <line x1="64.2" y1="64.2" x2="335.8" y2="335.8" class="wheel-line" />
          <line x1="335.8" y1="64.2" x2="64.2" y2="335.8" class="wheel-line" />
        </g>

        <text x="200" y="74" class="wheel-prize-text">
          <tspan x="200" dy="0">甜點</tspan>
          <tspan x="200" dy="22">折20元</tspan>
        </text>

        <text x="292" y="110" class="wheel-prize-text">
          <tspan x="292" dy="0">95折</tspan>
          <tspan x="292" dy="22">優惠</tspan>
        </text>

        <text x="322" y="200" class="wheel-prize-text">
          <tspan x="322" dy="-10">免費</tspan>
          <tspan x="322" dy="22">加濃縮</tspan>
        </text>

        <text x="292" y="290" class="wheel-prize-text">
          <tspan x="292" dy="0">下次</tspan>
          <tspan x="292" dy="22">折10元</tspan>
        </text>

        <text x="200" y="326" class="wheel-prize-text">
          <tspan x="200" dy="0">升級</tspan>
          <tspan x="200" dy="22">大杯</tspan>
        </text>

        <text x="108" y="290" class="wheel-prize-text">
          <tspan x="108" dy="0">環保杯</tspan>
          <tspan x="108" dy="22">折5元</tspan>
        </text>

        <text x="78" y="200" class="wheel-prize-text">
          <tspan x="78" dy="-10">買一</tspan>
          <tspan x="78" dy="22">送一券</tspan>
        </text>

        <text x="108" y="110" class="wheel-prize-text">
          <tspan x="108" dy="0">謝謝</tspan>
          <tspan x="108" dy="22">參與</tspan>
        </text>

        <circle cx="200" cy="200" r="52" fill="#eed57b" />
        <circle cx="200" cy="200" r="41" fill="#d78436" />

        <text x="200" y="193" class="wheel-center-svg-start">START</text>
        <text x="200" y="224" class="wheel-center-svg-main">開始</text>
      </svg>
    `;
  }

  startSpin() {
    if (this.spinning === true) {
      return;
    }

    this.spinning = true;

    const randomValue = Math.random() * this.rewards.length;
    const rewardIndex = parseInt(randomValue, 10);
    const reward = this.rewards[rewardIndex];

    const oneRewardDeg = 360 / this.rewards.length;
    const targetDeg = 2160 + rewardIndex * oneRewardDeg;

    const wheelSvgWrap = document.getElementById("wheelSvgWrap");
    const spinBtn = document.getElementById("spinBtn");

    spinBtn.textContent = "轉動中...";
    wheelSvgWrap.style.transform = "rotate(" + targetDeg + "deg)";

    setTimeout(() => {
      this.spinning = false;
      this.rewardText = reward;

      document.getElementById("wheelResult").innerHTML = `
        <div class="result-box">
          <span>抽獎結果</span>
          <strong>${reward}</strong>
        </div>
      `;

      spinBtn.textContent = "前往付款";
      spinBtn.onclick = () => {
        this.renderPaymentModal();
      };
    }, 2600);
  }

  renderPaymentModal() {
    let rewardHtml = "";

    if (this.rewardText !== "") {
      rewardHtml = `
        <div class="payment-reward">
          <span>本次優惠</span>
          <strong>${this.rewardText}</strong>
        </div>
      `;
    }

    this.modalRoot.innerHTML = `
      <div class="modal-bg bottom">
        <div class="sheet-card">
          <div class="handle"></div>
          <h3>付款確認</h3>

          <div class="order-list">${this.getOrderListHtml(false)}</div>

          ${rewardHtml}

          <div class="line-pay">
            <span>LINE Pay</span>
            <strong>LINE Pay</strong>
          </div>

          <div class="total-row">
            <span>訂單總額</span>
            <strong>$${this.cart.total()}</strong>
          </div>

          <div class="modal-btn-row">
            <button class="gray-btn" id="paymentBack">返回</button>
            <button class="orange-btn" id="finishPay">確認付款</button>
          </div>
        </div>
      </div>
    `;

    document.getElementById("paymentBack").addEventListener("click", () => {
      this.renderCheckoutModal();
    });

    document.getElementById("finishPay").addEventListener("click", () => {
      alert("付款完成，謝謝您的點餐！");
      this.cart.clear();
      this.rewardText = "";
      this.closeModal();
      this.updateBottomBar();
    });
  }
}

const app = new CoffeeOrderApp();