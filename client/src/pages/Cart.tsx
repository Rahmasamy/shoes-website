import { Link } from "wouter";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useCart, useUpdateCartItem, useRemoveFromCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Trash2, Minus, Plus, ArrowRight } from "lucide-react";

export default function Cart() {
  const { data: cart, isLoading } = useCart();
  const updateItem = useUpdateCartItem();
  const removeItem = useRemoveFromCart();

  const subtotal = cart?.reduce((sum, item) => sum + (Number(item.product.price) * item.quantity), 0) || 0;
  const shipping = subtotal > 150 ? 0 : 15;
  const total = subtotal + shipping;

  if (isLoading) return <div className="h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <h1 className="text-3xl font-display font-bold mb-8">Shopping Cart</h1>

        {cart && cart.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-6 p-6 rounded-2xl bg-card border border-border shadow-sm">
                  <div className="h-24 w-24 shrink-0 rounded-xl bg-secondary overflow-hidden">
                    <img src={item.product.images[0]} alt={item.product.name} className="h-full w-full object-cover" />
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg">{item.product.name}</h3>
                        <p className="text-sm text-muted-foreground">{item.size} / {item.color}</p>
                      </div>
                      <p className="font-bold text-lg">${Number(item.product.price).toFixed(2)}</p>
                    </div>

                    <div className="flex justify-between items-end">
                      <div className="flex items-center gap-3 bg-secondary rounded-lg p-1">
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          className="h-8 w-8 rounded-md"
                          disabled={item.quantity <= 1}
                          onClick={() => updateItem.mutate({ id: item.id, quantity: item.quantity - 1 })}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          className="h-8 w-8 rounded-md"
                          onClick={() => updateItem.mutate({ id: item.id, quantity: item.quantity + 1 })}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                        onClick={() => removeItem.mutate(item.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" /> Remove
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card p-6 rounded-2xl border border-border shadow-sm sticky top-24">
                <h3 className="font-bold text-xl mb-6">Order Summary</h3>
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-medium">{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="border-t pt-4 flex justify-between">
                    <span className="font-bold text-lg">Total</span>
                    <span className="font-bold text-lg text-primary">${total.toFixed(2)}</span>
                  </div>
                </div>
                <Link href="/checkout">
                  <Button className="w-full h-12 rounded-xl text-lg font-bold">
                    Checkout <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <p className="text-xs text-center text-muted-foreground mt-4">
                  Secure checkout powered by Stripe
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-24 bg-secondary/30 rounded-3xl">
            <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
            <p className="text-muted-foreground mb-8">Looks like you haven't added any shoes yet.</p>
            <Link href="/shop">
              <Button size="lg" className="rounded-full">Start Shopping</Button>
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
