import { Html, Head, Preview, Body, Container, Section, Text } from "@react-email/components";
import * as React from "react";

interface CustomOrderReceivedProps {
  customerName: string;
  instrumentType: string;
}

export const CustomOrderReceivedEmail = ({
  customerName,
  instrumentType,
}: CustomOrderReceivedProps) => {
  const previewText = `Recebemos seu pedido de orçamento para o instrumento ${instrumentType}!`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={section}>
            <Text style={h1}>Olá, {customerName}!</Text>
            <Text style={text}>
              Recebemos as informações sobre a sua encomenda de <strong>{instrumentType}</strong>.
            </Text>
            <Text style={text}>
              Um dos nossos luthiers entrará em contato com você o mais breve possível para 
              discutir os detalhes e fornecer o orçamento final.
            </Text>
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
const footer = { color: "#888", fontSize: "14px", marginTop: "40px" };

export default CustomOrderReceivedEmail;
