import React from "react";
import { Category } from "../features/dataSlice";

interface Props {
  categories: Category[];
  selectedId: number | null;
  onSelect: (id: number) => void;
}

export default function CategoryList({ categories, selectedId, onSelect }: Props) {
  return (
    <div>
      {categories.map((c) => (
        <button
          key={c.id}
          onClick={() => onSelect(c.id)}
          style={{
            display: "block",
            padding: "8px 12px",
            marginBottom: 8,
            background: c.id === selectedId ? "#0366d6" : "#f1f1f1",
            color: c.id === selectedId ? "white" : "black",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
            textAlign: "left",
            width: "100%"
          }}
        >
          {c.name}
        </button>
      ))}
    </div>
  );
}