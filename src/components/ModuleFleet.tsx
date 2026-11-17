import React, { useState } from 'react';
import { 
  NavalVessel, 
  OperationalStatus, 
  MissionCriticality 
} from '../types/naval';
import { 
  Anchor, 
  Activity, 
  CheckCircle2, 
  Building
} from 'lucide-react';

interface ModuleFleetProps {
  vessels: NavalVessel[];
  onUpdateVesselStatus: (vesselId: string, newStatus: OperationalStatus) => void;
  onAddDryDockBudgetWorkOrder: (vesselId: string, totalCost: number, details: string) => void;
}

export const ModuleFleet: React.FC<ModuleFleetProps> = ({
  vessels,
  onUpdateVesselStatus,
  onAddDryDockBudgetWorkOrder
}) => {
  const [selectedVesselId, setSelectedVesselId] = useState<string>(vessels[0]?.id || '');
  const [dryDockDays, setDryDockDays] = useState<number>(18);
  const [gritBlastSqMeters, setGritBlastSqMeters] = useState<number>(1200);
  const [paintLayersCount, setPaintLayersCount] = useState<number>(3);
  const [workOrderNotice, setWorkOrderNotice] = useState<string | null>(null);

  const selectedVessel = vessels.find((v) => v.id === selectedVesselId) || vessels[0] || null;

  // Dry Dock Parametric Estimator
  const dryDockDailyRate = 45000; // $45,000 MXN / día de varada en dique seco
  const gritBlastRate = 280; // $280 MXN / m² chorreado abrasivo SA 2.5
  const antifoulingCostPerLayer = 110000; // $110,000 MXN por capa para patrulla/buque
  const zincAnodesKitCost = 145000; // Kit de ánodos de zinc grado marino
  const shaftInspectionLaborCost = 280000; // Desmontaje e inspección de línea de ejes y timón

  const totalDryDockStayCost = dryDockDays * dryDockDailyRate;
  const totalSurfaceTreatmentCost = gritBlastSqMeters * gritBlastRate;
  const totalPaintCoatingCost = paintLayersCount * antifoulingCostPerLayer;
  const totalEstimatedDryDockBudget = 
    totalDryDockStayCost + 
    totalSurfaceTreatmentCost + 
    totalPaintCoatingCost + 
    zincAnodesKitCost + 
    shaftInspectionLaborCost;

  const handleAuthorizeDryDockBudget = () => {
    if (!selectedVessel) return;
    onAddDryDockBudgetWorkOrder(
      selectedVessel.id,
      totalEstimatedDryDockBudget,
      `Varada programada en Astillero de Marina para ${selectedVessel.name} (${selectedVessel.hullNumber}): ${dryDockDays} días de dique, chorro grit SA 2.5 (${gritBlastSqMeters} m²), ${paintLayersCount} capas antifouling y sustitución de ánodos de sacrificio.`
    );
    setWorkOrderNotice(`Presupuesto de carenado y dique seco autorizado: $${totalEstimatedDryDockBudget.toLocaleString('es-MX')} MXN afectado a Partida 35701.`);
    setTimeout(() => setWorkOrderNotice(null), 5000);
  };

  const getStatusBadge = (st: OperationalStatus) => {
    switch (st) {
      case 'OPERATIVO':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-100 text-emerald-900 border border-emerald-300">OPERATIVO</span>;
      case 'PREVENTIVO':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-amber-100 text-amber-900 border border-amber-300">PREVENTIVO PROGRAMADO</span>;
      case 'EN_DIQUE':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-blue-100 text-blue-900 border border-blue-300">EN DIQUE SECO</span>;
      case 'NO_OPERATIVO':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-100 text-rose-900 border border-rose-300">FUERA DE SERVICIO</span>;
    }
  };

  const getCriticalityBadge = (crit: MissionCriticality) => {
    switch (crit) {
      case 'EXTREMA':
        return <span className="text-rose-700 font-bold font-mono text-xs">CRITICIDAD EXTREMA</span>;
      case 'ALTA':
        return <span className="text-amber-800 font-semibold font-mono text-xs">CRITICIDAD ALTA</span>;
      case 'MEDIA':
        return <span className="text-blue-900 font-mono text-xs font-semibold">CRITICIDAD MEDIA</span>;
      case 'RUTINARIA':
        return <span className="text-slate-600 font-mono text-xs">RUTINARIA</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-blue-900 uppercase tracking-widest font-bold">
            <Anchor className="w-3.5 h-3.5 text-blue-800" />
            <span>MÓDULO IV // FLOTA NAVAL, HORÓMETROS & DIQUE SECO</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight mt-0.5">
            Mantenimiento Preventivo, Predictivo y Presupuesto de Carenado
          </h2>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl">
            Monitoreo en tiempo real de estados de operatividad, telemetría de horómetros en motores principales MTU/Caterpillar, degradación de componentes críticos y estimador paramétrico de dique seco.
          </p>
        </div>
        <div className="text-xs font-mono text-slate-700 bg-white border border-slate-200 px-3 py-1.5 rounded self-start font-medium shadow-2xs">
          Astilleros de Marina (ASTIMAR 1, 3, 20)
        </div>
      </div>

      {workOrderNotice && (
        <div className="p-3.5 rounded border border-emerald-300 bg-emerald-50 text-xs text-emerald-900 font-mono font-medium flex items-center gap-2.5 shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>{workOrderNotice}</span>
        </div>
      )}

      {/* Fleet Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {vessels.map((v) => {
          const isSelected = v.id === selectedVesselId;
          const enginePct = Math.min(100, (v.mainEngineHours / v.overhaulLimitHours) * 100);

          return (
            <button
              key={v.id}
              onClick={() => setSelectedVesselId(v.id)}
              className={`p-3.5 rounded-lg border text-left transition-all shadow-xs ${
                isSelected
                  ? 'border-blue-800 bg-blue-50/70'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-mono text-xs font-bold text-blue-900">{v.hullNumber}</span>
                {getStatusBadge(v.status)}
              </div>
              <div className="text-xs font-bold text-slate-900">{v.name}</div>
              <div className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{v.vesselClass.replace(/_/g, ' ')}</div>

              <div className="mt-2.5 pt-2 border-t border-slate-200 text-[10px] font-mono">
                <div className="flex justify-between text-slate-500 mb-0.5 font-medium">
                  <span>Horómetro MTU:</span>
                  <span className="text-slate-900 font-bold">{v.mainEngineHours} hrs</span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      enginePct > 95 ? 'bg-rose-600' : enginePct > 80 ? 'bg-amber-600' : 'bg-blue-800'
                    }`}
                    style={{ width: `${enginePct}%` }}
                  />
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Detailed Vessel Telemetry & Critical Wear Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Vessel Specs & Status Controls */}
        <div className="lg:col-span-5 rounded-lg border border-slate-200 bg-white p-4 space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <div>
              <div className="text-xs font-mono text-blue-900 uppercase font-bold">
                FICHA TÉCNICA OPERATIVA // {selectedVessel.hullNumber}
              </div>
              <h3 className="text-base font-bold text-slate-900">{selectedVessel.name}</h3>
            </div>
            {getStatusBadge(selectedVessel.status)}
          </div>

          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between py-1 border-b border-slate-100 text-slate-700">
              <span className="text-slate-500 font-semibold">Misión Actual:</span>
              <span className="text-right text-slate-900 font-sans max-w-[220px] font-medium">{selectedVessel.currentMission}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 text-slate-700">
              <span className="text-slate-500 font-semibold">Criticidad Táctica:</span>
              <span>{getCriticalityBadge(selectedVessel.tacticalCriticality)}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 text-slate-700">
              <span className="text-slate-500 font-semibold">Desplazamiento:</span>
              <span className="text-slate-900 font-medium">{selectedVessel.displacementTons.toLocaleString('es-MX')} Tons</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 text-slate-700">
              <span className="text-slate-500 font-semibold">Región Naval:</span>
              <span className="text-slate-900 font-medium">{selectedVessel.assignedRegion}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 text-slate-700">
              <span className="text-slate-500 font-semibold">Planta Propulsora:</span>
              <span className="text-right text-slate-900 max-w-[220px] text-[11px] font-medium">{selectedVessel.propulsionType}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 text-slate-700">
              <span className="text-slate-500 font-semibold">Horómetro Motores Principales:</span>
              <span className="text-blue-900 font-bold tabular-nums">
                {selectedVessel.mainEngineHours.toLocaleString('es-MX')} hrs / {selectedVessel.overhaulLimitHours.toLocaleString('es-MX')} hrs
              </span>
            </div>
            <div className="flex justify-between py-1 text-slate-700">
              <span className="text-slate-500 font-semibold">Última Varada en Dique:</span>
              <span className="text-slate-900 font-medium">{selectedVessel.lastDryDockDate} ({selectedVessel.daysInLastDryDock} días transcurridos)</span>
            </div>
          </div>

          {/* Operational Status Controller */}
          <div className="pt-2 border-t border-slate-200">
            <label className="text-xs font-mono text-slate-600 block mb-1.5 font-semibold">
              Actualizar Estado Operacional de la Unidad:
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {(['OPERATIVO', 'PREVENTIVO', 'EN_DIQUE', 'NO_OPERATIVO'] as OperationalStatus[]).map((st) => (
                <button
                  key={st}
                  onClick={() => onUpdateVesselStatus(selectedVessel.id, st)}
                  className={`py-1.5 px-2 text-[10px] font-mono rounded transition-colors ${
                    selectedVessel.status === st
                      ? 'bg-blue-900 text-white font-bold shadow-2xs'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {st.replace(/_/g, ' ')}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Critical Components Wear Matrix */}
        <div className="lg:col-span-7 rounded-lg border border-slate-200 bg-white p-4 space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <div className="text-xs font-mono text-blue-900 uppercase font-bold flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-800" />
              <span>Curvas de Degradación & Matriz de Componentes Críticos</span>
            </div>
            <span className="text-xs text-slate-500 font-mono">Monitoreo Predictivo MTU/Lloyd's</span>
          </div>

          <div className="space-y-3">
            {selectedVessel.criticalComponents.map((comp, idx) => {
              const isCrit = comp.status === 'CRITICO';
              const isAlert = comp.status === 'ALERTA_PREVENTIVA';

              return (
                <div
                  key={idx}
                  className={`p-3 rounded border text-xs font-mono ${
                    isCrit
                      ? 'border-rose-300 bg-rose-50/60'
                      : isAlert
                      ? 'border-amber-300 bg-amber-50/60'
                      : 'border-slate-200 bg-slate-50/70'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-slate-900">{comp.name}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        isCrit
                          ? 'bg-rose-100 text-rose-900 border border-rose-300'
                          : isAlert
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                      }`}
                    >
                      {comp.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 mb-2 font-medium">
                    <div>
                      <span>Nivel de Desgaste: </span>
                      <span className={isCrit ? 'text-rose-700 font-bold' : isAlert ? 'text-amber-800 font-bold' : 'text-emerald-800 font-bold'}>
                        {comp.wearPercentage}%
                      </span>
                    </div>
                    <div className="text-right">
                      <span>Horas Restantes Útiles: </span>
                      <span className="font-bold text-slate-900">{comp.hoursRemaining} hrs</span>
                    </div>
                  </div>

                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        isCrit ? 'bg-rose-600' : isAlert ? 'bg-amber-600' : 'bg-emerald-600'
                      }`}
                      style={{ width: `${comp.wearPercentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* SECTION 3: PARAMETRIC DRY DOCK & CAREENING BUDGET ESTIMATOR */}
      <div className="rounded-lg border border-slate-200 bg-white p-5 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200">
          <div className="flex items-center gap-2 text-xs font-mono text-blue-900 uppercase font-bold">
            <Building className="w-4 h-4 text-blue-800" />
            <span>Estimador Paramétrico de Presupuesto para Dique Seco, Carenado y Reparación Mayor</span>
          </div>
          <span className="text-xs text-slate-500 font-mono font-medium">
            Unidad: {selectedVessel.name} ({selectedVessel.displacementTons} tons)
          </span>
        </div>

        {/* Sliders */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
          <div>
            <label className="text-xs font-mono text-slate-600 block mb-1 font-medium">
              Estancia en Dique Seco ({dryDockDays} Días)
            </label>
            <input
              type="range"
              min={7}
              max={60}
              value={dryDockDays}
              onChange={(e) => setDryDockDays(parseInt(e.target.value))}
              className="w-full accent-blue-900 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>7 días</span>
              <span>Tarifa: $45,000/día</span>
              <span>60 días</span>
            </div>
          </div>

          <div>
            <label className="text-xs font-mono text-slate-600 block mb-1 font-medium">
              Área Chorro Abrasivo Grit SA 2.5 ({gritBlastSqMeters} m²)
            </label>
            <input
              type="range"
              min={300}
              max={3000}
              step={50}
              value={gritBlastSqMeters}
              onChange={(e) => setGritBlastSqMeters(parseInt(e.target.value))}
              className="w-full accent-blue-900 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>300 m²</span>
              <span>$280/m²</span>
              <span>3,000 m²</span>
            </div>
          </div>

          <div>
            <label className="text-xs font-mono text-slate-600 block mb-1 font-medium">
              Capas Esquema Antifouling ({paintLayersCount} Capas)
            </label>
            <input
              type="range"
              min={2}
              max={5}
              value={paintLayersCount}
              onChange={(e) => setPaintLayersCount(parseInt(e.target.value))}
              className="w-full accent-blue-900 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>2 capas</span>
              <span>Bicapa Epóxica + Silicón</span>
              <span>5 capas</span>
            </div>
          </div>
        </div>

        {/* Detailed Itemized Budget Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-3.5 rounded border border-slate-200 bg-slate-50 space-y-2 text-xs font-mono">
            <div className="text-[11px] text-slate-600 uppercase font-bold pb-1 border-b border-slate-200">
              Desglose Técnico de Rubros de Varada
            </div>
            <div className="flex justify-between text-slate-700">
              <span>Estancia en Dique ({dryDockDays} días x $45k):</span>
              <span className="text-slate-900 font-bold">${totalDryDockStayCost.toLocaleString('es-MX')} MXN</span>
            </div>
            <div className="flex justify-between text-slate-700">
              <span>Chorro Abrasivo Grit SA 2.5 ({gritBlastSqMeters} m²):</span>
              <span className="text-slate-900 font-bold">${totalSurfaceTreatmentCost.toLocaleString('es-MX')} MXN</span>
            </div>
            <div className="flex justify-between text-slate-700">
              <span>Esquema de Pintura Antifouling ({paintLayersCount} capas):</span>
              <span className="text-slate-900 font-bold">${totalPaintCoatingCost.toLocaleString('es-MX')} MXN</span>
            </div>
            <div className="flex justify-between text-slate-700">
              <span>Kit Ánodos de Sacrificio Zinc Grado Marino:</span>
              <span className="text-slate-900 font-bold">${zincAnodesKitCost.toLocaleString('es-MX')} MXN</span>
            </div>
            <div className="flex justify-between text-slate-700">
              <span>Desmontaje de Línea de Ejes y Arbotantes:</span>
              <span className="text-slate-900 font-bold">${shaftInspectionLaborCost.toLocaleString('es-MX')} MXN</span>
            </div>
          </div>

          <div className="p-4 rounded border border-blue-300 bg-blue-50/50 flex flex-col justify-between space-y-3 shadow-xs">
            <div>
              <div className="text-xs font-mono text-blue-900 uppercase font-bold">
                PRESUPUESTO TOTAL ESTIMADO // AFECTACIÓN PARTIDA 35701
              </div>
              <div className="text-2xl font-bold text-emerald-800 font-mono tabular-nums mt-2">
                ${totalEstimatedDryDockBudget.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN
              </div>
              <div className="text-xs text-slate-600 font-mono mt-1 font-medium">
                Partida 35701: Mantenimiento y Conservación de Maquinaria y Equipo Naval
              </div>
            </div>

            <button
              onClick={handleAuthorizeDryDockBudget}
              className="w-full py-2 px-4 rounded bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-xs flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Emitir Requisición Presupuestal de Varada</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
