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

interface RegistrationEmailProps {
  name: string;
  role: string;
  email: string;
  password: string;
}

function userRoleText(role: string) {
  switch (role) {
    case "ADMIN":
      return "Administrador";
    case "RECRUITER":
      return "Recrutador";
    case "TEACHER":
      return "Professor";
    case "STUDENT":
      return "Estudante";
    case "ALUMNI":
      return "Ex-aluno";
    default:
      return "Usuário";
  }
}

export const UserRegistrationTemplate = ({
  name,
  email,
  password,
  role,
}: RegistrationEmailProps) => {
  const previewText = `Registro do ${name} na Bytes 4 Future`;
  console.log(role);
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
                alt="Vercel"
                className="my-0 mx-auto"
              />
            </Section>
            <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
              Entrar como {userRoleText(role)} no Dashboard de Candidaturas B4F
            </Heading>
            <Text className="text-black text-[14px] leading-[24px]">
              Olá {name},
            </Text>
            <Text className="text-black text-[14px] leading-[24px]">
              <strong>Bytes 4 Future</strong> (
              <Link
                href={`mailto:joaquimubisse@gmail.com`}
                className="text-blue-600 no-underline"
              >
                candidaturas@bytes4future.co.mz
              </Link>
              ) acaba de o registrar como <strong>{userRoleText(role)}</strong>{" "}
              em seu Dashboard. Use as seguintes credenciais para fazer o LogIn:
            </Text>
            <code style={code}>Email: {email}</code>
            <code style={code}>Palavra-passe: {password}</code>
            <Section className="text-center mt-[32px] mb-[32px]">
              <Button
                className="bg-[#171212] rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3"
                href={`https://candidaturas-b4f.binario.co.mz/`}
              >
                Ir para o Dashboard
              </Button>
            </Section>
            <Text className="text-black text-[14px] leading-[24px]">
              ou copia este URL para o seu navegador:{" "}
              <Link
                href={`https://candidaturas-b4f.binario.co.mz/`}
                className="text-blue-600 no-underline"
              >
                {`https://candidaturas-b4f.binario.co.mz/`}
              </Link>
            </Text>
            <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
            <Text>
              Este convite foi destinado a{" "}
              <span className="text-black">{`${name}`}</span>. Este convite foi
              enviado por candidaturas@bytes4future.co.mz localizado em{" "}
              <span className="text-black">Maputo - Moçambique</span>. Se você
              não esperava este convite, pode ignorar este e-mail. Se você está
              preocupado com a segurança de suas contas, responda a este e-mail
              para entrar em contato conosco.
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
};
