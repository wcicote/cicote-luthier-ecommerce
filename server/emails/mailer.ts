import { Resend } from "resend";
import { OrderConfirmationEmail } from "./order-confirmation";
import { OrderStatusUpdateEmail } from "./order-status-update";
import { CustomOrderReceivedEmail } from "./custom-order-received";

const resend = new Resend(process.env.RESEND_API_KEY || "re_test_key");

const SENDER_EMAIL = "pedidos@cicoteluthier.com"; // Deve estar configurado no Resend

export async function sendOrderConfirmation(to: string, props: any) {
  if (!process.env.RESEND_API_KEY) return;
  try {
    await resend.emails.send({
      from: `Cicote Luthier <${SENDER_EMAIL}>`,
      to,
      subject: `Pedido Confirmado #${props.orderNumber}`,
      react: OrderConfirmationEmail(props),
    });
  } catch (err) {
    console.error("Erro ao enviar email de confirmação:", err);
  }
}

export async function sendOrderStatusUpdate(to: string, props: any) {
  if (!process.env.RESEND_API_KEY) return;
  try {
    await resend.emails.send({
      from: `Cicote Luthier <${SENDER_EMAIL}>`,
      to,
      subject: `Atualização do Pedido #${props.orderNumber}`,
      react: OrderStatusUpdateEmail(props),
    });
  } catch (err) {
    console.error("Erro ao enviar email de status:", err);
  }
}

export async function sendCustomOrderReceived(to: string, props: any) {
  if (!process.env.RESEND_API_KEY) return;
  try {
    await resend.emails.send({
      from: `Cicote Luthier <${SENDER_EMAIL}>`,
      to,
      subject: `Orçamento Recebido: ${props.instrumentType}`,
      react: CustomOrderReceivedEmail(props),
    });
  } catch (err) {
    console.error("Erro ao enviar email de encomenda:", err);
  }
}
