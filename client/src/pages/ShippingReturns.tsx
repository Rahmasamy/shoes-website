import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Package, RefreshCw, AlertTriangle, Store } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function ShippingReturns() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-16 max-w-4xl">
        <div className="text-center mb-16 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-display font-black text-foreground mb-4">
            {t("Shipping & Returns")}
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t("shippingIntro", { brand: "KARAWAN" })}
          </p>
            <div className="mt-6 inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full font-medium">
            <Package className="w-5 h-5" />
            <span>{t("inspectOnReceipt")}</span>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* General Policy */}
          <section className="bg-card border border-border/50 rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
              <RefreshCw className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-4 font-display">{t("Return & Exchange Policy")}</h2>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold mt-0.5">•</span>
                <span><strong>{t("14-Day Window")}</strong> {t("within14Days")}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold mt-0.5">•</span>
                <span><strong>{t("Original Condition")}</strong> {t("originalConditionDesc")}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold mt-0.5">•</span>
                <span><strong>{t("Missing Tags")}</strong> {t("missingTagsDesc")}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold mt-0.5">•</span>
                <span>{t("singleTransaction")}</span>
              </li>
            </ul>
          </section>

          {/* Defective Items */}
          <section className="bg-card border border-border/50 rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center mb-6">
              <AlertTriangle className="w-6 h-6 text-accent" />
            </div>
            <h2 className="text-2xl font-bold mb-4 font-display">{t("Defective or Incorrect Items")}</h2>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-accent font-bold mt-0.5">•</span>
                <span>{t("defectivePolicy")}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent font-bold mt-0.5">•</span>
                <span>{t("manufacturingDefectsDesc")}</span>
              </li>
            </ul>
          </section>

          {/* Shipping Fees */}
          <section className="bg-card border border-border/50 rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
              <Package className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-4 font-display">{t("Shipping Fees")}</h2>
            <p className="text-muted-foreground leading-relaxed">
              {t("shippingFeesDesc")}
            </p>
          </section>

          {/* In-Store Purchases */}
          <section className="bg-card border border-border/50 rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
              <Store className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-4 font-display">{t("In-Store Purchases")}</h2>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold mt-0.5">•</span>
                <span>{t("inStoreReturn")}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold mt-0.5">•</span>
                <span>You must keep all original purchase receipts and ensure they are available upon request.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold mt-0.5">•</span>
                <span>You must visit the branch within 14 days from the purchase date with the item in its original condition.</span>
              </li>
            </ul>
          </section>
        </div>

        <div className="mt-16 text-center">
          <p className="text-xl font-display font-bold text-foreground">
            {t("thankYouShopping", { brand: "KARAWAN" })}
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
