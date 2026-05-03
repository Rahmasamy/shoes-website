import { Link } from "wouter";
import { Facebook, Twitter, Instagram, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Footer() {
  return (
    <footer className="bg-card border-t border-border/50 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-16">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="text-3xl font-display font-black tracking-tighter text-primary">
              KARAWAN<span className="text-accent">.</span>
            </Link>
            <p className="text-muted-foreground leading-relaxed">
              Premium footwear designed for the modern lifestyle. Comfort meets style in every step.
            </p>
            <div className="flex gap-4">
              <Button variant="outline" size="icon" asChild className="rounded-full hover:border-accent hover:text-accent">
                <a href="https://www.facebook.com/share/1EKHUJJDEm/" target="_blank" rel="noopener noreferrer">
                  <Facebook className="h-4 w-4" />
                </a>
              </Button>
            
              <Button variant="outline" size="icon" asChild className="rounded-full hover:border-accent hover:text-accent">
               <a href="https://www.instagram.com/karawan.shoes?igsh=MTR5cmJ6dW9qcjEweg==" target="_blank" rel="noopener noreferrer">
                <Instagram className="h-4 w-4" />
               </a>
              </Button>
            </div>
          </div>

          {/* Shop */}
          <div className="space-y-4">
            <h4 className="font-display font-bold text-lg">Shop</h4>
            <ul className="space-y-2">
              <li><Link href="/shop?category=men" className="text-muted-foreground hover:text-primary transition-colors">Men's Collection</Link></li>
              <li><Link href="/shop?category=women" className="text-muted-foreground hover:text-primary transition-colors">Women's Collection</Link></li>
              <li><Link href="/shop?category=kids" className="text-muted-foreground hover:text-primary transition-colors">Kids' Collection</Link></li>
              <li><Link href="/shop?sort=newest" className="text-muted-foreground hover:text-primary transition-colors">New Arrivals</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="font-display font-bold text-lg">Support</h4>
            <ul className="space-y-2">
              <li><Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">Contact Us</Link></li>
              <li><Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">Shipping & Returns</Link></li>
           
            </ul>
          </div>

          {/* Newsletter */}
          {/* <div className="space-y-4">
            <h4 className="font-display font-bold text-lg">Stay in the Loop</h4>
            <p className="text-muted-foreground">Subscribe for exclusive offers and new releases.</p>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <Input placeholder="Enter your email" className="rounded-full" />
              <Button type="submit" size="icon" className="rounded-full shrink-0 bg-primary hover:bg-primary/90">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div> */}
        </div>

        <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>© 2026 KARAWAN. All rights reserved.</p>
          <div className="flex gap-6">
            <span>Privacy</span>
            <span>Terms</span>
           
          </div>
        </div>
      </div>
    </footer>
  );
}
