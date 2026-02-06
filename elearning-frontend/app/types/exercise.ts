export interface ExerciseProps {
  id: string;
  title: string;
  description?: string;
  language: "JAVASCRIPT" | "HTML" | "CSS"; // conforme o enum ExerciseLanguage

  // Campos específicos por linguagem
  functionName?: string; // JS
  parameters?: string[]; // JS
  functionTemplate?: string;
  tests?: { input: unknown[]; expected: unknown }[]; // JS

  htmlTemplate?: string; // HTML
  cssTemplate?: string; // CSS

  createdById: string;

  createdAt: Date;
  updatedAt: Date;
}
