import { db } from "./db";
import { users, products, cartItems, favorites, reviews, contacts, orders, orderItems, type User, type InsertUser, type Product, type CartItem, type Favorite, type Review, type Contact, type InsertContact, type Order, type OrderItem } from "@shared/schema";
import { eq, and, desc, sql, ilike } from "drizzle-orm";
import session from "express-session";
import createMemoryStore from "memorystore";

export interface IStorage {
  sessionStore: any;
  // User
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getUsers(): Promise<User[]>;

  // Products
  getProducts(filters?: { category?: string; type?: string; sort?: string; search?: string; page?: number; limit?: number }): Promise<{ products: Product[]; total: number }>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: any): Promise<Product>;
  updateProduct(id: number, product: any): Promise<Product>;

  // Cart
  getCartItems(userId: number): Promise<(CartItem & { product: Product })[]>;
  addToCart(userId: number, item: any): Promise<CartItem>;
  updateCartItem(id: number, quantity: number): Promise<CartItem>;
  removeFromCart(id: number): Promise<void>;
  
  // Favorites
  getFavorites(userId: number): Promise<(Favorite & { product: Product })[]>;
  toggleFavorite(userId: number, productId: number): Promise<{ isFavorite: boolean }>;

  // Reviews
  getReviews(): Promise<Review[]>;
  createReview(review: any): Promise<Review>;

  // Contact
  createContact(contact: InsertContact): Promise<Contact>;
  getContacts(): Promise<Contact[]>;

  // Orders
  createOrder(order: any, items: any[]): Promise<Order>;
  getOrders(userId: number): Promise<any[]>;
  getAllOrders(): Promise<any[]>;
  updateOrderStatus(id: number, status: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  sessionStore: any;

  constructor() {
    const MemoryStore = createMemoryStore(session);
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }

  async getUsers(): Promise<User[]> {
    return await db.select().from(users).orderBy(desc(users.createdAt));
  }

  async getProducts(filters?: { category?: string; type?: string; sort?: string; search?: string; page?: number; limit?: number }): Promise<{ products: Product[]; total: number }> {
    let query = db.select().from(products);
    let countQuery = db.select({ count: sql<number>`count(*)` }).from(products);
    
    const conditions = [];
    if (filters?.category) {
      conditions.push(eq(products.category, filters.category));
    }
    if (filters?.type) {
      conditions.push(eq(products.type, filters.type));
    }
    if (filters?.search) {
      conditions.push(ilike(products.name, `%${filters.search}%`));
    }
    
    let orderBy = desc(products.createdAt);
    if (filters?.sort === 'price_asc') orderBy = sql`${products.price} ASC`;
    if (filters?.sort === 'price_desc') orderBy = sql`${products.price} DESC`;
    if (filters?.sort === 'popular') orderBy = desc(products.isPopular);

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
      countQuery = countQuery.where(and(...conditions)) as any;
    }
    
    const [countResult] = await countQuery;
    const total = Number(countResult?.count || 0);

    let finalQuery = query.orderBy(orderBy);
    if (filters?.page && filters?.limit) {
      const offset = (filters.page - 1) * filters.limit;
      finalQuery = finalQuery.limit(filters.limit).offset(offset) as any;
    }

    const productsResult = await finalQuery;
    return { products: productsResult, total };
  }

  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async createProduct(product: any): Promise<Product> {
    const [newProduct] = await db.insert(products).values(product).returning();
    return newProduct;
  }

  async updateProduct(id: number, product: any): Promise<Product> {
    const [updated] = await db.update(products)
      .set(product)
      .where(eq(products.id, id))
      .returning();
    return updated;
  }

  async getCartItems(userId: number): Promise<(CartItem & { product: Product })[]> {
    const items = await db.select({
      cartItem: cartItems,
      product: products
    })
    .from(cartItems)
    .innerJoin(products, eq(cartItems.productId, products.id))
    .where(eq(cartItems.userId, userId));
    
    return items.map(i => ({ ...i.cartItem, product: i.product }));
  }

  async addToCart(userId: number, item: any): Promise<CartItem> {
    const [existing] = await db.select()
      .from(cartItems)
      .where(and(
        eq(cartItems.userId, userId),
        eq(cartItems.productId, item.productId),
        eq(cartItems.size, item.size),
        eq(cartItems.color, item.color)
      ));

    if (existing) {
      const [updated] = await db.update(cartItems)
        .set({ quantity: existing.quantity + item.quantity })
        .where(eq(cartItems.id, existing.id))
        .returning();
      return updated;
    }

    const [newItem] = await db.insert(cartItems).values({ ...item, userId }).returning();
    return newItem;
  }

  async updateCartItem(id: number, quantity: number): Promise<CartItem> {
    const [updated] = await db.update(cartItems)
      .set({ quantity })
      .where(eq(cartItems.id, id))
      .returning();
    return updated;
  }

  async removeFromCart(id: number): Promise<void> {
    await db.delete(cartItems).where(eq(cartItems.id, id));
  }

  async getFavorites(userId: number): Promise<(Favorite & { product: Product })[]> {
    const items = await db.select({
      favorite: favorites,
      product: products
    })
    .from(favorites)
    .innerJoin(products, eq(favorites.productId, products.id))
    .where(eq(favorites.userId, userId));

    return items.map(i => ({ ...i.favorite, product: i.product }));
  }

  async toggleFavorite(userId: number, productId: number): Promise<{ isFavorite: boolean }> {
    const [existing] = await db.select()
      .from(favorites)
      .where(and(eq(favorites.userId, userId), eq(favorites.productId, productId)));

    if (existing) {
      await db.delete(favorites).where(eq(favorites.id, existing.id));
      return { isFavorite: false };
    } else {
      await db.insert(favorites).values({ userId, productId });
      return { isFavorite: true };
    }
  }

  async getReviews(): Promise<Review[]> {
    return await db.select().from(reviews).orderBy(desc(reviews.rating));
  }

  async createReview(review: any): Promise<Review> {
    const [newReview] = await db.insert(reviews).values(review).returning();
    return newReview;
  }

  async createContact(contact: InsertContact): Promise<Contact> {
    const [newContact] = await db.insert(contacts).values(contact).returning();
    return newContact;
  }

  async getContacts(): Promise<Contact[]> {
    return await db.select().from(contacts).orderBy(desc(contacts.createdAt));
  }

  async createOrder(order: any, items: any[]): Promise<Order> {
    let subtotal = 0;
    const processedItems = [];

    for (const item of items) {
      const [product] = await db.select().from(products).where(eq(products.id, item.productId));
      if (!product) {
        throw new Error(`Product with ID ${item.productId} not found`);
      }
      
      const itemPrice = Number(product.price);
      subtotal += itemPrice * item.quantity;
      
      processedItems.push({
        productId: item.productId,
        quantity: item.quantity,
        price: product.price, // Backend-verified price
        size: item.size,
        color: item.color
      });
    }

    const shippingCost = 50; // 50 EGP Shipping
    const totalAmount = (subtotal + shippingCost).toFixed(2);

    const [newOrder] = await db.insert(orders).values({
      ...order,
      totalAmount
    }).returning();
    
    for (const item of processedItems) {
      await db.insert(orderItems).values({
        ...item,
        orderId: newOrder.id
      });
    }

    // Clear cart after order
    await db.delete(cartItems).where(eq(cartItems.userId, order.userId));
    
    return newOrder;
  }

  async getOrders(userId: number): Promise<any[]> {
    const userOrders = await db.select().from(orders).where(eq(orders.userId, userId)).orderBy(desc(orders.createdAt));
    const result = [];
    
    for (const order of userOrders) {
      const items = await db.select({
        item: orderItems,
        product: products
      })
      .from(orderItems)
      .innerJoin(products, eq(orderItems.productId, products.id))
      .where(eq(orderItems.orderId, order.id));
      
      result.push({
        ...order,
        items: items.map(i => ({ ...i.item, product: i.product }))
      });
    }
    return result;
  }

  async getAllOrders(): Promise<any[]> {
    const allOrders = await db.select().from(orders).orderBy(desc(orders.createdAt));
    const result = [];
    
    for (const order of allOrders) {
      const items = await db.select({
        item: orderItems,
        product: products
      })
      .from(orderItems)
      .innerJoin(products, eq(orderItems.productId, products.id))
      .where(eq(orderItems.orderId, order.id));
      
      const [user] = await db.select().from(users).where(eq(users.id, order.userId));
      
      result.push({
        ...order,
        items: items.map(i => ({ ...i.item, product: i.product })),
        user
      });
    }
    return result;
  }

  async updateOrderStatus(id: number, status: string): Promise<void> {
    await db.update(orders).set({ status }).where(eq(orders.id, id));
  }
}

export const storage = new DatabaseStorage();
