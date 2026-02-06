"use client";

import { EditionProps } from "@/app/types/edition";
import { createContext, useContext, useEffect, useState, useRef } from "react";

interface EditionContextProps {
  edition: EditionProps | null;
  changeEdition: (newEdition: EditionProps | null) => void;
  clearEdition: () => void;
}

const EditionContext = createContext<EditionContextProps | null>(null);

export const editionLocalStorageKey = "currentEdition";

export const EditionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [edition, setEdition] = useState<EditionProps | null>(null);

  /**
   * Evita que o effect de persistência rode
   * antes da leitura inicial do localStorage
   */
  const hasHydrated = useRef(false);

  /**
   * 1️⃣ Hidratação inicial (leitura do localStorage)
   */
  useEffect(() => {
    try {
      const storedEdition = localStorage.getItem(editionLocalStorageKey);

      if (
        !storedEdition ||
        storedEdition === "undefined" ||
        storedEdition === "null"
      ) {
        return;
      }

      const parsed = JSON.parse(storedEdition);

      // Segurança extra: garante que é um objeto válido
      if (typeof parsed === "object" && parsed !== null) {
        setEdition(parsed);
      }
    } catch (error) {
      console.error("Erro ao ler localStorage:", error);
      localStorage.removeItem(editionLocalStorageKey);
    } finally {
      hasHydrated.current = true;
    }
  }, []);

  /**
   * 2️⃣ Persistência (NUNCA remove automaticamente)
   */
  useEffect(() => {
    if (!hasHydrated.current) return;

    try {
      if (edition !== null) {
        localStorage.setItem(editionLocalStorageKey, JSON.stringify(edition));
      }
    } catch (error) {
      console.error("Erro ao salvar no localStorage:", error);
    }
  }, [edition]);

  /**
   * 3️⃣ Alterar edição
   */
  function changeEdition(newEdition: EditionProps | null) {
    setEdition(newEdition);

    // Remove apenas quando explicitamente solicitado
    if (newEdition === null) {
      localStorage.removeItem(editionLocalStorageKey);
    }
  }

  /**
   * 4️⃣ Limpar edição explicitamente
   */
  function clearEdition() {
    setEdition(null);
    localStorage.removeItem(editionLocalStorageKey);
  }

  return (
    <EditionContext.Provider value={{ edition, changeEdition, clearEdition }}>
      {children}
    </EditionContext.Provider>
  );
};

export const useEdition = () => {
  const context = useContext(EditionContext);
  if (!context) {
    throw new Error("useEdition deve ser usado dentro de EditionProvider");
  }
  return context;
};
