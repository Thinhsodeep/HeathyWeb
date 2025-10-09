import { useMemo, useState } from "react";
import "./App.css";

// ======= Dữ liệu mẫu =======
const PRODUCTS = [
  { id: 1, name: "Áo thun Basic", price: 129000, category: "Áo", rating: 4.5, image: "https://picsum.photos/seed/shirt1/600/400" },
  { id: 2, name: "Áo sơ mi Oxford", price: 259000, category: "Áo", rating: 4.7, image: "https://picsum.photos/seed/shirt2/600/400" },
  { id: 3, name: "Quần jean Slim", price: 399000, category: "Quần", rating: 4.4, image: "https://picsum.photos/seed/jeans1/600/400" },
  { id: 4, name: "Quần short Kaki", price: 199000, category: "Quần", rating: 4.2, image: "https://picsum.photos/seed/shorts1/600/400" },
  { id: 5, name: "Giày sneaker Trắng", price: 549000, category: "Giày", rating: 4.8, image: "https://picsum.photos/seed/shoes1/600/400" },
  { id: 6, name: "Giày chạy bộ", price: 639000, category: "Giày", rating: 4.6, image: "https://picsum.photos/seed/shoes2/600/400" },
  { id: 7, name: "Áo khoác Gió", price: 459000, category: "Áo", rating: 4.3, image: "https://picsum.photos/seed/jacket1/600/400" },
  { id: 8, name: "Quần jogger", price: 279000, category: "Quần", rating: 4.1, image: "https://picsum.photos/seed/jogger/600/400" },
];
const CATEGORIES = ["Tất cả", "Áo", "Quần", "Giày"];

const currency = (n) => n.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

function Stars({ value = 0 }) {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  return (
    <div className="stars" title={`Đánh giá ${value}/5`}>
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i < full || (i === full && half);
        return <span key={i} className={`star ${filled ? "filled" : ""}`}>★</span>;
      })}
    </div>
  );
}

export default function App() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Tất cả");
  const [sort, setSort] = useState("popular");
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState([]); // {id,name,price,qty,image}

  const filtered = useMemo(() => {
    let list = PRODUCTS.filter(
      (p) =>
        (!query || p.name.toLowerCase().includes(query.toLowerCase())) &&
        (category === "Tất cả" || p.category === category)
    );
    if (sort === "priceAsc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "priceDesc") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "rating") list = [...list].sort((a, b) => b.rating - a.rating);
    return list;
  }, [query, category, sort]);

  const add = (id) => {
    const p = PRODUCTS.find((x) => x.id === id);
    setCart((prev) => {
      const exist = prev.find((x) => x.id === id);
      if (exist) return prev.map((x) => (x.id === id ? { ...x, qty: x.qty + 1 } : x));
      return [...prev, { id: p.id, name: p.name, price: p.price, qty: 1, image: p.image }];
    });
  };
  const inc = (id) => setCart((prev) => prev.map((x) => (x.id === id ? { ...x, qty: x.qty + 1 } : x)));
  const dec = (id) =>
    setCart((prev) => prev.flatMap((x) => (x.id === id ? (x.qty > 1 ? [{ ...x, qty: x.qty - 1 }] : []) : [x])));
  const remove = (id) => setCart((prev) => prev.filter((x) => x.id !== id));
  const total = cart.reduce((s, x) => s + x.price * x.qty, 0);

  return (
    <div className="page">
      {/* header */}
      <header className="header">
        <div className="container header-inner">
          <div className="logo">🛍️ SimpleStore</div>
          <button className="btn primary" onClick={() => setCartOpen(true)}>
            Giỏ hàng • {cart.length}
          </button>
        </div>
      </header>

      {/* filters */}
      <section className="container controls">
        <input
          className="input"
          placeholder="Tìm sản phẩm..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="control-right">
          <select className="select" value={category} onChange={(e) => setCategory(e.target.value)}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <select className="select" value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="popular">Phổ biến</option>
            <option value="priceAsc">Giá tăng dần</option>
            <option value="priceDesc">Giá giảm dần</option>
            <option value="rating">Đánh giá cao</option>
          </select>
        </div>
      </section>

      {/* grid */}
      <main className="container grid">
        {filtered.map((p) => (
          <article key={p.id} className="card">
            <img className="card-img" src={p.image} alt={p.name} />
            <div className="card-body">
              <h3 className="card-title" title={p.name}>{p.name}</h3>
              <div className="row space-between">
                <span className="price">{currency(p.price)}</span>
                <Stars value={p.rating} />
              </div>
              <div className="row space-between">
                <span className="badge">{p.category}</span>
                <button className="btn" onClick={() => add(p.id)}>Thêm vào giỏ</button>
              </div>
            </div>
          </article>
        ))}
      </main>

      {/* cart drawer */}
      {cartOpen && (
        <div className="drawer">
          <div className="backdrop" onClick={() => setCartOpen(false)} />
          <aside className="panel">
            <div className="panel-head">
              <h2>Giỏ hàng ({cart.length})</h2>
              <button className="link" onClick={() => setCart([])}>Xoá hết</button>
            </div>

            <div className="panel-body">
              {cart.length === 0 && <p className="muted">Chưa có sản phẩm nào.</p>}
              {cart.map((item) => (
                <div key={item.id} className="cart-item">
                  <img src={item.image} alt="" />
                  <div className="cart-info">
                    <div className="name" title={item.name}>{item.name}</div>
                    <div className="muted">{currency(item.price)}</div>
                    <div className="qty">
                      <button onClick={() => dec(item.id)}>-</button>
                      <span>{item.qty}</span>
                      <button onClick={() => inc(item.id)}>+</button>
                    </div>
                  </div>
                  <button className="link danger" onClick={() => remove(item.id)}>Xoá</button>
                </div>
              ))}
            </div>

            <div className="panel-foot">
              <div className="row space-between">
                <span className="bold">Tổng cộng</span>
                <span className="total">{currency(total)}</span>
              </div>
              <button className="btn primary wide">Thanh toán</button>
              <button className="btn wide" onClick={() => setCartOpen(false)}>Tiếp tục mua</button>
            </div>
          </aside>
        </div>
      )}

      <footer className="footer">
        © {new Date().getFullYear()} SimpleStore • React + CSS
      </footer>
    </div>
  );
}
