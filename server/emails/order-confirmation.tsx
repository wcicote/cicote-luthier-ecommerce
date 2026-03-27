import { Html, Head, Preview, Body, Container, Section, Text, Button } from "@react-email/components";
import * as React from "react";

interface OrderConfirmationProps {
  customerName: string;
  orderNumber: string;
  totalAmount: number;
}

export const OrderConfirmationEmail = ({
  customerName,
  orderNumber,
  totalAmount,
}: OrderConfirmationProps) => {
  const previewText = `Seu pedido ${orderNumber} foi confirmado!`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={section}>
            <Text style={h1}>Obrigado pela sua compra, {customerName}!</Text>
            <Text style={text}>
              Seu pedido <strong>{orderNumber}</strong> foi recebido com sucesso. 
              Estamos preparando tudo para você.
            </Text>
            <Text style={text}>
              <strong>Total do pedido:</strong> {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalAmount)}
            </Text>
            <Button style={{ ...btn, padding: '12px 20px' }} href="https://cicoteluthier.com/minha-conta">
              Acompanhar Pedido
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

export default OrderConfirmationEmail;
