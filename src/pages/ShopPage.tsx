import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import { fetchData } from "../features/dataSlice";
import CategoryList from "../components/CategoryList";
import ProductList from "../components/ProductList";
import Cart from "../components/Cart";

export default function ShopPage() {
  const dispatch = useAppDispatch();
  const { categories, products, status, error } = useAppSelector((s) => s.data);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchData());
  }, [dispatch]);

  useEffect(() => {
    if (selectedCategoryId === null && categories.length > 0) {
      setSelectedCategoryId(categories[0].id);
    }
  }, [categories, selectedCategoryId]);

  return (
    <div style={{ display: "flex", gap: 24, padding: 20, fontFamily: "Arial, Helvetica, sans-serif" }}>
      <div style={{ flex: 1 }}>
        <h2>קטגוריות</h2>
        {status === "loading" && <div>טוען...</div>}
        {error && <div style={{ color: "red" }}>{error}</div>}
        <CategoryList
          categories={categories}
          selectedId={selectedCategoryId}
          onSelect={(id) => setSelectedCategoryId(id)}
        />

        <h2>מוצרים</h2>
        <ProductList
          products={products}
          selectedCategoryId={selectedCategoryId}
        />
      </div>

      <aside style={{ width: 380, borderLeft: "1px solid #ddd", paddingLeft: 20 }}>
        <h2>עגלה</h2>
        <Cart />
      </aside>
    </div>
  );
}