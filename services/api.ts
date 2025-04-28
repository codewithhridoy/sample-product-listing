import axios from "axios"
import type {OrderData, Product} from "@/types/product"

const api = axios.create({
  baseURL: "https://admin.refabry.com/api",
  headers: {
    "Content-Type": "application/json",
  },
})

export const fetchAllProducts = async () => {
  return api.get<Product[]>("/all/product/get")
}

export const fetchProductById = async (id: string) => {
  return api.get<Product>(`/all/product/get/${id}`)
}

export const placeOrder = async (orderData: OrderData) => {
  try {
    return await api.post("/public/order/create", orderData)
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      // Return the error response to handle it in the component
      return error.response
    }
    throw error
  }
}
