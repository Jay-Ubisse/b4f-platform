export function sanitizeFilename(filename: string): string {
  return filename
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove acentos
    .replace(/[^a-zA-Z0-9._-]/g, "_") // permite apenas letras, números, ponto, underline e hífen
    .replace(/_+/g, "_") // reduz múltiplos _ para um só
    .replace(/^_+|_+$/g, ""); // remove _ no início ou fim
}
