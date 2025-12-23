import React from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import { removeFromCart, updateQuantity, clearCart } from "../features/cartSlice";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const items = useAppSelector((s) => s.cart.items);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const total = items.reduce((acc, i) => acc + i.price * i.quantity, 0);

  if (items.length === 0) return <div>העגלה ריקה.</div>;

  return (
    <div>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {items.map((it) => (
          <li key={it.productId} style={{ marginBottom: 12, borderBottom: "1px solid #eee", paddingBottom: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontWeight: 600 }}>{it.name}</div>
                <div style={{ color: "#666", fontSize: 14 }}>
                  {it.price.toFixed(2)} ₪ &times; {it.quantity} = {(it.price * it.quantity).toFixed(2)} ₪
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <input
                  type="number"
                  min={1}
                  value={it.quantity}
                  onChange={(e) => {
                    const q = Math.max(1, Number(e.target.value));
                    dispatch(updateQuantity({ productId: it.productId, quantity: q }));
                  }}
                  style={{ width: 60, padding: 6 }}
                />
                <button onClick={() => dispatch(removeFromCart(it.productId))} style={{ padding: "6px 8px" }}>
                  הסר
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div style={{ marginTop: 12, fontWeight: 700 }}>סך הכל: {total.toFixed(2)} ₪</div>

      <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
        <button onClick={() => navigate("/checkout")} style={{ padding: "8px 12px" }}>
          המשך להזמנה
        </button>
        <button onClick={() => dispatch(clearCart())} style={{ padding: "8px 12px" }}>
          רוקן עגלה
        </button>
      </div>
    </div>
  );
}