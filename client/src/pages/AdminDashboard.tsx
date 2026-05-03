import { useAuth } from "@/hooks/use-auth";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { Package, Users, ShoppingCart, MessageSquare, Plus, Mail, Upload, Edit2, X, ClipboardList, Phone, MapPin, CheckCircle, UserPlus } from "lucide-react";
import { useLocation } from "wouter";
import { useEffect, useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Protect route
  useEffect(() => {
    if (user && user.role !== "admin") {
      setLocation("/");
    }
  }, [user, setLocation]);

  // Auto-refresh queries every 2 seconds to keep dashboard live across tabs
  const { data: products } = useQuery({ 
    queryKey: [api.products.list.path],
    refetchInterval: 2000,
    refetchIntervalInBackground: true
  });
  const { data: usersList } = useQuery({ 
    queryKey: [api.admin.users.path],
    enabled: !!user && user.role === "admin",
    refetchInterval: 2000,
    refetchIntervalInBackground: true
  });
  const { data: contacts } = useQuery({ 
    queryKey: [api.admin.contacts.path],
    enabled: !!user && user.role === "admin",
    refetchInterval: 2000,
    refetchIntervalInBackground: true
  });
  const { data: ordersList } = useQuery({
    queryKey: [api.admin.orders.path],
    enabled: !!user && user.role === "admin",
    refetchInterval: 2000,
    refetchIntervalInBackground: true
  });

  const createProductMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch(api.admin.createProduct.path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create product");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.products.list.path] });
      toast({ title: "Success", description: "Product created successfully" });
    }
  });

  const updateProductMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number, data: any }) => {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update product");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.products.list.path] });
      setEditingProduct(null);
      toast({ title: "Updated", description: "Product updated successfully" });
    }
  });

  const updateOrderStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number, status: string }) => {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update order");
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.admin.orders.path] });
      toast({ title: "Order Updated", description: "The order status has been updated." });
    }
  });

  const createUserMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch(api.admin.createUser.path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to create user");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.admin.users.path] });
      setIsUserModalOpen(false);
      toast({ title: "User Created", description: "The new user has been added successfully." });
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  });

  if (!user || user.role !== "admin") return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setIsUploading(true);
    try {
      const res = await fetch(api.admin.upload.path, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      const { url } = await res.json();
      
      const imageInput = document.getElementById("image") as HTMLInputElement;
      if (imageInput) imageInput.value = url;
      
      toast({ title: "Uploaded", description: "Image uploaded successfully" });
    } catch (err) {
      toast({ title: "Error", description: `Upload failed: ${err instanceof Error ? err.message : 'Unknown error'}`, variant: "destructive" });
    } finally {
      setIsUploading(false);
    }
  };

  const handleProductSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      description: formData.get("description"),
      price: formData.get("price"),
      category: formData.get("category"),
      type: formData.get("type"),
      sizes: (formData.get("sizes") as string).split(",").map(s => s.trim()),
      colors: (formData.get("colors") as string).split(",").map(c => c.trim()),
      images: [(formData.get("image") as string)],
      isNew: true,
      isPopular: false
    };

    if (editingProduct) {
      updateProductMutation.mutate({ id: editingProduct.id, data });
    } else {
      createProductMutation.mutate(data);
      e.currentTarget.reset();
    }
  };

  const handleUserSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    createUserMutation.mutate(data);
  };

  const pendingOrders = ordersList?.filter((o: any) => o.status === 'pending') || [];

  return (
    <div className="min-h-screen bg-secondary/30">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-display font-bold">Admin Panel</h1>
          <div className="text-sm text-muted-foreground flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            Live Syncing
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-white/50 backdrop-blur-sm border p-1 rounded-xl shadow-sm sticky top-20 z-40 w-full lg:w-auto">
            <TabsTrigger value="overview" className="rounded-lg flex-1 lg:flex-none">Overview</TabsTrigger>
            <TabsTrigger value="users" className="rounded-lg flex-1 lg:flex-none">Users</TabsTrigger>
            <TabsTrigger value="products" className="rounded-lg flex-1 lg:flex-none">Products</TabsTrigger>
            <TabsTrigger value="orders" className="rounded-lg flex-1 lg:flex-none">
              Orders {pendingOrders.length > 0 && <span className="ml-1 px-1.5 bg-accent text-accent-foreground text-[10px] rounded-full">{pendingOrders.length}</span>}
            </TabsTrigger>
            <TabsTrigger value="contacts" className="rounded-lg flex-1 lg:flex-none">Messages</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-border/50 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Products</CardTitle>
                  <Package className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{products?.length || 0}</div>
                </CardContent>
              </Card>
              <Card className="border-border/50 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Registered Users</CardTitle>
                  <Users className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{usersList?.length || 0}</div>
                </CardContent>
              </Card>
              <Card className="border-border/50 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Pending Orders</CardTitle>
                  <ClipboardList className="h-4 w-4 text-purple-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{pendingOrders.length}</div>
                </CardContent>
              </Card>
              <Card className="border-border/50 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Contact Messages</CardTitle>
                  <MessageSquare className="h-4 w-4 text-orange-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{contacts?.length || 0}</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users">
            <Card className="border-border/50 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Manage Users</CardTitle>
                  <CardDescription>View and manage registered users in the system.</CardDescription>
                </div>
                <Dialog open={isUserModalOpen} onOpenChange={setIsUserModalOpen}>
                  <DialogTrigger asChild>
                    <Button className="gap-2">
                      <UserPlus className="h-4 w-4" /> Create User
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Create New User</DialogTitle>
                      <DialogDescription>
                        Add a new administrator or customer to the system.
                      </DialogDescription>
                    </DialogHeader>
                    <form id="create-user-form" onSubmit={handleUserSubmit} className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input id="fullName" name="fullName" required placeholder="John Doe" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input id="username" name="username" required placeholder="johndoe" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" required placeholder="john@example.com" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" name="password" type="password" required placeholder="••••••••" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                        <Select name="role" defaultValue="user">
                          <SelectTrigger>
                            <SelectValue placeholder="Select Role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="user">User</SelectItem>
                            <SelectItem value="admin">Administrator</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </form>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsUserModalOpen(false)}>Cancel</Button>
                      <Button form="create-user-form" type="submit" disabled={createUserMutation.isPending}>
                        {createUserMutation.isPending ? "Creating..." : "Create User"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Joined</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {usersList?.map((u: any) => (
                      <TableRow key={u.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center text-xs font-bold">
                              {u.username.charAt(0).toUpperCase()}
                            </div>
                            {u.username}
                          </div>
                        </TableCell>
                        <TableCell>{u.email}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${u.role === 'admin' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
                            {u.role}
                          </span>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{new Date(u.createdAt).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              <Card className="lg:col-span-1 border-border/50 shadow-sm h-fit lg:sticky lg:top-36 z-10">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>{editingProduct ? "Edit Product" : "Add New Product"}</CardTitle>
                    <CardDescription>Enter the sneakers details.</CardDescription>
                  </div>
                  {editingProduct && (
                    <Button variant="ghost" size="icon" onClick={() => setEditingProduct(null)}>
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleProductSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Product Name</Label>
                      <Input id="name" name="name" defaultValue={editingProduct?.name} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea id="description" name="description" defaultValue={editingProduct?.description} required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="price">Price ($)</Label>
                        <Input id="price" name="price" type="number" step="0.01" defaultValue={editingProduct?.price} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select name="category" defaultValue={editingProduct?.category || "men"}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="men">Men</SelectItem>
                            <SelectItem value="women">Women</SelectItem>
                            <SelectItem value="kids">Kids</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="type">Type</Label>
                      <Input id="type" name="type" defaultValue={editingProduct?.type} required placeholder="e.g. sneakers, running" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="image">Image URL</Label>
                      <div className="flex gap-2">
                        <Input id="image" name="image" defaultValue={editingProduct?.images?.[0]} placeholder="https://..." />
                        <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
                        <Button type="button" variant="outline" size="icon" onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
                          <Upload className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="sizes">Sizes (comma separated)</Label>
                        <Input id="sizes" name="sizes" defaultValue={editingProduct?.sizes?.join(", ")} placeholder="40,41,42" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="colors">Colors (comma separated)</Label>
                        <Input id="colors" name="colors" defaultValue={editingProduct?.colors?.join(", ")} placeholder="white,black" required />
                      </div>
                    </div>
                    <Button type="submit" className="w-full" disabled={createProductMutation.isPending || updateProductMutation.isPending}>
                      {editingProduct 
                        ? (updateProductMutation.isPending ? "Updating..." : "Update Product") 
                        : (createProductMutation.isPending ? "Creating..." : "Add Product")
                      }
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card className="lg:col-span-2 border-border/50 shadow-sm">
                <CardHeader>
                  <CardTitle>Existing Products</CardTitle>
                  <CardDescription>View and manage current inventory.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products?.map((p: any) => (
                        <TableRow key={p.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-3">
                              <img src={p.images[0]} className="h-10 w-10 rounded-md object-cover" />
                              {p.name}
                            </div>
                          </TableCell>
                          <TableCell className="capitalize">{p.category} • {p.type}</TableCell>
                          <TableCell>${p.price}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="icon" onClick={() => setEditingProduct(p)}>
                              <Edit2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="orders">
            <Card className="border-border/50 shadow-sm">
              <CardHeader>
                <CardTitle>Pending Checkout Orders</CardTitle>
                <CardDescription>Review and process active customer orders.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {pendingOrders.length === 0 && <div className="text-center py-12 text-muted-foreground bg-secondary/20 rounded-2xl border-2 border-dashed">No pending orders.</div>}
                  {pendingOrders.map((order: any) => (
                    <Card key={order.id} className="overflow-hidden border-accent/20">
                      <div className="bg-accent/5 px-6 py-4 flex justify-between items-center border-b border-accent/10">
                        <div className="flex items-center gap-4">
                          <span className="font-bold text-lg">Order #{order.id}</span>
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-8 border-green-200 text-green-600 hover:bg-green-50"
                              onClick={() => updateOrderStatusMutation.mutate({ id: order.id, status: 'completed' })}
                              disabled={updateOrderStatusMutation.isPending}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" /> Approve
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-8 border-red-200 text-red-600 hover:bg-red-50"
                              onClick={() => updateOrderStatusMutation.mutate({ id: order.id, status: 'cancelled' })}
                              disabled={updateOrderStatusMutation.isPending}
                            >
                              <X className="h-4 w-4 mr-1" /> Cancel
                            </Button>
                          </div>
                        </div>
                        <span className="text-sm text-muted-foreground">{new Date(order.createdAt).toLocaleString()}</span>
                      </div>
                      <CardContent className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                          <div className="space-y-3">
                            <h4 className="font-bold text-sm uppercase text-muted-foreground flex items-center gap-2">
                              <Users className="h-4 w-4" /> Customer Details
                            </h4>
                            <div className="space-y-1">
                              <p className="font-medium text-lg">{order.fullName}</p>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Mail className="h-3 w-3" /> {order.email}
                              </div>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Phone className="h-3 w-3" /> {order.phone}
                              </div>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground pt-1">
                                <MapPin className="h-3 w-3" /> {order.address}, {order.city}
                              </div>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <h4 className="font-bold text-sm uppercase text-muted-foreground flex items-center gap-2">
                              <ShoppingCart className="h-4 w-4" /> Order Summary
                            </h4>
                            <div className="space-y-2">
                              {order.items.map((item: any, idx: number) => (
                                <div key={idx} className="flex justify-between text-sm">
                                  <span>{item.quantity} x {item.product.name} ({item.size})</span>
                                  <span className="font-medium">${(Number(item.price) * item.quantity).toFixed(2)}</span>
                                </div>
                              ))}
                              <Separator className="my-2" />
                              <div className="flex justify-between items-center pt-1">
                                <span className="font-bold text-lg">Total Amount</span>
                                <span className="text-xl font-bold text-primary">${Number(order.totalAmount).toFixed(2)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contacts">
            <Card className="border-border/50 shadow-sm">
              <CardHeader>
                <CardTitle>Inquiries & Messages</CardTitle>
                <CardDescription>Messages received from the contact form.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {contacts?.length === 0 && <div className="text-center py-8 text-muted-foreground">No messages found.</div>}
                  {contacts?.map((c: any) => (
                    <div key={c.id} className="p-4 rounded-xl border bg-white/50 space-y-2">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span className="font-bold">{c.name}</span>
                          <span className="text-sm text-muted-foreground">&lt;{c.email}&gt;</span>
                        </div>
                        <span className="text-xs text-muted-foreground">{new Date(c.createdAt).toLocaleString()}</span>
                      </div>
                      <p className="text-sm leading-relaxed text-foreground/80 bg-white p-3 rounded-lg border-l-4 border-accent">
                        {c.message}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
