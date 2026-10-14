
import { useState } from "react";
import Swal from "sweetalert2";

import "./Einkaufen.css";

import Jana from "../../../assets/cute-girl-with-glasses-yellow-jacket-transparent-background_574412-9543-removebg-preview.png";
import ShoppingCart from "../../../assets/shopping-cart-illustration_1496499-166-removebg-preview.png";

import Pizza from "../../../assets/pizza.png";
import Eis from "../../../assets/ice-cream.webp";
import Schokolade from "../../../assets/chocholate.webp";
import Brot from "../../../assets/bread-2.png";
import Kaese from "../../../assets/pngtree-yellow-cartoon-cheese-vector-illustration-png-image_20767423.png";
import Salat from "../../../assets/salat-2.png";
import Joghurt from "../../../assets/yogurt.png";
import Kuchen from "../../../assets/pngtree-ice-cream-cake-clipart-vector-png-image_6864445.png";

const products = [
  { id: 1, name: "Pizza", image: Pizza, emoji: "🍕" },
  { id: 2, name: "Eis", image: Eis, emoji: "🍦" },
  { id: 3, name: "Schokolade", image: Schokolade, emoji: "🍫" },
  { id: 4, name: "Brot", image: Brot, emoji: "🍞" },
  { id: 5, name: "Käse", image: Kaese, emoji: "🧀" },
  { id: 6, name: "Salat", image: Salat, emoji: "🥗" },
  { id: 7, name: "Joghurt", image: Joghurt, emoji: "🥛" },
  { id: 8, name: "Kuchen", image: Kuchen, emoji: "🍰" },
];

// المنتجات الموجودة على الرفوف
const shelves = [
  ["Pizza", "Brot", "Joghurt"],
  ["Eis", "Käse", null],
  ["Schokolade", "Salat", "Kuchen"],
];

// إنشاء قائمة عشوائية من 3 منتجات مختلفة
const getRandomShoppingList = () => {
  const shuffled = [...products];

  // خلط المنتجات عشوائيًا
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled.slice(0, 3).map((product) => product.name);
};

const getProduct = (name) =>
  products.find((product) => product.name === name);

function Einkaufen() {
  const [shoppingList, setShoppingList] = useState(
    getRandomShoppingList
  );

  const [collectedItems, setCollectedItems] = useState([]);

  const score = collectedItems.length;
  const total = shoppingList.length + collectedItems.length;

  // بدء جولة جديدة بقائمة مختلفة
  const resetGame = () => {
    setShoppingList(getRandomShoppingList());
    setCollectedItems([]);
  };

  const handleProductClick = (product) => {
    const isNeeded = shoppingList.includes(product.name);

    // المنتج مش موجود في القائمة
    if (!isNeeded) {
      Swal.fire({
        title: "Nicht auf der Liste! 😅",
        text: `${product.name} brauchst du nicht.`,
        confirmButtonText: "OK",
        confirmButtonColor: "#f59e0b",
      });

      return;
    }

    // إزالة المنتج من القائمة بعد جمعه
    const remaining = shoppingList.filter(
      (item) => item !== product.name
    );

    setCollectedItems((prev) => [...prev, product.name]);
    setShoppingList(remaining);

    // انتهاء الجولة
    if (remaining.length === 0) {
      setTimeout(() => {
        Swal.fire({
          title: "Super gemacht! 🎉",
          text: "Du hast alles eingekauft!",
          icon: "success",
          confirmButtonText: "Weiter ⭐",
          confirmButtonColor: "#f59e0b",
        }).then((result) => {
          if (result.isConfirmed) {
            resetGame();
          }
        });
      }, 400);
    }
  };

  return (
    <div className="einkaufen">
      {/* HEADER */}
      <header className="einkaufen-header">
        <h1>🛒 Im Supermarkt</h1>

        <div className="player-stars">
          ⭐ {score}
        </div>
      </header>

      {/* SUPERMARKET */}
      <main className="supermarket">
        <div className="supermarket-sign">
          🛒 SUPERMARKT
        </div>

        {/* SHOPPING LIST */}
        <div className="shopping-list">
          <div className="list-pin">📌</div>

          <h2>Meine Liste</h2>

          {shoppingList.length > 0 ? (
            shoppingList.map((item) => (
              <div className="list-item" key={item}>
                <span>{getProduct(item)?.emoji}</span>
                <span>{item}</span>
              </div>
            ))
          ) : (
            <div className="list-complete">
              🎉 Alles fertig!
            </div>
          )}

          <div className="list-progress">
            {collectedItems.length} / {total} ⭐
          </div>
        </div>

        {/* SHELVES AND PRODUCTS */}
        <div className="shelves">
          {shelves.map((levels, shelfIndex) => (
            <div className="shelf" key={shelfIndex}>
              {levels.map((name, levelIndex) => {
                const product = name ? getProduct(name) : null;

                const isCollected =
                  product &&
                  collectedItems.includes(product.name);

                return (
                  <div
                    className="shelf-level"
                    key={levelIndex}
                  >
                    {product && !isCollected && (
                      <button
                        type="button"
                        className="product"
                        onClick={() =>
                          handleProductClick(product)
                        }
                        aria-label={product.name}
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                        />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* JANA AND SHOPPING CART */}
        <div className="bottom-area">
          <div className="jana-character">
            <img src={Jana} alt="Jana" />
          </div>

          <div className="shopping-cart">
            <img
              src={ShoppingCart}
              alt="Shopping Cart"
            />

            <div className="cart-items">
              {collectedItems.map((item) => (
                <img
                  key={item}
                  src={getProduct(item).image}
                  alt={item}
                />
              ))}
            </div>
          </div>
        </div>

        {/* DECORATIONS */}
        <div className="decoration decoration-one">
          ⭐
        </div>

        <div className="decoration decoration-two">
          ✨
        </div>

        <div className="decoration decoration-three">
          ⭐
        </div>
      </main>
    </div>
  );
}

export default Einkaufen;
