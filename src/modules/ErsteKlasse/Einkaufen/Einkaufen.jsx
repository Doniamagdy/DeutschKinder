import { useState } from "react";
import Swal from "sweetalert2";

import "./Einkaufen.css";

import Jana from "../../../assets/cute-girl-cartoon-character-hand-drawn-doodle-style-isolated-white-background_1023984-30542.avif";
import ShoppingCart from "../../../assets/shopping-cart-illustration_1496499-166.png";

import Pizza from "../../../assets/Pizza.png";
import Eis from "../../../assets/ice-cream.webp";
import Schokolade from "../../../assets/chocholate.webp";
import Brot from "../../../assets/bread.jpg";
import Kaese from "../../../assets/cheese.avif";
import Salat from "../../../assets/salad.jpg";
import Joghurt from "../../../assets/yogurt.png";
import Kuchen from "../../../assets/kuchen.avif";

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

// كل رف فيه 3 مستويات، وكل مستوى فيه منتج واحد (أو null لو فاضي)
const shelves = [
  ["Pizza", "Brot", "Joghurt"],
  ["Eis", "Käse", null],
  ["Schokolade", "Salat", "Kuchen"],
];

const INITIAL_LIST = ["Pizza", "Eis", "Schokolade"];
const TOTAL = INITIAL_LIST.length;

const getProduct = (name) => products.find((p) => p.name === name);

function Einkaufen() {
  const [shoppingList, setShoppingList] = useState(INITIAL_LIST);
  const [collectedItems, setCollectedItems] = useState([]);

  const score = collectedItems.length;

  const resetGame = () => {
    setShoppingList(INITIAL_LIST);
    setCollectedItems([]);
  };

  const handleProductClick = (product) => {
    const isNeeded = shoppingList.includes(product.name);

    // المنتج مش في القائمة
    if (!isNeeded) {
      Swal.fire({
        title: "Nicht auf der Liste! 😅",
        text: `${product.name} brauchst du nicht.`,
        confirmButtonText: "OK",
        confirmButtonColor: "#f59e0b",
      });
      return;
    }

    const remaining = shoppingList.filter((item) => item !== product.name);

    setCollectedItems((prev) => [...prev, product.name]);
    setShoppingList(remaining);

    // القائمة خلصت
    if (remaining.length === 0) {
      setTimeout(() => {
        Swal.fire({
          title: "Super gemacht! 🎉",
          text: "Du hast alles eingekauft!",
          icon: "success",
          confirmButtonText: "Weiter ⭐",
          confirmButtonColor: "#f59e0b",
        }).then(resetGame);
      }, 400);
    }
  };

  return (
    <div className="einkaufen">
      {/* ===== HEADER ===== */}
      <header className="einkaufen-header">
        <h1>🛒 Jana's Supermarkt</h1>
        <div className="player-stars">⭐ {score}</div>
      </header>

      {/* ===== SUPERMARKET ===== */}
      <main className="supermarket">
        <div className="supermarket-sign">🛒 SUPERMARKT</div>

        {/* قائمة التسوق */}
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
            <div className="list-complete">🎉 Alles fertig!</div>
          )}

          <div className="list-progress">
            {collectedItems.length} / {TOTAL} ⭐
          </div>
        </div>

        {/* الرفوف + المنتجات */}
        <div className="shelves">
          {shelves.map((levels, shelfIndex) => (
            <div className="shelf" key={shelfIndex}>
              {levels.map((name, levelIndex) => {
                const product = name ? getProduct(name) : null;
                const isCollected =
                  product && collectedItems.includes(product.name);

                return (
                  <div className="shelf-level" key={levelIndex}>
                    {product && !isCollected && (
                      <button
                        type="button"
                        className="product"
                        onClick={() => handleProductClick(product)}
                      >
                        <img src={product.image} alt={product.name} />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* جانا + العربية */}
        <div className="bottom-area">
          <div className="jana-character">
            <img src={Jana} alt="Jana" />
          </div>

          <div className="shopping-cart">
            <img src={ShoppingCart} alt="Shopping Cart" />
            <div className="cart-items">
              {collectedItems.map((item) => (
                <img key={item} src={getProduct(item).image} alt={item} />
              ))}
            </div>
          </div>
        </div>

        {/* زينة */}
        <div className="decoration decoration-one">⭐</div>
        <div className="decoration decoration-two">✨</div>
        <div className="decoration decoration-three">⭐</div>
      </main>
    </div>
  );
}

export default Einkaufen;