import express, { type Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, hashPassword } from "./auth";
import { api } from "@shared/routes";
import { z } from "zod";
import multer from "multer";
import path from "path";
import fs from "fs";
import { seed } from "./seed";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  setupAuth(app);

  // Setup Multer for file uploads
  const uploadDir = path.resolve(process.cwd(), "uploads");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }

  // Restore seed images from backup if they don't exist in uploads folder (handles persistent disk mount)
  const backupDir = path.resolve(process.cwd(), "uploads_backup");
  if (fs.existsSync(backupDir)) {
    try {
      const files = fs.readdirSync(backupDir);
      for (const file of files) {
        const destPath = path.join(uploadDir, file);
        if (!fs.existsSync(destPath)) {
          fs.copyFileSync(path.join(backupDir, file), destPath);
        }
      }
      console.log("Restored missing seed images from backup.");
    } catch (err) {
      console.error("Failed to restore seed images from backup:", err);
    }
  }

  const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    },
  });

  const upload = multer({ storage: multerStorage });

  // Serve uploads directory
  app.use("/uploads", (req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    next();
  }, express.static(uploadDir));

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

  // Admin Routes
  app.get(api.admin.users.path, async (req, res) => {
    if (!req.isAuthenticated() || req.user?.role !== "admin") return res.status(401).send();
    const users = await storage.getUsers();
    res.json(users);
  });

  app.get(api.admin.contacts.path, async (req, res) => {
    if (!req.isAuthenticated() || req.user?.role !== "admin") return res.status(401).send();
    const contacts = await storage.getContacts();
    res.json(contacts);
  });

  app.post(api.admin.createProduct.path, async (req, res) => {
    if (!req.isAuthenticated() || req.user?.role !== "admin") return res.status(401).send();
    const product = await storage.createProduct(req.body);
    res.status(201).json(product);
  });

  app.patch(api.admin.updateProduct.path, async (req, res) => {
    if (!req.isAuthenticated() || req.user?.role !== "admin") return res.status(401).send();
    const product = await storage.updateProduct(Number(req.params.id), req.body);
    res.json(product);
  });

  app.post(api.admin.upload.path, upload.array("file"), async (req, res) => {
    if (!req.isAuthenticated() || req.user?.role !== "admin") return res.status(401).send();
    
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) return res.status(400).send("No files uploaded");
    
    const urls = files.map(file => `/uploads/${file.filename}`);
    res.json({ urls, url: urls[0] }); // maintain back-compat with single .url
  });

  app.get(api.admin.orders.path, async (req, res) => {
    if (!req.isAuthenticated() || req.user?.role !== "admin") return res.status(401).send();
    const orders = await storage.getAllOrders();
    res.json(orders);
  });

  app.post(api.admin.createUser.path, async (req, res) => {
    if (!req.isAuthenticated() || req.user?.role !== "admin") return res.status(401).send();
    
    const existingUser = await storage.getUserByUsername(req.body.username);
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const hashedPassword = await hashPassword(req.body.password);
    const user = await storage.createUser({
      ...req.body,
      password: hashedPassword
    });
    res.status(201).json(user);
  });

  app.patch(api.admin.updateOrderStatus.path, async (req, res) => {
    if (!req.isAuthenticated() || req.user?.role !== "admin") return res.status(401).send();
    await storage.updateOrderStatus(Number(req.params.id), req.body.status);
    res.sendStatus(200);
  });

  // Orders
  app.post(api.orders.create.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send();
    const { items, ...orderData } = req.body;
    const order = await storage.createOrder({
      ...orderData,
      userId: req.user!.id
    }, items);
    res.status(201).json(order);
  });

  app.get(api.orders.list.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send();
    const orders = await storage.getOrders(req.user!.id);
    res.json(orders);
  });

  // Seed Data
  console.log("Checking and seeding database...");
  await seed();

  return httpServer;
}
