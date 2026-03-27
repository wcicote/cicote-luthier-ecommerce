import { Html, Head, Preview, Body, Container, Section, Text, Button } from "@react-email/components";
import * as React from "react";

interface OrderStatusUpdateProps {
  customerName: string;
  orderNumber: string;
  status: string;
}

export const OrderStatusUpdateEmail = ({
  customerName,
  orderNumber,
  status,
}: OrderStatusUpdateProps) => {
  const previewText = `Seu pedido ${orderNumber} mudou para ${status}`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={section}>
            <Text style={h1}>Olá, {customerName}!</Text>
            <Text style={text}>
              Gostaríamos de informar que o status do seu pedido <strong>{orderNumber}</strong> foi atualizado.
            </Text>
            <Text style={text}>
              Novo status: <strong>{status}</strong>
            </Text>
            <Button style={{ ...btn, padding: '12px 20px' }} href="https://cicoteluthier.com/minha-conta/pedidos">
              Ver Pedidos
            </Button>
            <Text style={footer}>Obrigado por escolher Cicote Luthier!</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

const main = { backgroundColor: "#f6f9fc", fontFamily: "sans-serif" };
const container = { margin: "0 auto", padding: "20px" };
const section = { backgroundColor: "#ffffff", padding: "40px", borderRadius: "5px" };
const h1 = { color: "#333", fontSize: "24px", fontWeight: "bold", margin: "0 0 20px" };
const text = { color: "#555", fontSize: "16px", lineHeight: "26px", margin: "0 0 20px" };
const btn = { backgroundColor: "#000", color: "#fff", borderRadius: "5px", textDecoration: "none" };
const footer = { color: "#888", fontSize: "14px", marginTop: "40px" };

export default OrderStatusUpdateEmail;
