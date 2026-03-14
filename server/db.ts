import { eq, and, like, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, 
  users,
  products,
  categories,
  orders,
  orderItems,
  cartItems,
  promotions,
  reviews,
  wishlist,
  userAddresses,
  siteSettings,
  InsertProduct,
  InsertOrder,
  InsertOrderItem,
  InsertCartItem,
  InsertPromotion,
  InsertReview,
  InsertWishlist,
  InsertUserAddress,
  InsertCategory
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ============= PRODUCTS =============
export async function getProducts(limit = 50, offset = 0) {
  const db = await getDb();
  if (!db) return [];

  return await db.select()
    .from(products)
    .where(eq(products.active, 1))
    .limit(limit)
    .offset(offset);
}

export async function getProductById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select()
    .from(products)
    .where(and(eq(products.id, id), eq(products.active, 1)))
    .limit(1);
  
  return result.length > 0 ? result[0] : undefined;
}

export async function getProductsByCategory(categoryId: number, limit = 50, offset = 0) {
  const db = await getDb();
  if (!db) return [];

  return await db.select()
    .from(products)
    .where(and(eq(products.categoryId, categoryId), eq(products.active, 1)))
    .limit(limit)
    .offset(offset);
}

export async function searchProducts(query: string, limit = 50) {
  const db = await getDb();
  if (!db) return [];

  return await db.select()
    .from(products)
    .where(and(
      like(products.name, `%${query}%`),
      eq(products.active, 1)
    ))
    .limit(limit);
}

export async function createProduct(product: InsertProduct) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.insert(products).values(product);
}

export async function updateProduct(id: number, updates: Partial<InsertProduct>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.update(products)
    .set(updates)
    .where(eq(products.id, id));
}

// ============= CATEGORIES =============
export async function getCategories() {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(categories);
}

export async function getCategoryById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select()
    .from(categories)
    .where(eq(categories.id, id))
    .limit(1);
  
  return result.length > 0 ? result[0] : undefined;
}

export async function createCategory(category: InsertCategory) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.insert(categories).values(category);
}

// ============= CART =============
export async function getCartItems(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select()
    .from(cartItems)
    .where(eq(cartItems.userId, userId));
}

export async function addToCart(userId: number, productId: number, quantity: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.insert(cartItems).values({
    userId,
    productId,
    quantity,
  });
}

export async function updateCartItem(id: number, quantity: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.update(cartItems)
    .set({ quantity })
    .where(eq(cartItems.id, id));
}

export async function removeFromCart(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.delete(cartItems).where(eq(cartItems.id, id));
}

export async function clearCart(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.delete(cartItems).where(eq(cartItems.userId, userId));
}

// ============= ORDERS =============
export async function createOrder(order: InsertOrder) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.insert(orders).values(order);
}

export async function getOrderById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select()
    .from(orders)
    .where(eq(orders.id, id))
    .limit(1);
  
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserOrders(userId: number, limit = 50, offset = 0) {
  const db = await getDb();
  if (!db) return [];

  return await db.select()
    .from(orders)
    .where(eq(orders.userId, userId))
    .orderBy(desc(orders.createdAt))
    .limit(limit)
    .offset(offset);
}

export async function updateOrderStatus(id: number, status: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.update(orders)
    .set({ status: status as any })
    .where(eq(orders.id, id));
}

// ============= ORDER ITEMS =============
export async function createOrderItem(item: InsertOrderItem) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.insert(orderItems).values(item);
}

export async function getOrderItems(orderId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select()
    .from(orderItems)
    .where(eq(orderItems.orderId, orderId));
}

// ============= PROMOTIONS =============
export async function getPromotionByCode(code: string) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select()
    .from(promotions)
    .where(and(
      eq(promotions.code, code),
      eq(promotions.active, 1)
    ))
    .limit(1);
  
  return result.length > 0 ? result[0] : undefined;
}

export async function createPromotion(promotion: InsertPromotion) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.insert(promotions).values(promotion);
}

// ============= REVIEWS =============
export async function getProductReviews(productId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select()
    .from(reviews)
    .where(eq(reviews.productId, productId))
    .orderBy(desc(reviews.createdAt));
}

export async function createReview(review: InsertReview) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.insert(reviews).values(review);
}

// ============= WISHLIST =============
export async function getWishlist(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select()
    .from(wishlist)
    .where(eq(wishlist.userId, userId));
}

export async function addToWishlist(userId: number, productId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.insert(wishlist).values({ userId, productId });
}

export async function removeFromWishlist(userId: number, productId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.delete(wishlist)
    .where(and(
      eq(wishlist.userId, userId),
      eq(wishlist.productId, productId)
    ));
}

// ============= USER ADDRESSES =============
export async function getUserAddresses(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select()
    .from(userAddresses)
    .where(eq(userAddresses.userId, userId));
}

export async function createUserAddress(address: InsertUserAddress) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.insert(userAddresses).values(address);
}

export async function updateUserAddress(id: number, updates: Partial<InsertUserAddress>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.update(userAddresses)
    .set(updates)
    .where(eq(userAddresses.id, id));
}

// ============= SITE SETTINGS =============
export async function getSiteSetting(key: string) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select()
    .from(siteSettings)
    .where(eq(siteSettings.key, key))
    .limit(1);
  
  return result.length > 0 ? result[0] : undefined;
}

export async function setSiteSetting(key: string, value: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const existing = await getSiteSetting(key);
  
  if (existing) {
    return await db.update(siteSettings)
      .set({ value })
      .where(eq(siteSettings.key, key));
  } else {
    return await db.insert(siteSettings).values({ key, value });
  }
}
