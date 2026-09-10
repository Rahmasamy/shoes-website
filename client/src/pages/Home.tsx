import { Link } from "wouter";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useProducts } from "@/hooks/use-products";
import { ProductCard } from "@/components/ProductCard";
import { useFavorites } from "@/hooks/use-favorites";
import { ArrowRight, Truck, Shield, RefreshCcw, Star, HelpCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function Home() {
  const { t } = useTranslation();
  // Fetch products
  const { data: newArrivalsData, isLoading: isLoadingNewArrivals } = useProducts({ sort: "newest" });
  const { data: popularData } = useProducts({ sort: "popular" });
  const { data: favorites } = useFavorites();

  const newArrivals = newArrivalsData?.products;
  const popular = popularData?.products;

  const isFavorite = (id: number) => favorites?.some(f => f.productId === id);

  // Unsplash images for sections
  // Hero: Dynamic shoe action shot - from assets
  const heroImage = "/assets/cover.jpeg";
  // Features: Clean minimal shoe
  const featureImage = "/assets/sale2.jpg";
  const karemanReview = "/assets/kareman-review.jpeg";
  const kholoudReview = "/assets/kholoud-review.jpeg";

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[85vh] min-h-[600px] w-full overflow-hidden flex items-center">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent z-10" />
          <img src={heroImage} alt="Hero" className="w-full h-full object-cover object-[center_35%]" />
        </div>

        <div className="container mx-auto px-4 relative z-20">
          <div className="max-w-2xl space-y-8 animate-fade-in-up">
            <h1 className="text-6xl md:text-8xl font-display font-black leading-tight text-foreground">
              {t("stepInto")} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                {t("theFuture")}
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-lg">
              {t("heroSubtitle")}
            </p>
            <div className="flex gap-4">
              <Link href="/shop?category=men">
                <Button size="lg" className="rounded-full px-8 h-14 text-lg bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25">
                  {t("Shop Men")}
                </Button>
              </Link>
              <Link href="/shop?category=women">
                <Button size="lg" variant="outline" className="rounded-full px-8 h-14 text-lg border-2 hover:bg-primary/5">
                  {t("Shop Women")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      {/* Branded Feature Image Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div
            className="brand-image-section rounded-3xl overflow-hidden"
            style={{ backgroundImage: "url('/assets/sale-feature.jpg')",

              backgroundSize: "cover", backgroundRepeat: "no-repeat" 
             }}
          >
            <div className="brand-image-content text-center w-full px-6">
              <div className="max-w-3xl mx-auto py-20">
                <h2 className="brand-image-title text-4xl md:text-5xl font-display font-black mb-4">
                  {t("brandFeatureTitle")}
                </h2>
                <p className="brand-image-sub text-lg mb-6">{t("brandFeatureSubtitle")}</p>
                <div className="flex justify-center">
                  <Link href="/shop">
                    <button className="brand-cta">{t("Shop Sale")}</button>
                  </Link>
                </div>
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
              <h2 className="text-4xl font-display font-bold mb-4">{t("New Arrivals")}</h2>
              <p className="text-muted-foreground">{t("newArrivalsSubtitle")}</p>
            
            </div>
            <Link href="/shop?sort=newest">
              <Button variant="ghost" className="group">
                View All <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>

          {isLoadingNewArrivals ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-[400px] rounded-2xl bg-secondary/50 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {newArrivals?.slice(0, 4).map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isFavorite={isFavorite(product.id)}
                />
              ))}
            </div>
          )}
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
              {t("whyChooseUsBadge")}
            </span>
            <h2 className="text-4xl md:text-5xl font-display font-black">{t("Premium Service Guaranteed")}</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t("premiumSubtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
            {/* Feature 1 */}
            <div className="group relative border border-black rounded-3xl">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-lg"></div>
              <div className="relative p-8 rounded-3xl bg-card border border-border/50 hover:border-primary/50 shadow-lg hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 h-full flex flex-col">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-2xl opacity-10 blur-xl group-hover:opacity-20 transition-opacity"></div>
                  <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Truck className="w-8 h-8 text-primary group-hover:text-accent transition-colors" />
                  </div>
                </div>
                <h3 className="font-bold text-xl mb-3 group-hover:text-accent transition-colors">{t("Shipping in Egypt")}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed flex-grow">{t("fastShipping")}</p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group relative md:scale-105 border border-black rounded-3xl">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-accent/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-lg"></div>
              <div className="relative p-8 rounded-3xl bg-gradient-to-br from-card to-card/50 border border-border/50 hover:border-accent/50 shadow-xl hover:shadow-2xl hover:shadow-accent/20 transition-all duration-300 h-full flex flex-col">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-accent to-primary rounded-2xl opacity-10 blur-xl group-hover:opacity-20 transition-opacity"></div>
                  <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Shield className="w-8 h-8 text-accent group-hover:text-primary transition-colors" />
                  </div>
                </div>
                <h3 className="font-bold text-xl mb-3 group-hover:text-accent transition-colors">{t("Secure Payment")}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed flex-grow">{t("securePaymentDesc")}</p>
                <div className="mt-4 text-accent text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">Learn more →</div>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group relative border border-black rounded-3xl">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-lg"></div>
              <div className="relative p-8 rounded-3xl bg-card border border-border/50 hover:border-primary/50 shadow-lg hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 h-full flex flex-col">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-2xl opacity-10 blur-xl group-hover:opacity-20 transition-opacity"></div>
                  <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <RefreshCcw className="w-8 h-8 text-primary group-hover:text-accent transition-colors" />
                  </div>
                </div>
                <h3 className="font-bold text-xl mb-3 group-hover:text-primary transition-colors">{t("30 Days Return")}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed flex-grow">{t("returnPolicy")}</p>
                <div className="mt-4 text-primary text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">Learn more →</div>
              </div>
            </div>
          </div>
        </div>
      </section>

    
      {/* Promotional Section */}
      <section className="py-24 bg-black text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-1"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <Badge className="bg-accent text-white hover:bg-accent/90 border-none px-4 py-1 text-sm">{t("LIMITED OFFER")}</Badge>
              <h2 className="text-5xl md:text-6xl flex-wrap text-white leading-tight">
                {t("promoDiscount")} <br />
                {t("promoCollection")}
              </h2>
              <p className="text-primary-foreground/80 text-lg max-w-md">
                {t("promoSubtitle")}
              </p>
              <Button size="lg" className="rounded-full bg-white text-primary hover:bg-gray-100 font-bold px-8">
                {t("Shop Sale")}
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

      {/* FAQ Section */}
      <section className="py-24 bg-background relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10 max-w-5xl">
          <div className="text-center mb-16 animate-fade-in-up">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-6">
              <HelpCircle className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-black text-foreground mb-4">{t("Frequently Asked Questions")}</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">{t("faqSubtitle")}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
            <Accordion type="single" collapsible className="w-full space-y-4">
              <AccordionItem value="changes" className="border border-black bg-card rounded-xl px-4 hover:shadow-md transition-all">
                <AccordionTrigger className="text-left hover:no-underline font-bold py-5">{t("faq.changeOrder.title")}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {t("faq.changeOrder.answer")}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="sizing" className="border border-black bg-card rounded-xl px-4 hover:shadow-md transition-all">
                <AccordionTrigger className="text-left hover:no-underline font-bold py-5">{t("faq.sizing.title")}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {t("faq.sizing.answer")}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="currency" className="border border-black bg-card rounded-xl px-4 hover:shadow-md transition-all">
                <AccordionTrigger className="text-left hover:no-underline font-bold py-5">{t("faq.currency.title")}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {t("faq.currency.answer")}
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <Accordion type="single" collapsible className="w-full space-y-4">
              <AccordionItem value="shipping" className="border border-black bg-card rounded-xl px-4 hover:shadow-md transition-all">
                <AccordionTrigger className="text-left hover:no-underline font-bold py-5">{t("faq.shipping.title")}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  <div className="space-y-2 text-sm">
                    <p className="font-semibold">{t("faq.shipping.ratesIntro")}</p>
                    <ul className="list-disc list-inside pl-2 space-y-1">
                      <li>{t("faq.shipping.cairo")}</li>
                    </ul>
                    <p className="pt-2">{t("faq.shipping.delivery")}</p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="payments" className="border border-black bg-card rounded-xl px-4 hover:shadow-md transition-all">
                <AccordionTrigger className="text-left hover:no-underline font-bold py-5">{t("faq.payments.title")}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {t("faq.payments.answer")}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="returns" className="border border-black bg-card rounded-xl px-4 hover:shadow-md transition-all">
                <AccordionTrigger className="text-left hover:no-underline font-bold py-5">{t("faq.returns.title")}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  <div className="space-y-2 text-sm">
                    <p>{t("faq.returns.answerIntro")}</p>
                    <ul className="list-disc list-inside pl-2 space-y-1">
                      <li>{t("faq.returns.option1")}</li>
                      <li>{t("faq.returns.option2")}</li>
                      <li>{t("faq.returns.option3")}</li>
                    </ul>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-4">{t("What Our Customers Say")}</h2>
            <p className="text-muted-foreground">{t("testimonialsSubtitle")}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-card p-4 rounded-3xl shadow-lg border border-border/50 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col items-center">
              <img
                src={karemanReview}
                alt="Kareman's Review"
                className="w-full h-auto rounded-2xl object-contain max-h-[500px]"
              />
            </div>
            <div className="bg-card p-4 rounded-3xl shadow-lg border border-border/50 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col items-center">
              <img
                src={kholoudReview}
                alt="Kholoud's Review"
                className="w-full h-auto rounded-2xl object-contain max-h-[500px]"
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
