import { Router } from 'express';
import { createClient } from '@supabase/supabase-js';
import { ENV } from '../_core/env';

export const orderRoutes = Router();

// Helper to get an authenticated Supabase client using the incoming token
function getAuthClient(req: any) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) throw new Error('Unauthorized');
  
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

// POST /api/orders
orderRoutes.post('/', async (req, res) => {
  try {
    const supabase = getAuthClient(req);
    const { items, shipping_address, shipping_method, shipping_cost, subtotal, tax = 0 } = req.body;
    
    // Get the User ID
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized user' });
    }

    // Insert Order
    const total_amount = subtotal + shipping_cost + tax;
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        order_number: `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        status: 'pending',
        subtotal,
        shipping_cost,
        tax,
        total_amount,
        shipping_method,
        shipping_address,
        payment_method: 'card',
        payment_status: 'pending'
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // Insert Order Items
    const orderItemsToInsert = items.map((item: any) => ({
      order_id: order.id,
      product_id: item.product.id,
      quantity: item.quantity,
      unit_price: item.product.price,
      product_name: item.product.name,
      product_image_url: item.product.image_url
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItemsToInsert);

    if (itemsError) throw itemsError;

    // Clear user cart
    const { error: clearError } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', user.id);

    if (clearError) console.warn('[Orders] Could not clear cart after order created:', clearError);

    res.json({ order });
  } catch (error: any) {
    console.error('[Orders Route Error]', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/orders
orderRoutes.get('/', async (req, res) => {
  try {
    const supabase = getAuthClient(req);
    const { data, error } = await supabase
      .from('orders')
      .select('id, created_at, order_number, total_amount, status')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json({ orders: data });
  } catch (error: any) {
    console.error('[Orders Route Error]', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/orders/:id
orderRoutes.get('/:id', async (req, res) => {
  try {
    const supabase = getAuthClient(req);
    const { id } = req.params;
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('id', id)
      .single();

    if (error) throw error;
    res.json({ order: data });
  } catch (error: any) {
    console.error('[Orders Route Error]', error);
    res.status(500).json({ error: error.message });
  }
});
