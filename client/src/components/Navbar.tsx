import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";
import { ShoppingBag, User, Heart, Menu, X, Search } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
export function Navbar() {
  const { user, logoutMutation } = useAuth();
  const { data: cart } = useCart();
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const cartCount = cart?.reduce((sum, item) => sum + item.quantity, 0) || 0;
   const LogoImage = "/assets/logo.png";
  const NavLinks = () => (
    <>
      <Link href="/" className={`text-sm font-medium transition-colors hover:text-accent ${location === "/" ? "text-primary font-bold" : "text-muted-foreground"}`}>
        Home
      </Link>
      <Link href="/shop?category=men" className={`text-sm font-medium transition-colors hover:text-accent ${location.includes("men") ? "text-primary font-bold" : "text-muted-foreground"}`}>
        Men
      </Link>
      <Link href="/shop?category=women" className={`text-sm font-medium transition-colors hover:text-accent ${location.includes("women") ? "text-primary font-bold" : "text-muted-foreground"}`}>
        Women
      </Link>
      <Link href="/shop?category=kids" className={`text-sm font-medium transition-colors hover:text-accent ${location.includes("kids") ? "text-primary font-bold" : "text-muted-foreground"}`}>
        Kids
      </Link>
      <Link href="/contact" className={`text-sm font-medium transition-colors hover:text-accent ${location === "/contact" ? "text-primary font-bold" : "text-muted-foreground"}`}>
        Contact
      </Link>
      {user?.role === "admin" && (
        <Link href="/admin" className={`text-sm font-medium transition-colors hover:text-accent ${location === "/admin" ? "text-primary font-bold" : "text-muted-foreground"}`}>
          Dashboard
        </Link>
      )}
    </>
  );

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Mobile Menu */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="lg:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px]">
            <div className="flex flex-col gap-6 mt-8">
              <Link href="/" onClick={() => setIsOpen(false)} className="text-2xl font-display font-bold text-primary">Karawan</Link>
              <div className="flex flex-col gap-4">
                <NavLinks />
              </div>
              <Separator />
              <div className="flex flex-col gap-4">
                {user ? (
                  <>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold">
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium">{user.fullName || user.username}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <Button variant="outline" onClick={() => logoutMutation.mutate()}>Log out</Button>
                  </>
                ) : (
                  <Link href="/auth" onClick={() => setIsOpen(false)}>
                    <Button className="w-full">Sign In</Button>
                  </Link>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* Logo */}
        <Link href="/" className="w-14 h-14 flex gap-3 items-center font-display font-black tracking-tighter text-primary">
        <img src={LogoImage} alt="logoimage" className="flex-1" />
        <p className="font-bold text-capailtize text-2xl ">
          Karawan
        </p>
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-8">
          <NavLinks />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
        

          {user && (
            <Link href="/favorites">
              <Button variant="ghost" size="icon">
                <Heart className="h-5 w-5" />
              </Button>
            </Link>
          )}

          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center rounded-full p-0 bg-accent text-accent-foreground text-xs">
                  {cartCount}
                </Badge>
              )}
            </Button>
          </Link>

          {user ? (
            <Link href="/profile">
              <Button variant="ghost" size="icon" className="hidden sm:flex">
                <User className="h-5 w-5" />
              </Button>
            </Link>
          ) : (
            <Link href="/auth">
              <Button variant="default" className="hidden sm:flex bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20">
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
