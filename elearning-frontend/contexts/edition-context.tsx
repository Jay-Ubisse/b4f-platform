"use client";

import { EditionProps } from "@/app/types/edition";
import { createContext, useContext, useState } from "react";

interface EditionContextProps {
  edition: EditionProps | null;
  changeEdition: (edition: EditionProps | null) => void;
}

const EditionContext = createContext<EditionContextProps | null>(null);

export const EditionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [edition, setEdition] = useState<EditionProps | null>(null);

  function changeEdition(edition: EditionProps | null) {
    setEdition(edition);
  }

  return (
    <EditionContext.Provider value={{ edition, changeEdition }}>
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
