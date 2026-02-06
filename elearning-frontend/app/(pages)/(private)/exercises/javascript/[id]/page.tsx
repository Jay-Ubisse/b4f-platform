"use client";

import { useState, use } from "react";
import Editor from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { checkExerciseAnswer, getExercise } from "@/services/exercise";
import { Icons } from "@/components/loading-spinner";
import confetti from "canvas-confetti";

export default function ExercisePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [code, setCode] = useState<string>("");
  const [message, setMessage] = useState<null | {
    type: "success" | "error";
    text: string;
  }>(null);

  const {
    isPending,
    error,
    data: exercise,
    refetch,
  } = useQuery({
    queryKey: ["exercise"],
    queryFn: () => getExercise(id),
    refetchInterval: 5000,
  });

  if (isPending) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Icons.spinner className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 text-center">
        <p className="text-red-500 font-medium">
          Ocorreu um erro ao carregar o exercício.
        </p>
        <Button variant="outline" onClick={() => refetch()}>
          Recarregar
        </Button>
      </div>
    );
  }

  if (!exercise) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 text-center">
        <p className="text-yellow-500 font-medium">
          Nenhum exercício encontrado.
        </p>
        <Button variant="outline" onClick={() => refetch()}>
          Recarregar
        </Button>
      </div>
    );
  }

  async function handleSubmit() {
    setMessage(null); // Resetar mensagens

    try {
      // Endpoint fictício - substituis pelo teu axios
      const response = await checkExerciseAnswer({
        data: {
          exerciseId: exercise!.id,
          solution: code,
          studentId: "",
        },
      });

      if (response.status === 200) {
        setMessage({
          type: "success",
          text: "Resposta correta! 🎉",
        });

        // Dispara confetti
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } else {
        setMessage({
          type: "error",
          text: "O código inserido está incorreto ❌",
        });
      }
    } catch (err) {
      console.log(err);
      setMessage({
        type: "error",
        text: "Erro ao enviar o código. Verifica a tua conexão.",
      });
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-10 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 text-white">
      <div className="w-full max-w-4xl bg-zinc-950 border border-zinc-800 rounded-2xl shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-2">{exercise.title}</h1>
        <p className="text-zinc-400 mb-6">{exercise.description}</p>

        {/* Mensagem dinâmica acima do editor */}
        {message && (
          <div
            className={`mb-4 p-3 rounded-lg text-center font-medium ${
              message.type === "success"
                ? "bg-green-600/20 border border-green-600 text-green-400"
                : "bg-red-600/20 border border-red-600 text-red-400"
            }`}
          >
            {message.text}
          </div>
        )}

        <Editor
          height="400px"
          defaultLanguage="javascript"
          theme="vs-dark"
          value={exercise.functionTemplate || ""}
          onChange={(value) => setCode(value || "")}
          options={{
            fontSize: 14,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            wordWrap: "on",
            automaticLayout: true,
          }}
        />

        <div className="flex justify-end mt-6">
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg transition-all"
            onClick={handleSubmit}
          >
            Submeter
          </Button>
        </div>
      </div>
    </div>
  );
}
