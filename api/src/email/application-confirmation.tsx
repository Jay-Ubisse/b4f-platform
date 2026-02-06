import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Img,
  Section,
  Text,
} from "@react-email/components";

interface ApplicationConfirmationProps {
  name: string;
  code: string;
}

export const ApplicationConfirmation = ({
  name,
  code,
}: ApplicationConfirmationProps) => (
  <Html>
    <Head />
    <Body style={main}>
      <Container style={container}>
        <Img
          src={`/vercel.svg`}
          width="170"
          height="50"
          alt="Koala"
          style={logo}
        />
        <Text style={paragraph}>Olá {name},</Text>
        <Text style={paragraph}>
          Agradecemos por se candidatar à formação do Bytes 4 Future. Informamos
          que recebemos sua inscrição com sucesso.
        </Text>
        <Text style={paragraph}>
          Para ver o estado da sua candidatura, clique no link abaixo e insira o
          seu código de candidato ({code}) no campo de busca.
        </Text>
        <Section style={btnContainer}>
          <Button
            style={button}
            href="https://candidaturas-b4f.vercel.app/search-candidate"
          >
            Ver estado da candidatura
          </Button>
        </Section>
        <Text style={paragraph}>
          Atenciosamente,
          <br />
          Equipa Bytes 4 Future
        </Text>
      </Container>
    </Body>
  </Html>
);

export default ApplicationConfirmation;

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
};

const logo = {
  margin: "0 auto",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "26px",
};

const btnContainer = {
  textAlign: "center" as const,
};

const button = {
  backgroundColor: "#5F51E8",
  borderRadius: "3px",
  color: "#fff",
  fontSize: "16px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "12px",
};

const hr = {
  borderColor: "#cccccc",
  margin: "20px 0",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
};
