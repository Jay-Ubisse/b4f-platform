"use client";

import { use, useCallback, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { z } from "zod";
import { useRouter } from "next/navigation";

import { Icons } from "@/components/loading-spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createQuizzItem, getQuizz } from "@/services/quizz";
import { CirclePlus, PlusCircle } from "lucide-react";

// -------------------------------
// Schema e tipos
// -------------------------------
const quizzItemSchema = z.object({
  quizzId: z.string().min(1, { message: "Quizz ID is required" }),
  question: z.string().min(1, { message: "Question is required" }),
  option1: z.string().min(1, { message: "Option 1 is required" }),
  option2: z.string().min(1, { message: "Option 2 is required" }),
  option3: z.string().optional(),
  option4: z.string().optional(),
  answer: z.string().min(1, { message: "Answer is required" }),
});

// Internal shape we keep in UI (allows empty option fields)
type UiQuizzItem = {
  quizzId: string;
  question: string;
  option1: string;
  option2: string;
  option3?: string;
  option4?: string;
  answer: string; // must equal the selected option text when saved
};

// -------------------------------
// Small utility helpers
// -------------------------------
const EMPTY_ITEM = (quizzId: string): UiQuizzItem => ({
  quizzId,
  question: "",
  option1: "",
  option2: "",
  option3: undefined,
  option4: undefined,
  answer: "",
});

function getOptionValues(q: UiQuizzItem) {
  return [q.option1, q.option2, q.option3, q.option4].filter(
    (v): v is string => typeof v === "string" && v.trim() !== ""
  );
}

// -------------------------------
// Confirm dialog (simple)
// -------------------------------
function ConfirmDialog({
  open,
  title,
  message,
  onCancel,
  onConfirm,
  confirmLabel = "Confirmar",
}: {
  open: boolean;
  title: string;
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
  confirmLabel?: string;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onCancel}
        aria-hidden
      />
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative z-50 w-full max-w-lg bg-white rounded-xl shadow-lg p-6"
      >
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground mb-4">{message}</p>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

// -------------------------------
// OptionRow component
// -------------------------------
function OptionRow({
  value,
  index,
  onChange,
  onRemove,
  onSelectAnswer,
  selected,
  disabledRemove,
}: {
  value: string;
  index: number;
  onChange: (val: string) => void;
  onRemove: () => void;
  onSelectAnswer: () => void;
  selected: boolean;
  disabledRemove: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-3 border rounded-lg p-2 transition-colors ${
        selected ? "bg-green-50 border-green-400" : "bg-white"
      }`}
      // clicking the row selects as answer
      onClick={onSelectAnswer}
      role="button"
    >
      <Input
        placeholder={`Opção ${index + 1}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent border-none p-0"
        onClick={(e) => e.stopPropagation()} // don't let input click select answer
      />
      <div className="flex items-center gap-2">
        {selected ? (
          <motion.span
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-green-600 font-bold"
            onClick={(e) => e.stopPropagation()}
          >
            ✔️
          </motion.span>
        ) : null}

        {!disabledRemove && (
          <Button
            variant="destructive"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
          >
            Remover
          </Button>
        )}
      </div>
    </div>
  );
}

// -------------------------------
// QuestionCard component
// -------------------------------
function QuestionCard({
  question,
  index,
  onChangeField,
  onAddOption,
  onRemoveOption,
  onRemoveQuestion,
  onSelectAnswer,
  validationError,
}: {
  question: UiQuizzItem;
  index: number;
  onChangeField: (field: keyof UiQuizzItem, value: string) => void;
  onAddOption: () => void;
  onRemoveOption: (
    field: "option1" | "option2" | "option3" | "option4"
  ) => void;
  onRemoveQuestion: () => void;
  onSelectAnswer: (value: string) => void;
  validationError?: string | null;
}) {
  const options = [
    {
      key: "option1" as const,
      label: "Opção 1",
      value: question.option1 || "",
    },
    {
      key: "option2" as const,
      label: "Opção 2",
      value: question.option2 || "",
    },
    {
      key: "option3" as const,
      label: "Opção 3",
      value: question.option3 ?? "",
    },
    {
      key: "option4" as const,
      label: "Opção 4",
      value: question.option4 ?? "",
    },
  ];

  const filledCount = options.filter((o) => o.value.trim() !== "").length;

  return (
    <div className="border rounded-2xl p-5 bg-white shadow-sm relative">
      <div className="absolute top-4 right-4">
        <Button variant="destructive" size="sm" onClick={onRemoveQuestion}>
          Remover Pergunta
        </Button>
      </div>

      <div className="mb-4">
        <Label className="font-semibold mb-2 block">Pergunta {index + 1}</Label>
        <Input
          placeholder="Digite a pergunta"
          value={question.question}
          onChange={(e) => onChangeField("question", e.target.value)}
        />
      </div>

      <div className="space-y-3">
        <Label className="font-semibold">Opções</Label>

        <div className="grid grid-cols-1 gap-2">
          {options.map((opt, optIndex) =>
            // only render option rows if slot exists (option1/2 always exist, 3/4 may be undefined)
            optIndex < 2 ||
            question[`option${optIndex + 1}` as keyof UiQuizzItem] !==
              undefined ? (
              <OptionRow
                key={opt.key}
                index={optIndex}
                value={opt.value}
                onChange={(val) => onChangeField(opt.key, val)}
                onRemove={() => onRemoveOption(opt.key)}
                onSelectAnswer={() => {
                  // only allow selecting when option has text
                  if (opt.value.trim() === "") return;
                  onSelectAnswer(opt.value);
                }}
                selected={
                  question.answer === opt.value && opt.value.trim() !== ""
                }
                disabledRemove={optIndex < 2} // first two cannot be removed
              />
            ) : null
          )}
        </div>

        <div className="mt-2 flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onAddOption}
            disabled={filledCount >= 4}
          >
            <CirclePlus className="mr-2" />
            Adicionar opção
          </Button>
          <span className="text-sm text-muted-foreground">
            {filledCount} / 4 preenchidas
          </span>
        </div>

        {validationError && (
          <p className="text-sm text-red-600 mt-2">{validationError}</p>
        )}
      </div>
    </div>
  );
}

// -------------------------------
// Página principal
// -------------------------------
export default function CreateQuizzPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const {
    isPending,
    error,
    data: quizz,
    refetch,
  } = useQuery({
    queryKey: ["quizz", id],
    queryFn: () => getQuizz({ id }),
  });

  // UI state
  const [questions, setQuestions] = useState<UiQuizzItem[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [confirmRemoveIndex, setConfirmRemoveIndex] = useState<number | null>(
    null
  );

  // Adiciona nova pergunta com duas opções vazias (nenhuma selecionada)
  const handleAddQuestion = useCallback(() => {
    setQuestions((prev) => [...prev, EMPTY_ITEM(id)]);
  }, [id]);

  const handleRemoveQuestion = useCallback((index: number) => {
    setConfirmRemoveIndex(index);
  }, []);

  const confirmRemoveQuestion = useCallback(() => {
    if (confirmRemoveIndex === null) return;
    setQuestions((prev) => prev.filter((_, i) => i !== confirmRemoveIndex));
    setConfirmRemoveIndex(null);
  }, [confirmRemoveIndex]);

  const cancelRemoveQuestion = useCallback(
    () => setConfirmRemoveIndex(null),
    []
  );

  // Atualiza campo
  const handleChange = useCallback(
    (index: number, field: keyof UiQuizzItem, value: string) => {
      setQuestions((prev) => {
        const copy = [...prev];
        copy[index] = { ...copy[index], [field]: value };

        // If user changed the text of the currently selected answer and it no longer matches,
        // unset answer to avoid stale references.
        if (field.startsWith("option")) {
          const currentAnswer = copy[index].answer;
          const optionValues = getOptionValues(copy[index]);
          if (currentAnswer && !optionValues.includes(currentAnswer)) {
            copy[index].answer = "";
          }
        }

        return copy;
      });
    },
    []
  );

  // adiciona option (cria slot option3/option4)
  const handleAddOption = useCallback((index: number) => {
    setQuestions((prev) => {
      const copy = [...prev];
      const q = { ...copy[index] };
      if (q.option3 === undefined) q.option3 = "";
      else if (q.option4 === undefined) q.option4 = "";
      copy[index] = q;
      return copy;
    });
  }, []);

  // remove option (limpa campo)
  const handleRemoveOption = useCallback(
    (index: number, field: "option1" | "option2" | "option3" | "option4") => {
      setQuestions((prev) => {
        const copy = [...prev];
        const q = { ...copy[index] };
        // Prevent removing the first two options
        if (field === "option1" || field === "option2") return copy;

        // capture the current value before removing so we can compare against answer
        const removedValue = q[field] as string | undefined;
        q[field] = undefined;

        // if removed option was the selected answer, unset answer
        if (removedValue && q.answer === removedValue) {
          q.answer = "";
        }
        copy[index] = q;
        return copy;
      });
    },
    []
  );

  // select answer
  const handleSelectAnswer = useCallback((index: number, value: string) => {
    setQuestions((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], answer: value };
      return copy;
    });
  }, []);

  // Validation before saving
  const validateAll = useCallback((items: UiQuizzItem[]) => {
    const errors: (string | null)[] = items.map((q) => {
      if (!q.question || q.question.trim() === "") return "Pergunta vazia";
      const optionVals = getOptionValues(q);
      if (optionVals.length < 2)
        return "A pergunta deve ter pelo menos 2 opções";
      if (!q.answer || q.answer.trim() === "")
        return "Selecione a resposta correta";
      if (!optionVals.includes(q.answer))
        return "A resposta correta deve corresponder a uma opção";
      return null;
    });
    return errors;
  }, []);

  // Save all to backend
  const handleSave = useCallback(async () => {
    if (questions.length === 0) {
      toast.error("Adicione pelo menos uma pergunta");
      return;
    }

    const validation = validateAll(questions);
    const hasError = validation.some(Boolean);
    if (hasError) {
      validation.forEach((err, idx) => {
        if (err) {
          toast.error(`Pergunta ${idx + 1}: ${err}`);
        }
      });
      return;
    }

    setIsSaving(true);
    toast.loading("A guardar perguntas...", { id: "save" });

    try {
      // convert UiQuizzItem -> payload matching schema (ensures optional fields omitted if undefined)
      type PayloadProps = {
        quizzId: string;
        question: string;
        option1: string;
        option2: string;
        option3?: string;
        option4?: string;
        answer: string;
      };

      for (const q of questions) {
        const payload: PayloadProps = {
          quizzId: q.quizzId,
          question: q.question,
          option1: q.option1,
          option2: q.option2,
          answer: q.answer,
        };
        if (q.option3 && q.option3.trim() !== "") payload.option3 = q.option3;
        if (q.option4 && q.option4.trim() !== "") payload.option4 = q.option4;

        // zod parse will throw if invalid
        quizzItemSchema.parse(payload);
        await createQuizzItem({ data: payload });
      }

      toast.success("Perguntas adicionadas com sucesso!", { id: "save" });
      router.push("/quizzes-management");
      // optionally reset UI
      setQuestions([]);
    } catch (err) {
      console.error(err);
      const msg = "Erro ao guardar perguntas";
      toast.error(msg, { id: "save" });
    } finally {
      setIsSaving(false);
    }
  }, [questions, validateAll]);

  if (isPending) {
    return (
      <div className="flex justify-center items-center px-4 py-2 w-full h-full">
        <Icons.spinner className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-between items-center px-4 py-2 w-full mt-20 bg-red-500/80">
        <p>Ocorreu um erro ao buscar o quizz</p>
        <Button variant={"outline"} size={"sm"} onClick={() => refetch()}>
          Recarregar
        </Button>
      </div>
    );
  }

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

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-6">
      <h1 className="text-2xl font-semibold mb-2">
        Adicionar perguntas - {quizz.name}
      </h1>

      <div className="flex items-center gap-2">
        <Button
          onClick={handleAddQuestion}
          className="bg-primary text-secondary flex items-center gap-2"
        >
          <PlusCircle />
          <span>Adicionar Pergunta</span>
        </Button>

        <div className="ml-auto" />
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-primary text-secondary"
        >
          {isSaving ? "A guardar..." : "Guardar todas as perguntas"}
        </Button>
      </div>

      <div className="space-y-4">
        {questions.length === 0 && (
          <div className="p-6 rounded-lg bg-slate-50 text-center text-sm text-muted-foreground">
            Clique em &quot;Adicionar Pergunta&quot; para começar a criar
            perguntas.
          </div>
        )}

        {questions.map((q, idx) => (
          <QuestionCard
            key={idx}
            question={q}
            index={idx}
            onChangeField={(field, value) => handleChange(idx, field, value)}
            onAddOption={() => handleAddOption(idx)}
            onRemoveOption={(field) => handleRemoveOption(idx, field)}
            onRemoveQuestion={() => handleRemoveQuestion(idx)}
            onSelectAnswer={(value) => handleSelectAnswer(idx, value)}
            validationError={validateAll([q])[0] ?? null}
          />
        ))}
      </div>

      {/* Confirm remove dialog */}
      <ConfirmDialog
        open={confirmRemoveIndex !== null}
        title="Remover pergunta"
        message="Tem certeza que deseja remover esta pergunta? Esta ação não pode ser desfeita."
        onCancel={cancelRemoveQuestion}
        onConfirm={confirmRemoveQuestion}
        confirmLabel="Remover"
      />
    </div>
  );
}
