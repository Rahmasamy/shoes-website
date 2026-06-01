import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Profile() {
  const { user, logoutMutation } = useAuth();
  const [, setLocation] = useLocation();

  if (!user) {
    setLocation("/auth");
    return null;
  }

  // Mock Orders Data
  const orders = [
    { id: "ORD-1234", date: "Oct 24, 2024", total: 185.00, status: "Delivered", items: 2 },
    { id: "ORD-5678", date: "Sep 12, 2024", total: 95.50, status: "Delivered", items: 1 },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 items-center md:grid-cols-3 gap-8">
          
          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="text-center p-6">
              <div className="flex flex-col items-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src={user.avatarUrl || ""} />
                  <AvatarFallback className="text-2xl font-bold bg-primary/10 text-primary">
                    {user.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-2xl font-bold">{user.fullName}</h2>
                <p className="text-muted-foreground">@{user.username}</p>
                <p className="text-sm text-muted-foreground mb-6">{user.email}</p>
                <Button 
                  variant="destructive" 
                  className="w-full"
                  onClick={() => logoutMutation.mutate()}
                >
                  Log Out
                </Button>
              </div>
            </Card>
          </div>

          {/* Main Content */}
          {/* <div className="md:col-span-2 space-y-8">
            <div className="bg-card rounded-2xl border p-6">
              <h3 className="text-xl font-bold mb-6">Order History</h3>
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="flex justify-between items-center p-4 rounded-xl bg-secondary/30 border border-border">
                    <div>
                      <h4 className="font-bold">{order.id}</h4>
                      <p className="text-sm text-muted-foreground">{order.date} • {order.items} items</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{order.total.toFixed(2)} EGP</p>
                      <span className="inline-block px-2 py-1 rounded-md bg-green-100 text-green-700 text-xs font-bold">
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-card rounded-2xl border p-6">
              <h3 className="text-xl font-bold mb-4">Account Settings</h3>
              <p className="text-muted-foreground mb-4">Manage your account preferences and security settings.</p>
              <div className="space-y-2">
                <Button variant="outline" className="justify-start w-full">Change Password</Button>
                <Button variant="outline" className="justify-start w-full">Manage Addresses</Button>
                <Button variant="outline" className="justify-start w-full">Payment Methods</Button>
              </div>
            </div>
          </div> */}

        </div>
      </main>

      <Footer />
    </div>
  );
}
