import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/use-auth";

import Home from "@/pages/Home";
import Shop from "@/pages/Shop";
import ProductDetails from "@/pages/ProductDetails";
import Cart from "@/pages/Cart";
import Favorites from "@/pages/Favorites";
import Contact from "@/pages/Contact";
import Auth from "@/pages/Auth";
import Profile from "@/pages/Profile";
import ShippingReturns from "@/pages/ShippingReturns";
import AdminDashboard from "@/pages/AdminDashboard";
import Checkout from "@/pages/Checkout";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/shop" component={Shop} />
      <Route path="/product/:id" component={ProductDetails} />
      <Route path="/cart" component={Cart} />
      <Route path="/favorites" component={Favorites} />
      <Route path="/contact" component={Contact} />
      <Route path="/auth" component={Auth} />
      <Route path="/shipping-returns" component={ShippingReturns} />
      <Route path="/profile" component={Profile} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/checkout" component={Checkout} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
