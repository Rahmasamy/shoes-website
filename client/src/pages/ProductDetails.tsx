import { useRoute } from "wouter";
import { useProduct } from "@/hooks/use-products";
import { useAddToCart } from "@/hooks/use-cart";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ShoppingBag, Star, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ProductDetails() {
  const [, params] = useRoute("/product/:id");
  const id = Number(params?.id);
  
  const { data: product, isLoading } = useProduct(id);
  const addToCart = useAddToCart();
  
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [currentImage, setCurrentImage] = useState(0);

  if (isLoading) return <div className="h-screen w-full flex items-center justify-center">Loading...</div>;
  if (!product) return <div className="h-screen w-full flex items-center justify-center">Product not found</div>;

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) return;
    addToCart.mutate({
      productId: product.id,
      quantity: 1,
      size: selectedSize,
      color: selectedColor,
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-[4/5] w-full rounded-3xl overflow-hidden bg-secondary">
              <img 
                src={product.images[currentImage]} 
                alt={product.name} 
                className="w-full h-full object-cover object-center"
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  className={cn(
                    "aspect-square rounded-xl overflow-hidden border-2 transition-all",
                    currentImage === i ? "border-primary" : "border-transparent opacity-70 hover:opacity-100"
                  )}
                  onClick={() => setCurrentImage(i)}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col justify-center space-y-8">
            <div className="space-y-2">
              <p className="text-muted-foreground capitalize font-medium">{product.category} / {product.type}</p>
              <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground">{product.name}</h1>
              <div className="flex items-center gap-2">
                <div className="flex text-accent">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                </div>
                <span className="text-sm text-muted-foreground">(4.9/5 based on 124 reviews)</span>
              </div>
            </div>

            <p className="text-3xl font-bold text-primary">${Number(product.price).toFixed(2)}</p>

            <p className="text-muted-foreground leading-relaxed">
              {product.description}
            </p>

            <div className="space-y-4">
              <h3 className="font-bold">Select Color</h3>
              <div className="flex gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={cn(
                      "w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all",
                      selectedColor === color ? "border-primary ring-2 ring-primary/20" : "border-border"
                    )}
                    style={{ backgroundColor: color.toLowerCase() }}
                  >
                    {selectedColor === color && <Check className={cn("w-5 h-5", color.toLowerCase() === 'white' ? 'text-black' : 'text-white')} />}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold">Select Size</h3>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={cn(
                      "py-3 rounded-xl border-2 font-medium transition-all",
                      selectedSize === size 
                        ? "border-primary bg-primary text-primary-foreground" 
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-8 border-t border-border">
              <Button 
                size="lg" 
                className="w-full h-14 text-lg rounded-full"
                disabled={!selectedSize || !selectedColor || addToCart.isPending}
                onClick={handleAddToCart}
              >
                {addToCart.isPending ? "Adding..." : (
                  <>
                    <ShoppingBag className="mr-2 h-5 w-5" /> Add to Cart
                  </>
                )}
              </Button>
              {(!selectedSize || !selectedColor) && (
                <p className="text-center text-sm text-destructive mt-2">Please select a size and color</p>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
