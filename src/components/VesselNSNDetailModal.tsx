import React from 'react';
import { NavalVessel, NavalSupplyItem } from '../types/naval';
import { 
  Ship, 
  X, 
  Gauge, 
  Clock, 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  Anchor, 
  ShieldCheck, 
  Flame, 
  Calendar, 
  FileText,
  MapPin,
  Compass
} from 'lucide-react';

interface VesselNSNDetailModalProps {
  supply: NavalSupplyItem | null;
  vessel: NavalVessel | null;
  onClose: () => void;
  onNavigateToFleet?: (vesselId: string) => void;
  onNavigateToDryDock?: (vesselId: string) => void;
}

export const VesselNSNDetailModal: React.FC<VesselNSNDetailModalProps> = ({
  supply,
  vessel,
  onClose,
  onNavigateToFleet,
  onNavigateToDryDock
}) => {
  if (!supply && !vessel) return null;

  // Status badge colors
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'OPERATIVO':
        return {
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-300',
          dot: 'bg-emerald-500',
          label: 'OPERATIVO // LISTO PARA MISIÓN'
        };
      case 'PREVENTIVO':
        return {
          bg: 'bg-amber-50 text-amber-800 border-amber-300',
          dot: 'bg-amber-500',
          label: 'ALERTA PREVENTIVA // MONITOREO'
        };
      case 'EN_DIQUE':
        return {
          bg: 'bg-blue-50 text-blue-800 border-blue-300',
          dot: 'bg-blue-500',
          label: 'EN DIQUE SECO // CARENAJE'
        };
      default:
        return {
          bg: 'bg-rose-50 text-rose-800 border-rose-300',
          dot: 'bg-rose-500',
          label: 'NO OPERATIVO // ESPERA DE REFACCIÓN'
        };
    }
  };

  const statusInfo = vessel ? getStatusBadge(vessel.status) : null;
  const hoursRemainingOverhaul = vessel ? Math.max(0, vessel.overhaulLimitHours - vessel.mainEngineHours) : 0;
  const overhaulPercent = vessel ? Math.min(100, Math.round((vessel.mainEngineHours / vessel.overhaulLimitHours) * 100)) : 0;

  return (
    <div 
      role="dialog"
      aria-modal="true"
      aria-labelledby="vessel-detail-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="bg-white border border-slate-300 rounded-xl shadow-2xl max-w-3xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded bg-blue-600/30 text-blue-400 border border-blue-500/30">
              <Ship className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-wider">
                  FICHA TÉCNICA MILITAR // VINCULACIÓN OTAN NSN
                </span>
                {supply && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-950 text-blue-300 border border-blue-700">
                    NSN: {supply.nsnCode}
                  </span>
                )}
              </div>
              <h3 id="vessel-detail-title" className="text-base font-bold text-white tracking-tight mt-0.5">
                {vessel ? `${vessel.name} (${vessel.hullNumber})` : 'Información de Embarcación'}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Cerrar ventana de ficha técnica"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-900 font-sans">
          
          {/* Linked OTAN NSN Supply Summary Card */}
          {supply && (
            <div className="p-4 rounded-lg bg-blue-50/70 border border-blue-200 text-xs font-mono">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-blue-200/80 pb-2.5 mb-2.5">
                <div>
                  <span className="text-[10px] text-blue-800 font-bold uppercase tracking-wider">
                    Suministro OTAN Seleccionado
                  </span>
                  <div className="text-sm font-bold text-blue-950 font-sans">
                    {supply.name}
                  </div>
                </div>
                <div className="text-left sm:text-right">
                  <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-900 border border-blue-300 font-bold">
                    Partida {supply.partidaGasto}
                  </span>
                  <div className="text-[11px] text-blue-800 font-semibold mt-0.5">
                    ${supply.unitCost.toLocaleString('es-MX')} MXN / {supply.unit}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-slate-700">
                <div>
                  <span className="text-slate-500 block">Código OTAN:</span>
                  <span className="font-bold text-blue-900">{supply.nsnCode}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Norma Militar:</span>
                  <span className="font-semibold">{supply.specDoc}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Stock en Almacén:</span>
                  <span className="font-bold">{supply.stockActual} {supply.unit}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Tiempo de Entrega:</span>
                  <span className="font-semibold">{supply.leadTimeDays} días</span>
                </div>
              </div>
            </div>
          )}

          {/* Full Vessel Data Card */}
          {vessel ? (
            <div className="space-y-4">
              {/* Vessel Identification & Operational Status Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-blue-900">
                      {vessel.vesselClass.replace('_', ' ')}
                    </span>
                    <span className="text-slate-400">·</span>
                    <span className="text-xs font-mono text-slate-600">
                      Desplazamiento: {vessel.displacementTons.toLocaleString('es-MX')} Tons
                    </span>
                  </div>
                  <h4 className="text-xl font-extrabold text-slate-900 font-sans">
                    {vessel.name} <span className="text-blue-900 font-mono font-bold">[{vessel.hullNumber}]</span>
                  </h4>
                  <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                    <span>Adscripción: {vessel.assignedRegion}</span>
                  </div>
                </div>

                {statusInfo && (
                  <div className="self-start sm:self-center">
                    <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md border text-xs font-mono font-bold shadow-2xs ${statusInfo.bg}`}>
                      <span className={`w-2 h-2 rounded-full ${statusInfo.dot} animate-pulse`} />
                      <span>{statusInfo.label}</span>
                    </span>
                  </div>
                )}
              </div>

              {/* Mission & Tactical Criticality */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-2xs">
                  <div className="text-slate-500 text-[10px] uppercase font-bold flex items-center gap-1">
                    <Compass className="w-3.5 h-3.5 text-blue-700" />
                    <span>Misión Táctica Asignada</span>
                  </div>
                  <div className="font-semibold text-slate-900 text-xs mt-1 font-sans">
                    {vessel.currentMission}
                  </div>
                </div>

                <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-2xs">
                  <div className="text-slate-500 text-[10px] uppercase font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-700" />
                    <span>Criticidad de Misión</span>
                  </div>
                  <div className="font-bold text-slate-900 text-xs mt-1">
                    NIVEL: {vessel.tacticalCriticality} // PRIORIDAD MANDO
                  </div>
                </div>
              </div>

              {/* Propulsion & Engine Horometers Section */}
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold text-slate-800 uppercase flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-amber-600" />
                    <span>Planta Propulsora & Horómetros Marinos</span>
                  </span>
                  <span className="text-[11px] font-mono text-slate-500">
                    {vessel.propulsionType}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono mt-3">
                  <div className="p-2.5 bg-white rounded border border-slate-200">
                    <div className="text-[10px] text-slate-500 font-semibold uppercase">Horómetro Motor Principal</div>
                    <div className="text-base font-bold text-slate-900 tabular-nums">
                      {vessel.mainEngineHours.toLocaleString('es-MX')} hrs
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      Límite Overhaul: {vessel.overhaulLimitHours.toLocaleString('es-MX')} hrs
                    </div>
                  </div>

                  <div className="p-2.5 bg-white rounded border border-slate-200">
                    <div className="text-[10px] text-slate-500 font-semibold uppercase">Horómetro Auxiliares</div>
                    <div className="text-base font-bold text-slate-900 tabular-nums">
                      {vessel.auxEngineHours.toLocaleString('es-MX')} hrs
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      Generadores de Servicio
                    </div>
                  </div>

                  <div className="p-2.5 bg-white rounded border border-slate-200">
                    <div className="text-[10px] text-slate-500 font-semibold uppercase">Tiempo Remanente a Dique</div>
                    <div className={`text-base font-bold tabular-nums ${hoursRemainingOverhaul <= 100 ? 'text-rose-700' : 'text-slate-900'}`}>
                      {hoursRemainingOverhaul.toLocaleString('es-MX')} hrs
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      Último dique: hace {vessel.daysInLastDryDock} días
                    </div>
                  </div>
                </div>

                {/* Overhaul progress bar */}
                <div className="mt-3">
                  <div className="flex justify-between text-[10px] font-mono text-slate-600 mb-1">
                    <span>Vida útil del ciclo operativo</span>
                    <span className="font-bold">{overhaulPercent}% acumulado</span>
                  </div>
                  <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        overhaulPercent >= 95 ? 'bg-rose-600' : overhaulPercent >= 80 ? 'bg-amber-600' : 'bg-emerald-600'
                      }`}
                      style={{ width: `${overhaulPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Critical Components Breakdown */}
              <div className="space-y-2">
                <span className="text-xs font-mono font-bold text-slate-800 uppercase block">
                  Matriz de Degradación de Componentes Críticos
                </span>
                <div className="divide-y divide-slate-200 border border-slate-200 rounded-lg overflow-hidden bg-white text-xs font-mono">
                  {vessel.criticalComponents.map((comp, idx) => (
                    <div key={idx} className="p-3 flex items-center justify-between gap-4 hover:bg-slate-50">
                      <div className="flex-1">
                        <div className="font-semibold text-slate-900 flex items-center gap-2">
                          <span>{comp.name}</span>
                          {comp.status === 'CRITICO' && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
                              CRÍTICO
                            </span>
                          )}
                          {comp.status === 'ALERTA_PREVENTIVA' && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                              PREVENTIVO
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          Remanente: {comp.hoursRemaining} hrs de navegación segura
                        </div>
                      </div>

                      <div className="w-32 text-right">
                        <div className="text-xs font-bold text-slate-900">
                          {comp.wearPercentage}% desgaste
                        </div>
                        <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden mt-1">
                          <div 
                            className={`h-full rounded-full ${
                              comp.wearPercentage >= 90 ? 'bg-rose-600' : comp.wearPercentage >= 75 ? 'bg-amber-600' : 'bg-emerald-600'
                            }`}
                            style={{ width: `${comp.wearPercentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            <div className="p-8 text-center text-slate-500 font-mono text-xs">
              No hay embarcación asociada a este código.
            </div>
          )}

        </div>

        {/* Modal Footer with Actions */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="text-slate-500">
            Libro Mayor de Intendencia & Mando Naval // SEMAR
          </div>

          <div className="flex items-center gap-2">
            {vessel && onNavigateToFleet && (
              <button
                onClick={() => {
                  onNavigateToFleet(vessel.id);
                  onClose();
                }}
                className="px-3 py-1.5 rounded bg-blue-900 hover:bg-blue-800 text-white font-bold transition-colors cursor-pointer shadow-xs"
              >
                Ver en Flota Naval & Dique
              </button>
            )}
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-medium transition-colors cursor-pointer"
            >
              Cerrar Ficha
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
