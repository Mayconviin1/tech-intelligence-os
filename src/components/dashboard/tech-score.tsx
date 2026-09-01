"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Info } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TechScoreData } from "@/types";

interface TechScoreProps {
  data: TechScoreData;
}

const scoreFactors = [
  { label: "Tecnologias acompanhadas", description: "Número e diversidade de tecnologias no seu radar" },
  { label: "Atividade de aprendizado", description: "Cursos, artigos, projetos e documentação estudados" },
  { label: "Skills documentadas", description: "Tecnologias e habilidades registradas no seu perfil" },
  { label: "Tendências relevantes", description: "Quanto das tendências atuais são relevantes para você" },
  { label: "Atividade profissional", description: "Candidaturas, projetos open source e contribuições" },
  { label: "Engajamento", description: "Uso regular do sistema e feedback nas recomendações" },
];

export function TechScore({ data }: TechScoreProps) {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <div className="relative">
      <div className="flex items-start gap-4">
        <div className="flex flex-col items-start">
          <span className="text-7xl font-light tracking-tight text-text-primary">
            {data.overall}
          </span>
          <span className="text-xs font-medium uppercase tracking-widest text-text-muted mt-2">
            Tech Score
          </span>
          <span
            className={cn(
              "text-sm mt-1",
              data.change >= 0 ? "text-text-secondary" : "text-text-muted"
            )}
          >
            {data.change >= 0 ? "+" : ""}
            {data.change.toFixed(1)}% este mês
          </span>
        </div>
        <button
          onClick={() => setShowInfo(!showInfo)}
          className="mt-1 p-1 rounded-full text-text-muted hover:text-text-secondary hover:bg-bg-surface transition-colors duration-200"
        >
          <Info className="w-4 h-4" strokeWidth={1.5} />
        </button>
      </div>

      <AnimatePresence>
        {showInfo && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 mt-3 w-80 bg-glass-bg backdrop-blur-2xl border border-glass-border rounded-xl shadow-lg p-5 z-10"
          >
            <h3 className="text-sm font-medium text-text-primary mb-3">
              Como seu Tech Score é calculado
            </h3>
            <div className="space-y-3">
              {scoreFactors.map((factor) => (
                <div key={factor.label}>
                  <p className="text-xs font-medium text-text-secondary">{factor.label}</p>
                  <p className="text-xs text-text-muted mt-0.5">{factor.description}</p>
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowInfo(false)}
              className="mt-4 text-xs text-text-muted hover:text-text-secondary transition-colors"
            >
              Fechar
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
