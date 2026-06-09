import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";
import { ShoppingBag, CreditCard, Truck, CheckCircle2 } from "lucide-react";

export default function Checkout() {
  const { user } = useAuth();
  const { data: cart, isLoading: cartLoading } = useCart();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSuccess, setIsSuccess] = useState(false);

  const subtotal = cart?.reduce((sum, item) => sum + Number(item.product.price) * item.quantity, 0) || 0;
  const shipping = 50;
  const total = subtotal + shipping;

  const createOrderMutation = useMutation({
    mutationFn: async (formData: any) => {
      const orderData = {
        ...formData,
        items: cart?.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          size: item.size,
          color: item.color
        }))
      };

      const res = await fetch(api.orders.create.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });
      if (!res.ok) throw new Error("Order creation failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.cart.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.admin.orders.path] });
      setIsSuccess(true);
      toast({ title: "Order Placed!", description: "Your order has been successfully created." });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    createOrderMutation.mutate(data);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="max-w-md w-full text-center space-y-6">
            <div className="h-24 w-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="h-12 w-12" />
            </div>
            <h1 className="text-3xl font-display font-bold">Thank you for your order!</h1>
            <p className="text-muted-foreground">
              We've received your order and will begin processing it right away. 
              You'll receive a confirmation email shortly.
            </p>
            <Button onClick={() => setLocation("/")} size="lg" className="w-full">
              Continue Shopping
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (cart?.length === 0 && !cartLoading) {
    setLocation("/cart");
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-secondary/20">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto">
          {/* Checkout Form */}
          <div className="flex-1 space-y-6">
            <h1 className="text-3xl font-display font-bold">Checkout</h1>
            
            <form id="checkout-form" onSubmit={handleSubmit} className="space-y-6">
              <Card className="border-border/50 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5 text-accent" />
                    Shipping Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input id="fullName" name="fullName" defaultValue={user?.fullName || ""} required placeholder="John Doe" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" name="email" type="email" defaultValue={user?.email || ""} required placeholder="john@example.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" name="phone" type="tel" required placeholder="+1 (555) 000-0000" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" name="address" required placeholder="123 Street Name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" name="city" required placeholder="New York" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-accent" />
                    Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-4 rounded-lg border bg-accent/5 flex items-center justify-between">
                    <div>
                      <p className="font-medium">Cash on Delivery</p>
                      <p className="text-sm text-muted-foreground">Pay when your order arrives</p>
                    </div>
                    <CheckCircle2 className="h-5 w-5 text-accent" />
                  </div>
                </CardContent>
              </Card>
            </form>
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-[380px]">
            <Card className="border-border/50 shadow-sm sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5 text-accent" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 max-h-[300px] overflow-auto pr-2">
                  {cart?.map((item) => (
                    <div key={item.id} className="flex gap-3 text-sm">
                      <img src={item.product.images[0]} className="h-12 w-12 rounded-md object-cover" />
                      <div className="flex-1">
                        <p className="font-medium line-clamp-1">{item.product.name}</p>
                        <p className="text-muted-foreground">{item.quantity} x {item.product.price} EGP</p>
                        <p className="text-[10px] uppercase text-accent font-bold">{item.size} • {item.color}</p>
                      </div>
                      <p className="font-bold">{(Number(item.product.price) * item.quantity).toFixed(2)} EGP</p>
                    </div>
                  ))}
                </div>
                
                <Separator />
                
                <div className="space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{subtotal.toFixed(2)} EGP</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>{shipping.toFixed(2)} EGP</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2">
                    <span>Total</span>
                    <span className="text-primary">{total.toFixed(2)} EGP</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  form="checkout-form" 
                  type="submit" 
                  className="w-full h-12 text-lg shadow-lg shadow-primary/20"
                  disabled={createOrderMutation.isPending}
                >
                  {createOrderMutation.isPending ? "Processing..." : `Place Order • ${total.toFixed(2)} EGP`}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
