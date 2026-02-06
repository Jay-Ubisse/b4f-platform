import { GeneratePasswordProps } from "@/app/types/password-generator";

export function passwordGenerator({
  passwordLength,
  useLowerCase,
  useNumbers,
  useSymbols,
  useUpperCase,
}: GeneratePasswordProps): string {
  let charset = "";
  let newPassword = "";

  if (useSymbols) charset += "!@#$%^&*()";
  if (useNumbers) charset += "0123456789";
  if (useLowerCase) charset += "abcdefghijklmnopqrstuvwxyz";
  if (useUpperCase) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  for (let i = 0; i < passwordLength; i++) {
    newPassword += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return newPassword;
}
