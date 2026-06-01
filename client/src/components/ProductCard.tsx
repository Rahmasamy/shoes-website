import { Link } from "wouter";
import { type Product } from "@shared/schema";
import { Heart, ShoppingBag } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToggleFavorite } from "@/hooks/use-favorites";
import { useAddToCart } from "@/hooks/use-cart";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  isFavorite?: boolean;
}

export function ProductCard({ product, isFavorite = false }: ProductCardProps) {
  const toggleFavorite = useToggleFavorite();
  const addToCart = useAddToCart();

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleFavorite.mutate(product.id);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    // Default to first size/color if adding directly from card
    // In a real app, might open a quick view modal instead
    addToCart.mutate({
      productId: product.id,
      quantity: 1,
      size: product.sizes[0],
      color: product.colors[0],
    });
  };

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const message = encodeURIComponent(`Hello, I'm interested in the product: ${product.name} (Price: ${Number(product.price).toFixed(2)} EGP). Is it available?`);
    window.open(`https://wa.me/201004642036?text=${message}`, "_blank");
  };

  return (
    <Link href={`/product/${product.id}`} className="group block h-full">
      <div className="relative h-full flex flex-col transition-all duration-300 hover:-translate-y-1">
        {/* Image Container */}
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-white mb-4">
          <img
            src={product.images[0]}
            alt={product.name}
            className="h-full w-full object-contain object-center transition-transform duration-500 group-hover:scale-105"
          />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.isNew && <Badge className="bg-primary text-white hover:bg-primary">NEW</Badge>}
            {product.isPopular && <Badge variant="secondary" className="bg-white/90 backdrop-blur text-primary font-bold">HOT</Badge>}
          </div>

          {/* Quick Actions Overlay */}
          <div className="absolute bottom-4 right-4 flex flex-col gap-2 opacity-0 transform translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
            <Button
              size="icon"
              variant="secondary"
              className={cn("h-10 w-10 rounded-full shadow-lg bg-white hover:bg-accent hover:text-white transition-colors", isFavorite && "text-red-500 hover:text-white")}
              onClick={handleFavorite}
              disabled={toggleFavorite.isPending}
            >
              <Heart className={cn("h-5 w-5", isFavorite && "fill-current")} />
            </Button>
            <Button
              size="icon"
              className="h-10 w-10 rounded-full shadow-lg bg-primary text-white hover:bg-primary/90"
              onClick={handleAddToCart}
              disabled={addToCart.isPending}
            >
              <ShoppingBag className="h-5 w-5" />
            </Button>
            <Button
              size="icon"
              className="h-10 w-10 rounded-full shadow-lg bg-green-500 hover:bg-green-600 text-white transition-colors"
              onClick={handleWhatsApp}
            >
              <FaWhatsapp className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col flex-1">
          <h3 className="font-display font-bold text-lg text-foreground group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <p className="text-muted-foreground text-sm capitalize">{product.category} • {product.type}</p>
          <div className="mt-2 flex items-center justify-between">
            <span className="font-bold text-lg">{Number(product.price).toFixed(2)} EGP</span>
            <div className="flex gap-1">
               {product.colors.slice(0, 3).map((color, i) => (
                 <div key={i} className="w-3 h-3 rounded-full border border-border" style={{ backgroundColor: color.toLowerCase() }} />
               ))}
               {product.colors.length > 3 && <span className="text-xs text-muted-foreground">+</span>}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
