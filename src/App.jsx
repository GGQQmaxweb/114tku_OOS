import { useState } from "react";
import { menuItems, rewards, syrupOptions } from "./menuData";

export default function App() {
  const [cart, setCart] = useState([]);
  const [sizeModalOpen, setSizeModalOpen] = useState(false);
  const [addonModalOpen, setAddonModalOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [wheelOpen, setWheelOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);

  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);

  const [noAddon, setNoAddon] = useState(true);
  const [syrupSelected, setSyrupSelected] = useState(false);
  const [selectedSyrupId, setSelectedSyrupId] = useState("");
  const [extraShot, setExtraShot] = useState(false);

  const [spinning, setSpinning] = useState(false);
  const [wheelDeg, setWheelDeg] = useState(0);
  const [rewardText, setRewardText] = useState("");

  function openItemFlow(item) {
    if (item.counterOnly === true) {
      alert("此品項價格請洽櫃台，暫不支援線上加入購物車");
      return;
    }

    setSelectedItem(item);

    if (item.variants.length > 1) {
      setSelectedVariant(item.variants[0]);
      setSizeModalOpen(true);
      return;
    }

    setSelectedVariant(item.variants[0]);
    resetAddon();
    setAddonModalOpen(true);
  }

  function resetAddon() {
    setNoAddon(true);
    setSyrupSelected(false);
    setSelectedSyrupId("");
    setExtraShot(false);
  }

  function closeSizeModal() {
    setSizeModalOpen(false);
  }

  function sizeNext() {
    setSizeModalOpen(false);
    resetAddon();
    setAddonModalOpen(true);
  }

  function closeAddonModal() {
    setAddonModalOpen(false);
  }

  function backToSize() {
    setAddonModalOpen(false);

    if (selectedItem !== null) {
      if (selectedItem.variants.length > 1) {
        setSizeModalOpen(true);
      }
    }
  }

  function chooseNoAddon() {
    setNoAddon(true);
    setSyrupSelected(false);
    setSelectedSyrupId("");
    setExtraShot(false);
  }

  function toggleSyrup() {
    if (syrupSelected === true) {
      setSyrupSelected(false);
      setSelectedSyrupId("");
    } else {
      setSyrupSelected(true);
      setNoAddon(false);
      setSelectedSyrupId(syrupOptions[0].id);
    }
  }

  function chooseSyrup(id) {
    setSyrupSelected(true);
    setNoAddon(false);
    setSelectedSyrupId(id);
  }

  function toggleExtraShot() {
    if (extraShot === true) {
      setExtraShot(false);
    } else {
      setExtraShot(true);
      setNoAddon(false);
    }
  }

  function getSelectedSyrupName() {
    for (let i = 0; i < syrupOptions.length; i++) {
      if (syrupOptions[i].id === selectedSyrupId) {
        return syrupOptions[i].name + " " + syrupOptions[i].en;
      }
    }

    return "";
  }

  function getAddonPrice() {
    let price = 0;

    if (syrupSelected === true) {
      price = price + 10;
    }

    if (extraShot === true) {
      price = price + 20;
    }

    return price;
  }

  function getPreviewTotal() {
    if (selectedVariant === null) {
      return 0;
    }

    return selectedVariant.price + getAddonPrice();
  }

  function addToCart() {
    if (selectedItem === null) {
      return;
    }

    if (selectedVariant === null) {
      return;
    }

    const addonNames = [];

    if (syrupSelected === true) {
      addonNames.push("糖漿：" + getSelectedSyrupName());
    }

    if (extraShot === true) {
      addonNames.push("多一份義式咖啡");
    }

    if (noAddon === true) {
      addonNames.push("不加購");
    }

    const cartItem = {
      cartId: Date.now(),
      itemId: selectedItem.id,
      name: selectedItem.name,
      en: selectedItem.en,
      image: selectedItem.image,
      size: selectedVariant.label,
      basePrice: selectedVariant.price,
      addonPrice: getAddonPrice(),
      price: getPreviewTotal(),
      qty: 1,
      addons: addonNames,
    };

    const newCart = cart.slice();
    newCart.push(cartItem);

    setCart(newCart);
    setAddonModalOpen(false);
    setSelectedItem(null);
    setSelectedVariant(null);
    resetAddon();
  }

  function removeCartItem(cartId) {
    const newCart = [];

    for (let i = 0; i < cart.length; i++) {
      if (cart[i].cartId !== cartId) {
        newCart.push(cart[i]);
      }
    }

    setCart(newCart);
  }

  function getCartCount() {
    let count = 0;

    for (let i = 0; i < cart.length; i++) {
      count = count + cart[i].qty;
    }

    return count;
  }

  function getTotal() {
    let total = 0;

    for (let i = 0; i < cart.length; i++) {
      total = total + cart[i].price * cart[i].qty;
    }

    return total;
  }

  function openCart() {
    if (getCartCount() === 0) {
      alert("購物車是空的，請先選擇餐點");
      return;
    }

    setCartOpen(true);
  }

  function openCheckout() {
    if (getCartCount() === 0) {
      alert("請先選擇餐點");
      return;
    }

    setCheckoutOpen(true);
  }

  function goCheckoutNext() {
    setCheckoutOpen(false);

    if (getTotal() > 199) {
      setWheelOpen(true);
      return;
    }

    setPaymentOpen(true);
  }

  function startSpin() {
    if (spinning === true) {
      return;
    }

    setSpinning(true);
    setRewardText("");

    const randomValue = Math.random() * rewards.length;
    const rewardIndex = parseInt(randomValue, 10);
    const reward = rewards[rewardIndex];

    const oneRewardDeg = 360 / rewards.length;
    const targetDeg = 2160 + rewardIndex * oneRewardDeg;

    setWheelDeg(targetDeg);

    setTimeout(function () {
      setRewardText(reward);
      setSpinning(false);
    }, 2600);
  }

  function skipWheel() {
    setWheelOpen(false);
    setPaymentOpen(true);
  }

  function goPaymentAfterWheel() {
    setWheelOpen(false);
    setPaymentOpen(true);
  }

  function finishPayment() {
    alert("付款完成，謝謝您的點餐！");

    setCart([]);
    setCartOpen(false);
    setCheckoutOpen(false);
    setWheelOpen(false);
    setPaymentOpen(false);
    setRewardText("");
    setWheelDeg(0);
  }

  return (
    <div className="page">
      <div className="phone">
        <Header />

        <main className="main">
          <div className="notice-box">
            <strong>ⓘ 以下飲品點擊「＋」後，可選擇尺寸與價位</strong>
            <span>
              適用：拿鐵咖啡、美式咖啡、黑糖拿鐵、焦糖瑪奇朵、摩卡瑪奇朵、義式咖啡
            </span>
          </div>

          <div className="section-title">
            <span>☕</span>
            <h2>店內餐點</h2>
          </div>

          <div className="menu-list">
            {menuItems.map(function (item) {
              return (
                <MenuRow
                  key={item.id}
                  item={item}
                  onAdd={function () {
                    openItemFlow(item);
                  }}
                />
              );
            })}
          </div>
        </main>

        <button className="cart-float" onClick={openCart}>
          🛒
          {getCartCount() > 0 && <span className="cart-badge">{getCartCount()}</span>}
        </button>

        <div className="bottom-bar">
          <div>
            <div className="total-label">小計 ({getCartCount()})</div>
            <div className="total-price">${getTotal()}</div>
          </div>

          <button className="checkout-main-btn" onClick={openCheckout}>
            結帳去 〉
          </button>
        </div>

        {sizeModalOpen && (
          <SizeModal
            item={selectedItem}
            selectedVariant={selectedVariant}
            onChooseVariant={setSelectedVariant}
            onClose={closeSizeModal}
            onNext={sizeNext}
          />
        )}

        {addonModalOpen && (
          <AddonModal
            item={selectedItem}
            variant={selectedVariant}
            noAddon={noAddon}
            syrupSelected={syrupSelected}
            selectedSyrupId={selectedSyrupId}
            extraShot={extraShot}
            previewTotal={getPreviewTotal()}
            onNoAddon={chooseNoAddon}
            onToggleSyrup={toggleSyrup}
            onChooseSyrup={chooseSyrup}
            onToggleExtraShot={toggleExtraShot}
            onBack={backToSize}
            onClose={closeAddonModal}
            onAddCart={addToCart}
          />
        )}

        {cartOpen && (
          <CartModal
            items={cart}
            total={getTotal()}
            onRemove={removeCartItem}
            onClose={function () {
              setCartOpen(false);
            }}
            onCheckout={function () {
              setCartOpen(false);
              setCheckoutOpen(true);
            }}
          />
        )}

        {checkoutOpen && (
          <CheckoutModal
            items={cart}
            total={getTotal()}
            onClose={function () {
              setCheckoutOpen(false);
            }}
            onNext={goCheckoutNext}
          />
        )}

        {wheelOpen && (
          <WheelModal
            total={getTotal()}
            wheelDeg={wheelDeg}
            spinning={spinning}
            rewardText={rewardText}
            onStart={startSpin}
            onSkip={skipWheel}
            onClose={function () {
              setWheelOpen(false);
            }}
            onNextPayment={goPaymentAfterWheel}
          />
        )}

        {paymentOpen && (
          <PaymentModal
            items={cart}
            total={getTotal()}
            rewardText={rewardText}
            onBack={function () {
              setPaymentOpen(false);
              setCheckoutOpen(true);
            }}
            onFinish={finishPayment}
          />
        )}
      </div>
    </div>
  );
}

function Header() {
  return (
    <header className="header-card">
      <div className="logo-box">
        <div className="logo-mark">☕</div>
      </div>

      <div className="shop-info">
        <h1>BITTER SWEET</h1>
        <h1>COFFEE ROASTY</h1>
        <p>精品咖啡・輕食點餐</p>
      </div>

      <div className="rules-box">
        <div className="rule-item">
          <strong>自備環保杯優惠 5 元</strong>
          <span>Use reusable cup: -5 NT</span>
        </div>

        <div className="rule-item">
          <strong>內用限時 60 分鐘</strong>
          <span>Time limit to stay: 60 mins</span>
        </div>
      </div>
    </header>
  );
}

function MenuRow(props) {
  const item = props.item;

  return (
    <div className="menu-row">
      <img src={item.image} alt={item.name} className="row-img" />

      <div className="row-info">
        <h3>{item.name}</h3>
        <p>{item.en}</p>

        <div className="variant-line">{renderVariantText(item)}</div>
      </div>

      <button className="row-add-btn" onClick={props.onAdd}>
        ＋
      </button>
    </div>
  );
}

function renderVariantText(item) {
  if (item.counterOnly === true) {
    return <span className="counter-price">價格請洽櫃台</span>;
  }

  if (item.priceNote !== undefined) {
    return <span className="variant-price">{item.priceNote}</span>;
  }

  return item.variants.map(function (variant) {
    return (
      <span className="variant-price" key={variant.label}>
        {variant.label} ${variant.price}
      </span>
    );
  });
}

function SizeModal(props) {
  if (props.item === null) {
    return null;
  }

  return (
    <div className="modal-bg center">
      <div className="option-modal">
        <button className="close-btn" onClick={props.onClose}>
          ×
        </button>

        <h2>選擇尺寸與價位</h2>

        <div className="selected-drink">
          <img src={props.item.image} alt={props.item.name} />
          <div>
            <strong>{props.item.name}</strong>
            <span>{props.item.en}</span>
          </div>
        </div>

        <div className="size-options">
          {props.item.variants.map(function (variant) {
            let className = "size-card";

            if (props.selectedVariant !== null) {
              if (props.selectedVariant.label === variant.label) {
                className = "size-card active";
              }
            }

            return (
              <button
                className={className}
                key={variant.label}
                onClick={function () {
                  props.onChooseVariant(variant);
                }}
              >
                <strong>{variant.label}</strong>
                <span>${variant.price}</span>
              </button>
            );
          })}
        </div>

        <div className="size-hint-box">
          <strong>☕ 其他飲品也可從此選擇尺寸</strong>

          <div className="mini-drinks">
            <MiniDrink name="美式咖啡" en="Americano" />
            <MiniDrink name="黑糖拿鐵" en="Black Sugar Latte" />
            <MiniDrink name="焦糖瑪奇朵" en="Caramel Macchiato" />
            <MiniDrink name="摩卡瑪奇朵" en="Mocca Macchiato" />
            <MiniDrink name="義式咖啡" en="Espresso" />
          </div>
        </div>

        <div className="modal-btn-row">
          <button className="gray-btn" onClick={props.onClose}>
            取消
          </button>

          <button className="orange-btn" onClick={props.onNext}>
            下一步
          </button>
        </div>
      </div>
    </div>
  );
}

function MiniDrink(props) {
  return (
    <div className="mini-drink">
      <div className="mini-circle">☕</div>
      <span>{props.name}</span>
      <small>{props.en}</small>
    </div>
  );
}

function AddonModal(props) {
  if (props.item === null) {
    return null;
  }

  if (props.variant === null) {
    return null;
  }

  let noAddonClass = "radio-dot";

  if (props.noAddon === true) {
    noAddonClass = "radio-dot checked";
  }

  let syrupCheckClass = "check-box";

  if (props.syrupSelected === true) {
    syrupCheckClass = "check-box checked";
  }

  let extraCheckClass = "check-box";

  if (props.extraShot === true) {
    extraCheckClass = "check-box checked";
  }

  return (
    <div className="modal-bg center">
      <div className="option-modal addon-modal">
        <button className="close-btn" onClick={props.onClose}>
          ×
        </button>

        <h2>是否加購？</h2>

        <div className="addon-summary">
          <img src={props.item.image} alt={props.item.name} />
          <strong>
            {props.item.name} / {props.variant.label} / ${props.variant.price}
          </strong>
        </div>

        <button className="addon-line" onClick={props.onNoAddon}>
          <span className={noAddonClass}></span>
          <span>不加購</span>
        </button>

        <button className="addon-line" onClick={props.onToggleSyrup}>
          <span className={syrupCheckClass}></span>
          <span>糖漿風味</span>
          <strong>+$10</strong>
        </button>

        <div className="syrup-list">
          {syrupOptions.map(function (syrup) {
            let className = "small-check";

            if (props.selectedSyrupId === syrup.id) {
              className = "small-check checked";
            }

            return (
              <button
                className="syrup-option"
                key={syrup.id}
                onClick={function () {
                  props.onChooseSyrup(syrup.id);
                }}
              >
                <span className={className}></span>
                <span>
                  {syrup.name} ({syrup.en})
                </span>
              </button>
            );
          })}
        </div>

        <div className="dash-line"></div>

        <button className="addon-line" onClick={props.onToggleExtraShot}>
          <span className={extraCheckClass}></span>
          <span>多一份義式咖啡</span>
          <strong>+$20</strong>
        </button>

        <p className="addon-note">限加一份 One more espresso shot</p>

        <div className="addon-total">
          <span>本品項金額</span>
          <strong>${props.previewTotal}</strong>
        </div>

        <div className="modal-btn-row">
          <button className="gray-btn" onClick={props.onBack}>
            返回
          </button>

          <button className="orange-btn" onClick={props.onAddCart}>
            加入購物車 🛒
          </button>
        </div>
      </div>
    </div>
  );
}

function CartModal(props) {
  return (
    <div className="modal-bg bottom">
      <div className="sheet">
        <div className="handle"></div>

        <h2>購物車內容</h2>

        <OrderList items={props.items} onRemove={props.onRemove} canRemove={true} />

        <div className="modal-total-row">
          <span>目前總額</span>
          <strong>${props.total}</strong>
        </div>

        <div className="modal-btn-row">
          <button className="gray-btn" onClick={props.onClose}>
            返回
          </button>

          <button className="orange-btn" onClick={props.onCheckout}>
            我要結帳
          </button>
        </div>
      </div>
    </div>
  );
}

function CheckoutModal(props) {
  return (
    <div className="modal-bg bottom">
      <div className="sheet">
        <div className="handle"></div>

        <h2>確認您的餐點與金額</h2>

        {props.total > 199 && (
          <p className="hint">訂單滿 $200，下一步可參加幸運轉盤</p>
        )}

        <OrderList items={props.items} />

        <div className="modal-total-row">
          <span>總計</span>
          <strong>${props.total}</strong>
        </div>

        <div className="modal-btn-row">
          <button className="gray-btn" onClick={props.onClose}>
            返回
          </button>

          <button className="orange-btn" onClick={props.onNext}>
            去結帳
          </button>
        </div>
      </div>
    </div>
  );
}

function WheelModal(props) {
  let startText = "開始";

  if (props.spinning === true) {
    startText = "轉動中...";
  }

  return (
    <div className="modal-bg center">
      <div className="wheel-modal">
        <button className="close-btn" onClick={props.onClose}>
          ×
        </button>

        <h2>✨ 幸運轉盤抽獎 ✨</h2>
        <p className="wheel-subtitle">單筆消費滿 $200，即可抽一次優惠好禮</p>

        <div className="pointer"></div>

        <div
          className="wheel-svg-wrap"
          style={{
            transform: "rotate(" + props.wheelDeg + "deg)",
          }}
        >
          <svg className="wheel-svg" viewBox="0 0 400 400">
            <circle cx="200" cy="200" r="192" fill="#102234" />

            <g transform="rotate(-22.5 200 200)">
              <path
                d="M200 200 L200 8 A192 192 0 0 1 335.8 64.2 Z"
                fill="#7d8bdd"
              />
              <path
                d="M200 200 L335.8 64.2 A192 192 0 0 1 392 200 Z"
                fill="#a7b0b5"
              />
              <path
                d="M200 200 L392 200 A192 192 0 0 1 335.8 335.8 Z"
                fill="#83bcb7"
              />
              <path
                d="M200 200 L335.8 335.8 A192 192 0 0 1 200 392 Z"
                fill="#e0c971"
              />
              <path
                d="M200 200 L200 392 A192 192 0 0 1 64.2 335.8 Z"
                fill="#d6a06e"
              />
              <path
                d="M200 200 L64.2 335.8 A192 192 0 0 1 8 200 Z"
                fill="#c47a8d"
              />
              <path
                d="M200 200 L8 200 A192 192 0 0 1 64.2 64.2 Z"
                fill="#8d61b7"
              />
              <path
                d="M200 200 L64.2 64.2 A192 192 0 0 1 200 8 Z"
                fill="#93aedf"
              />

              <line x1="200" y1="8" x2="200" y2="392" className="wheel-line" />
              <line x1="8" y1="200" x2="392" y2="200" className="wheel-line" />
              <line
                x1="64.2"
                y1="64.2"
                x2="335.8"
                y2="335.8"
                className="wheel-line"
              />
              <line
                x1="335.8"
                y1="64.2"
                x2="64.2"
                y2="335.8"
                className="wheel-line"
              />
            </g>

            <text x="200" y="74" className="wheel-prize-text">
              <tspan x="200" dy="0">
                甜點
              </tspan>
              <tspan x="200" dy="22">
                折20元
              </tspan>
            </text>

            <text x="292" y="110" className="wheel-prize-text">
              <tspan x="292" dy="0">
                95折
              </tspan>
              <tspan x="292" dy="22">
                優惠
              </tspan>
            </text>

            <text x="322" y="200" className="wheel-prize-text">
              <tspan x="322" dy="-10">
                免費
              </tspan>
              <tspan x="322" dy="22">
                加濃縮
              </tspan>
            </text>

            <text x="292" y="290" className="wheel-prize-text">
              <tspan x="292" dy="0">
                下次
              </tspan>
              <tspan x="292" dy="22">
                折10元
              </tspan>
            </text>

            <text x="200" y="326" className="wheel-prize-text">
              <tspan x="200" dy="0">
                升級
              </tspan>
              <tspan x="200" dy="22">
                大杯
              </tspan>
            </text>

            <text x="108" y="290" className="wheel-prize-text">
              <tspan x="108" dy="0">
                環保杯
              </tspan>
              <tspan x="108" dy="22">
                折5元
              </tspan>
            </text>

            <text x="78" y="200" className="wheel-prize-text">
              <tspan x="78" dy="-10">
                買一
              </tspan>
              <tspan x="78" dy="22">
                送一券
              </tspan>
            </text>

            <text x="108" y="110" className="wheel-prize-text">
              <tspan x="108" dy="0">
                謝謝
              </tspan>
              <tspan x="108" dy="22">
                參與
              </tspan>
            </text>

            <circle cx="200" cy="200" r="52" fill="#eed57b" />
            <circle cx="200" cy="200" r="41" fill="#d78436" />

            <text x="200" y="193" className="wheel-center-svg-start">
              START
            </text>
            <text x="200" y="224" className="wheel-center-svg-main">
              開始
            </text>
          </svg>
        </div>

        <div className="qualified-box">
          <span>本次訂單金額：</span>
          <strong>${props.total}</strong>
          <em>已符合抽獎資格</em>
        </div>

        {props.rewardText !== "" && (
          <div className="result-box">
            <span>抽獎結果</span>
            <strong>{props.rewardText}</strong>
          </div>
        )}

        <p className="wheel-note">
          抽獎完成後將顯示本次獲得的優惠，再進入付款流程。
        </p>

        {props.rewardText === "" && (
          <button className="spin-btn" onClick={props.onStart}>
            {startText}
          </button>
        )}

        {props.rewardText !== "" && (
          <button className="spin-btn" onClick={props.onNextPayment}>
            前往付款
          </button>
        )}

        <button className="skip-btn" onClick={props.onSkip}>
          稍後使用
        </button>
      </div>
    </div>
  );
}

function PaymentModal(props) {
  return (
    <div className="modal-bg bottom">
      <div className="sheet">
        <div className="handle"></div>

        <h2>付款確認</h2>

        <OrderList items={props.items} />

        {props.rewardText !== "" && (
          <div className="payment-reward">
            <span>本次優惠</span>
            <strong>{props.rewardText}</strong>
          </div>
        )}

        <div className="pay-box">
          <h3>付款方式</h3>

          <div className="line-pay">
            <span>LINE Pay</span>
            <strong>LINE Pay</strong>
          </div>
        </div>

        <div className="modal-total-row">
          <span>訂單總額</span>
          <strong>${props.total}</strong>
        </div>

        <div className="modal-btn-row">
          <button className="gray-btn" onClick={props.onBack}>
            返回
          </button>

          <button className="orange-btn" onClick={props.onFinish}>
            確認付款
          </button>
        </div>
      </div>
    </div>
  );
}

function OrderList(props) {
  return (
    <div className="order-list">
      {props.items.map(function (item) {
        return (
          <div className="order-row" key={item.cartId}>
            <div className="order-left">
              <img src={item.image} alt={item.name} />

              <div>
                <h4>{item.name}</h4>
                <p>
                  {item.en} / {item.size}
                </p>

                <div className="addon-text">
                  {item.addons.map(function (addon) {
                    return <span key={addon}>{addon}</span>;
                  })}
                </div>
              </div>
            </div>

            <div className="order-right">
              <span>x{item.qty}</span>
              <strong>${item.price}</strong>

              {props.canRemove === true && (
                <button
                  className="remove-order-btn"
                  onClick={function () {
                    props.onRemove(item.cartId);
                  }}
                >
                  移除
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}