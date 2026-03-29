import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useProducts } from "@/hooks/use-products";
import { useFavorites } from "@/hooks/use-favorites";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Filter, X, Search } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function Shop() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const categoryParam = searchParams.get("category") as 'men' | 'women' | 'kids' | undefined;
  
  const [filters, setFilters] = useState({
    category: categoryParam,
    type: "",
    search: "",
    sort: "newest" as "newest" | "price_asc" | "price_desc" | "popular",
  });

  // Sync category from URL
  useEffect(() => {
    if (categoryParam) setFilters(f => ({ ...f, category: categoryParam }));
  }, [categoryParam]);

  const { data: products, isLoading } = useProducts(filters);
  const { data: favorites } = useFavorites();
  const isFavorite = (id: number) => favorites?.some(f => f.productId === id);

  const clearFilters = () => {
    setFilters({
      category: undefined,
      type: "",
      search: "",
      sort: "newest",
    });
  };

  const SidebarContent = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-lg">Filters</h3>
        <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground hover:text-primary">
          Clear All
        </Button>
      </div>

      <Accordion type="multiple" defaultValue={["category", "type", "price"]}>
        <AccordionItem value="category">
          <AccordionTrigger>Category</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {['men', 'women', 'kids'].map((cat) => (
                <div key={cat} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`cat-${cat}`} 
                    checked={filters.category === cat}
                    onCheckedChange={(checked) => setFilters(f => ({ ...f, category: checked ? cat as any : undefined }))}
                  />
                  <Label htmlFor={`cat-${cat}`} className="capitalize cursor-pointer">{cat}</Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="type">
          <AccordionTrigger>Type</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {['sneakers', 'boots', 'running', 'casual'].map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`type-${type}`}
                    checked={filters.type === type}
                    onCheckedChange={(checked) => setFilters(f => ({ ...f, type: checked ? type : "" }))}
                  />
                  <Label htmlFor={`type-${type}`} className="capitalize cursor-pointer">{type}</Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold capitalize">
              {filters.category ? `${filters.category}'s Collection` : 'All Products'}
            </h1>
            <p className="text-muted-foreground">{products?.length || 0} products found</p>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            {/* Search */}
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search products..." 
                className="pl-9 rounded-full"
                value={filters.search}
                onChange={(e) => setFilters(f => ({ ...f, search: e.target.value }))}
              />
            </div>

            {/* Mobile Filter Trigger */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="md:hidden">
                  <Filter className="h-4 w-4 mr-2" /> Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <div className="mt-6">
                  <SidebarContent />
                </div>
              </SheetContent>
            </Sheet>

            {/* Sort */}
            <select 
              className="bg-background border border-input rounded-md px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              value={filters.sort}
              onChange={(e) => setFilters(f => ({ ...f, sort: e.target.value as any }))}
            >
              <option value="newest">Newest</option>
              <option value="popular">Most Popular</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden md:block w-64 shrink-0">
            <div className="sticky top-24">
              <SidebarContent />
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-[400px] rounded-2xl bg-secondary/50 animate-pulse" />
                ))}
              </div>
            ) : products?.length === 0 ? (
              <div className="text-center py-24">
                <h3 className="text-2xl font-bold mb-2">No products found</h3>
                <p className="text-muted-foreground mb-6">Try adjusting your filters or search terms.</p>
                <Button onClick={clearFilters}>Clear Filters</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {products?.map((product) => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    isFavorite={isFavorite(product.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
