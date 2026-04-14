import { Link } from "wouter";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useProducts } from "@/hooks/use-products";
import { ProductCard } from "@/components/ProductCard";
import { useFavorites } from "@/hooks/use-favorites";
import { ArrowRight, Truck, Shield, RefreshCcw, Star } from "lucide-react";

export default function Home() {
  // Fetch products
  const { data: newArrivals } = useProducts({ sort: "newest" });
  const { data: popular } = useProducts({ sort: "popular" });
  const { data: favorites } = useFavorites();

  const isFavorite = (id: number) => favorites?.some(f => f.productId === id);

  // Unsplash images for sections
  // Hero: Dynamic shoe action shot - from assets
  const heroImage = "/assets/hero.png";
  // Features: Clean minimal shoe
  const featureImage = "/assets/sale1.jpg";

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[90vh] w-full overflow-hidden bg-primary/5 flex items-center">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/50 to-transparent z-10" />
          <img src={heroImage} alt="Hero" className="w-full h-full object-cover object-center" />
        </div>
        
        <div className="container mx-auto px-4 relative z-20">
          <div className="max-w-2xl space-y-8 animate-fade-in-up">
            <span className="inline-block px-4 py-2 rounded-full bg-accent/10 text-accent font-bold tracking-wider text-sm">
              NEW COLLECTION 2024
            </span>
            <h1 className="text-6xl md:text-8xl font-display font-black leading-tight text-foreground">
              STEP INTO <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                THE FUTURE
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-lg">
              Experience the perfect blend of performance and style. 
              Engineered for comfort, designed for the streets.
            </p>
            <div className="flex gap-4">
              <Link href="/shop?category=men">
                <Button size="lg" className="rounded-full px-8 h-14 text-lg bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25">
                  Shop Men
                </Button>
              </Link>
              <Link href="/shop?category=women">
                <Button size="lg" variant="outline" className="rounded-full px-8 h-14 text-lg border-2 hover:bg-primary/5">
                  Shop Women
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-32 bg-gradient-to-b from-background to-secondary/10 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-accent/5 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-16 space-y-4">
            <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-bold text-sm tracking-wider">
              WHY CHOOSE US
            </span>
            <h2 className="text-4xl md:text-5xl font-display font-black">Premium Service Guaranteed</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We're committed to delivering excellence in every aspect of your shopping experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
            {/* Feature 1 */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-lg"></div>
              <div className="relative p-8 rounded-3xl bg-card border border-border/50 hover:border-primary/50 shadow-lg hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 h-full flex flex-col">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-2xl opacity-10 blur-xl group-hover:opacity-20 transition-opacity"></div>
                  <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Truck className="w-8 h-8 text-primary group-hover:text-accent transition-colors" />
                  </div>
                </div>
                <h3 className="font-bold text-xl mb-3 group-hover:text-primary transition-colors">Free Shipping</h3>
                <p className="text-muted-foreground text-sm leading-relaxed flex-grow">On all orders over $150. International shipping available to 150+ countries.</p>
                <div className="mt-4 text-primary text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">Learn more →</div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group relative md:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-accent/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-lg"></div>
              <div className="relative p-8 rounded-3xl bg-gradient-to-br from-card to-card/50 border border-border/50 hover:border-accent/50 shadow-xl hover:shadow-2xl hover:shadow-accent/20 transition-all duration-300 h-full flex flex-col">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-accent to-primary rounded-2xl opacity-10 blur-xl group-hover:opacity-20 transition-opacity"></div>
                  <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Shield className="w-8 h-8 text-accent group-hover:text-primary transition-colors" />
                  </div>
                </div>
                <h3 className="font-bold text-xl mb-3 group-hover:text-accent transition-colors">Secure Payment</h3>
                <p className="text-muted-foreground text-sm leading-relaxed flex-grow">100% secure payment with 256-bit SSL encryption. Your data is always protected.</p>
                <div className="mt-4 text-accent text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">Learn more →</div>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-lg"></div>
              <div className="relative p-8 rounded-3xl bg-card border border-border/50 hover:border-primary/50 shadow-lg hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 h-full flex flex-col">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-2xl opacity-10 blur-xl group-hover:opacity-20 transition-opacity"></div>
                  <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <RefreshCcw className="w-8 h-8 text-primary group-hover:text-accent transition-colors" />
                  </div>
                </div>
                <h3 className="font-bold text-xl mb-3 group-hover:text-primary transition-colors">30 Days Return</h3>
                <p className="text-muted-foreground text-sm leading-relaxed flex-grow">Not satisfied? Return it within 30 days for a full refund. No questions asked.</p>
                <div className="mt-4 text-primary text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">Learn more →</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-display font-bold mb-4">New Arrivals</h2>
              <p className="text-muted-foreground">Check out the latest drops from our premium collection.</p>
            </div>
            <Link href="/shop?sort=newest">
              <Button variant="ghost" className="group">
                View All <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {newArrivals?.slice(0, 4).map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                isFavorite={isFavorite(product.id)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Promotional Section */}
      <section className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-1"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <Badge className="bg-accent text-white hover:bg-accent/90 border-none px-4 py-1 text-sm">LIMITED OFFER</Badge>
              <h2 className="text-5xl md:text-6xl flex-wrap text-white leading-tight">
                30% OFF <br />
                SUMMER COLLECTION
              </h2>
              <p className="text-primary-foreground/80 text-lg max-w-md">
                Get ready for the season with our latest summer styles. 
                Limited time offer on selected items.
              </p>
              <Button size="lg" className="rounded-full bg-white text-primary hover:bg-gray-100 font-bold px-8">
                Shop Sale
              </Button>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-accent/20 rounded-full blur-3xl transform scale-75"></div>
              <img 
                src={featureImage} 
                alt="Promo Shoe" 
                className="relative h-[500px] object-cover z-10 w-full rounded-3xl shadow-2xl transform rotate-[-12deg] hover:rotate-0 transition-transform duration-500" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-4">What Our Customers Say</h2>
            <p className="text-muted-foreground">Don't just take our word for it.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-card p-8 rounded-2xl shadow-sm border border-border/50">
                <div className="flex gap-1 mb-4 text-accent">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-current" />)}
                </div>
                <p className="text-foreground/80 mb-6 italic">
                  "Absolutely love these shoes! The comfort is unmatched and the style is exactly what I was looking for. Will definitely buy again."
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gray-200" />
                  <div>
                    <h4 className="font-bold">Alex Johnson</h4>
                    <p className="text-sm text-muted-foreground">Verified Buyer</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
