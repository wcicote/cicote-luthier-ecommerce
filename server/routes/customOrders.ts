import { Router } from "express";
import { createClient } from "@supabase/supabase-js";
import { ENV } from "../_core/env";
import { sendCustomOrderReceived } from "../emails/mailer";

export const customOrdersRoutes = Router();

// Endpoint público/autenticado para criar encomendas customizadas
customOrdersRoutes.post("/", async (req, res) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    
    const supabase = createClient(ENV.supabaseUrl, ENV.supabaseAnonKey, token ? {
      global: {
        headers: { Authorization: `Bearer ${token}` }
      }
    } : undefined);

    const orderData = req.body;
    const insertData = { ...orderData };

    if (token) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            insertData.usuario_id = user.id;
        }
    }

    const { data: customOrder, error } = await supabase
      .from("encomendas_customizadas")
      .insert(insertData)
      .select()
      .single();

    if (error) throw error;

    // Send confirmation email
    await sendCustomOrderReceived(customOrder.email_cliente, {
      customerName: customOrder.nome_cliente,
      instrumentType: customOrder.tipo_instrumento || "Instrumento Customizado",
    });

    res.status(201).json({ customOrder });
  } catch (err: any) {
    console.error("[Custom Orders Route Error]", err);
    res.status(500).json({ error: err.message });
  }
});
