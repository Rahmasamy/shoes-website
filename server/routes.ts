import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  setupAuth(app);

  // Products
  app.get(api.products.list.path, async (req, res) => {
    const products = await storage.getProducts(req.query as any);
    res.json(products);
  });

  app.get(api.products.get.path, async (req, res) => {
    const product = await storage.getProduct(Number(req.params.id));
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  });

  // Cart
  app.get(api.cart.list.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send();
    const items = await storage.getCartItems(req.user!.id);
    res.json(items);
  });

  app.post(api.cart.add.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send();
    const item = await storage.addToCart(req.user!.id, req.body);
    res.status(201).json(item);
  });

  app.patch(api.cart.update.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send();
    const item = await storage.updateCartItem(Number(req.params.id), req.body.quantity);
    res.json(item);
  });

  app.delete(api.cart.delete.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send();
    await storage.removeFromCart(Number(req.params.id));
    res.status(204).send();
  });

  // Favorites
  app.get(api.favorites.list.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send();
    const items = await storage.getFavorites(req.user!.id);
    res.json(items);
  });

  app.post(api.favorites.toggle.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send();
    const result = await storage.toggleFavorite(req.user!.id, req.body.productId);
    res.json(result);
  });

  // Reviews
  app.get(api.reviews.list.path, async (req, res) => {
    const reviews = await storage.getReviews();
    res.json(reviews);
  });

  // Contact
  app.post(api.contact.submit.path, async (req, res) => {
    const contact = await storage.createContact(req.body);
    res.status(201).json(contact);
  });

  // Seed Data
  const existingProducts = await storage.getProducts();
  if (existingProducts.length === 0) {
    console.log("Seeding database...");
    await seedDatabase();
  }

  return httpServer;
}

async function seedDatabase() {
  const dummyProducts = [
    {
      name: "Air Max Pulse",
      description: "A comfortable and stylish sneaker for everyday wear.",
      price: "120.00",
      category: "men",
      type: "sneakers",
      sizes: ["40", "41", "42", "43", "44", "45"],
      colors: ["white", "black", "grey"],
      images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff"],
      isNew: true,
      isPopular: true
    },
    {
      name: "Ultra Boost DNA",
      description: "High performance running shoes with responsive cushioning.",
      price: "180.00",
      category: "men",
      type: "running",
      sizes: ["40", "41", "42", "43", "44"],
      colors: ["blue", "black"],
      images: ["https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a"],
      isPopular: true
    },
    {
      name: "Classic Leather Boots",
      description: "Durable leather boots perfect for winter.",
      price: "150.00",
      category: "men",
      type: "boots",
      sizes: ["40", "41", "42", "43"],
      colors: ["brown", "black"],
      images: ["https://images.unsplash.com/photo-1608231387042-66d1773070a5"],
      isNew: false
    },
    {
      name: "Summer Canvas",
      description: "Lightweight canvas shoes for women.",
      price: "60.00",
      category: "women",
      type: "casual",
      sizes: ["36", "37", "38", "39", "40"],
      colors: ["pink", "white", "beige"],
      images: ["https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77"],
      isNew: true
    },
    {
      name: "Kids Light Up",
      description: "Fun light-up sneakers for kids.",
      price: "45.00",
      category: "kids",
      type: "sneakers",
      sizes: ["30", "31", "32", "33"],
      colors: ["red", "blue"],
      images: ["https://images.unsplash.com/photo-1514989940723-e8875ea6f03f"],
      isPopular: true
    },
    {
      name: "Elegant Heels",
      description: "Classic heels for formal occasions.",
      price: "95.00",
      category: "women",
      type: "heels",
      sizes: ["36", "37", "38", "39"],
      colors: ["black", "red"],
      images: ["https://images.unsplash.com/photo-1543163521-1bf539c55dd2"],
      isNew: false
    }
  ];

  for (const p of dummyProducts) {
    await storage.createProduct(p);
  }
  
  await storage.createReview({
    name: "John Doe",
    rating: 5,
    content: "Great shoes! Very comfortable.",
    avatarUrl: "https://github.com/shadcn.png"
  });
  
  await storage.createReview({
    name: "Jane Smith",
    rating: 4,
    content: "Love the style, but sizing is a bit small.",
    avatarUrl: "https://github.com/shadcn.png"
  });
}
