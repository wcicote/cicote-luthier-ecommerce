import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";

export const appRouter = router({
  system: systemRouter,
  
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // PRODUCTS
  products: router({
    list: publicProcedure
      .input(z.object({ limit: z.number().default(50), offset: z.number().default(0) }))
      .query(async ({ input }) => await db.getProducts(input.limit, input.offset)),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => await db.getProductById(input.id)),

    search: publicProcedure
      .input(z.object({ query: z.string(), limit: z.number().default(50) }))
      .query(async ({ input }) => await db.searchProducts(input.query, input.limit)),

    getByCategory: publicProcedure
      .input(z.object({ categoryId: z.number(), limit: z.number().default(50), offset: z.number().default(0) }))
      .query(async ({ input }) => await db.getProductsByCategory(input.categoryId, input.limit, input.offset)),

    create: protectedProcedure
      .input(z.object({
        categoryId: z.number(),
        name: z.string(),
        slug: z.string(),
        description: z.string().optional(),
        price: z.string(),
        image: z.string().optional(),
        stock: z.number().default(0),
        material: z.string().optional(),
        isCustomOrder: z.number().default(0),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== 'admin') throw new Error('Only admins can create products');
        return await db.createProduct(input);
      }),

    update: protectedProcedure
      .input(z.object({ id: z.number(), updates: z.record(z.string(), z.any()) }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== 'admin') throw new Error('Only admins can update products');
        return await db.updateProduct(input.id, input.updates as any);
      }),
  }),

  // CATEGORIES
  categories: router({
    list: publicProcedure.query(async () => await db.getCategories()),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => await db.getCategoryById(input.id)),

    create: protectedProcedure
      .input(z.object({
        name: z.string(),
        slug: z.string(),
        description: z.string().optional(),
        image: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== 'admin') throw new Error('Only admins can create categories');
        return await db.createCategory(input);
      }),
  }),

  // CART
  cart: router({
    getItems: protectedProcedure.query(async ({ ctx }) => {
      if (!ctx.user?.id) throw new Error('User not found');
      return await db.getCartItems(ctx.user.id);
    }),

    addItem: protectedProcedure
      .input(z.object({ productId: z.number(), quantity: z.number().default(1) }))
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user?.id) throw new Error('User not found');
        return await db.addToCart(ctx.user.id, input.productId, input.quantity);
      }),

    updateItem: protectedProcedure
      .input(z.object({ id: z.number(), quantity: z.number() }))
      .mutation(async ({ input }) => await db.updateCartItem(input.id, input.quantity)),

    removeItem: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => await db.removeFromCart(input.id)),

    clear: protectedProcedure.mutation(async ({ ctx }) => {
      if (!ctx.user?.id) throw new Error('User not found');
      return await db.clearCart(ctx.user.id);
    }),
  }),

  // ORDERS
  orders: router({
    list: protectedProcedure
      .input(z.object({ limit: z.number().default(50), offset: z.number().default(0) }))
      .query(async ({ input, ctx }) => {
        if (!ctx.user?.id) throw new Error('User not found');
        return await db.getUserOrders(ctx.user.id, input.limit, input.offset);
      }),

    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input, ctx }) => {
        const order = await db.getOrderById(input.id);
        if (order?.userId !== ctx.user?.id && ctx.user?.role !== 'admin') {
          throw new Error('Unauthorized');
        }
        return order;
      }),

    create: protectedProcedure
      .input(z.object({
        orderNumber: z.string(),
        subtotal: z.string(),
        shippingCost: z.string().default('0'),
        tax: z.string().default('0'),
        discount: z.string().default('0'),
        total: z.string(),
        shippingMethod: z.string().default('super_frete'),
        shippingAddress: z.string(),
        shippingCity: z.string(),
        shippingState: z.string(),
        shippingZip: z.string(),
        paymentMethod: z.string(),
        promoCode: z.string().optional(),
        items: z.array(z.object({
          productId: z.number(),
          quantity: z.number(),
          price: z.string(),
          subtotal: z.string(),
        })),
      }))
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user?.id) throw new Error('User not found');

        const order = await db.createOrder({
          userId: ctx.user.id,
          orderNumber: input.orderNumber,
          subtotal: input.subtotal,
          shippingCost: input.shippingCost,
          tax: input.tax,
          discount: input.discount,
          total: input.total,
          shippingMethod: input.shippingMethod,
          shippingAddress: input.shippingAddress,
          shippingCity: input.shippingCity,
          shippingState: input.shippingState,
          shippingZip: input.shippingZip,
          paymentMethod: input.paymentMethod,
          promoCode: input.promoCode,
          status: 'pending',
        });

        for (const item of input.items) {
          await db.createOrderItem({
            orderId: (order as any).insertId,
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            subtotal: item.subtotal,
          });
        }

        return order;
      }),

    updateStatus: protectedProcedure
      .input(z.object({ id: z.number(), status: z.string() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== 'admin') throw new Error('Only admins can update order status');
        return await db.updateOrderStatus(input.id, input.status);
      }),
  }),

  // PROMOTIONS
  promotions: router({
    validate: publicProcedure
      .input(z.object({ code: z.string() }))
      .query(async ({ input }) => {
        const promo = await db.getPromotionByCode(input.code);
        if (!promo) return null;

        const now = new Date();
        if (now < promo.validFrom || now > promo.validUntil) return null;
        if (promo.maxUses && (promo.usedCount || 0) >= promo.maxUses) return null;

        return promo;
      }),

    create: protectedProcedure
      .input(z.object({
        code: z.string(),
        description: z.string().optional(),
        discountType: z.enum(['percentage', 'fixed']),
        discountValue: z.string(),
        minOrderValue: z.string().optional(),
        maxUses: z.number().optional(),
        validFrom: z.date(),
        validUntil: z.date(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== 'admin') throw new Error('Only admins can create promotions');
        return await db.createPromotion({ ...input, active: 1, usedCount: 0 });
      }),
  }),

  // REVIEWS
  reviews: router({
    getByProduct: publicProcedure
      .input(z.object({ productId: z.number() }))
      .query(async ({ input }) => await db.getProductReviews(input.productId)),

    create: protectedProcedure
      .input(z.object({
        productId: z.number(),
        rating: z.number().min(1).max(5),
        title: z.string().optional(),
        comment: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user?.id) throw new Error('User not found');
        return await db.createReview({
          productId: input.productId,
          userId: ctx.user.id,
          rating: input.rating,
          title: input.title,
          comment: input.comment,
          verified: 0,
        });
      }),
  }),

  // WISHLIST
  wishlist: router({
    getItems: protectedProcedure.query(async ({ ctx }) => {
      if (!ctx.user?.id) throw new Error('User not found');
      return await db.getWishlist(ctx.user.id);
    }),

    addItem: protectedProcedure
      .input(z.object({ productId: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user?.id) throw new Error('User not found');
        return await db.addToWishlist(ctx.user.id, input.productId);
      }),

    removeItem: protectedProcedure
      .input(z.object({ productId: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user?.id) throw new Error('User not found');
        return await db.removeFromWishlist(ctx.user.id, input.productId);
      }),
  }),

  // ADDRESSES
  addresses: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      if (!ctx.user?.id) throw new Error('User not found');
      return await db.getUserAddresses(ctx.user.id);
    }),

    create: protectedProcedure
      .input(z.object({
        type: z.enum(['shipping', 'billing', 'both']).default('shipping'),
        name: z.string().optional(),
        street: z.string(),
        number: z.string(),
        complement: z.string().optional(),
        city: z.string(),
        state: z.string(),
        zip: z.string(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user?.id) throw new Error('User not found');
        return await db.createUserAddress({ userId: ctx.user.id, ...input });
      }),

    update: protectedProcedure
      .input(z.object({ id: z.number(), updates: z.record(z.string(), z.any()) }))
      .mutation(async ({ input }) => await db.updateUserAddress(input.id, input.updates as any)),
  }),

  // SETTINGS
  settings: router({
    get: publicProcedure
      .input(z.object({ key: z.string() }))
      .query(async ({ input }) => await db.getSiteSetting(input.key)),

    set: protectedProcedure
      .input(z.object({ key: z.string(), value: z.string() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== 'admin') throw new Error('Only admins can update settings');
        return await db.setSiteSetting(input.key, input.value);
      }),
  }),
});

export type AppRouter = typeof appRouter;
