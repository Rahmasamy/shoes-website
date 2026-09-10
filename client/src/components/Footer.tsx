import { Link } from "wouter";
import { Facebook, Twitter, Instagram, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useTranslation } from "react-i18next";

export function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="bg-black text-white border-t border-border/50 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-16">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="text-3xl font-display font-black tracking-tighter ">
              KARAWAN<span className="text-accent">.</span>
            </Link>
            <p className=" leading-relaxed">
              {t("footerDescription")}
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
            <h4 className="font-display font-bold text-lg text-white">{t("Shop")}</h4>
            <ul className="space-y-2">
              <li><Link href="/shop?category=men" className=" hover: transition-colors">{t("Men's Collection")}</Link></li>
              <li><Link href="/shop?category=women" className=" hover: transition-colors">{t("Women's Collection")}</Link></li>
              <li><Link href="/shop?category=kids" className=" hover: transition-colors">{t("Kids' Collection")}</Link></li>
              <li><Link href="/shop?sort=newest" className=" hover: transition-colors">{t("New Arrivals")}</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="font-display font-bold text-lg text-white">{t("Support")}</h4>
            <ul className="space-y-2">
              <li><Link href="/contact" className=" hover: transition-colors">{t("Contact Us")}</Link></li>
              <li><Link href="/shipping-returns" className=" hover: transition-colors">{t("Shipping & Returns")}</Link></li>
              <li className=" pt-2">
                <span className="font-bold  text-xs uppercase tracking-wider block mb-1">WhatsApp / Call</span>
                <a href="https://wa.me/201004642036" target="_blank" rel="noopener noreferrer" className="hover: transition-colors block">
                  01004642036
                </a>
                <a href="tel:01070740831" className="hover: transition-colors block">
                  01070740831
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          {/* <div className="space-y-4">
            <h4 className="font-display font-bold text-lg">Stay in the Loop</h4>
            <p className="">Subscribe for exclusive offers and new releases.</p>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <Input placeholder="Enter your email" className="rounded-full" />
              <Button type="submit" size="icon" className="rounded-full shrink-0 bg-primary hover:bg-primary/90">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div> */}
        </div>

        <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm ">
          <p>{t("copyright", { year: 2026 })}</p>
          <div className="flex gap-6">
            <span>{t("Privacy")}</span>
            <span>{t("Terms")}</span>
           
          </div>
        </div>
      </div>
    </footer>
  );
}
