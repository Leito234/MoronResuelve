import React, { useState } from 'react';

export interface EmergencyCallInfo {
  number: string;
  label: string;
  subtitle: string;
  description: string;
  badge: string;
  icon: string;
  colorClass: string;
}

interface EmergencyModalProps {
  info: EmergencyCallInfo | null;
  onClose: () => void;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({ info, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!info) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(info.number);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleCall = () => {
    window.location.href = `tel:${info.number}`;
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-surface-container-lowest rounded-3xl p-6 shadow-2xl border border-surface-container-high relative overflow-hidden animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Encabezado con badge y botón cerrar */}
        <div className="flex items-center justify-between mb-4">
          <span className="px-3 py-1 rounded-full bg-red-100 text-red-800 text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
            <span>{info.badge}</span>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-secondary hover:text-on-surface transition-colors"
            title="Cerrar ventana"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Identidad de la línea */}
        <div className="flex flex-col items-center text-center">
          <div className={`w-16 h-16 rounded-2xl ${info.colorClass} flex items-center justify-center shadow-md mb-3`}>
            <span className="material-symbols-outlined text-3xl">{info.icon}</span>
          </div>

          <h3 className="font-headline-md text-headline-md text-on-surface font-extrabold">
            {info.label}
          </h3>
          <p className="font-body-md text-secondary text-sm mt-1 max-w-xs">
            {info.description}
          </p>

          {/* Gran número telefónico */}
          <div className="my-4 px-6 py-3 bg-surface-container-low rounded-2xl border border-surface-container-high/80 w-full flex flex-col items-center">
            <span className="text-xs text-secondary uppercase font-bold tracking-wider mb-0.5">
              Marcá directamente al
            </span>
            <div className="text-4xl font-extrabold text-primary font-mono tracking-widest">
              {info.number}
            </div>
            <span className="text-[11px] text-secondary mt-0.5 font-medium">
              Línea gratuita • Sin costo de comunicación
            </span>
          </div>
        </div>

        {/* Acciones principales */}
        <div className="space-y-2.5 pt-1">
          <a
            href={`tel:${info.number}`}
            onClick={handleCall}
            className="w-full py-3.5 px-4 rounded-2xl bg-primary text-on-primary font-title-md text-base font-bold shadow-md hover:bg-primary-container active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-center"
          >
            <span className="material-symbols-outlined text-xl">call</span>
            <span>Llamar ahora al {info.number}</span>
          </a>

          <button
            type="button"
            onClick={handleCopy}
            className="w-full py-3 px-4 rounded-2xl bg-surface-container hover:bg-surface-container-high text-on-surface font-title-md text-sm font-semibold transition-all flex items-center justify-center gap-2 border border-surface-container-high"
          >
            <span className="material-symbols-outlined text-base">
              {copied ? 'check_circle' : 'content_copy'}
            </span>
            <span>{copied ? '¡Número copiado al portapapeles!' : `Copiar número (${info.number})`}</span>
          </button>
        </div>

        {/* Nota informativa para Desktop y alternativa local */}
        <div className="mt-4 p-3 bg-surface-container-low rounded-2xl border border-surface-container-high text-xs text-secondary space-y-1">
          <div className="flex items-start gap-1.5">
            <span className="material-symbols-outlined text-sm text-secondary shrink-0 mt-0.5">info</span>
            <p className="leading-snug">
              <strong>En computadoras:</strong> Si no tenés una app de telefonía vinculada, podés marcar el <strong>{info.number}</strong> desde tu teléfono móvil o copiar el número con el botón superior.
            </p>
          </div>
          <div className="pt-1 border-t border-surface-container-high/60 flex items-center justify-between text-[11px]">
            <span>Central Telefónica Morón:</span>
            <a href="tel:08005556676" className="text-primary font-bold hover:underline">
              0800-555-6676
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
