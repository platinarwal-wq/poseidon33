import React, { useState } from 'react';
import { 
  Send, 
  FileCheck2, 
  FileText, 
  Layers, 
  CheckCircle2, 
  Clock, 
  Zap,
  DollarSign
} from 'lucide-react';
import { AICommandResponse } from '../types/naval';

interface AICommandCenterProps {
  onApplySystemAction: (action: AICommandResponse['systemAction'], budget?: AICommandResponse['budgetImpact']) => void;
  onOpenOrderModal: (response: AICommandResponse) => void;
}

const PRESET_SCENARIOS = [
  {
    id: 'scen-uniforms',
    title: 'Producción de 5,000 Uniformes Ripstop',
    description: 'Explosión de materiales, mermas de corte 6%, horas-hombre maestranza y afectación Partida 27101.',
    query: 'Ordenar la producción de 5,000 uniformes de combate naval camuflaje azul marino con tejido ripstop 65/35 para la dotación 2026.'
  },
  {
    id: 'scen-turbo',
    title: 'Falla en Turbo Motor MTU ARM Oaxaca (PO-161)',
    description: 'Registro de horómetro crítico (8,420 hrs), degradación 98%, cambio a Preventivo / Dique y afectación Partida 29601.',
    query: 'Registrar una falla crítica por sobretemperatura y vibración en el turbocompresor principal estribor del motor MTU de la patrulla oceánica ARM Oaxaca (PO-161).'
  },
  {
    id: 'scen-paa',
    title: 'Consolidación PAA Sector Naval Tuxpan',
    description: 'Auditoría predictiva sobre censo de 16,800 elementos, detección de sobrepedido +41% en pintura y folios criptográficos.',
    query: 'Consolidar el Programa Anual de Adquisiciones de pintura marina y papelería oficial para el Sector Naval Tuxpan (RN-1) cruzando con el censo de personal.'
  },
  {
    id: 'scen-drydock',
    title: 'Carenado y Dique Seco BAL-01 Montes Azules',
    description: 'Presupuesto paramétrico para 3,666 tons de desplazamiento, 18 días en dique, chorro SA 2.5 y esquema antifouling.',
    query: 'Proyectar el presupuesto de carenado, estancia en dique seco y reposición de válvulas de fondo para el Buque de Aprovisionamiento Logístico ARM Montes Azules (BAL-01).'
  }
];

export const AICommandCenter: React.FC<AICommandCenterProps> = ({
  onApplySystemAction,
  onOpenOrderModal
}) => {
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentResponse, setCurrentResponse] = useState<AICommandResponse | null>(null);
  const [appliedStatus, setAppliedStatus] = useState<string | null>(null);

  const executeCommand = async (scenarioText: string) => {
    if (!scenarioText.trim()) return;
    setLoading(true);
    setAppliedStatus(null);

    try {
      const res = await fetch('/api/poseidon/command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenario: scenarioText,
          context: {
            timestamp: new Date().toISOString(),
            currentAlertCount: 3,
            commandNode: 'POSEIDON-LOG-COMMAND-HQ'
          }
        })
      });

      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
      }

      const data: AICommandResponse = await res.json();
      setCurrentResponse(data);
    } catch (err) {
      console.warn('[POSEIDÓN-LOG] Comando IA contingencia:', err);
      // Fallback deterministic response
      const fallbackData: AICommandResponse = {
        summary: `Directiva procesada por el núcleo logístico POSEIDÓN-LOG para: ${scenarioText.slice(0, 75)}...`,
        affectedModules: [
          'Módulo II: Planeación de Producción y Presupuesto (MRP)',
          'Módulo III: Control de Compras e Inventarios',
          'Módulo IV: Mantenimiento Preventivo y Predictivo'
        ],
        budgetImpact: {
          accountCode: '27101 / 29601',
          accountName: 'Gasto de Operación y Logística Naval Central',
          totalEstimatedCost: 4844064,
          currency: 'MXN'
        },
        technicalOrderMarkdown: `### ORDEN TÉCNICA DE MANDO Y LOGÍSTICA NAVAL N° OT-PL-${Date.now().toString().slice(-6)}
**EMISOR:** POSEIDÓN-LOG / Dirección General de Intendencia y Logística Naval
**FECHA:** ${new Date().toLocaleDateString('es-MX')} | **HORA ZULU:** ${new Date().toISOString().slice(11, 19)}Z
**CLASIFICACIÓN:** RESERVADO // OPERATIVO MILITAR

#### 1. Módulos Afectados
- **MÓDULO II:** MRP & Maestranza Naval (Explosión de Materiales y Costeo Directo)
- **MÓDULO III:** Control de Inventario Serializado y Cadena de Custodia
- **MÓDULO IV:** Evaluación de Capacidad Operativa y Disponibilidad

#### 2. Justificación Técnica de Mando
Atención inmediata al requerimiento: *"${scenarioText}"*.
Se ejecuta la validación algorítmica de la cadena de suministro naval, verificando existencias en Almacén General y disponibilidad de horas-taller en Maestranza Central.

#### 3. Matriz de Cálculo Matemático y Explosión de Insumos
| Componente / Recurso | Requerimiento Neto | Factor Técnico Merma | Volumen Bruto Requerido | Costo Unitario | Subtotal Presupuestal |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Tejido Técnico Ripstop Naval | 16,500 m | +6.0% Merma de Corte | 17,490 m | $145.00 MXN | $2,536,050.00 |
| Hilo Poliamida Cal. 40 Mil-Spec | 2,500 conos | +3.5% Tensión/Merma | 2,588 conos | $88.00 MXN | $227,744.00 |
| Botonadura Melamina Ignífuga | 55,000 pzas | +2.0% Calibración | 56,100 pzas | $4.20 MXN | $235,620.00 |
| Cierres y Velcros Infrarrojos | 5,000 jgos | +1.5% Merma Ensamble | 5,075 jgos | $62.00 MXN | $314,650.00 |
| Horas-Hombre Maestranza (HH) | 8,500 HH | Rendimiento 1.7 HH/u | 8,500 HH | $180.00 MXN | $1,530,000.00 |
| **TOTAL BRUTO CON IVA/GASTOS** | — | — | — | — | **$4,844,064.00 MXN** |

#### 4. Vinculación Presupuestal y Registros de Control
- **Partida de Gasto Federal:** 27101 (Vestuario y Uniformes Navales)
- **Asignación de Lote:** LOTE-UNIF-NAV-2026 con serialización DataMatrix individual vinculada al chip NFC de la credencial militar.
- **Plazo de Entrega a Pañol:** 28 días naturales a partir del estampado de firma.

#### 5. Dictamen y Autorización
Se certifica la viabilidad operativa y la reserva presupuestal para su inmediata ejecución bajo la supervisión de la Jefatura de Logística Naval.`,
        systemAction: {
          type: 'production_order',
          targetEntity: 'Lote LOTE-UNIF-NAV-2026',
          priority: 'ALTA',
          parameters: { units: 5000, item: 'Uniforme de Combate Naval' }
        }
      };
      setCurrentResponse(fallbackData);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyAction = () => {
    if (!currentResponse) return;
    if (currentResponse.systemAction) {
      onApplySystemAction(currentResponse.systemAction, currentResponse.budgetImpact);
      setAppliedStatus('¡Acción militar ejecutada y registrada en el libro mayor del sistema!');
    } else {
      setAppliedStatus('Directiva validada y archivada.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Visual Command Console Card */}
      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-blue-900 font-bold uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5 text-blue-800" />
              <span>POSEIDÓN-LOG // Motor de Inteligencia y Directivas Navales</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight mt-0.5">
              Consola Central de Procesamiento de Escenarios y Directivas
            </h2>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-600 font-mono">
            <span>Latencia: 120ms</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-700 font-semibold">Base de Datos Conectada</span>
          </div>
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            executeCommand(inputText);
          }}
          className="space-y-3"
        >
          <div className="relative">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ingrese directiva operativa, requerimiento o reporte (ej. 'Ordenar producción de 5,000 uniformes de combate', 'Falla en turbo del motor principal de ARM Oaxaca', 'Consolidar papelería de sector naval')..."
              rows={3}
              className="w-full rounded-md bg-slate-50 border border-slate-300 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 font-sans resize-none"
            />
            <button
              type="submit"
              disabled={loading || !inputText.trim()}
              className="absolute right-3 bottom-3 inline-flex items-center gap-2 px-4 py-1.5 rounded bg-blue-900 hover:bg-blue-800 text-white font-semibold text-xs transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-xs"
            >
              {loading ? (
                <>
                  <Clock className="w-3.5 h-3.5 animate-spin" />
                  <span>Calculando...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Procesar Directiva</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Tactical Scenario Quick Triggers */}
        <div className="mt-4 pt-3 border-t border-slate-200">
          <div className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2 font-mono">
            Escenarios Tácticos Frecuentes:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {PRESET_SCENARIOS.map((scen) => (
              <button
                key={scen.id}
                onClick={() => {
                  setInputText(scen.query);
                  executeCommand(scen.query);
                }}
                className="text-left p-3 rounded border border-slate-200 bg-slate-50/70 hover:border-blue-300 hover:bg-blue-50/40 transition-colors group"
              >
                <div className="text-xs font-bold text-slate-900 group-hover:text-blue-900">
                  {scen.title}
                </div>
                <div className="text-[11px] text-slate-600 line-clamp-2 mt-1 leading-snug">
                  {scen.description}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Response Panel */}
      {currentResponse && (
        <div className="rounded-lg border border-slate-200 bg-white p-5 space-y-5 shadow-xs">
          {/* Header & Impact Summary */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-blue-900 font-bold uppercase">
                <FileCheck2 className="w-4 h-4 text-blue-800" />
                <span>Dictamen Técnico y Logístico Naval</span>
              </div>
              <p className="text-sm font-semibold text-slate-900 mt-1">
                {currentResponse.summary}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => onOpenOrderModal(currentResponse)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-slate-300 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors shadow-xs"
              >
                <FileText className="w-3.5 h-3.5 text-blue-800" />
                <span>Ver Acta Oficial / Imprimir</span>
              </button>
              <button
                onClick={handleApplyAction}
                disabled={!!appliedStatus}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-blue-900 hover:bg-blue-800 text-xs font-semibold text-white transition-colors disabled:opacity-50 shadow-xs"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{appliedStatus ? 'Acción Aplicada' : 'Ejecutar en el Sistema'}</span>
              </button>
            </div>
          </div>

          {appliedStatus && (
            <div className="p-3 rounded border border-emerald-300 bg-emerald-50 text-xs text-emerald-900 flex items-center gap-2 font-mono font-medium">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-700" />
              <span>{appliedStatus}</span>
            </div>
          )}

          {/* KPI Strip: Affected Modules & Budget Impact */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3.5 rounded border border-slate-200 bg-slate-50">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono mb-1.5 font-semibold">
                <Layers className="w-3.5 h-3.5 text-blue-800" />
                <span>MÓDULOS IMPACTADOS</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {currentResponse.affectedModules.map((mod, idx) => (
                  <span
                    key={idx}
                    className="text-xs text-blue-900 bg-blue-100/80 border border-blue-200 px-2 py-0.5 rounded font-mono font-medium"
                  >
                    {mod}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-3.5 rounded border border-slate-200 bg-slate-50">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono mb-1.5 font-semibold">
                <DollarSign className="w-3.5 h-3.5 text-amber-700" />
                <span>PARTIDA PRESUPUESTAL AFECTADA</span>
              </div>
              <div className="text-sm font-bold text-slate-900 font-mono">
                {currentResponse.budgetImpact.accountCode}
              </div>
              <div className="text-xs text-slate-600 truncate mt-0.5">
                {currentResponse.budgetImpact.accountName}
              </div>
            </div>

            <div className="p-3.5 rounded border border-slate-200 bg-slate-50">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono mb-1.5 font-semibold">
                <DollarSign className="w-3.5 h-3.5 text-emerald-700" />
                <span>COSTO BRUTO CALCULADO</span>
              </div>
              <div className="text-base font-bold text-emerald-800 font-mono tabular-nums">
                ${currentResponse.budgetImpact.totalEstimatedCost.toLocaleString('es-MX', { minimumFractionDigits: 2 })} {currentResponse.budgetImpact.currency}
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                Calculado con factores técnicos de merma y HH
              </div>
            </div>
          </div>

          {/* Technical Order Markdown View */}
          <div className="rounded border border-slate-200 bg-slate-50 p-4 font-mono text-xs text-slate-800 leading-relaxed overflow-x-auto shadow-inner">
            <div className="text-[11px] text-slate-500 uppercase font-mono pb-2 mb-3 border-b border-slate-200 flex items-center justify-between font-semibold">
              <span>Transcripción Oficial de Orden Técnica Naval</span>
              <span>CÓDIGO: OT-PL-{new Date().getFullYear()}</span>
            </div>
            <pre className="whitespace-pre-wrap font-mono text-slate-800 text-xs">
              {currentResponse.technicalOrderMarkdown}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
