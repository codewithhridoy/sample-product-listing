"use client"

import { useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import OrderForm from "@/components/order-form"
import { Card, CardContent } from "@/components/ui/card"

export default function ProductDetail() {
  const { id } = useParams()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { currentProduct, products, loading } = useAppSelector((state) => state.products)

  // If no current product is set but we have products in the store, try to find it by ID
  useEffect(() => {
    if (!currentProduct && products.length > 0 && id) {
      const foundProduct = products.find((p) => p.id.toString() === id.toString())
      if (!foundProduct) {
        router.push("/")
      }
    }
  }, [currentProduct, products, id, router, dispatch])


  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!currentProduct) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p>Product not found or no product selected</p>
        <Button onClick={() => router.push("/")} className="mt-4">
          Back to Products
        </Button>
      </div>
    )
  }

  const imageUrl = currentProduct.image
    ? `https://admin.refabry.com/storage/product/${currentProduct.image}`
    : "/placeholder.svg?height=400&width=400"

  return (
    <div className="container mx-auto px-4 py-8">
      <Button onClick={() => router.push("/")} variant="outline" className="mb-6">
        ← Back to Products
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative h-[400px] rounded-lg overflow-hidden">
          <Image
            src={imageUrl || "/placeholder.svg"}
            alt={currentProduct.name || "Product image"}
            fill
            className="object-contain"
            priority
          />
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-2">{currentProduct.name}</h1>
          <p className="text-2xl font-semibold text-primary mb-4">৳{currentProduct.price}</p>

          {currentProduct.discount_price && (
            <p className="text-lg text-muted-foreground mb-2">
              <span className="line-through">৳{currentProduct.regular_price}</span>
              <span className="ml-2 text-green-600">
                {Math.round(
                  ((Number(currentProduct.regular_price) - currentProduct.price) / Number(currentProduct.regular_price)) * 100,
                )}
                % off
              </span>
            </p>
          )}

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-muted-foreground">{currentProduct.description || "No description available"}</p>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Details</h3>
            <ul className="list-disc list-inside text-muted-foreground">
              {!!currentProduct?.category?.id && <li>Category: {currentProduct?.category?.name}</li>}
              {!!currentProduct?.stock && <li>In Stock: {currentProduct.stock}</li>}
              {!!currentProduct?.sku && <li>SKU: {currentProduct.sku}</li>}
            </ul>
          </div>
        </div>
      </div>

       <Card className="mt-12">
         <CardContent className="pt-6">
           <h2 className="text-2xl font-bold mb-6">Place an Order</h2>
           <OrderForm productId={currentProduct.id} productPrice={currentProduct.price} />
         </CardContent>
       </Card>
    </div>
  )
}
