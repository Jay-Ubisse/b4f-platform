"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import toast from "react-hot-toast";

export default function NewExercisePage() {
  const router = useRouter();

  const [exercise, setExercise] = useState({
    title: "",
    question: "",
    language: "",
    functionName: "",
    codeTemplate: "",
    correctAnswer: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setExercise({ ...exercise, [e.target.name]: e.target.value });
  };

  const handleLanguageChange = (value: string) => {
    setExercise({ ...exercise, language: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!exercise.title || !exercise.question || !exercise.language) {
      toast.error("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    try {
      const res = await fetch("/api/exercises", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(exercise),
      });

      if (!res.ok) throw new Error("Erro ao salvar exercício");

      toast.success("Exercício criado com sucesso!");
      router.push("/exercises");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao criar exercício.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-6 text-center">
        Criar Novo Exercício
      </h1>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Formulário */}
        <Card>
          <CardHeader>
            <CardTitle>Informações do Exercício</CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Ex: Criar um botão estilizado"
                  value={exercise.title}
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label htmlFor="question">Enunciado / Pergunta</Label>
                <Textarea
                  id="question"
                  name="question"
                  placeholder="Descreva o que o aluno deve fazer..."
                  value={exercise.question}
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label>Linguagem</Label>
                <Select onValueChange={handleLanguageChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma linguagem" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="html">HTML</SelectItem>
                    <SelectItem value="css">CSS</SelectItem>
                    <SelectItem value="javascript">JavaScript</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Campos específicos por linguagem */}
              {exercise.language === "javascript" && (
                <>
                  <div>
                    <Label htmlFor="functionName">Nome da Função</Label>
                    <Input
                      id="functionName"
                      name="functionName"
                      placeholder="Ex: somaNumeros"
                      value={exercise.functionName}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <Label htmlFor="codeTemplate">Código Base (JS)</Label>
                    <Textarea
                      id="codeTemplate"
                      name="codeTemplate"
                      placeholder={`Exemplo:
function soma(a, b) {
  // Escreva seu código aqui
}`}
                      value={exercise.codeTemplate}
                      onChange={handleChange}
                      rows={5}
                    />
                  </div>

                  <div>
                    <Label htmlFor="correctAnswer">Resposta Correta</Label>
                    <Input
                      id="correctAnswer"
                      name="correctAnswer"
                      placeholder="Ex: 10"
                      value={exercise.correctAnswer}
                      onChange={handleChange}
                    />
                  </div>
                </>
              )}

              {exercise.language === "html" && (
                <div>
                  <Label htmlFor="codeTemplate">Código HTML Esperado</Label>
                  <Textarea
                    id="codeTemplate"
                    name="codeTemplate"
                    placeholder={`Exemplo:
<button class="btn">Clique aqui</button>`}
                    value={exercise.codeTemplate}
                    onChange={handleChange}
                    rows={5}
                  />
                </div>
              )}

              {exercise.language === "css" && (
                <div>
                  <Label htmlFor="codeTemplate">Código CSS Esperado</Label>
                  <Textarea
                    id="codeTemplate"
                    name="codeTemplate"
                    placeholder={`Exemplo:
.btn {
  background-color: blue;
  color: white;
}`}
                    value={exercise.codeTemplate}
                    onChange={handleChange}
                    rows={5}
                  />
                </div>
              )}
            </CardContent>

            <CardFooter className="flex justify-end">
              <Button type="submit" className="w-full md:w-auto">
                Salvar Exercício
              </Button>
            </CardFooter>
          </form>
        </Card>

        {/* Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Pré-visualização</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>
              <strong>Título:</strong> {exercise.title || "—"}
            </p>
            <p>
              <strong>Pergunta:</strong> {exercise.question || "—"}
            </p>
            <p>
              <strong>Linguagem:</strong>{" "}
              {exercise.language?.toUpperCase() || "—"}
            </p>

            {exercise.language === "javascript" && (
              <>
                <p>
                  <strong>Função:</strong> {exercise.functionName || "—"}
                </p>
                <pre className="bg-muted p-3 rounded-md text-sm">
                  {exercise.codeTemplate || "// Código base aparecerá aqui..."}
                </pre>
                <p>
                  <strong>Resposta Correta:</strong>{" "}
                  {exercise.correctAnswer || "—"}
                </p>
              </>
            )}

            {(exercise.language === "html" || exercise.language === "css") && (
              <pre className="bg-muted p-3 rounded-md text-sm">
                {exercise.codeTemplate || "// Código base aparecerá aqui..."}
              </pre>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
