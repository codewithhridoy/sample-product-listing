import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import type { Product } from "@/types/product";
import {useAppDispatch} from "@/redux/hooks";
import {useRouter} from "next/navigation";
import {setCurrentProduct} from "@/redux/features/productSlice";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const dispatch = useAppDispatch()
  const router = useRouter()

  const imageUrl = product.image
    ? `https://admin.refabry.com/storage/product/${product.image}`
    : "/placeholder.svg?height=300&width=300";

  const redirectToSingleProduct = (e: React.MouseEvent) => {
    e.preventDefault()
    dispatch(setCurrentProduct(product))
    router.push(`/product/${product.id}`)
  }

  return (
        <Card onClick={redirectToSingleProduct} className="h-full overflow-hidden transition-all duration-200 hover:shadow-lg">
          <div className="relative h-48 w-full overflow-hidden">
            <Image
              src={imageUrl || "/placeholder.svg"}
              alt={product.name || "Product image"}
              fill
              className="object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>
          <CardContent className="p-4">
            <h3 className="font-semibold line-clamp-2 h-12">{product?.name}</h3>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-lg font-bold text-primary">
                ৳{product?.price}
              </span>
              {product.discount_price && (
                <span className="text-sm text-muted-foreground line-through">
                  ৳{product?.regular_price}
                </span>
              )}
            </div>
          </CardContent>
          <CardFooter className="p-4 pt-0">
            <div className="w-full text-sm text-muted-foreground">
              {!!product?.category && <span>{product?.category?.name}</span>}
            </div>
          </CardFooter>
        </Card>
  );
}
