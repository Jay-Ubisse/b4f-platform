import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import { Tailwind } from "@react-email/tailwind";

interface StudentRegistrationEmailProps {
  name: string;
  email: string;
  password: string;
  course: string; // ex: "Programação Web"
  shift: string; // ex: "Manhã" | "Tarde" | "Noite"
}

export const StudentRegistrationTemplate = ({
  name,
  email,
  password,
  course,
  shift,
}: StudentRegistrationEmailProps) => {
  const previewText = `Parabéns, ${name}! Você foi admitido(a) no Bytes 4 Future`;

  const dashboardUrl = `https://plataforma-power-up.vercel.app/`;
  const supportEmail = `candidaturas@bytes4future.co.mz`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>

      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans px-2">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[465px]">
            <Section className="mt-[32px]">
              <Img
                src={`/logo-red.png`}
                width="40"
                height="37"
                alt="Bytes 4 Future"
                className="my-0 mx-auto"
              />
            </Section>

            <Heading className="text-black text-[22px] font-normal text-center p-0 my-[26px] mx-0">
              Parabéns, <strong>{name}</strong>! 🎉
            </Heading>

            <Text className="text-black text-[14px] leading-[24px]">
              Você foi <strong>admitido(a)</strong> no programa{" "}
              <strong>Bytes 4 Future</strong>.
            </Text>

            <Text className="text-black text-[14px] leading-[24px]">
              Abaixo estão os detalhes da sua admissão:
            </Text>

            <div style={infoBox}>
              <Text style={infoLine}>
                <strong>Curso:</strong> {course}
              </Text>
              <Text style={infoLine}>
                <strong>Turno da turma:</strong> {shift}
              </Text>
            </div>

            <Text className="text-black text-[14px] leading-[24px]">
              Também criámos o seu acesso à plataforma. Use as credenciais
              abaixo para fazer login no Dashboard:
            </Text>

            <code style={code}>Email: {email}</code>
            <code style={code}>Palavra-passe: {password}</code>

            <Section className="text-center mt-[24px] mb-[24px]">
              <Button
                className="bg-[#171212] rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3"
                href={dashboardUrl}
              >
                Aceder ao Dashboard
              </Button>
            </Section>

            <Text className="text-black text-[14px] leading-[24px]">
              Se preferir, copie e cole este link no seu navegador:{" "}
              <Link href={dashboardUrl} className="text-blue-600 no-underline">
                {dashboardUrl}
              </Link>
            </Text>

            <Text className="text-black text-[14px] leading-[24px]">
              <strong>Próximos passos:</strong> a equipa do{" "}
              <strong>Bytes4Future</strong> irá entrar em contacto consigo para
              informar a <strong>data de início das aulas</strong> e os{" "}
              <strong>horários</strong>.
            </Text>

            <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />

            <Text className="text-black text-[12px] leading-[20px]">
              Este e-mail foi destinado a{" "}
              <span className="text-black">{name}</span>. Se você não esperava
              esta mensagem, pode ignorá-la. Caso esteja preocupado(a) com a
              segurança da sua conta, responda este e-mail ou contacte-nos via{" "}
              <Link
                href={`mailto:${supportEmail}`}
                className="text-blue-600 no-underline"
              >
                {supportEmail}
              </Link>
              . <br />
              <span className="text-black">Maputo - Moçambique</span>.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

const code = {
  display: "inline-block",
  padding: "16px 4.5%",
  width: "90.5%",
  backgroundColor: "#f4f4f4",
  borderRadius: "5px",
  border: "1px solid #eee",
  color: "#333",
  marginTop: "8px",
};

const infoBox: React.CSSProperties = {
  backgroundColor: "#f8fafc",
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
  padding: "12px 14px",
  marginTop: "8px",
  marginBottom: "10px",
};

const infoLine: React.CSSProperties = {
  margin: "6px 0",
  fontSize: "14px",
  lineHeight: "22px",
  color: "#111827",
};
