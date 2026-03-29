import { db } from "./db";
import { users, products, cartItems, favorites, reviews, contacts, type User, type InsertUser, type Product, type CartItem, type Favorite, type Review, type Contact, type InsertContact } from "@shared/schema";
import { eq, and, desc, sql, ilike } from "drizzle-orm";

export interface IStorage {
  // User
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Products
  getProducts(filters?: { category?: string; type?: string; sort?: string; search?: string }): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: any): Promise<Product>; // For seed

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
}

export class DatabaseStorage implements IStorage {
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

  async getProducts(filters?: { category?: string; type?: string; sort?: string; search?: string }): Promise<Product[]> {
    let query = db.select().from(products);
    
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
      return await query.where(and(...conditions)).orderBy(orderBy);
    }
    
    return await query.orderBy(orderBy);
  }

  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async createProduct(product: any): Promise<Product> {
    const [newProduct] = await db.insert(products).values(product).returning();
    return newProduct;
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
}

export const storage = new DatabaseStorage();
