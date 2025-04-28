import ProductList from "@/components/product-list"

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Product Catalog</h1>
      <ProductList />
    </main>
  )
}
