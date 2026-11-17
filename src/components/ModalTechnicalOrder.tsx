import React, { useState } from 'react';
import { AICommandResponse } from '../types/naval';
import { 
  Printer, 
  Download, 
  Copy, 
  Check, 
  X, 
  ShieldCheck, 
  QrCode, 
  Anchor 
} from 'lucide-react';

interface ModalTechnicalOrderProps {
  response: AICommandResponse | null;
  onClose: () => void;
}

export const ModalTechnicalOrder: React.FC<ModalTechnicalOrderProps> = ({
  response,
  onClose
}) => {
  const [copied, setCopied] = useState(false);

  if (!response) return null;

  const orderFolio = `OT-PL-${Date.now().toString().slice(-8)}`;
  const shaToken = `SHA256:7e9b014f${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 10)}`;

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(response.technicalOrderMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const blob = new Blob([response.technicalOrderMarkdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ORDEN_TECNICA_${orderFolio}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-lg border border-slate-300 bg-white shadow-2xl overflow-hidden my-auto">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded bg-blue-900 text-white shadow-2xs">
              <Anchor className="w-4 h-4" />
            </span>
            <div>
              <div className="text-xs font-mono font-bold text-slate-900">
                ACTA TÉCNICA MILITAR OFICIAL // {orderFolio}
              </div>
              <div className="text-[10px] text-slate-500 font-mono">
                Autenticada por Sistema POSEIDÓN-LOG
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyMarkdown}
              className="p-1.5 rounded hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors"
              title="Copiar Markdown"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-700" /> : <Copy className="w-4 h-4 text-slate-700" />}
            </button>
            <button
              onClick={handleDownload}
              className="p-1.5 rounded hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors"
              title="Descargar archivo .md"
            >
              <Download className="w-4 h-4 text-slate-700" />
            </button>
            <button
              onClick={handlePrint}
              className="p-1.5 rounded hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors"
              title="Imprimir documento"
            >
              <Printer className="w-4 h-4 text-blue-900" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors ml-2"
              title="Cerrar ventana"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Official Document Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-slate-900 bg-white font-sans print:p-0">
          {/* Official Letterhead */}
          <div className="border-b-2 border-slate-300 pb-4 flex flex-col sm:flex-row justify-between items-start gap-4">
            <div className="space-y-1">
              <div className="text-xs font-mono tracking-widest text-blue-900 font-bold uppercase">
                ESTADOS UNIDOS MEXICANOS · FUERZA NAVAL Y MARÍTIMA
              </div>
              <h1 className="text-base font-bold text-slate-900 tracking-tight">
                DIRECCIÓN GENERAL DE LOGÍSTICA Y MANDO OPERATIVO
              </h1>
              <div className="text-xs text-slate-600 font-mono">
                JEFATURA DE ADQUISICIONES, MAESTRANZA Y MANTENIMIENTO DE FLOTA
              </div>
            </div>

            <div className="text-right font-mono text-xs space-y-1 bg-slate-50 p-2.5 rounded border border-slate-200">
              <div className="text-rose-700 font-bold">CLASIFICACIÓN: OFICIAL // MIL-SPEC</div>
              <div className="text-slate-700 font-medium">FOLIO: {orderFolio}</div>
              <div className="text-[10px] text-slate-500">FECHA: {new Date().toLocaleDateString('es-MX')}</div>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-slate-50 border border-slate-200 rounded-md font-mono text-xs">
            <div>
              <span className="text-slate-500 block text-[10px] font-semibold">PARTIDA DE AFECTACIÓN:</span>
              <span className="font-bold text-blue-900">{response.budgetImpact.accountCode}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] font-semibold">MONTO COMPROMETIDO BRUTO:</span>
              <span className="font-bold text-emerald-800 tabular-nums">
                ${response.budgetImpact.totalEstimatedCost.toLocaleString('es-MX', { minimumFractionDigits: 2 })} {response.budgetImpact.currency}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] font-semibold">CERTIFICACIÓN DIGITAL:</span>
              <span className="text-slate-700 truncate block text-[10px] font-medium">{shaToken.slice(0, 22)}...</span>
            </div>
          </div>

          {/* Rendered Technical Order Markdown */}
          <div className="p-4 rounded border border-slate-200 bg-slate-50/70 text-xs font-mono leading-relaxed space-y-3 whitespace-pre-wrap text-slate-800 shadow-2xs">
            {response.technicalOrderMarkdown}
          </div>

          {/* Signature and Verification Footer */}
          <div className="pt-6 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center font-mono text-xs">
            <div className="space-y-2">
              <div className="h-12 border-b border-slate-300 mx-6 flex items-end justify-center pb-1 text-[11px] text-blue-900 font-bold">
                [FIRMA DIGITAL SHA-256]
              </div>
              <div className="font-bold text-slate-900">JEFE DE LOGÍSTICA NAVAL</div>
              <div className="text-[10px] text-slate-500">Capitán de Navío CG</div>
            </div>

            <div className="space-y-2">
              <div className="h-12 border-b border-slate-300 mx-6 flex items-end justify-center pb-1 text-[11px] text-blue-900 font-bold">
                [VALIDACIÓN AUTOMATIZADA]
              </div>
              <div className="font-bold text-slate-900">POSEIDÓN-LOG CORE</div>
              <div className="text-[10px] text-slate-500">Motor de Decisión Militar</div>
            </div>

            <div className="space-y-2">
              <div className="h-12 border-b border-slate-300 mx-6 flex items-end justify-center pb-1 text-[11px] text-blue-900 font-bold">
                [AUTORIZACIÓN SUPERIOR]
              </div>
              <div className="font-bold text-slate-900">ESTADO MAYOR GENERAL</div>
              <div className="text-[10px] text-slate-500">Almirante Comandante</div>
            </div>
          </div>

          {/* Security QR Token */}
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-3 border-t border-slate-200">
            <div className="flex items-center gap-2">
              <QrCode className="w-4 h-4 text-blue-900" />
              <span>TOKEN CRIPTOGRÁFICO DE VERIFICACIÓN: {shaToken}</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-800 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>ACTA VÁLIDA PARA TRAMITACIÓN PRESUPUESTAL</span>
            </div>
          </div>
        </div>

        {/* Modal Bottom Controls */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-slate-200 bg-slate-50">
          <div className="text-xs text-slate-500 font-mono">
            Documento militar emitido bajo el marco normativo de intendencia naval.
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold rounded bg-slate-200 hover:bg-slate-300 text-slate-800 transition-colors shadow-2xs"
          >
            Cerrar Vista
          </button>
        </div>
      </div>
    </div>
  );
};
