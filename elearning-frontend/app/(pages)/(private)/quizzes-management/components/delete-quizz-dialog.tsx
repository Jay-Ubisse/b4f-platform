"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { deleteQuizz } from "@/services/quizz";

export function DeleteQuizButton({
  quizId,
  quizName,
}: {
  quizId: string;
  quizName: string;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    setLoading(true);
    toast.loading("A eliminar...", { id: "delete" });

    const res = await deleteQuizz(quizId);

    if (res.status === 200) {
      toast.success("Quizz eliminado", { id: "delete" });
      setOpen(false);
    } else {
      toast.error("Erro ao eliminar", { id: "delete" });
    }

    setLoading(false);
  }

  return (
    <>
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
        className="text-red-600 hover:text-red-800"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 
                   2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 
                   1H5v2h14V4z"
          />
        </svg>
      </motion.button>

      {/* Dialog de confirmação */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar eliminação</DialogTitle>
          </DialogHeader>

          <p>
            Tem certeza que deseja eliminar o quizz <b>{quizName}</b>?
          </p>

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={loading}
            >
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
