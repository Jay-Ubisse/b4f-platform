"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import toast from "react-hot-toast";
import { useAuth } from "@/contexts/auth-context";
import { Trash2 } from "lucide-react";
import { createExercise } from "@/services/exercise";

interface TestCase {
  input: string;
  expected: string;
}

export default function NewJavaScriptExercisePage() {
  const router = useRouter();
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [functionName, setFunctionName] = useState("");
  const [parameters, setParameters] = useState("");
  const [tests, setTests] = useState<TestCase[]>([{ input: "", expected: "" }]);
  const [loading, setLoading] = useState(false);

  // ➕ Adiciona novo teste
  const addTest = () => {
    setTests([...tests, { input: "", expected: "" }]);
  };

  // ❌ Remove teste
  const removeTest = (index: number) => {
    const newTests = [...tests];
    newTests.splice(index, 1);
    setTests(newTests);
  };

  // ✏️ Atualiza campo de teste
  const handleTestChange = (
    index: number,
    field: keyof TestCase,
    value: string
  ) => {
    const newTests = [...tests];
    newTests[index][field] = value;
    setTests(newTests);
  };

  // 🧠 Submeter exercício
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    toast.loading("A criar exercício...", { id: "1" });

    try {
      const payload = {
        title,
        description,
        language: "JAVASCRIPT",
        functionName,
        parameters: parameters.split(",").map((p) => p.trim()),
        tests: tests.map((t) => ({
          input: JSON.parse(t.input),
          expected: JSON.parse(t.expected),
        })),
        createdById: user!.id,
      };

      await createExercise({ data: payload });

      toast.success("Exercício de JavaScript criado com sucesso!", { id: "1" });
      router.push("/exercises/javascript");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao criar exercício. Verifique os dados.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-6 text-center">
        Criar Exercício de JavaScript
      </h1>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Informações do Exercício</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4 mt-4">
            <div>
              <Label htmlFor="title" className="mb-2">
                Título
              </Label>
              <Input
                id="title"
                placeholder="Ex: Função que soma dois números"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="description" className="mb-2">
                {" "}
                Descrição
              </Label>
              <Textarea
                id="description"
                placeholder="Explique o que o aluno deve fazer..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="functionName" className="mb-2">
                  Nome da Função
                </Label>
                <Input
                  id="functionName"
                  placeholder="Ex: somaNumeros"
                  value={functionName}
                  onChange={(e) => setFunctionName(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="parameters" className="mb-2">
                  Parâmetros
                </Label>
                <Input
                  id="parameters"
                  placeholder="Ex: a,b"
                  value={parameters}
                  onChange={(e) => setParameters(e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label className="mb-2">Casos de Teste</Label>
              <div className="space-y-4 mt-2">
                {tests.map((test, index) => (
                  <div
                    key={index}
                    className="p-4 border rounded-md space-y-2 relative bg-muted/40"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="mb-2">Argumentos (Array)</Label>
                        <Input
                          placeholder="Ex: [1,2]"
                          value={test.input}
                          onChange={(e) =>
                            handleTestChange(index, "input", e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <Label className="mb-2">Retorno esperado</Label>
                        <Input
                          placeholder="Ex: 3"
                          value={test.expected}
                          onChange={(e) =>
                            handleTestChange(index, "expected", e.target.value)
                          }
                        />
                      </div>
                    </div>
                    {tests.length > 1 && (
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2"
                        onClick={() => removeTest(index)}
                      >
                        <Trash2 />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              <Button
                type="button"
                variant="secondary"
                className="mt-2"
                onClick={addTest}
              >
                + Adicionar Teste
              </Button>
            </div>
          </CardContent>

          <CardFooter className="flex justify-end">
            <Button type="submit" disabled={loading}>
              {loading ? "A criar..." : "Criar Exercício"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
