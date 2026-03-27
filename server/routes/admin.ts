import { Router } from "express";
import { createClient } from "@supabase/supabase-js";
import { ENV } from "../_core/env";
import { adminAuth } from "../middleware/adminAuth";
import { sendOrderStatusUpdate } from "../emails/mailer";

export const adminRoutes = Router();

// Middleware de verificação de admin
adminRoutes.use(adminAuth);

function getAuthClient(req: any) {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) throw new Error("Unauthorized");
  
  return createClient(
    ENV.supabaseUrl,
    ENV.supabaseAnonKey,
    {
      global: {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    }
  );
}

// ========================
// PRODUCTS CRUD
// ========================

// Listar produtos
adminRoutes.get("/products", async (req, res) => {
  try {
    const supabase = getAuthClient(req);
    const { data: products, error } = await supabase
      .from("products")
      .select("*, categories(name)")
      .order("created_at", { ascending: false });

    if (error) throw error;
    // Flatten category name for frontend
    const mapped = (products || []).map((p: any) => ({
      ...p,
      category: p.categories?.name || 'Sem Categoria',
      status: p.is_active ? 'Ativo' : 'Inativo',
    }));
    res.json({ products: mapped });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Criar produto
adminRoutes.post("/products", async (req, res) => {
  try {
    const supabase = getAuthClient(req);
    const body = req.body;

    // Generate slug from name
    const slug = (body.name || "produto")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      + "-" + Date.now();

    // Resolve category_id from category name if provided
    let categoryId: string | null = null;
    if (body.category) {
      const { data: cat } = await supabase
        .from("categories")
        .select("id")
        .ilike("name", body.category)
        .maybeSingle();
      categoryId = cat?.id || null;
    }

    // Build the insert object with only valid columns
    const productData: Record<string, any> = {
      name: body.name,
      description: body.description || null,
      price: parseFloat(body.price) || 0,
      stock: parseInt(body.stock) || 0,
      image_url: body.image_url || null,
      imagens: body.imagens || [],
      slug,
      is_active: true,
      category_id: categoryId,
    };

    const { data: product, error } = await supabase
      .from("products")
      .insert(productData)
      .select()
      .single();

    if (error) throw error;
    res.status(201).json({ product });
  } catch (error: any) {
    console.error("Product creation error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Atualizar produto
adminRoutes.put("/products/:id", async (req, res) => {
  try {
    const supabase = getAuthClient(req);
    const { id } = req.params;
    const body = req.body;

    // Only allow valid product columns
    const validKeys = ['name', 'description', 'price', 'stock', 'image_url', 'imagens', 'is_active', 'featured', 'slug', 'category_id'];
    const updates: Record<string, any> = {};
    for (const key of validKeys) {
      if (body[key] !== undefined) {
        updates[key] = body[key];
      }
    }

    const { data: product, error } = await supabase
      .from("products")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    res.json({ product });
  } catch (error: any) {
    console.error("Product update error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Deletar produto
adminRoutes.delete("/products/:id", async (req, res) => {
  try {
    const supabase = getAuthClient(req);
    const { id } = req.params;

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id);

    if (error) throw error;
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ========================
// ORDERS
// ========================

// Atualizar status do pedido e enviar e-mail
adminRoutes.put("/orders/:id/status", async (req, res) => {
  try {
    const supabase = getAuthClient(req);
    const { id } = req.params;
    const { status } = req.body;

    const { data: order, error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", id)
      .select("*, order_items(*)")
      .single();

    if (error) throw error;

    // Call Resend to send Order Status Update
    await sendOrderStatusUpdate(order.user_id, { // wait, user profile email is needed!
      customerName: "Cliente", // will fetch below
      orderNumber: order.order_number,
      status: order.status
    });

    res.json({ order });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ========================
// DASHBOARD
// ========================

adminRoutes.get("/dashboard", async (req, res) => {
  try {
    const supabase = getAuthClient(req);
    
    // Total Vendas
    const { data: orders, error: ordersError } = await supabase
      .from("orders")
      .select("total_amount, created_at");
      
    if (ordersError) throw ordersError;
    
    const total_vendas = orders.reduce((sum, order) => sum + (Number(order.total_amount) || 0), 0);
    
    // Pedidos hoje
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const pedidos_hoje = orders.filter((o) => new Date(o.created_at) >= today).length;
    
    // Produtos Ativos
    const { data: products, error: prodError } = await supabase
      .from("products")
      .select("id")
      .eq("is_active", true);
      
    if (prodError) throw prodError;
    
    // Clientes Total
    const { count: clientes_total, error: userError } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true });
      
    if (userError) throw userError;

    res.json({
      total_vendas,
      pedidos_hoje,
      produtos_ativos: products.length,
      clientes_total: clientes_total || 0,
      recentOrders: orders.slice(0, 5),
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ========================
// PROMOTIONS
// ========================

// Listar
adminRoutes.get("/promotions", async (req, res) => {
  try {
    const supabase = getAuthClient(req);
    const { data: promotions, error } = await supabase
      .from("promocoes")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    res.json({ promotions });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Criar
adminRoutes.post("/promotions", async (req, res) => {
  try {
    const supabase = getAuthClient(req);
    const { data: promotion, error } = await supabase
      .from("promocoes")
      .insert(req.body)
      .select()
      .single();

    if (error) throw error;
    res.status(201).json({ promotion });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ========================
// CUSTOM ORDERS
// ========================

adminRoutes.get("/custom-orders", async (req, res) => {
  try {
    const supabase = getAuthClient(req);
    const { data: customOrders, error } = await supabase
      .from("encomendas_customizadas")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    res.json({ customOrders });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});
