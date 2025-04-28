import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import { fetchAllProducts, fetchProductById } from "@/services/api"
import type { Product } from "@/types/product"

interface ProductState {
  products: Product[]
  currentProduct: Product | null
  loading: boolean
  error: string | null
}

const initialState: ProductState = {
  products: [],
  currentProduct: null,
  loading: false,
  error: null,
}

export const fetchProducts = createAsyncThunk("products/fetchProducts", async (_, { rejectWithValue }) => {
  try {
    const response = await fetchAllProducts()

    return response?.data?.data?.data ?? [];
  } catch (error) {
    return rejectWithValue("Failed to fetch products")
  }
})

export const fetchSingleProduct = createAsyncThunk(
  "products/fetchSingleProduct",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await fetchProductById(id)

      return response?.data?.data?.data ?? [];
    } catch (error) {
      return rejectWithValue("Failed to fetch product details")
    }
  },
)

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setCurrentProduct: (state, action: PayloadAction<Product>) => {
      state.currentProduct = action.payload
    },
    clearCurrentProduct: (state) => {
      state.currentProduct = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.loading = false
        state.products = action.payload
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // Fetch single product
      .addCase(fetchSingleProduct.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchSingleProduct.fulfilled, (state, action: PayloadAction<Product>) => {
        state.loading = false
        state.currentProduct = action.payload
      })
      .addCase(fetchSingleProduct.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { setCurrentProduct, clearCurrentProduct } = productSlice.actions
export default productSlice.reducer
