import { z } from 'zod';
import { insertUserSchema, insertCartItemSchema, insertFavoriteSchema, insertContactSchema, users, products, cartItems, favorites, reviews, contacts } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  products: {
    list: {
      method: 'GET' as const,
      path: '/api/products',
      input: z.object({
        category: z.enum(['men', 'women', 'kids']).optional(),
        type: z.string().optional(),
        sort: z.enum(['price_asc', 'price_desc', 'newest', 'popular']).optional(),
        search: z.string().optional(),
      }).optional(),
      responses: {
        200: z.array(z.custom<typeof products.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/products/:id',
      responses: {
        200: z.custom<typeof products.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
  },
  cart: {
    list: {
      method: 'GET' as const,
      path: '/api/cart',
      responses: {
        200: z.array(z.custom<typeof cartItems.$inferSelect & { product: typeof products.$inferSelect }>()),
      },
    },
    add: {
      method: 'POST' as const,
      path: '/api/cart',
      input: insertCartItemSchema.omit({ userId: true }),
      responses: {
        201: z.custom<typeof cartItems.$inferSelect>(),
        401: errorSchemas.internal, // Unauthorized
      },
    },
    update: {
      method: 'PATCH' as const,
      path: '/api/cart/:id',
      input: z.object({ quantity: z.number().min(1) }),
      responses: {
        200: z.custom<typeof cartItems.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/cart/:id',
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
      },
    },
  },
  favorites: {
    list: {
      method: 'GET' as const,
      path: '/api/favorites',
      responses: {
        200: z.array(z.custom<typeof favorites.$inferSelect & { product: typeof products.$inferSelect }>()),
      },
    },
    toggle: {
      method: 'POST' as const,
      path: '/api/favorites',
      input: z.object({ productId: z.number() }),
      responses: {
        200: z.object({ isFavorite: z.boolean() }),
        401: errorSchemas.internal,
      },
    },
  },
  reviews: {
    list: {
      method: 'GET' as const,
      path: '/api/reviews',
      responses: {
        200: z.array(z.custom<typeof reviews.$inferSelect>()),
      },
    },
  },
  contact: {
    submit: {
      method: 'POST' as const,
      path: '/api/contact',
      input: insertContactSchema,
      responses: {
        201: z.custom<typeof contacts.$inferSelect>(),
      },
    },
  },
  auth: {
    register: {
      method: 'POST' as const,
      path: '/api/register',
      input: insertUserSchema,
      responses: {
        201: z.custom<typeof users.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    login: {
      method: 'POST' as const,
      path: '/api/login',
      input: z.object({ username: z.string(), password: z.string() }),
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        401: errorSchemas.internal,
      },
    },
    logout: {
      method: 'POST' as const,
      path: '/api/logout',
      responses: {
        200: z.void(),
      },
    },
    me: {
      method: 'GET' as const,
      path: '/api/user',
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        401: errorSchemas.internal,
      },
    },
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
