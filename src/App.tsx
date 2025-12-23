import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import ShopPage from "./pages/ShopPage";
import Checkout from "./pages/Checkout";

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ padding: 12 }}>
        <header style={{ marginBottom: 12 }}>
          <nav style={{ display: "flex", gap: 8 }}>
            <Link to="/">חנות</Link>
            <Link to="/checkout">סיכום הזמנה</Link>
          </nav>
        </header>

        <Routes>
          <Route path="/" element={<ShopPage />} />
          <Route path="/checkout" element={<Checkout />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}