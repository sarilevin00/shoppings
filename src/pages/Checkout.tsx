import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import { clearCart } from "../features/cartSlice";
import { useNavigate } from "react-router-dom";

interface OrderPayload {
  customer: {
    firstName: string;
    lastName: string;
    address: string;
    email: string;
  };
  items: {
    productId: number;
    name: string;
    price: number;
    quantity: number;
  }[];
  total: number;
  createdAt?: string;
}

const ORDERS_API = process.env.REACT_APP_ORDERS_API_URL || "http://localhost:4000";

export default function Checkout() {
  const items = useAppSelector(s => s.cart.items);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const total = items.reduce((acc, i) => acc + i.price * i.quantity, 0);

  const validate = () => {
    if (!firstName.trim() || !lastName.trim() || !address.trim() || !email.trim()) {
      return false;
    }
    // בדיקה בסיסית של מייל
    if (!/^\S+@\S+\.\S+$/.test(email)) return false;
    if (items.length === 0) return false;
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!validate()) {
      setError("אנא מלא/י את כל השדות כהלכה וודא/י שיש מוצרים בעגלה.");
      return;
    }

    const payload: OrderPayload = {
      customer: { firstName, lastName, address, email },
      items: items.map(i => ({ productId: i.productId, name: i.name, price: i.price, quantity: i.quantity })),
      total,
      createdAt: new Date().toISOString()
    };

    try {
      setSubmitting(true);
      const res = await fetch(`${ORDERS_API}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Server error");
      }
      const data = await res.json();
      setSuccessMsg(`הזמנה נשלחה בהצלחה (id: ${data.id || data._id || data.result})`);
      dispatch(clearCart());
      // ניתן לנווט חזרה לעמוד הראשי לאחר שניות
      setTimeout(() => navigate("/"), 2500);
    } catch (err: any) {
      setError(err.message || "שגיאה בשליחת ההזמנה");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: 820, margin: "0 auto", fontFamily: "Arial, Helvetica, sans-serif" }}>
      <h2>סיכום ההזמנה</h2>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
        <div style={{ display: "flex", gap: 8 }}>
          <input placeholder="שם פרטי" value={firstName} onChange={(e) => setFirstName(e.target.value)} required style={{ flex: 1, padding: 8 }} />
          <input placeholder="שם משפחה" value={lastName} onChange={(e) => setLastName(e.target.value)} required style={{ flex: 1, padding: 8 }} />
        </div>

        <input placeholder="כתובת מלאה" value={address} onChange={(e) => setAddress(e.target.value)} required style={{ padding: 8 }} />
        <input placeholder="אימייל" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ padding: 8 }} />

        <h3>המוצרים בעגלה</h3>
        {items.length === 0 ? <div>אין מוצרים בעגלה.</div> : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {items.map(it => (
              <li key={it.productId} style={{ display: "flex", justifyContent: "space-between", padding: 8, borderBottom: "1px solid #eee" }}>
                <div>
                  <div style={{ fontWeight: 600 }}>{it.name}</div>
                  <div style={{ color: "#666" }}>{it.quantity} × {it.price.toFixed(2)} ₪</div>
                </div>
                <div style={{ alignSelf: "center", fontWeight: 700 }}>{(it.price * it.quantity).toFixed(2)} ₪</div>
              </li>
            ))}
          </ul>
        )}

        <div style={{ fontWeight: 800 }}>סה"כ להזמנה: {total.toFixed(2)} ₪</div>

        {error && <div style={{ color: "red" }}>{error}</div>}
        {successMsg && <div style={{ color: "green" }}>{successMsg}</div>}

        <div style={{ display: "flex", gap: 8 }}>
          <button type="submit" disabled={submitting} style={{ padding: "8px 12px" }}>
            {submitting ? "שולח..." : "אשר הזמנה"}
          </button>
        </div>
      </form>
    </div>
  );
}