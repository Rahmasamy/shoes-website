import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Package, RefreshCw, AlertTriangle, Store } from "lucide-react";

export default function ShippingReturns() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-16 max-w-4xl">
        <div className="text-center mb-16 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-display font-black text-foreground mb-4">
            Shipping & Returns
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            At <strong className="text-primary font-bold">KARAWAN</strong>, we ensure that all our customers are completely satisfied with their purchases. If you are not satisfied with the product for any reason, we offer an easy and flexible return and exchange policy.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full font-medium">
            <Package className="w-5 h-5" />
            <span>You can inspect the order upon receipt from the representative.</span>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* General Policy */}
          <section className="bg-card border border-border/50 rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
              <RefreshCw className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-4 font-display">Return & Exchange Policy</h2>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold mt-0.5">•</span>
                <span><strong>14-Day Window:</strong> Requests must be submitted within 14 days from the date of receiving the shipment.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold mt-0.5">•</span>
                <span><strong>Original Condition:</strong> The product must be in its original condition, with its original size tag attached.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold mt-0.5">•</span>
                <span><strong>Missing Tags:</strong> Products with damaged or missing tags are not eligible for return or exchange.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold mt-0.5">•</span>
                <span>All orders are allowed only one transaction—either one exchange or one return.</span>
              </li>
            </ul>
          </section>

          {/* Defective Items */}
          <section className="bg-card border border-border/50 rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center mb-6">
              <AlertTriangle className="w-6 h-6 text-accent" />
            </div>
            <h2 className="text-2xl font-bold mb-4 font-display">Defective or Incorrect Items</h2>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-accent font-bold mt-0.5">•</span>
                <span>If the received product is damaged, defective, or incorrect, we offer a full refund or a free exchange within 14 days from receipt.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent font-bold mt-0.5">•</span>
                <span>For manufacturing defects appearing after use (within the first 14 days), we provide a warranty to resolve the issue according to our standards.</span>
              </li>
            </ul>
          </section>

          {/* Shipping Fees */}
          <section className="bg-card border border-border/50 rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
              <Package className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-4 font-display">Shipping Fees</h2>
            <p className="text-muted-foreground leading-relaxed">
              Shipping fees are non-refundable. The customer is responsible for bearing any additional shipping fees upon exchange or return.
            </p>
          </section>

          {/* In-Store Purchases */}
          <section className="bg-card border border-border/50 rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
              <Store className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-4 font-display">In-Store Purchases</h2>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold mt-0.5">•</span>
                <span>Products purchased from our physical branches can only be exchanged or returned at our branches.</span>
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
            We thank you for choosing to shop with KARAWAN!
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
