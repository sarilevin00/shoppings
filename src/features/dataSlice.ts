import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Category {
  id: number;
  name: string;
}

export interface Product {
  id: number;
  name: string;
  categoryId: number;
  price: number;
}

interface DataState {
  categories: Category[];
  products: Product[];
  status: "idle" | "loading" | "failed";
  error?: string | null;
}

const initialState: DataState = {
  categories: [],
  products: [],
  status: "idle",
  error: null
};

export const fetchData = createAsyncThunk("data/fetchData", async () => {
  const res = await fetch("/data.json");
  if (!res.ok) throw new Error("Failed to fetch data.json");
  return res.json();
});

const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchData.fulfilled, (state, action: PayloadAction<any>) => {
        state.status = "idle";
        state.categories = action.payload.categories || [];
        state.products = action.payload.products || [];
      })
      .addCase(fetchData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "unknown error";
      });
  }
});

export default dataSlice.reducer;