"use client";

import { use, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/loading-spinner";
import { getQuizz } from "@/services/quizz";
import { QuizzItemProps } from "@/app/types/course";
import { useAuth } from "@/contexts/auth-context";
import { UserRole } from "@/app/types/user";
import toast from "react-hot-toast";
import { markChapterAsCompleted } from "@/services/chapter";

export default function QuizzPlayPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { user } = useAuth();

  const {
    isPending,
    error,
    data: quizz,
    refetch,
  } = useQuery({
    queryKey: ["quizzPlay", id],
    queryFn: () => getQuizz({ id }),
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);

  const [answers, setAnswers] = useState<
    {
      question: string;
      selected: string;
      correct: string;
      isCorrect: boolean;
    }[]
  >([]);

  const [finished, setFinished] = useState(false);

  const questions: QuizzItemProps[] = quizz?.quizzItems || [];

  const handleNext = () => {
    if (!selected) return;

    const currentQuestion = questions[currentIndex];

    const correctAnswer = currentQuestion.answer.trim().toLowerCase();
    const userAnswer = selected.trim().toLowerCase();

    const isCorrect = correctAnswer === userAnswer;

    // Armazena resposta
    setAnswers((prev) => [
      ...prev,
      {
        question: currentQuestion.question,
        selected,
        correct: currentQuestion.answer,
        isCorrect,
      },
    ]);

    // Vai para próxima pergunta
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
      setSelected(null);
    } else {
      // Finalizou tudo
      setFinished(true);

      // Se acertou tudo → confetti
      const allCorrect = answers.every((a) => a.isCorrect) && isCorrect;
      if (allCorrect) fireConfetti();
    }
  };

  const fireConfetti = () => {
    const duration = 2 * 1000;
    const animationEnd = Date.now() + duration;

    const defaults = {
      startVelocity: 30,
      spread: 360,
      ticks: 60,
      zIndex: 1000,
    };

    const randomInRange = (min: number, max: number) =>
      Math.random() * (max - min) + min;

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);
  };

  if (!quizz) {
    return (
      <div className="flex justify-between items-center px-4 py-2 w-full mt-20 bg-yellow-500/80">
        <p>Quizz não encontrado</p>
        <Button variant={"outline"} size={"sm"} onClick={() => refetch()}>
          Recarregar
        </Button>
      </div>
    );
  }

  const handleQuizzSubmit = async () => {
    if (user?.role !== UserRole.STUDENT) {
      toast("Deve ter uma conta de aluno para submeter o Quizz.", { id: "1" });
      return;
    }

    const response = await markChapterAsCompleted({
      data: {
        chapterId: quizz.chapterId,
        userEmail: user.email,
      },
    });

    if (response.status === 200) {
      toast.success("Capítulo concluído com sucesso", { id: "1" });
    } else {
      toast.error(response.data.message, { id: "1" });
    }
  };

  if (isPending) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Icons.spinner className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !quizz) {
    return (
      <div className="flex justify-center items-center h-screen bg-red-500/10 text-red-500">
        Erro ao carregar o quizz.
      </div>
    );
  }

  // -------------------------------
  //     FINAL DO QUIZZ
  // -------------------------------

  if (finished) {
    const incorrect = answers.filter((a) => !a.isCorrect);
    const allCorrect = incorrect.length === 0;

    if (allCorrect) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col justify-center items-center h-screen text-center space-y-6"
        >
          <h1 className="text-3xl font-bold text-green-600">🎉 Parabéns! 🎉</h1>
          <p className="text-lg">Você acertou todas as perguntas!</p>

          <Button
            onClick={handleQuizzSubmit}
            className="bg-primary text-secondary"
          >
            Submeter Quizz
          </Button>
        </motion.div>
      );
    }

    return (
      <div className="max-w-xl mx-auto py-12 text-center space-y-6">
        <h1 className="text-2xl font-bold text-red-600">
          Você errou {incorrect.length} pergunta(s)
        </h1>

        <div className="space-y-4 text-left">
          {incorrect.map((item, idx) => (
            <div key={idx} className="p-4 border rounded-xl bg-red-50">
              <p className="font-semibold">{item.question}</p>

              {/**
               *  <p className="text-sm text-red-600">
                Sua resposta: {item.selected}
              </p>
               * <
               p className="text-sm text-green-700">
                Resposta correta: {item.correct}
              </p> */}
            </div>
          ))}
        </div>

        <Button
          onClick={() => {
            setCurrentIndex(0);
            setAnswers([]);
            setFinished(false);
            setSelected(null);
          }}
          className="bg-primary text-white"
        >
          Refazer Quizz
        </Button>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <div className="max-w-2xl mx-auto py-12 space-y-6 text-center">
      <h1 className="text-2xl font-bold mb-4">{quizz.name}</h1>
      <p className="text-lg font-semibold mb-2">
        Pergunta {currentIndex + 1} de {questions.length}
      </p>

      <motion.div
        key={currentIndex}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="p-6 border rounded-2xl bg-white shadow-md min-w-xl"
      >
        <h2 className="text-xl font-medium mb-4">{currentQuestion.question}</h2>

        <div className="flex flex-col gap-3">
          {[
            currentQuestion.option1,
            currentQuestion.option2,
            currentQuestion.option3,
            currentQuestion.option4,
          ]
            .filter(Boolean)
            .map((opt, idx) => (
              <Button
                key={idx}
                variant={selected === opt ? "default" : "outline"}
                className="py-2 text-base"
                onClick={() => setSelected(opt!)}
              >
                {opt}
              </Button>
            ))}
        </div>

        <Button onClick={handleNext} disabled={!selected} className="mt-6">
          Próxima pergunta
        </Button>
      </motion.div>
    </div>
  );
}
