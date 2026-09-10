import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { useFavorites } from "@/hooks/use-favorites";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

export default function Favorites() {
  const { data: favorites, isLoading } = useFavorites();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <h1 className="text-3xl font-display font-bold mb-8">{t("My Wishlist")}</h1>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="h-[400px] rounded-2xl bg-secondary/50 animate-pulse" />
            ))}
          </div>
        ) : favorites && favorites.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {favorites.map((item) => (
              <ProductCard 
                key={item.product.id} 
                product={item.product} 
                isFavorite={true}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-secondary/30 rounded-3xl">
            <h2 className="text-2xl font-bold mb-4">{t("No favorites yet")}</h2>
            <p className="text-muted-foreground mb-8">{t("favoritesEmptyDesc")}</p>
            <Link href="/shop">
              <Button size="lg" className="rounded-full">{t("Explore Collection")}</Button>
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
