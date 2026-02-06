import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Text,
  Heading,
  Hr,
  Button,
  Section,
} from "@react-email/components";

interface ApplicationCompletedEmailProps {
  name: string;
  candidateCode: string;
  applicationStatusUrl: string;
}

export const ApplicationCompletedEmail = ({
  name,
  candidateCode,
  applicationStatusUrl,
}: ApplicationCompletedEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Candidatura concluída com sucesso – Bytes 4 Future</Preview>

      <Body
        style={{
          fontFamily: "Arial, sans-serif",
          backgroundColor: "#f9fafb",
          padding: "20px",
        }}
      >
        <Container
          style={{
            backgroundColor: "#ffffff",
            padding: "30px",
            borderRadius: "8px",
            maxWidth: "600px",
            margin: "0 auto",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          }}
        >
          <Heading
            style={{
              fontSize: "24px",
              marginBottom: "16px",
              color: "#1e40af",
            }}
          >
            Candidatura concluída com sucesso 🎉
          </Heading>

          <Text style={{ fontSize: "16px", lineHeight: "1.6" }}>
            Olá {name},
          </Text>

          <Text style={{ fontSize: "16px", lineHeight: "1.6" }}>
            A sua candidatura ao programa <strong>Bytes 4 Future</strong> foi
            concluída com sucesso!
          </Text>

          <Text
            style={{
              fontSize: "16px",
              lineHeight: "1.6",
              marginTop: "16px",
            }}
          >
            Para acompanhar o estado da sua candidatura, utilize o código
            abaixo. Guarde-o com cuidado, pois será necessário para futuras
            consultas.
          </Text>

          {/* Código do candidato */}
          <Section
            style={{
              backgroundColor: "#f1f5f9",
              padding: "16px",
              borderRadius: "6px",
              margin: "20px 0",
              textAlign: "center",
            }}
          >
            <Text
              style={{
                fontSize: "14px",
                color: "#475569",
                marginBottom: "8px",
              }}
            >
              Código do Candidato
            </Text>
            <Text
              style={{
                fontSize: "20px",
                fontWeight: "bold",
                letterSpacing: "1px",
                color: "#0f172a",
              }}
            >
              {candidateCode}
            </Text>
          </Section>

          {/* Botão para ver estado */}
          <Button
            href={applicationStatusUrl}
            style={{
              backgroundColor: "#2563eb",
              color: "#ffffff",
              fontSize: "16px",
              padding: "12px 20px",
              borderRadius: "6px",
              textDecoration: "none",
              display: "inline-block",
            }}
          >
            Ver estado da candidatura
          </Button>

          <Hr style={{ margin: "28px 0" }} />

          <Text
            style={{
              fontSize: "16px",
              lineHeight: "1.5",
              color: "#6b7280",
            }}
          >
            Atenciosamente,
            <br />
            <strong>Equipa Bytes 4 Future</strong>
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default ApplicationCompletedEmail;
