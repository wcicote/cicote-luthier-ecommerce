import { Router } from 'express';
import Stripe from 'stripe';
import { ENV } from '../_core/env';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2025-02-24.acacia',
});

// A system-level Supabase client (using anon key since policies allow webhook update, but could use service_role)
const supabase = createClient(ENV.supabaseUrl, ENV.supabaseAnonKey);

export const paymentRoutes = Router();

// POST /api/payments/create-intent
paymentRoutes.post('/create-intent', async (req, res) => {
  try {
    const { orderId, amount } = req.body;
    
    // In a real app, you should calculate the amount securely on the backend from the DB order.
    // Ensure amount is an integer representing cents
    const amountInCents = Math.round(amount * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'brl',
      metadata: {
        orderId,
      },
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error: any) {
    console.error('[Payments] Error creating intent:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/payments/webhook
export const paymentWebhookHandler = async (req: any, res: any) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET || 'whsec_placeholder'
    );
  } catch (err: any) {
    console.error(`[Payments] Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const orderId = paymentIntent.metadata.orderId;

      if (orderId) {
        console.log(`[Payments] Order ${orderId} payment succeeded`);
        const { error } = await supabase
          .from('orders')
          .update({
            status: 'paid',
            payment_status: 'paid',
            stripe_payment_id: paymentIntent.id,
            updated_at: new Date().toISOString(),
          })
          .eq('id', orderId);

        if (error) console.error('[Payments] Supabase update error:', error);
      }
      break;
    }
    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const orderId = paymentIntent.metadata.orderId;

      if (orderId) {
        console.log(`[Payments] Order ${orderId} payment failed`);
        const { error } = await supabase
          .from('orders')
          .update({
            payment_status: 'failed',
            updated_at: new Date().toISOString(),
          })
          .eq('id', orderId);

        if (error) console.error('[Payments] Supabase update error:', error);
      }
      break;
    }
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.send();
};
