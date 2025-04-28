"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchProducts } from "@/redux/features/productSlice";
import ProductCard from "./product-card";
import { Loader2 } from "lucide-react";

export default function ProductList() {
  const dispatch = useAppDispatch();
  const { products, loading, error } = useAppSelector(
    (state) => state.products
  );

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500">
        <p>Error loading products: {error}</p>
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="text-center">
        <p>No products found</p>
      </div>
    );
  }

  console.log("Products:", products);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {!!products?.length &&
        products?.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
    </div>
  );
}
