import React, { useState } from "react";
import { Product } from "../features/dataSlice";
import { useAppDispatch } from "../hooks";
import { addToCart } from "../features/cartSlice";

interface Props {
  products: Product[];
  selectedCategoryId: number | null;
}

export default function ProductList({ products, selectedCategoryId }: Props) {
  const dispatch = useAppDispatch();

  // local map of quantities per product
  const [quantities, setQuantities] = useState<Record<number, number>>({});

  const filtered = selectedCategoryId
    ? products.filter((p) => p.categoryId === selectedCategoryId)
    : products;

  const setQty = (productId: number, q: number) => {
    setQuantities((prev) => ({ ...prev, [productId]: q }));
  };

  const handleAdd = (p: Product) => {
    const qty = Math.max(1, Math.floor(Number(quantities[p.id] ?? 1)));
    dispatch(addToCart({ productId: p.id, name: p.name, price: p.price, quantity: qty }));
    // איפוס כמות ל-1 אחרי הוספה (רצוני)
    setQuantities((prev) => ({ ...prev, [p.id]: 1 }));
  };

  if (filtered.length === 0) return <div>אין מוצרים לקטגוריה זו.</div>;

  return (
    <div style={{ display: "grid", gap: 12 }}>
      {filtered.map((p) => (
        <div key={p.id} style={{ padding: 12, border: "1px solid #eee", borderRadius: 6 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <strong>{p.name}</strong>
            <span>{p.price.toFixed(2)} ₪</span>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input
              type="number"
              min={1}
              value={quantities[p.id] ?? 1}
              onChange={(e) => setQty(p.id, Math.max(1, Number(e.target.value)))}
              style={{ width: 80, padding: 6 }}
            />
            <button onClick={() => handleAdd(p)} style={{ padding: "6px 12px", cursor: "pointer" }}>
              הוסף מוצר לסל
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}